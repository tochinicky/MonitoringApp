/*
* Primary file for the API
*
*/

//Dependencies
const http = require('http');
const https = require('https');
const url =  require('url');
const fs = require('fs');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const handler = require('./lib/handlers');
const helpers = require('./lib/helpers');
//const _data = require('./lib/data');



// // TESTING
// _data.delete('test','newFile',(err) => {
//   console.log('this was the error',err);
// });
// Insantiating the HTTP server
let httpServer = http.createServer((req,res) => {
  unifiedServer(req,res);
})
// Start the server
httpServer.listen(config.httpPort,() => console.log(`The server is listening on port ${config.httpPort} in ${config.envName} mode`));


//Instantiate the HTTPS Server
// let httpsServerOptions = {
//   'key':fs.readFileSync('./privkey.pem'),
//   'cert':fs.readFileSync('./https/cacert.pem')
// };
// let httpsServer = https.createServer(httpsServerOptions,(req,res) => {
//   unifiedServer(req,res);
// })

// //Start the HTTPS Server
// httpsServer.listen(config.httpsPort,() => console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} mode`));



//All the server logic for both the http and https server
const unifiedServer = (req,res)=>{
  //Get the path and parse it
  let parseUrl = url.parse(req.url,true);

  //Get the path
  let path = parseUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g,'');

  //Get the Method
  let method = req.method.toLocaleLowerCase();
  //Get a querystring from url
  let queryStringObject = parseUrl.query;
  //console.log(queryStringObject);

  //Get headers
  let header = req.headers;

  //Get payloads of an incoming request
  let stringDecod = new stringDecoder('utf-8');
  let data ='';
  req.on('data', chunk=>{
    data += stringDecod.write(chunk); 
  });
  req.on('end', () => {
    data += stringDecod.end();

    //Choose the handler this request should go to. if one is not found use the not found handler
    let chooseHandler = typeof(router[trimmedPath]) !== 'undefined'?router[trimmedPath]:handler.notFound;
    
    //Construct the data object to send to the handler
    let dataReq = {
      'trimmedPath': trimmedPath,
      'queryStringMethod': queryStringObject,
      'method':method,
      'headers':header,
      'payload': helpers.parseJsonToObject(data)
    };

    //Route the request to the handler specified in the router
    chooseHandler(dataReq,(statusCode,payload)=>{
      //console.log(JSON.stringify(dataReq));
      //console.log(statusCode,payload)
      //Use the status code called back by the handler, or default to status code 200
      statusCode = typeof(statusCode) === "number"?statusCode: 200;

      //Use the payload by the handler, or default to an empty object
      payload = typeof(payload) === "object"?payload:{};

      //Convert the payload to a string
      let payloadString = JSON.stringify(payload)

      //Set the response to be a json 
      res.setHeader("Content-Type","application/json");
         //Return the response
      res.writeHead(statusCode);
      res.end(payloadString);

    //Log the request path
      console.log(`Returning this response: ${statusCode}, ${payloadString}`);
    })
  
  });
}


//Define a request router
const router = {
  ping: handler.ping,
  feature: handler.feature,
  users: handler.users,
  tokens: handler.tokens,
  checks: handler.checks
};