var fs=require('fs');
var config = {};

//folder location
config.dir='spec-sheets/';
//output folder location
config.output = 'output/';
//output filename
config.outputFilename = 'map-specs.csv';

//store all the file name in the array
config.files = fs.readdirSync(config.dir);
  

//create output folder directory if doesn't exist
if (!fs.existsSync(config.output))
  fs.mkdirSync(config.output);

//creating file
fs.writeFileSync(config.output + config.outputFilename, "Map Name,ID,Short Label,Label\n"); 

config.files.forEach(function(file){     
  var fileData,
      preparedData,
      mapName;
  fileData = fs.readFileSync(config.dir+ file,'utf-8'); 

  try {
    mapName = fileData.match(/####\sJavaScript Alias:\smaps\/(.*)/)[1];
    preparedData = fileData.match(/---\|---\|---\|---\n([\s\S]*?)\n\n/); 
    preparedData = preparedData[1].trim();
    preparedData = preparedData.split('|').join(',');
    preparedData = preparedData.split("\n");

    for(var i=0; i<preparedData.length; i++)
      preparedData[i] = mapName + "," + preparedData[i];

    preparedData = preparedData.join("\n");
    preparedData = preparedData + "\n";

    fs.appendFileSync(config.output + config.outputFilename, preparedData); 
  } catch(err) {            
    console.log(file, err);
    fs.writeFileSync(config.dir + file, fileData + '\n\n'); 
    config.flag = 'false';
  }         
});

if(typeof config.flag === 'undefined')
  console.log('File writing is done... Please check ' + config.output + ' folder.');
else
  console.log('Please Re-Run, this program again... Task is incomplet.');    