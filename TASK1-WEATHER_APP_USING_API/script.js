const fs = require("fs");
var requests = require("requests");
const http = require('http');
const bodyParser = require('body-parser');
const { url } = require("url");




// const app = express();
// app.use(bodyParser.urlencoded({extended:true}));

const mainfile = fs.readFileSync(`${__dirname}/index.html`, "utf-8");

// app.get('/', (req,res)=> {
//   res.sendFile(`${__dirname}/templates/index.html`);
// })

// app.post('/', (req, res) => {
//   // console.log(req.body.cityname);
//   console.log("the request is received");
//   console.log(req.body.search_val);
// })


// const form = document.querySelector('.search');
// form.addEventListener("submit", e =>{
//   e.preventDefault();
//   const inputVal = input.value;
// })

// const inputVal = input.value;

//html
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
  // temperture = temperture.replace("{%tempstatus%}", orgVal.sys.country);
  temperture = temperture.replace("{%minTempVal%}", orgVal.main.temp_min);
  temperture = temperture.replace("{%maxTempVal%}", orgVal.main.temp_max);
  return temperture;
};





const server = http.createServer((req, res) => {
  const querry = "Pune";
  const apiKey = "d8bae6905e1cc3eaf2624f5498368048";
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
        // console.log(arrData[0].main.temp);

        const realTimeData = arrData
          .map((el) => replaceVal(mainfile, el))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
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
