const fs = require("fs");
var requests = require("requests");
const http = require('http');
const bodyParser = require('body-parser');
const { url } = require("url");

const mainfile = fs.readFileSync(`${__dirname}/index.html`, "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperture = tempVal.replace(
    "{%DESCRIP%}",
    orgVal.weather[0].description
  );
  temperture = temperture.replace("{%TEMPVAL%}", orgVal.main.temp);
  temperture = temperture.replace("{%IMGDESCRIPT%}", orgVal.weather[0].main);
  temperture = temperture.replace("{%HUMID%}", orgVal.main.humidity);
  temperture = temperture.replace("{%WINDSPEED%}", orgVal.wind.speed);
  temperture = temperture.replace("{%LOCATIONVAL%}", orgVal.name);
  temperture = temperture.replace("{%COUNTRY%}", orgVal.sys.country);
  temperture = temperture.replace("{%minTempVal%}", orgVal.main.temp_min);
  temperture = temperture.replace("{%maxTempVal%}", orgVal.main.temp_max);
  return temperture;
};


const server = http.createServer((req, res) => {
  const querry = "Pune";
  const apiKey = "d8bae6905e1cc3eaf******498368048";   // Use your OpenWeather API Key
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?appid=" +
        apiKey +
        "&q=" +
        querry +"&units=metric"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];

        const realTimeData = arrData
          .map((el) => replaceVal(mainfile, el))
          .join("");
        res.write(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
