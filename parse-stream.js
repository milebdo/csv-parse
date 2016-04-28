// 0. Please use readline (https://nodejs.org/api/readline.html) to deal with per line file reading
// 1. Then use the parse API of csv-parse (http://csv.adaltas.com/parse/ find the Node.js Stream API section)
'use strict';

var debug = require('debug')('hello');

var fs = require('fs');
var parse = require('csv-parse');
var helper = require('./helper');

var inputFile='sample.csv';

var chomp = require("line-chomper").chomp;

chomp(inputFile, function (err, lines) {
	lines.forEach(function (line, offset) {
		var getdata = line.toString().split('"');
		var full_name = getdata[1]+" "+getdata[3];
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
//                    console.log(loggingStatus);
                });
            }
      });
	});
});
