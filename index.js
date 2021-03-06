var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var rl = require('readline');
var router = express.Router();
var http = require('http');
var https = require('https');
var app = express();
var bodyParser = require('body-parser');

// initial directory structure with just the root
var directories = {
  root: {}
};
// An array for tracking where we are in the directory tree, position 0 is the current directory with parent folders stored in sequence after.
var navArray = [{
  name: "root",
  dirs: directories.root // a reference to the location of child directories in the directories object.
}];

// Convert each line from the linereader into an array of values
function convertLineToArray(line, wstream) {
  var tempArray = line.split(" ");
  var lineArray = [];
  for (var i = 0; i < tempArray.length; i++) {
    if (tempArray[i] !== "") {
      lineArray.push(tempArray[i])
    }
  }
  return lineArray;
};

// Handle each command as they are streamed from the input file
function handleCommand(line, wstream) {
  var lineArray = convertLineToArray(line);
  wstream.write('Command: ' + line + '\n');
  console.log(JSON.stringify(directories));
  switch (lineArray[0]) {
    case 'dir':
      // Display the path and the subdirectories of the current default directory, the latter in lexicographic order.
      var curDir = "";
      // Piece together a properly formatted string for the current directory.
      for (var i = 0; i < navArray.length; i++) {
        if (i === 0) {
          curDir = navArray[i].name;
        } else {
          curDir = navArray[i].name + '\\' + curDir;
        }
      }
      var dirString = "Directory of " + curDir + ":\n";
      // Piece together the string for subdirectories.
      var subDirs = Object.keys(navArray[0].dirs);
      if (subDirs.length === 0) {
        dirString = dirString + "No subdirectories";
      } else {
        var subDirString = "";
        subDirs = subDirs.sort()
        for(var ii = 0; ii < subDirs.length;ii++){
          subDirString = subDirString + subDirs[ii] + '\t';
        }
        dirString = dirString + subDirString;
      }
      wstream.write(dirString + '\n');
      break;
    case 'mkdir':
      // Create a subdirectory of the current default directory with the specified name.
      console.log(lineArray[1]);
      // Should check to see if directory exists already, eventually...
      navArray[0].dirs[lineArray[1]] = {};
      break;
    case 'cd':
      // Change the default to a specified subdirectory of the current default directory.
      console.log(lineArray);
      var subDirs = Object.keys(navArray[0].dirs);
      var isMatch = false;
      // Make sure the requested directory exists in the subdirectories.
      for (var i = 0; i < subDirs.length; i++) {
        if (subDirs[i] === lineArray[1]) {
          isMatch = true;
        }
      }
      if (isMatch) {
        // Create a navObj to track directory navigation and put it at position 0 in the navArray.
        var navObj = {
          name: lineArray[1],
          dirs: navArray[0].dirs[lineArray[1]]
        };
        navArray.splice(0, 0, navObj);
      } else {
        console.log("No directory named " + lineArray[1] + " was found");
      }
      break;
    case 'up':
      // Change the default to the parent directory of the current default directory.
      if (navArray.length > 1) {
        // Just move the parent to position 0 and drop the current directory.
        navArray.shift();
      } else {
        wstream.write("Cannot move up from root directory\n");
      }
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
  // Create a file to write to.
  var wstream = fs.createWriteStream('output/prog5.out');
  wstream.write('Start----->\n');

  // Read the input file line by line.
  var lineReader = rl.createInterface({
    input: fs.createReadStream('input/prog5.dat')
  });

  lineReader.on('line', function (line) {
    handleCommand(line, wstream);
  });

  // I think we're done here.
  lineReader.on('close', function () {
    console.log("We done");
    wstream.write('End------->\n');
    wstream.end();
    res.send('File written!');
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