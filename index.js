var http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");

replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp)
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min)
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max)
    temperature = temperature.replace("{%location%}", orgVal.name)
    temperature = temperature.replace("{%country%}", orgVal.sys.country)
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        let apid = "https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=cb5f6ffe24f31fc8184d357055b8c992"
        requests(apid)
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData]
                const realTimeData = arrData.
                    map((val) => replaceVal(homeFile, val))
                    .join("");
                res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to error", err);
                res.end();
            });
    }
});
server.listen(9000, "127.0.0.1")



