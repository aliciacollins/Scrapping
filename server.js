
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser")
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require('cheerio');

var db = require("./models");

var PORT = process.env.PORT || 8000;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapping";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI) || "mongodb://localhost/Scrapping";

var app = express();
app.use(express.static("public"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: "main" }));
app.set('view engine', '.hbs');

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/scrapping");


app.get("/", function (req, res) {

    axios.get("https://www.azcardinals.com/news/").then(function (response) {
        // const dbArticles = []
        var $ = cheerio.load(response.data);

        $(".d3-l-col__col-3").each(function (i, element) {

            var result = {};
            ///use this or element
            result.title = $(element)
            .find('a')
            .attr("title");
            result.link = "https://www.azcardinals.com/" + $(element)
            .find('a')
            .attr("href");
            result.summary = $(element)
            .find(".d3-o-media-object__summary")
            .text()
            .trim();
            result.img = $(element)
            .find("img")
            .attr('src');

            // dbArticles.push(db.Article.create(result));

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
            .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            console.log(err);
            });
        });
        db.Article.find({})
        .populate("note")
        .then(function(articles){
            res.render("index", {articles:articles})
        });

    });
})



// This link is not working say undefined but is defined
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article 
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});