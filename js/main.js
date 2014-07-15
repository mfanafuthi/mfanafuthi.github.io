$(document).ready(function() {
    
    /*Diese Daten müssen angepasst werden*/
    var username = "mfanafuthi";
    var repname = "mfanafuthi.github.io";
    var branch = "master"
    var cover = "Title"
    var tableOfContent="Table of Content"
    
    /*feste Variablen*/
    var titleUrl = "book/"+cover+".md"
    var url = "https://api.github.com/repos/"+username+"/"+repname+"/contents/book?ref="+branch;
    var showdown = new Showdown.converter();
    $(".tocTitle").append("<h5>"+tableOfContent+"</h5>");
    var theContent = [];
    var y=30;
    var x=30
    var doc = new jsPDF("p","mm","a4");
    arrayBilder=[];
    
    /*lade Title Seite. title.Md*/
    $.ajax({
        url : titleUrl,
        dataType: "text",
        success : function (data) {
            var preview_content = showdown.makeHtml(data);
            $(".toc").append("<p><a class='link' data-link=chapter0'>"+cover+"</a></p>");
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
                sizeY=imageObj.height/imageObj.width*155;
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
        y=30
        zaehlerBilder2=0;
        
        if ($(theContent[0]).find("img").length > 0){
            imgless = theContent[0].replace(/<img[^>]*>/g,"<div class=imgplaceholder></div>");
            imgless=imgless.split("<div class=imgplaceholder></div>");
            imgs=$(theContent[0]).find("img")
            
            for (v=0; v<imgless.length; v++){
                doc.fromHTML(imgless[v],30,30,{
                    'width': 170,
                    'elementHandlers': specialElementHandlers
                });
                
                if(v+1!=imgless.length){
                    a=zaehlerBilder2*2;
                    b=a+1;
                    doc.addImage(arrayBilder[a], 'JPEG', x, y, 155, arrayBilder[b]);
                    y=y+arrayBilder[b]+16*0.3527;
                    zaehlerBilder=zaehlerBilder+1;
                }
            }
        }else{
            doc.fromHTML(theContent[0],30,30,{
                'width': 170,
                'elementHandlers': specialElementHandlers
            });
        }
        doc.addPage();
        y=30;
        htmlString="<h1>"+tableOfContent+"</h1>"+$(".toc").html();
        doc.fromHTML(htmlString,30,30,{
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        
        for(z=1; z<theContent.length; z++){
        doc.addPage();
        y=30;
            if ($(theContent[z]).find("img").length > 0){
                imgless = theContent[z].replace(/<img[^>]*>/g,"<div class=imgplaceholder></div>");
                imgless=imgless.split("<div class=imgplaceholder></div>");
                imgs=$(theContent[z]).find("img")
                
                for (f=0; f<imgless.length; f++){
                    doc.fromHTML(imgless[f],30,30,{
                        'width': 170,
                        'elementHandlers': specialElementHandlers
                    });
                    
                    if(v+1!=imgless.length){
                        a=zaehlerBilder2*2;
                        b=a+1;
                        doc.addImage(arrayBilder[a], 'JPEG', x, y, 155, arrayBilder[b]);
                        y=y+arrayBilder[b]+16*0.3527;
                        zaehlerBilder=zaehlerBilder+1;
                    }
                }
            }else{
                console.log(z);
                doc.fromHTML(theContent[z],30,30,{
                    'width': 170,
                    'elementHandlers': specialElementHandlers
               });
            }
        }
        
        //doc.save(repname+".pdf");
        doc.output('datauri');
    }
    
    var specialElementHandlers = {
        'H1': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(24)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), 155)
            y=y+16*0.3527;
            page(24, neuertext);
            y=y+4*0.3527;
            return true;
        },
        'H2': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(18)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), 155)
            y=y+16*0.3527;
            page(18, neuertext);
            y=y+4*0.3527;
            return true;
        },
        'H3': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(14)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), 155)
            y=y+16*0.3527;
            page(14, neuertext);
            y=y+4*0.3527;
            return true;
        },
        'H4': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), 155)
            y=y+16*0.3527;
            page(12, neuertext);
            y=y+4*0.3527;
            return true;
        },
        'H5': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), 155)
            y=y+16*0.3527;
            page(12, neuertext);
            y=y+4*0.3527;
            return true;
        },
        'H6': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('bold')
            neuertext=doc.splitTextToSize($(element).text(), 155)
            y=y+16*0.3527;
            page(12, neuertext);
            y=y+4*0.3527;
            return true;
        },
        'P': function(element, renderer){
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('normal')
            neuertext=doc.splitTextToSize($(element).text(), 155)
            page(12, neuertext);
            y=y+4*0.3527;
            return true;
        },
        'LI': function(element, renderer){
            
            //doc.ellipse(x+4, y-1.5, 1, 1, 'D');
            x=x+10;
            doc.setFont("helvetica");
            doc.setFontSize(12)
            doc.setFontStyle('normal')
            neuertext=doc.splitTextToSize($(element).text(), 155)
            page(12, neuertext);
            y=y+4*0.3527;
            x=x-10;
            return true;
        },
        'OL': function(element, renderer){
            
            return true;
        },
        'BLOCKQOUTE': function(element, renderer){
            return true;
        },
        'CODE': function(element, renderer){
            return true;
        }
    };
    
    function page(fontsize, textArray){
        fontsize=fontsize*1.2;
        fullSize=y+fontsize*textArray.length*0.3527;
        textSize=fontsize*textArray.length*0.3527;
        if(fullSize>280){
            lines=fullSize-280;
            lines=textSize-lines;
            lines=lines/fontsize*0.3527;
            lines=Math.floor(lines);
            for(i=0; i<lines; i++){
                doc.text(x, y, textArray[i])
                y=y+fontsize*0.3527;
            }
            doc.addPage();
            y=30;
            for(i=lines; i<textArray.length; i++){
                doc.text(x, y, textArray[i])
                y=y+fontsize*0.3527;
            }
        }else{
            doc.text(x, y, textArray)
            y=fullSize;
        }
    }
});