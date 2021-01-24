const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.get("/",function(req,res){

	res.sendFile(__dirname + "/index.html");

});//app.get


app.post("/",function(req,res){

const q = req.body.cityName;
const urllink = "https://api.openweathermap.org/data/2.5/weather?q="+q+"&units=metric&appid=b1643b2e42495f4f5bfdae93008a21c6#";

https.get(urllink,function(response){
	console.log(response.statusCode);
	
	response.on("data",(data)=>{ 
		const weatherdata =JSON.parse(data);
		//console.log(weatherdata.weather[0].description);
		imgsource = "http://openweathermap.org/img/wn/"+weatherdata.weather[0].icon+"@2x.png";

		res.write("<p>weather there it is  "+weatherdata.weather[0].description+"</p>");
		res.write("<h1>Temperature here is "+weatherdata.main.temp+"</h1>");
		res.write("<img src ='"+imgsource+"'>" );
		res.send();
	});//response
	
});//https.get

	//res.send("You will be shown the weather");
});//app.post




app.listen(3000,function(){
	console.log("Connected To Port 3000 \n\n");
});

