const fs = require("fs");
const jsonFile = fs.readFileSync('wc2018.json');
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
}
let uniqueDates = [...new Set(dates)].sort();
exports.uniqueDates = uniqueDates;

//--------------to find the match in each day-------------

exports.findMatchofTheDay = function (date=''){
    let teams = jsonObj.teams;         //list of every teams
    let matchOfDay=[],arrHtml=[],homeTeam='', awayTeam='',result = '';
    for (let key in datas){            //check which match play on that day
        if(datas[key].date.includes(date)){
            matchOfDay.push(datas[key]);
        }
    }
   var Times =[];let arrTime =[];
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
        //find result
        let result = matchOfDay[key].home_result+" : "+matchOfDay[key].away_result; 

        //find local match's Time on that day
        let fullDate = new Date(matchOfDay[key].date)
        let hour = fullDate.getHours();
        let minutes = fullDate.getMinutes();
        hour<=9?  competeTime = '0'+hour+':'+minutes+'0': competeTime = hour+':'+minutes+'0'
       
        if(hour<=4){
            arrTime.push({date,homeTeam,home_flag,awayTeam,away_flag,competeTime,result});
            continue;
        }  
        
        Times.push(competeTime);
        //array keep output of each day
        arrHtml.push(renderMatchOfDay(date,homeTeam,home_flag,awayTeam,away_flag,competeTime,result)); 
    }
    
    if(arrTime.length != 0){
       for (let key in arrTime){
            date = arrTime[key].date ;
            homeTeam = arrTime[key].homeTeam
            home_flag = arrTime[key].home_flag
            awayTeam = arrTime[key].awayTeam
            away_flag = arrTime[key].away_flag
            competeTime = arrTime[key].competeTime
            result = arrTime[key].result
            arrHtml.push(renderMatchOfDay(date,homeTeam,home_flag,awayTeam,away_flag,competeTime,result));
       }
    }
   
    return arrHtml
}

function renderMatchOfDay(date,home,home_flag,away,away_flag,time,result){
    let today = "2018-06-18T18:00:00+03:00".slice(0,10)
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

exports.convertDateFormat = function(inputDate){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    
    let fullDate = new Date(inputDate);
    let year = fullDate.getFullYear();
    let month = months[fullDate.getMonth()];
    let date = fullDate.getDate();
    let day = days[fullDate.getDay()];
    return `${day} ${date} ${month} ${year}`;
}



