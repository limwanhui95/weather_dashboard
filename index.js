import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import Appip from "apiip.net"
import Chart from "chart.js/auto";

const weatherURL = "http://api.weatherapi.com/v1";

const app = express();
const port = 3000;
const weather_apiKey = process.env.weather_apiKey;
const appip_apiKey = process.env.appip_apiKey;


const appip = Appip(appip_apiKey);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('trust proxy',true);

// global variable
var geoResult;
var weatherResult;

// render homepage
app.get("/",async(req,res)=>{
    try{
        console.log(req.ip);
        geoResult = await appip.getLocation({ip: req.ip});
        weatherResult = await axios.get(weatherURL+`/forecast.json?key=${weather_apiKey}&q=${geoResult.latitude}, ${geoResult.longitude}&aqi=yes&days=1`);
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
