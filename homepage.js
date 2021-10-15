let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
const getAllMatches = require("./allMatches");

let link = "https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415";
request(link, cb);

function cb(error, response, html){

    if(error == null && response.statusCode == 200){
        parseData(html);
    }else if(response.statusCode == 404){
        console.log("Page not found");
    }else{
        console.log("error");
    }
}

function parseData(html){
    fs.writeFileSync("./home.html", html);
    let ch = cheerio.load(html);
    let aTag = ch(".widget-items.cta-link  a").attr("href");
    let completeLink = "https://www.espncricinfo.com" + aTag;
    console.log(completeLink);
    getAllMatches(completeLink);
}

// all matches ki link nikal dega
