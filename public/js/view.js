$(document).ready(function(){

  //helper function for displaying and altering the modal
  function displayModal(title, body) {
    var modal = $("#displayModal");
    modal.find(".title").text(title);
    modal.find(".body").text(body);
    modal.modal("show");
  }

  //button to scrape the onion to get articles
  $(".scrape").on("click", function(event){
    event.preventDefault();
    $.get("/scrape", function(data){
      displayModal("Scrape succeeded", data.articlesAdded + " new Articles Added!");
      $('#displayModal').one('hidden.bs.modal', function () {
        window.location.reload();
      });
    });  
  });

  //button to go to saved article page
  $(".savedArticles").on("click", function(event){
    window.location = "/saved"
  });

  $(".goHome").on("click", function(event){
    window.location = "/"
  });

  //button to perform DATA GEONOCIDE to get back to a clean starting state in MonogoDB
  $(".purgeDatabase").on("click", function(event){
    $.get("/purgeDatabase", function(data){
      displayModal("Success!", "The Entire Database has been removed");
      $('#displayModal').one('hidden.bs.modal', function () {
        window.location.reload();
      });
    });
  });

  //button that saves the article to the saved article list.
  $(".saveArticle").on("click", function(event){
    var id=$(this).attr("data-id");
    $.post("/saveArticle", {id: id}, function(data){
      if(data.err)
        displayModal("Unsuccess!", data.msg);
      else
        displayModal("Success!", "Article saved to saved list!");
    });
  });

  //unsaves the article
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

            /*<!-- note sample html
          <div class="panel panel-default">
            <div class="row">
              <div class="col-md-10 flexBoxy">
                <p></p>
              </div>
              <div class="col-md-2">
                <button class="btn btn-danger pull-right delete-note" data-id-note="" data-id-savedArticle=""> X </button>
              </div>
            </div>
          </div>
          -->*/
  //help function for building HTML for each note, and then adding it to the DOM
  function insertNote(body, noteId, savedArticleId){
    var panel = $("<div>");
    panel.addClass("panel panel-default");
    panel.attr("id", noteId);
    var row = $("<div>");
    row.addClass("row");
    var col1 = $("<div>");
    col1.addClass("col-md-10 flexBoxy");
    var p = $("<p>");
    p.text(body);

    col1.append(p);
    row.append(col1);

    var col2 = $("<div>");
    col2.addClass("col-md-2");
    var button = $("<button>");
    button.addClass("btn btn-danger pull-right delete-note");
    button.attr("data-id-note", noteId);
    button.attr("data-id-savedArticle", savedArticleId);
    button.text(" X ");

    col2.append(button);
    row.append(col2);
    panel.append(row);
    $(".note-container").append(panel);
  }

  //button that displays the notes modal on the saved article page
  $(".seeNotes").on("click", function(event){
    var savedArticleId=$(this).attr("data-id");
    var modal = $("#notesModal");
    $(".save-note").attr("data-id-savedArticle", savedArticleId);
    modal.find(".note-container").empty();
    modal.find(".note-container").html('<div class="panel panel-default text-center nonotes"> <p>No notes so far</p> </div>');
    modal.modal("show");

    $.get('/notes/'+savedArticleId, function(data) {
      if(data.length>0){
        console.log(data);
        modal.find(".note-container").empty();
        for(var i =0; i<data.length; ++i){
          insertNote(data[i].body, data[i]._id, savedArticleId);
        }
      }
      
    });
  });

  //save the text box into a new note.
  $(".save-note").on("click", function(event){
    var savedArticleId = $(this).attr("data-id-savedArticle");
    var body = $(".note-input").val().trim();
    $(".note-input").val("");
    $(".nonotes").hide();

    $.ajax({
      url: '/notes',
      data: {body:body, savedArticleId: savedArticleId},
      type: 'POST',
      success: function(data) {
        insertNote(data.noteBody, data.noteId, data.savedArticleId);
      }
    });
  });

  //listener to see when a note is being deleted
  $(document).on("click", ".delete-note", function(event){
    var noteId = $(this).attr("data-id-note");
    var savedArticleId = $(this).attr("data-id-savedArticle");
    $.ajax({
      url: '/notes',
      data: {noteId:noteId, savedArticleId: savedArticleId},
      type: 'DELETE',
      success: function(data) {
        $("#"+noteId).hide();

      }
    });

  });

});