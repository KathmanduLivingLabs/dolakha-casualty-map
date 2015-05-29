var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

var updateTimestamp = {};

function updateFile(filename){

fs.readFile(filename, {
                encoding: "utf-8"
            }, function(err, data){
    if(err){
        console.log("error in source file: " + filename);
        return;
    }
    
    $ = cheerio.load(data);
    
    $("#totalinfo").each(function(){
          $(this).find(".date").text(updateTimestamp["update-date"]);
          $($(this).find("h1")[0]).text("Total Deaths: " + updateTimestamp["lost"]);
          $($(this).find("h1")[1]).text("Total Injuries: " + updateTimestamp["injured"]);
    });
    $($(".contextinfo").find("p")[0]).text("Data Updated: " + updateTimestamp["update-date"]);

    
    fs.writeFile(filename, $.html(), function(err){
        if(err) throw err;
        console.log(filename + " updated");
    });
});
}

request("https://docs.google.com/spreadsheets/d/1qnsJw_UkYDy_fswUYgaQyb4sD76xIN_T7Qi97Rnq2-Y/export?format=csv&gid=528772735", function(error, response, data){
    if (error || response.statusCode !== 200) return "error: "+ response.statusCode;
    var csvLinesArray = data.trim().replace(/\"/g,"").split("\n");
    csvLine = csvLinesArray[1].split(",");
    updateTimestamp = {
        "update-date": csvLine[0].replace("AM","NST").replace("PM","NST"),
        "lost": csvLine[1],
        "injured": csvLine[2]
    };


    updateFile("../index.html");
    updateFile("../iframe-full-width.html");
    updateFile("../iframe.html");

    var archiveFilename = "data-"+updateTimestamp["update-date"].replace(/:/g,".").replace(/ /g,"-")+".csv";

    request
  .get("https://docs.google.com/spreadsheets/d/1qnsJw_UkYDy_fswUYgaQyb4sD76xIN_T7Qi97Rnq2-Y/export?format=csv&gid=787276582")
  .on('error', function(err) {
    console.log(err)
  }).pipe(fs.createWriteStream(archiveFilename));
});

request
  .get("https://docs.google.com/spreadsheets/d/1qnsJw_UkYDy_fswUYgaQyb4sD76xIN_T7Qi97Rnq2-Y/export?format=csv&gid=933548789")
  .on('error', function(err) {
    console.log(err)
  }).pipe(fs.createWriteStream("data.csv"));





