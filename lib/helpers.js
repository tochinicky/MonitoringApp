/*
/* Helpers for various tasks
*
*/

//Dependencies
const crypto = require('crypto');
const config = require('../config');
//Container for all the helpers
const helpers ={};


//Create a SHA256 hash
helpers.hash = str =>{
  if(typeof(str) === 'string' && str.length > 0){
    let hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash;
  }else{
    return false;
  }
}

//Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = str =>{
  try {
    let obj = JSON.parse(str);
    return obj;
  } catch (error) {
    return {};
  }
}
// Create a string of random alphanumeric characters, of a given length
helper.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    let str = '';
   
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str+=randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

//Export the module
module.exports = helpers;