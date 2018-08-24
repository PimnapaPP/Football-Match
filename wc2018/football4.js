const fs = require("fs");
const jsonFile = fs.readFileSync('wc2018.json');
let jsonObj = JSON.parse(jsonFile); //parse json to obj

//-----------read each group to make array of data---------------------

let datas = [];
Object.keys(jsonObj.groups).map(group => {
    let matchs = jsonObj.groups[group].matches;
    matchs.map(match =>datas.push(match));
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
    let matchofDayWSortTimes=[], matchOfDay=[],Times =[];   
    //-find match of the day
    for (let key in datas){            
        if(datas[key].date.includes(date)){
            matchOfDay.push(datas[key]);
        }
    }

    //-find sorted Time on that day
    for (let key in matchOfDay){ 
        Times.push(matchOfDay[key].date.slice(11,16))
    }
    Times = [...new Set(Times)].sort();
    Times.map( time => matchofDayWSortTimes.push(findMatchAtTime(matchOfDay,time,date)))
    
    return matchofDayWSortTimes;
}

//----------------find match at each time in a day---------------------------
function findMatchAtTime(matchOfDay,time,date){
    let teams = jsonObj.teams;
    let htmlMatchs=[],homeTeam='', awayTeam='',score = '';

    for (let key in matchOfDay){ 
        if(matchOfDay[key].date.includes(time)){            
            
            //-find whether this match's already finished or not
            let finish = matchOfDay[key].finished;

            //-find Home or Away Team
            teams.find(team => {            
                if(team.id == matchOfDay[key].home_team ){
                    homeTeam = team.name;
                    home_flag = team.flag;
                }
                if(team.id == matchOfDay[key].away_team){
                    awayTeam = team.name;
                    away_flag = team.flag;
                }
            });
            //-find score result
            let score = matchOfDay[key].home_result+" : "+matchOfDay[key].away_result; 

            //-find local competition's time
            let fullDate = new Date(matchOfDay[key].date)
            let hour = fullDate.getHours();
            let minutes = fullDate.getMinutes();
            hour<=9?  competeTime = '0'+hour+':'+minutes+'0': competeTime = hour+':'+minutes+'0'
            
            //-array keep output of each match at each time with html format
            htmlMatchs.push(renderMatchAtSpecificTimeDate(date,homeTeam,home_flag,awayTeam,away_flag,competeTime,score,finish)); 

       }
    }

    return htmlMatchs.join('')
} 

function renderMatchAtSpecificTimeDate(date,home,home_flag,away,away_flag,time,score,finish){
    finish? showupResult = score:showupResult = time;
    
    return '<label>'+home+'</label>'+
    '<img width="20" src = '+home_flag+'>'+
    '<label>' +showupResult+ '</label>'+
    '<img width="20" src = '+away_flag+'>'+
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



