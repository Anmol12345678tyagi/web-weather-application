const http = require("http");
const fs = require('fs');
var requests = require('requests');
const homeFile = fs.readFileSync("home.html", 'utf8');

const replaceval = (tempval , orgval) =>{
    let temperature = tempval.replace("{%temp%}",to_cel(orgval.main.temp));
     temperature = temperature.replace("{%tempmin%}",to_cel(orgval.main.temp_min));
     temperature = temperature.replace("{%tempmax%}",to_cel(orgval.main.temp_max));
     temperature = temperature.replace("{%location%}",orgval.name);
     temperature = temperature.replace("{%country%}",orgval.sys.country);
     temperature = temperature.replace("{%tempstatus%}",orgval.weather[0].main);

     function to_cel(x){
      x = x-273.15;
      const num1 = x.toString().split('.')[0];
      const tempnum2 = x.toString().split('.')[1];    
      var temp = String(tempnum2).charAt(0);
      const num2 = Number(temp);
      return `${num1}.${num2}`;
  }

    // console.log(temperature);
     return temperature;
}

const server = http.createServer((req,res)=>{

  if (req.url == "/"){

    if (req.url == "/") {
    // res.end("server page");
    requests('https://api.openweathermap.org/data/2.5/weather?lat=29.372442&lon=78.135849&appid=9afb3064e35850722de25b25eae08e73')
          .on('data', (chunk) => { 
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
            // console.log(arrdata);
            // console.log(arrdata.weather[0].main);
            const realTimeData = arrdata.map(val => replaceval(homeFile,val)).join();
            res.write(realTimeData);
          })
          .on('end', (err) => {
            if (err) return console.log("connection closed due to error", err);
            res.end()
          });
    
        }
    }
});

server.listen(8000,"127.0.0.1",()=>{
    // console.log("console log server check");
});