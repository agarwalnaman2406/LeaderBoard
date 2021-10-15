let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");

let link = "https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/england-vs-australia-2nd-semi-final-1144529/full-scorecard"
let leaderboard = [];
let count = 0;

function getMatch(link){
    request(link, cb);
    count++;
}


function cb(error, response, html){

    if(error == null && response.statusCode == 200){
        count--;
        parseData(html);
        if(count == 0){
            console.table(leaderboard);
        }
    }else if(response.statusCode == 404){
        console.log("Page not found");
    }else{
        console.log("error");
    }
}

function parseData(html){
    let ch = cheerio.load(html);
    let bothInnings = ch(".card.content-block.match-scorecard-table .Collapsible");
    for(let i=0;i<bothInnings.length;i++){
        let teamName = ch(bothInnings[i]).find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        let allTrs = ch(bothInnings[i]).find(".table.batsman tbody tr");
        if(!teamName.includes("Team")){
            for(let j=0;j<allTrs.length-1;j++){
                let allTds = ch(allTrs[j]).find("td");
                if(allTds.length>1){
                    let batsmanName = ch(allTds[0]).find("a").text().trim();
                    let runs = ch(allTds[2]).text().trim();
                    let balls = ch(allTds[3]).text().trim();
                    let fours = ch(allTds[5]).text().trim();
                    let sixes = ch(allTds[6]).text().trim();
                    let strikeRate = ch(allTds[7]).text().trim();
                    // console.log(`Batsman = ${batsmanName} Runs = ${runs} Balls = ${balls} Fours = ${fours} Sixes = ${sixes} SR = ${strikeRate}`);
                    createLeaderBoard(teamName, batsmanName, runs, balls, fours, sixes);
                }
            }
        }
        
        // console.log("##########################");
    }
}

function createLeaderBoard(teamName, batsmanName, runs, balls, fours, sixes){

    runs = Number(runs);
    balls = Number(balls);
    fours = Number(fours);
    sixes = Number(sixes);

    for(let i=0;i<leaderboard.length;i++){
        if(leaderboard[i].Batsman == batsmanName && leaderboard[i].Team == teamName){
            leaderboard[i].Runs += runs;
            leaderboard[i].Balls += balls;
            leaderboard[i].Sixes += sixes;
            leaderboard[i].Fours += fours;
            return;
        }
    }

    let entry = {
        Team : teamName,
        Batsman : batsmanName,
        Runs : runs,
        Balls : balls,
        Fours :fours,
        Sixes : sixes
    }
    leaderboard.push(entry);

}


module.exports = getMatch;