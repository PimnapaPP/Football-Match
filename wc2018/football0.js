const app = require('express')();
const control = require('./fbController');
const port = 8000;

const findMatchofTheDay = control.findMatchofTheDay;
const convertDateFormat = control.convertDateFormat;
const uniqueDates = control.uniqueDates;

app.get('/', function (req, res) {
    uniqueDates.forEach(day =>{
        res.write('<h1>'+convertDateFormat(day)+'</h1>')
        res.write(""+findMatchofTheDay(day).join("")+'<br>')
    })
    res.end();
})

app.listen(port, function() {
    console.log('http://localhost:'+port);
});

