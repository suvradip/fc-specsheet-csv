var fs=require('fs');
var config = {};

//folder location
config.dir='spec-sheets/';
//output folder location
config.output = 'output/';
//output filename
config.outputFilename = 'map-specs.csv';
//individual spec-sheets folder name
config.output_specs = config.output+"spec-sheets/";

//store all the file name in the array
config.files = fs.readdirSync(config.dir);
  
//csv file header for individual file
config.csvHeader = "ID,Short Label,Label\n";

//create output folder directory if doesn't exist
// if (!fs.existsSync(config.output))
//   fs.mkdirSync(config.output);


var checkDir = function(){
  var _path = arguments;
  if(_path.length === 1) {
    if(!fs.existsSync(_path[0]))
      fs.mkdirSync(_path[0]);
  } else {
    for(var i=0; i<_path.length; i++)
      checkDir(_path[i]);
  }  
};

checkDir(config.output, config.output_specs);

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
   
    //writing individual csv files 
    fs.writeFileSync(config.output + "spec-sheets/"+mapName+".csv", config.csvHeader + preparedData);

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