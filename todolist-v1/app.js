const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
let items = ["Buy Food", "Cook Food", "Eat Food"];
let workitems = [];
let currentday = date.getdate();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
	res.render('list', {
		listtitle: currentday,
		listitem:  items
	});
});

app.post("/", function (req, res) {
	let item = req.body.newItem;

	console.log(req.body.ListButton);
	if (req.body.ListButton === "Worklist") {
		workitems.push(item);
		res.redirect("/work");
	} else {
		items.push(item);
		res.redirect("/");
	}
});

app.get("/work", function (req, res) {
	res.render('list', {
		listtitle: "Worklist",
		listitem: workitems
	});
});

app.listen(3000, function () {
	console.log("Connected to 3000");
});