var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var SavedArticle = require("../models/SavedArticle.js");


//Get HTML Routes using Handlebars to render the pages.
//======================
router.get("/", function(req, res){
  Article.find({}, function(err, results){
    if(err)
      return res.send(err);
    res.render("index", {articles: results});
  });
});


router.get("/saved", function(req, res){
  SavedArticle.find({})
    .populate("article")
    .exec(function(err, results){
      if(err)
        return res.send(err);
      //res.json(results);
      res.render("savedArticles", {results: results});
    });
});

//======================


//Article API Routes
//============================================
router.post("/saveArticle", function(req, res){
  var _id= req.body.id;
  var newDoc = new SavedArticle({article: _id});
  newDoc.save(function(err, result){
    if(err){
      res.json({err: true, msg: "Article is already saved to saved list"});
    } else {
      res.json({success: true});
    }
  });
});

router.delete("/saveArticle", function(req, res){
  var _id= req.body.id;
  SavedArticle.remove({_id: _id}, function(err, result){
    if(err){
      res.json({err: true, msg: "Thing failed :("});
    } else {
      res.json({success: true});
    }
  });
});
//============================================


//Note API Routes
//============================================
router.get("/notes/:id", function(req, res){
  var id=req.params.id;
  SavedArticle.findById(id)
    .populate("notes")
    .exec(function(err, result){
      if(err)
        res.json({err:true, msg:"Thing failed :("});
      else
        res.json(result.notes);
    });
});

router.post("/notes", function(req, res){
  var newDoc = {body: req.body.body.trim()};
  var newNote = new Note(newDoc);
  newNote.save(function(err,note){
    if(err)
      res.json({err:true, msg:"Thing failed :("});
    else {
      SavedArticle.findByIdAndUpdate(
        req.body.savedArticleId, 
        {$push: {"notes": note._id}},
        {new: true},
        function(err, savedArticle){
          if(err)
            res.json({err:true, msg:"Thing failed :("});
          else
            res.json({success: true, noteBody: note.body, noteId: note._id, savedArticleId: savedArticle._id});
        });
      
    }
  });

});


router.delete("/notes", function(req, res){
  var noteId= req.body.noteId;
  var savedArticleId = req.body.savedArtictleId;
  Note.remove({_id: noteId}, function(err, result){
    if(err)
      console.log(err);
    SavedArticle.findByIdAndUpdate(savedArticleId, {$pull: {notes: noteId}}, function(err, result){
      res.sendStatus(204);
    });
  });
});
//============================================

//Api'ish route to tell my site to scrape The Onion using Cheerio
//============================================
router.get("/scrape", function(req, res){
  request("http://www.theonion.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);

    var articleArray = [];

    $("article[role='article']").each(function(i, element){
      var input = {};
      var importantThing = $(this).find("h2.headline");
      input.title = importantThing.children("a").text();
      input.link = "http://www.theonion.com"+importantThing.children("a").attr("href");
      importantThing = $(this).find("div.desc");
      input.summary = importantThing.text().trim();

      articleArray.push(input);

    });

    Article.insertMany(articleArray, {ordered: false})
    .then(function(results) {
      //console.log(results.length);
      res.json({articlesAdded: results.length});
    }, function(err){
      //console.log(err);
      res.json({articlesAdded: (articleArray.length-err.writeErrors.length)});
    });
  
    
  });
});
//============================================

//Misc Testing Route
//============================================
router.get("/purgeDatabase", function(req, res){
  SavedArticle.remove({}, function(){});
  Note.remove({}, function(){});
  Article.remove({}, function(){});
  res.sendStatus(204);
});
//============================================

module.exports = router;