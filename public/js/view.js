$(document).ready(function(){

  $(".scrape").on("click", function(event){
    event.preventDefault();
    $.get("/scrape", function(data){
      console.log("Scrappe Successful");
      console.log(data.articlesAdded+" Articles Added!");
    });  
  });

});