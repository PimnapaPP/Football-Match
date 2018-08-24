const fs = require("fs");
const app = require('express')();
const jsonFile = fs.readFileSync('wc2018.json');
const port = 8000;

let jsonObj = JSON.parse(jsonFile); //parse json to obj

//-----------read each group to make array of data---------------------
let datas = [];
Object.keys(jsonObj.groups).forEach(group => {
    let matchs = jsonObj.groups[group].matches;
    matchs.forEach(match =>datas.push(match));
})

//-----------------to list unique date--------------------
let dates=[];
for (let key in datas){
    dates.push(datas[key].date.slice(0,10))
    // let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    
    // let fullDate = new Date(datas[key].date);
    // let year = fullDate.getFullYear();
    // let month = months[fullDate.getMonth()];
    // let date = fullDate.getDate();
    // let day = days[fullDate.getDay()];
    // dates.push(`${day} ${date} ${month} ${year}`);
}
var uniqueDates = [...new Set(dates)].sort();


//--------------to find the match in each day-------------
function findMatchofTheDay(date=''){
    let teams = jsonObj.teams;         //list of every teams
    let matchOfDay=[],arrHtml=[],homeTeam='', awayTeam='',result = '';
    //dateISO = new Date(date).toISOString()

    for (let key in datas){            //check which match play on that day
        if(datas[key].date.includes(date)){
            matchOfDay.push(datas[key]);
        }
    }

    for (let key in matchOfDay){  
        teams.find(team => {            //find Home or Away Team
            if(team.id == matchOfDay[key].home_team ){
                homeTeam = team.name;
                home_flag = team.flag;
            }
            if(team.id == matchOfDay[key].away_team){
                awayTeam = team.name;
                away_flag = team.flag;
            }
        });

        //find local match's Time on that day
        let fullDate = new Date(matchOfDay[key].date)
        let hour = fullDate.getHours();
        let minutes = fullDate.getMinutes();
        hour<=9?  competeTime = '0'+hour+':'+minutes+'0': competeTime = hour+':'+minutes+'0'
        
        let result = matchOfDay[key].home_result+" : "+matchOfDay[key].away_result;  //find result
        console.log('yyyyy')    
        arrHtml.push(renderMatchOfDay(date,homeTeam,home_flag,awayTeam,away_flag,competeTime,result)); //array keep output of each day
    }
    return arrHtml
}

function renderMatchOfDay(date,home,home_flag,away,away_flag,time,result){
    let today = "2018-06-18T18:00:00+03:00".slice(0,10)
    console.log('xxxxxxxxxx')
    if (today>date) {
    
        return '<label>&nbsp;'+home+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>'+
        '<img height="20" width="30" src = '+home_flag+'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
        '<label>' +result+ '</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
        '<img height="20" width="30" src = '+away_flag+'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
        '<label>'+away+'</label><br>'
    }
    
    return '<label>&nbsp;'+home+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>'+
    '<img height="20" width="30" src = '+home_flag+'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
    '<label>' +time+ '</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
    '<img height="20" width="30" src = '+away_flag+'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
    '<label>'+away+'</label><br>'
}

function convertDateFormat(inputDate){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    
    let fullDate = new Date(inputDate);
    let year = fullDate.getFullYear();
    let month = months[fullDate.getMonth()];
    let date = fullDate.getDate();
    let day = days[fullDate.getDay()];
    return `${day} ${date} ${month} ${year}`;
}

//--------------------------View---------------------------------------

app.get('/', function (req, res) {
    uniqueDates.forEach(day =>{
        res.write('<h1>'+convertDateFormat(day)+'</h1>')
        //res.write('<h1>'+day+'</h1>')
        res.write(""+findMatchofTheDay(day).join("")+'<br>')
    })
    res.end();
})

app.listen(port, function() {
    console.log('http://localhost:'+port);
});

