const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', ejs);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); //connecting to blogDB 

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

//**********************************For All Artilcle*******************************************//
app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {
        console.log(req.body.title + " " + req.body.content);
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully Added new Article");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err, foundArticles) {
            if (!err) {
                res.send("Deletion Completed");
            } else {
                res.send(err);
            }
        });
    });
//**********************************For All Artilcle*******************************************//


//**********************************For Specific Artilcle*******************************************//
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        const ReqArticle = req.params.articleTitle;
        console.log("Found this--> " + ReqArticle);
        Article.findOne({
            title: ReqArticle
        }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No Articles with that title found ;( ");
            }
        });
    })
    .put(function (req, res) {
        console.log(req.params.articleTitle + " " + req.body.title);
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            }, {
                overwrite: true
            },
            function (err) {
                if (!err) {
                    res.send("Succesfully Updated article with put ");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .patch(function (req, res) {
        console.log(req.params.articleTitle + " " + req.body.title);
        Article.update({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            function (err, result) {
                if (!err) {
                    res.send("Succesfully Updated article with patch");
                }
            });
    })
    .delete(function (req, res) {
        Article.deleteOne({
                title: req.params.articleTitle
            },
            function (err) {
                if (!err) {
                    res.send("Successfully deleted the coresponding article.");
                } else {
                    res.send(err);
                }
            }
        );
    });
//**********************************For Specific Artilcle*******************************************//



app.listen(3000, function () {
    console.log("Connected to port 3000");
});
