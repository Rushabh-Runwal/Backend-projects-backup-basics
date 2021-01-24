const express = require("express");

const app = express();

		app.get("/",function(req,res){
			res.send("<h1>HEYY </h1>");
		});

		app.get("/about",function(req,res){
			res.send("page by : Rushabh Runwal");
		});

	
		app.get("/contact",function(req,res){
			res.send("contact me on +91 744 731 2272 ");
		});

app.listen(3000 , function(){
		   	console.log("Server started at port 3000");
		   });