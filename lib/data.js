/*
* Library for storing and editing data
*
*/

//Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

//Container for module (to be exported)
let lib ={};

//Base directory of the data flder
lib.baseDir = path.join(__dirname,'/../.data/');

//write data to a file
lib.create = (dir,file,data,callback)=>{
  //open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor)=>{
    console.log(err,fileDescriptor);
    if(!err && fileDescriptor){
      //Convert data to string
      let stringData = JSON.stringify(data);

      //Write to file and close it
      fs.writeFile(fileDescriptor,stringData,err=>{
        if(!err){
          fs.close(fileDescriptor,err=>{
            if(!err){
              callback(false);
            }else{
              callback('Error closing new file');
            }
          });
        }else{
          callback('Error writing to new file');
        }
      });
    }else{
      callback('Could not create new file, it may already exist');
    }
  });
}


//Read data from a file
lib.read = (dir,file,callback)=>{
  fs.readFile(lib.baseDir + dir+'/'+file+'.json','utf8',(err,data)=>{
   if(!err && data){
     let parsedData = helpers.parseJsonToObject(data);
     callback(false,parsedData);
   }else{
    callback(err,data);
   }
 
  })
}

//Update data inside a file
lib.update = (dir,file,data,callback)=>{
  //Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',(err,fileDescriptor)=>{

    if(!err && fileDescriptor){
      //Convert data to string
      let stringData = JSON.stringify(data);

      //Truncate the file
      fs.truncate(fileDescriptor,err=>{
        if(!err){
          //Wrtie to the file and close it
          fs.writeFile(fileDescriptor,stringData,err=>{
            if(!err){
              fs.close(fileDescriptor,err=>{
                if(!err){
                  callback(false);
                }else{
                  callback('Error closing existing file');
                }
              });
            }else{
              callback('Error writing to existing file');
            }
          })
        }else{
          callback('Error truncating file');
        }
      });

    }
  })
}


//Delete a file
lib.delete = (dir,file,callback)=>{
  //Unlink the file
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',err=>{
    !err?callback(false):callback('Error deletign file');
  })
}
//Export the module
module.exports = lib;