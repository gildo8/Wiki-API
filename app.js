//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

////////// Request Targetting all Articles //////////

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
    res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article");
    }
    else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
            res.send("Successfully deleted all articles.");
    }else{
      res.send(err);
    }

  });
});

////////// Request Targetting a specific Article //////////


app.route("/articles/:articleTitle")

.get(function(req,res){

  var userTitle = req.params.articleTitle;

  Article.findOne({title: userTitle}, function(err, foundArticle){
    if(foundArticle)
    {
      res.send(foundArticle)
    }
    else{
      res.send("No articles matching " + userTitle + " title was found.");
    }
  });
})

.put(function(req,res){
    var userTitle = req.params.articleTitle;

    Article.findOneAndUpdate(
      {title: userTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully update article.");
        }
        else{
          res.send(err);
        }
      });
})

.patch(function(req, res){
  var userTitle = req.params.articleTitle;

  Article.findOneAndUpdate(
    {title: userTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully update article.");
      }
      else{
        res.send(err);
      }
    });
})

.delete(function(req, res){
  var userTitle = req.params.articleTitle;

  Article.deleteOne({title: userTitle}, function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Article " + userTitle +" Successfully deleted!")
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
