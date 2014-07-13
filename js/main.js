$(document).ready(function() {
    var username = "mfanafuthi";
    var repname = "mfanafuthi.github.io";
    var branch = "master"
    
    var url = "https://api.github.com/repos/"+username+"/"+repname+"/contents/book?ref="+branch;
    var showdown = new Showdown.converter();

    $.getJSON(url,function(result){
        $.each(result, function (key, data) {
            var string = data["name"];
            var n = string.length;
            var Extrakt = string.slice(0, n-3);
            $(".einDrittel").append("<p><a class='link'>"+Extrakt+"</a></p>");
        })
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