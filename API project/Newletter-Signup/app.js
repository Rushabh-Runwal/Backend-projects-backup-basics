//jshint esversion 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();


app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/SignUp.html");

});

app.post("/", function (req, res) {
	const Name = req.body.YourName;
	const email = req.body.Email;
	//	console.log(Name,email);
app.set(express.static("public"));


	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: Name,
				}
		}	
	   ]
	};


	const jsondata = JSON.stringify(data);

	const url = "https://us18.api.mailchimp.com/3.0/lists/a7e742d7d7";
	const option = {
		method: "POST",
		auth: "rushabh22:61322f0480c2dd9cc2e53b05f28e9d1e-us18",
	};

	const request = https.request(url, option, function (response) {
		if(response.statusCode===200) {
			res.sendFile(__dirname + "/Success.html");
		}
		else {
			res.sendFile(__dirname + "/failure.html");
		}	
		
		response.on("data", function (data) {
			console.log(JSON.parse(data));

		});
	});

	request.write(jsondata);
	request.end();
});



app.post("/failure",function(req,res){
	res.redirect("/");
});





app.listen(3000, function () {
	console.log("Connected to port 3000");
});


// api :61322f0480c2dd9cc2e53b05f28e9d1e-us18
//audience id: a7e742d7d7

//--data '{"name":"Freddie'\
//''
//s Favorite Hats ","
//contact ":{"
//company ":"
//Mailchimp ","
//address1 ":"
//675 Ponce De Leon Ave NE ","
//address2 ":"
//Suite 5000 ","
//city ":"
//Atlanta ","
//state ":"
//GA ","
//zip ":"
//30308 ","
//country ":"
//US ","
//phone ":"
//"},"
//permission_reminder ":"
//You '\''
//re receiving this email because you signed up
//for updates about Freddie '\''
//s newest hats.
//","
//campaign_defaults ":{"
//from_name ":"
//Freddie ","
//from_email ":"
//freddie @freddiehats.com ","
//subject ":"
//","
//language ":"
//en "},"
//email_type_option ":true}' \
