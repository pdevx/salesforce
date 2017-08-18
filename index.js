var express = require('express');
var fileUpload = require('express-fileupload');
var router = express.Router();
var http = require('http');
var https = require('https');
var app = express();
var bodyParser = require('body-parser');

function handleCommand(line) {
  var tempArray = line.split(" ");
  var newLine = [];

  for(var i = 0;i<tempArray.length;i++){
    if(tempArray[i] !== ""){
      newLine.push(tempArray[i])
    }
  }


  console.log(newLine);
  switch (newLine[0]) {
    case 'dir':
      break;
    case 'mkdir':
      break;
    case 'cd':
      break;
    case 'up':
      break;
  }
};

// body-parser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/angular/app/.www/'));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/angular/app/.www/' });
});

// API
app.post('/sendFile', function (req, res) {
  var dirArray = ['root'];
  var dirArrayPosition = 0;

  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('prog5.dat')
  });

  lineReader.on('line', function (line) {
    console.log(line);
    handleCommand(line);
  });

  // console.log(req);
  // if (!req.files){
  //   return res.status(400).send('No files were uploaded.');
  // }
  // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  // let sampleFile = req.files.sampleFile;

  // // Use the mv() method to place the file somewhere on your server 
  // sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send('File uploaded!');
  // });


});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});