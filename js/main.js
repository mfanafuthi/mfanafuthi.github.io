$(document).ready(function() {
    var username = "mfanafuthi";
    var repname = "mfanafuthi.github.io";
    var branch = "master"
    var cover = "Title"
    var tableOfContent="Table of Content"
    
    var titleUrl = "book/"+cover+".md"
    var url = "https://api.github.com/repos/"+username+"/"+repname+"/contents/book?ref="+branch;
    var showdown = new Showdown.converter();
    $(".tocTitle").append("<h5>"+tableOfContent+"</h5>");
    var theContent = [];
    var y=30;
    var x=30
    var doc = new jsPDF("p","mm","a4");
    
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
    
    
    $(document).on("click", ".link", function(){
        var dom=$(this).data( "link" );
        $(".content").fadeOut(100);
        $("."+dom).delay(300).fadeIn()
    });
    
    $(document).on("click", "#download", function(){
        y=30
        var specialElementHandlers = {
            'H1': function(element, renderer){
                doc.setFont("helvetica");
                doc.setFontSize(24)
                doc.setFontStyle('bold')
                neuertext=doc.splitTextToSize($(element).text(), 160)
                y=y+16*0.3527;
                page(24, neuertext);
                y=y+4*0.3527;
                return true;
            },
            'H2': function(element, renderer){
                doc.setFont("helvetica");
                doc.setFontSize(18)
                doc.setFontStyle('bold')
                neuertext=doc.splitTextToSize($(element).text(), 160)
                y=y+16*0.3527;
                page(18, neuertext);
                y=y+4*0.3527;
                return true;
            },
            'H3': function(element, renderer){
                doc.setFont("helvetica");
                doc.setFontSize(14)
                doc.setFontStyle('bold')
                neuertext=doc.splitTextToSize($(element).text(), 160)
                y=y+16*0.3527;
                page(14, neuertext);
                y=y+4*0.3527;
                return true;
            },
            'H4': function(element, renderer){
                doc.setFont("helvetica");
                doc.setFontSize(12)
                doc.setFontStyle('bold')
                neuertext=doc.splitTextToSize($(element).text(), 160)
                y=y+16*0.3527;
                page(12, neuertext);
                y=y+4*0.3527;
                return true;
            },
            'H5': function(element, renderer){
                doc.setFont("helvetica");
                doc.setFontSize(12)
                doc.setFontStyle('bold')
                neuertext=doc.splitTextToSize($(element).text(), 160)
                y=y+16*0.3527;
                page(12, neuertext);
                y=y+4*0.3527;
                return true;
            },
            'H6': function(element, renderer){
                doc.setFont("helvetica");
                doc.setFontSize(12)
                doc.setFontStyle('bold')
                neuertext=doc.splitTextToSize($(element).text(), 160)
                y=y+16*0.3527;
                page(12, neuertext);
                y=y+4*0.3527;
                return true;
            },
            'P': function(element, renderer){
                doc.setFont("helvetica");
                doc.setFontSize(12)
                doc.setFontStyle('normal')
                neuertext=doc.splitTextToSize($(element).text(), 160)
                page(12, neuertext);
                y=y+4*0.3527;
                return true;
            },
            'LI': function(element, renderer){
                doc.setFont("helvetica");
                doc.setFontSize(12)
                doc.setFontStyle('normal')
                neuertext=doc.splitTextToSize($(element).text(), 160)
                page(12, neuertext);
                y=y+4*0.3527;
                return true;
            },
            'BLOCKQOUTE': function(element, renderer){
                return true;
            },
            'CODE': function(element, renderer){
                return true;
            }
        };
      
        doc.fromHTML(theContent[0],30,30,{
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        doc.addPage();
        y=30;
        htmlString="<h1>"+tableOfContent+"</h1>"+$(".toc").html();
        doc.fromHTML(htmlString,30,30,{
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        
        

        for(i=1; i<theContent.length; i++){
            string=theContent[i];
            //alert(theContent[i]);
            console.log(theContent[i]);
            doc.addPage();
            y=30;
            doc.fromHTML(string,30,30,{
                'width': 170
                ,'elementHandlers': specialElementHandlers
            });
        }

        doc.output('datauri');
        
    });
    
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