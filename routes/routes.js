var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var SavedArticle = require("../models/SavedArticle.js");

router.get("/", function(req, res){
  Article.find({}, function(err, results){
    if(err)
      res.send(err);
    res.render("index", {articles: results});
  });
});

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

      // var newArticle = new Article(input);
      // newArticle.save(function(err, result){
      //   if(err)
      //     console.log(err);
      //   console.log("Successfully Inserted");
      // });

    });

    // //var newArticle = new Article(input);
    // try {
    //   Article.insertMany(articleArray, {ordered: false}, function(err, results) {
    //     if(err) {
    //       console.log("Err");
    //     } else
    //       console.log(results.length);
    //   });
    // } catch(e) {
    //   print(e);
    // }

    
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

module.exports = router;