$(document).ready(function() {
    var username = "mfanafuthi";
    var repname = "mfanafuthi.github.io";
    var branch = "master"
    var cover = "Title"
    
    var titleUrl = "book/"+cover+".md"
    var url = "https://api.github.com/repos/"+username+"/"+repname+"/contents/book?ref="+branch;
    var showdown = new Showdown.converter();
    
    $.ajax({
        url : titleUrl,
        dataType: "text",
        success : function (data) {
            var preview_content = showdown.makeHtml(data);
            $(".toc").append("<p><a class='link' data-link="+titleUrl+">"+cover+"</a></p>");
            $(".zweiDrittel").html(preview_content);
        },
        error : function () {
            $.getJSON(url,function(result){
                var url= "book/"+result[0]["name"];
                $.ajax({
                    url : url,
                    dataType: "text",
                    success : function (data) {
                        var preview_content = showdown.makeHtml(data);
                        $(".zweiDrittel").html(preview_content);
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
                        title = $(preview_content).first().filter('h1').text();
                        $(".toc").append("<p><a class='link' data-link="+url+">"+title+"</a></p>");
                    }
                });
            }
        })
    });
    
    
    
    $(document).on("click", ".link", function(){
        var url=$(this).data( "link" );
        $.ajax({
            url : url,
            dataType: "text",
            success : function (data) {
                var preview_content = showdown.makeHtml(data);
                $(".zweiDrittel").html(preview_content);
            }
        });
    });
    
    $(document).on("click", "#download", function(){
var doc = new jsPDF();
doc.text(20, 20, 'Hello world!');
doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
doc.addPage();
doc.text(20, 20, 'Do you like that?');

doc.save('Test.pdf');
    });
    
});