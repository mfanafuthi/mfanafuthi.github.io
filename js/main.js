$(document).ready(function() {
    
    /*Diese Daten müssen angepasst werden*/
    var username = "mfanafuthi";
    var repname = "mfanafuthi.github.io";
    var branch = "master"
    var cover = "Title"
    var tableOfContent="Table of Content"
    
    /*Seitenränder PDF in mm*/
    var startY=25;
    var endY=270;
    var startX=25
    var endX=150;
    var mmToPt=0.3527;
    /*feste Variablen*/
    var titleUrl = "book/"+cover+".md"
    var url = "https://api.github.com/repos/"+username+"/"+repname+"/contents/book?ref="+branch;
    var showdown = new Showdown.converter();
    $(".tocTitle").append("<h5>"+tableOfContent+"</h5>");
    var theContent = [];
    var doc = new jsPDF("p","mm","a4");
    var ol=false;
    var ul=false;
    var listnumber;
    arrayBilder=[];

    
    /*lade Title Seite. title.Md*/
    $.ajax({
        url : titleUrl,
        dataType: "text",
        success : function (data) {
            var preview_content = showdown.makeHtml(data);
            title = $(preview_content).first().filter('h1').text();
            $(".toc").append("<p><a class='link' data-link=chapter0>"+title+"</a></p>");
            $(".zweiDrittel").append("<div class='content chapter0'>"+preview_content+"</div>");
            theContent.push(preview_content);
            $(".chapter0").fadeIn();
            
        },
        error : function () {
            $.getJSON(url,function(result){
                var url= "book/"+result[0]["name"];
                $.ajax({
                    url : url,
                    dataType: "text",
                    success : function (data) {
                        var preview_content = showdown.makeHtml(data);
                        title = $(preview_content).first().filter('h1').text();
                        $(".toc").append("<p><a class='link' data-link=chapter0>"+title+"</a></p>");
                        $(".zweiDrittel").append("<div class='content chapter0'>"+preview_content+"</div>");
                        theContent.push(preview_content);
                        $(".chapter0").fadeIn();
                    }
                });
            });
            
        }
        
    });
    
    /*lade alle Daten*/
    $.getJSON(url,function(result){
        $.each(result, function (key, data) {
            var string = data["name"];
            var n = string.length;
            var Extrakt = string.slice(0, n-3);
            if(Extrakt!=cover){
                var url="book/"+Extrakt+".md"
                $.ajax({
                    url : url,
                    dataType: "text",
                    success : function (data) {
                        var preview_content = showdown.makeHtml(data);
                        $(".zweiDrittel").append("<div class='content chapter"+theContent.length+"'>"+preview_content+"</div>");
                        
                        title = $(preview_content).first().filter('h1').text();
                        $(".toc").append("<p><a class='link' data-link=chapter"+theContent.length+">"+title+"</a></p>");
                        theContent.push(preview_content);
                    }
                });
            }
        })
        var nav = responsiveNav(".toc", { // Selector
            animate: true, // Boolean: Use CSS3 transitions, true or false
            transition: 284, // Integer: Speed of the transition, in milliseconds
            label: "<h5>"+tableOfContent+"</h5>", // String: Label for the navigation toggle
            insert: "before", // String: Insert the toggle before or after the navigation
            customToggle: "", // Selector: Specify the ID of a custom toggle
            closeOnNavClick: false, // Boolean: Close the navigation when one of the links are clicked
            openPos: "relative", // String: Position of the opened nav, relative or static
            navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
            navActiveClass: "js-nav-active", // String: Class that is added to  element when nav is active
            jsClass: "js", // String: 'JS enabled' class which is added to  element
            init: function(){}, // Function: Init callback
            open: function(){}, // Function: Open callback
            close: function(){} // Function: Close callback
    });
    });
    
    /*Click durch die einzelnen Kapitel*/
    $(document).on("click", ".link", function(){
        var dom=$(this).data( "link" );
        $(".content").fadeOut(100);
        $("."+dom).delay(300).fadeIn()
    });
    
    /*Pdf erstellen*/
    $(document).on("click", "#download", function(){
        
        /*Schritt 1 ALle Bilder zu URLs*/
        zaehlerBilder=0;
        
        $("img").each(function() {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var imageObj = new Image();
        
            imageObj.onload = function() {
                canvas.height=imageObj.height
                canvas.width=imageObj.width
                context.drawImage(imageObj, 0, 0);
                data = canvas.toDataURL("image/jpeg");
                sizeY=imageObj.height/imageObj.width*endX;
                //console.log(data);
                callback(data, sizeY);
            };
            
            var callback = function (data, sizeY) {
                arrayBilder.push(data, sizeY)
                zaehlerBilder=zaehlerBilder+1;
                
                canvas.remove();
                
                if(zaehlerBilder==$("img").length){
                    makePDF();
                }
                
            }
            
            imageObj.src = $(this).attr("src");;
             
        });
    });
    
    /*PDF zusammenschreiben*/
    function makePDF(){
        y=startY
        zaehlerBilder2=0;
        
        if ($(theContent[0]).find("img").length > 0){
            imgless = theContent[0].replace(/<img[^>]*>/g,"<div class=imgplaceholder></div>");
            imgless=imgless.split("<div class=imgplaceholder></div>");
            imgs=$(theContent[0]).find("img")
            
            for (v=0; v<imgless.length; v++){
                doc.fromHTML(imgless[v],startX,startY,{
                    'width': endX,
                    'elementHandlers': specialElementHandlers
                });
                
                if(v+1!=imgless.length){
                    a=zaehlerBilder2*2;
                    b=a+1;
                    doc.addImage(arrayBilder[a], 'JPEG', startX, y, endX, arrayBilder[b]);
                    y=y+arrayBilder[b]+16*mmToPt;
                    zaehlerBilder=zaehlerBilder+1;
                }
            }
        }else{
            doc.fromHTML(theContent[0],startX,startY,{
                'width': endX,
                'elementHandlers': specialElementHandlers
            });
        }
        doc.addPage();
        y=startY;
        htmlString="<h1>"+tableOfContent+"</h1>"+$(".toc").html();
        doc.fromHTML(htmlString,startX,startY,{
            'width': endX,
            'elementHandlers': specialElementHandlers
        });
        
        for(q=1; q<theContent.length; q++){
            doc.addPage();
            y=startY;
            if ($(theContent[q]).find("img").length > 0){
                imgless = theContent[q].replace(/<img[^>]*>/g,"<div class=imgplaceholder></div>");
                imgless=imgless.split("<div class=imgplaceholder></div>");
                imgs=$(theContent[q]).find("img")
                
                for (f=0; f<imgless.length; f++){
                    doc.fromHTML(imgless[f],startX,startY,{
                        'width': endX,
                        'elementHandlers': specialElementHandlers
                    });
                    
                    if(f+1!=imgless.length){
                        a=zaehlerBilder2*2;
                        b=a+1;
                        doc.addImage(arrayBilder[a], 'JPEG', startX, y, endX, arrayBilder[b]);
                        y=y+arrayBilder[b]+16*mmToPt;
                        zaehlerBilder=zaehlerBilder+1;
                    }
                }
            }else{
                string=theContent[q].replace("/n","");
                console.log(string);
                doc.fromHTML(string,startX,startY,{
                    'width': 170,
                    'elementHandlers': specialElementHandlers
               });
            }
        }
        
        //doc.save(repname+".pdf");
        doc.output('datauri');
    }
    
    //Form der einzelnen Parts
    var specialElementHandlers = {
        'H1': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(24)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), endX)
            y=y+16*mmToPt;
            page(24, neuertext);
            y=y+4*mmToPt;
            return true;
        },
        'H2': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(18)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), endX)
            y=y+16*mmToPt;
            page(18, neuertext);
            y=y+4*mmToPt;
            return true;
        },
        'H3': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(14)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), endX)
            y=y+16*mmToPt;
            page(14, neuertext);
            y=y+4*mmToPt;
            return true;
        },
        'H4': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), endX)
            y=y+16*mmToPt;
            page(12, neuertext);
            y=y+4*mmToPt;
            return true;
        },
        'H5': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), endX)
            y=y+16*mmToPt;
            page(12, neuertext);
            y=y+4*mmToPt;
            return true;
        },
        'H6': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), endX)
            y=y+16*mmToPt;
            page(12, neuertext);
            y=y+4*mmToPt;
            return true;
        },
        'P': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('normal')
            neuertext=doc.splitTextToSize($(element).text(), endX)
            page(12, neuertext);
            y=y+4*mmToPt;
            return true;
        },
        'LI': function(element, renderer){
            startX=startX+10;
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('normal')
            
            neuertext=doc.splitTextToSize($(element).text(), endX)
            pageLi(12, neuertext);
            y=y+4*mmToPt;
            startX=startX-10;
            return true;
        },
        'OL': function(element, renderer){
            ol=true
            listnumber=1;
            return false;
        },
        'UL': function(element, renderer){
            ol=false
            return false;
        },
        
        'BLOCKQUOTE': function(element, renderer){
            //doc.text(startX-6.5, y,"blockquote");
            startX=startX+20;
            doc.setFont("helvetica");
            doc.setFontSize(10)
            doc.setFontStyle('italic')
            neuertext=doc.splitTextToSize($(element).text(), endX-20)
            page(10, neuertext);
            y=y+4*mmToPt;
            startX=startX-20;
            return true;
        },
        'CODE': function(element, renderer){
            doc.setFont("courier");
            doc.setFontSize(10)
            doc.setFontStyle('normal')
            neuertext=doc.splitTextToSize($(element).text(), endX-20)
            pageCode(10, neuertext);
            
            return true;
        }
    };
    
    function page(fontsize, textArray){
        fontsize=fontsize*1.2;
        fullSize=y+fontsize*textArray.length*mmToPt;
        textSize=fontsize*textArray.length*mmToPt;
        if(fullSize>endY){
            lines=fullSize-endY;
            lines=textSize-lines;
            lines=lines/fontsize*mmToPt;
            lines=Math.floor(lines);
            for(i=0; i<lines; i++){
                doc.text(startX, y, textArray[i])
                y=y+fontsize*mmToPt;
            }
            doc.addPage();
            y=startY;
            for(i=lines; i<textArray.length; i++){
                doc.text(startX, y, textArray[i])
                y=y+fontsize*mmToPt;
            }
        }else{
            
            doc.text(startX, y, textArray)
            y=fullSize;
        }
    }
    
    function pageCode(fontsize, textArray){
        fontsize=fontsize*1.2;
        fullSize=y+fontsize*textArray.length*mmToPt+20;
        textSize=fontsize*textArray.length*mmToPt;
        if(fullSize>endY){
            doc.rect(startX, y, endX, textSize+10, 'D');
            doc.text(startX+10, y+10, textArray)
            y=fullSize;
        }else{
            doc.rect(startX, y, endX, textSize+10, 'D');
            doc.text(startX+10, y+10, textArray)
            y=fullSize;
        }
    }
    
    function pageLi(fontsize, textArray){
        fontsize=fontsize*1.2;
        fullSize=y+fontsize*textArray.length*mmToPt;
        textSize=fontsize*textArray.length*mmToPt;
        if(fullSize>endY){
            lines=fullSize-endY;
            lines=textSize-lines;
            lines=lines/fontsize*mmToPt;
            lines=Math.floor(lines);
            if(lines<0){
                if(ol==false){
                    doc.ellipse(startX-6, y-1.5, 1, 1, 'D');
                }else{
                    doc.text(startX-6.5, y,listnumber+".");
                    listnumber=listnumber+1;
                }
            }
            for(i=0; i<lines; i++){
                doc.text(startX, y, textArray[i])
                y=y+fontsize*mmToPt;
            }
            doc.addPage();
            y=startY;
            if(lines==0){
                if(ol==false){
                    doc.ellipse(startX-6, y-1.5, 1, 1, 'D');
                }else{
                    doc.text(startX-6.5, y,listnumber+".");
                    listnumber=listnumber+1;
                }
            }
            for(i=lines; i<textArray.length; i++){
                doc.text(startX, y, textArray[i])
                y=y+fontsize*mmToPt;
            }
        }else{
            if(ol==false){
                doc.ellipse(startX-6, y-1.5, 1, 1, 'D');
            }else{
                doc.text(startX-6.5, y,listnumber+".");
                listnumber=listnumber+1;
            }
            doc.text(startX, y, textArray)
            y=fullSize;
        }
    }
});