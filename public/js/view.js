$(document).ready(function(){

  function displayModal(title, body) {
    var modal = $("#displayModal");
    modal.find(".title").text(title);
    modal.find(".body").text(body);
    modal.modal("show");
  }

  $(".scrape").on("click", function(event){
    event.preventDefault();
    $.get("/scrape", function(data){
      displayModal("Scrape succeeded", data.articlesAdded + " new Articles Added!");
    });  
  });

  $(".savedArticles").on("click", function(event){
    window.location = "/saved"
  });

  $(".saveArticle").on("click", function(event){
    var id=$(this).attr("data-id");
    $.post("/saveArticle", {id: id}, function(data){
      if(data.err)
        displayModal("Unsuccess!", data.msg);
      else
        displayModal("Success!", "Article saved to saved list!");
    });
  });

  $(".unsave").on("click", function(event){
    var id=$(this).attr("data-id");
    $.ajax({
      url: '/saveArticle',
      data: {id:id},
      type: 'DELETE',
      success: function(data) {
        if(data.err)
          displayModal("Unsuccess!", data.msg);
        else {
          $("#"+id).hide();
          displayModal("Success!", "Article has been removed from saved list!");
        }
      }
    });
  });

});