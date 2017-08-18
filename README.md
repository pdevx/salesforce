# Salesforce Subdirectories

###### Getting Started
Clone the repository and run 'npm install' at the root as well as inside the 'angular' folder to install dependencies.

Inside the angular folder, run 'gulp build' to build the app.

Then run 'npm start' to initiate a server at localhost:5000.

###### About
In my first attempt at this problem I thought too much about the file in/out portion and sank too much time into a gui for choosing a file and sending it to a server for processing. I realized a good chunk of the way through and needed to shift gears to the logic portion of the problem. I didn't end up solving the problem in the 2 hours alotted which was a bummer. I did spend a few more hours on the problem so that I could get a proper solution created. The logic for parsing the file and running the commands is located in the nodejs server index.js file. Once the app is built and the server is started, you can navigate to localhost:5000 in a browser and click the ok button. Node will read the file in the input folder and output to the output folder.

If I revisit this in the future I plan to reimplement the file selection from the gui and have the server send back the output file to the client rather than store it in a folder.