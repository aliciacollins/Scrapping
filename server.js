
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser")
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require('cheerio');
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/Scrapping ,{ useNewUrlParser: true }";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
 //mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/Scrapping");

var Article = require("./models/Article.js");

var PORT = process.env.PORT || 8000;
var app = express();


app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.static("public"));

app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout:"main"}));
app.set('view engine', '.hbs');

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapping");


app.get("/scrape", function(req,res){
    
   axios.get("https://www.azcardinals.com/news/").then(function(response){
       
        var $ = cheerio.load(response.data);

    $(".d3-l-col__col-3").each(function(i,element){
        
        var result = {};
///use this or element
        result.title =$(element).find('a').attr("title");
        result.link = "https://www.azcardinals.com/" + $(element).find('a').attr("href");
        result.summary =$(element).find(".d3-o-media-object__summary").text();
        result.img =$(element).find("img").attr('src');

        Article.create(result)
        .then(function(dbArticle){
            console.log("dbArticle",dbArticle)
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
            });
    });
   // console.log("result",result);
    res.send("Scrape Complete");
    });
});

app.get("/", function(req,res){
    Article.findAll({}.then(function(dbArticles){
        console.log(dbArticles);
        res.render("index", {articles: dbArticles})
    }))
})


// Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//       .then(function(dbArticle) {
//         // If we were able to successfully find Articles, send them back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  
//   // Route for grabbing a specific Article by id, populate it with it's note
//   app.get("/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//       // ..and populate all of the notes associated with it
//       .populate("note")
//       .then(function(dbArticle) {
//         // If we were able to successfully find an Article with the given id, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  
//   // Route for saving/updating an Article's associated Note
//   app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//       .then(function(dbNote) {
//         // If a Note was created successfully, find one Article 
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//       })
//       .then(function(dbArticle) {
//         // If we were able to successfully update an Article, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });





// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });