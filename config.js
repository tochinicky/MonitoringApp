/*
* Create and export configuration variables
*
*/

//Container for all the environments
let environments ={};

//Staging (default) environment
environments.staging = {
  'httpPort':3000,
  'httpsPort':3001,
  'envName':'staging',
  'hashingSecret':'thisIsMySecret'
};

//Production environment
environments.production = {
  'httpPort': 5000,
  'httpsPort':5001,
  'envName': 'production',
  'hashingSecret':'thisIsMySecret'
}

//Determine which environment was passed as a command-line arguement
let currentEnvironment = typeof(process.env.NODE_ENV) === 'string'?process.env.NODE_ENV.toLowerCase():'';

//Check the current environment is one of the environments above, if not, default to staging
let environmentToEport = typeof(environments[currentEnvironment]) === 'object'? environments[currentEnvironment]:environments.staging;

//Export the module
module.exports = environmentToEport;