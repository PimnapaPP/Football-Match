const fs = require("fs");
const data = fs.readFileSync('wc2018.json');


//-----------read each group to make array of data---------------------
function getTeamById(id){
    return data.teams.find(team => team.id ===id)
}

function prepareData({ home_team, away_team, home_result, away_result, date, finished }){
    const home = getTeamById(home_team);
    const away = getTeamById(away_team);

    return {
        home:{
            name: home.name,
            flag: home.flag
        },
        away:{
            name: away.name,
            flag: away.flag
        },
        finished,
        date,
        score: finished? `${home_result} :${away_result}`:`? : ?`,
        dateForThai: format(addHours(new Date(date), -3), 'DD MMMM', { locale: thLocale}),
        time: format(new Date(date), 'HH:mm')

    }
}

function getAllMatches(groups){
    return groups.reduce(function (previousMatchs, currentGroup){
        return previousMatchs.concat(data.groups[currentGroup].matches.map(prepareData))
    },[])
}

function sortMatchesByDate(matches) {
    console.log(matches)
    return matches.slice(0).sort(function(a, b) {
      return new Date(a.date) > new Date(b.date) ? 1 : -1
    })
  }


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
    '<img src ='+home_flag+' width="20" >'+
    '<label>' +showupResult+ '</label>'+
    '<img src ='+away_flag+' width="20" >'+
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


