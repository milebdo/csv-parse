// please use promise approach to fight the naive one in parse-callback.js
'use strict';

var debug = require('debug')('hello');

var fs = require('fs');
var parse = require('csv-parse');
var helper = require('./helper');
var Promise = require('promise');

var promise = new Promise.denodeify(fs.readFile);

var parser = promise('sample.csv')
   .then(function (str) {
	   parse(str, function transformEachLine(err, parsed) {
		   for (let index in parsed) {
			   let full_name = parsed[index][0]+' '+parsed[index][1];			   
			   if(index != 0)
			   { 
				 helper.sendSms(full_name, function afterSending(err, sendingStatus) { 
		                 let nameToLog;
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
//		                         console.log(loggingStatus);
		                     });
		                 }
	               });
				 }
		   }
	   });
   })