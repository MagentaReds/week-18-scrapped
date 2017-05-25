$(document).on("ready", function(event){

  $(".scrape").on("click", function(event){
    event.preventDefualt();
    $.get("/scrape", function(data){
      console.log("Scrappe Successful");
    });  
  });

});