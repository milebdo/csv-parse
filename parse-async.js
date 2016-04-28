// Please use async lib https://github.com/caolan/async
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var helper = require('./helper');
var debug = require('debug')('hello');

var inputFile='sample.csv';

var parser = parse({delimiter: ','}, function (err, data) {
  async.eachSeries(data, function (line, callback) {
	  Object.keys(data).forEach(function (key) {
		 if(key!=0)
		 {
			 var full_name = data[key][0]+' '+data[key][1];
			 helper.sendSms(full_name, function afterSending(err, sendingStatus) {
	                 var nameToLog;
	                 if (err) {
	                     debug(err.message);
	
	                     nameToLog = {
	                         sendingStatus,
	                         full_name
	                     };
	                 }
	                 if (nameToLog) {
	                     helper.logToS3(nameToLog, function afterLogging(err, loggingStatus) {
	                         if (err) {
	                             debug(err.message);
	                         }
//	                         console.log(loggingStatus);
	                     });
	                 }
               });
		 }
	  	 });
  	  });
})
fs.createReadStream(inputFile).pipe(parser);