import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import Appip from "apiip.net"
import Chart from "chart.js/auto";

const weatherURL = "http://api.weatherapi.com/v1";

const app = express();
const port = 3000;
const weather_apiKey = "365759bb0ea8432b88690535242602";
const appip_apiKey = "aa71965c-89fa-4b15-a950-26c156764bbe";
const appip = Appip(appip_apiKey);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// global variable
var geoResult;
var weatherResult;

// render homepage
app.get("/",async(req,res)=>{
    try{
        geoResult = await appip.getLocation();
        weatherResult = await axios.get(weatherURL+`/forecast.json?key=${weather_apiKey}&q=${geoResult.latitude}, ${geoResult.longitude}&aqi=yes&days=1`);
        console.log(weatherResult.data);
        res.render("index.ejs", { 
            geoData: geoResult,
            weatherData: weatherResult.data,
            weatherImgSrc: getImgPath(weatherResult.data),
        });
    } catch (error) {
        console.log("error");
        console.error(error);
    }
});


app.listen(port,()=>{
    console.log(`Server running on port: ${port}`);
});

function getImgPath(data) {
    let imgPath = data.current.condition.icon;
    let imgPathArray = imgPath.split("/");
    let imgSrc = `images/weather/${imgPathArray[imgPathArray.length-2]}/${imgPathArray[imgPathArray.length-1]}`;
    return imgSrc;
}