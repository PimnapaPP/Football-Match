const express = require('express')
const { format, addHours } = require('date-fns')
const thLocale = require('date-fns/locale/th')

const data = require('./data/wc2018.json')
const app = express()

function getTeamById(id) {
  return data.teams.find((team) => team.id === id)
}

function prepareData({ home_team, away_team, home_result, away_result, date, finished }) {
  const home = getTeamById(home_team)
  const away = getTeamById(away_team)

  return {
    home: {
      name: home.name,
      flag: home.flag
    },
    away: {
      name: away.name,
      flag: away.flag
    },
    finished,
    date,
    score: finished ? `${home_result} : ${away_result}` : '? : ?',
    dateForThai: format(addHours(new Date(date), -3), 'DD MMMM', { locale: thLocale}),
    time: format(new Date(date), 'HH:mm')
  }
}

function getAllMatches(groups) {
  return groups.reduce(function(previousMatches, currentGroup) {
    return previousMatches.concat(data.groups[currentGroup].matches.map(prepareData))
  }, []) 
}

function sortMatchesByDate(matches) {
  console.log(matches)
  return matches.slice(0).sort(function(a, b) {
    return new Date(a.date) > new Date(b.date) ? 1 : -1
  })
}

function renderMatchesToHTML(matches) {
  let lastDateForThai = ''
  return matches.reduce(function(prevOutput, match) {
    console.log(match)
    const { home, away, finished, score, time, dateForThai } = match;
      let firstMatchOfDay = false

      if (lastDateForThai !== dateForThai) {
        lastDateForThai = dateForThai
        firstMatchOfDay = true
      } 

      const output = `
        ${firstMatchOfDay ? `<br /><h3>วันที่ ${dateForThai}</h3>` : ''}
        <p>
          ${home.name}
          <img src="${home.flag}" width="20" />
          ${finished ? score : time}
          <img src="${away.flag}" width="20" />
          ${away.name}
        </p>
      `
      
      return prevOutput + output
   
  }, '')
}

const allGroups = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const allMatches = getAllMatches(allGroups); //console.log('AllMatch :'+allMatches)
const allSortedMatches = sortMatchesByDate(allMatches);//console.log('allsort :'+allSortedMatches)
const html = renderMatchesToHTML(allSortedMatches);//console.log('html :'+html)

app.get('/', (req, res) => res.send(html))
app.listen(3000, () => console.log('Example app listening on port 3000!'))