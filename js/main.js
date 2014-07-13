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
            $(".einDrittel").append("<p><a class='link'>"+cover+"</a></p>");
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
                $(".einDrittel").append("<p><a class='link'>"+Extrakt+"</a></p>");
            }
        })
        $(".einDrittel").append('<p><button type="button" id="download">Donwload PDF</button></p>')
    });
    
    
    
    $(document).on("click", ".link", function(){
        var url="book/"+$(this).text()+".md"
        $.ajax({
            url : url,
            dataType: "text",
            success : function (data) {
                var preview_content = showdown.makeHtml(data);
                $(".zweiDrittel").html(preview_content);
            }
        });
    });

    
});