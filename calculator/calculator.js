const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
	res.sendFile(__dirname+"/bmicalculator.html");
});



app.post("/bmicalculator",function(req,res){
	
	var result = Number(req.body.weight) / Math.pow(Number(req.body.weight),2);
	
	res.send("RESult is "+result);
});


app.listen(3000,function(){
	console.log("Connect to 3000 ");
})


















