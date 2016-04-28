'use strict';

const debug = require('debug')('hello');

const fs = require('fs');
const parse = require('csv-parse');
const helper = require('./helper');

// 0. Naïve

function naive() {
    fs.readFile(__dirname + '/sample.csv', function thenParse(err, loadedCsv) {

        parse(loadedCsv, function transformEachLine(err, parsed) {

            for (let index in parsed) {

                let line = parsed[index];

                // FIXME: Put your transformation here
                let full_name = parsed[index][0]+' '+parsed[index][1]; //format data into full name
                
                if (index > 0) {
                    debug(`sending data index: ${index - 1}`);

                    helper.sendSms(full_name, function afterSending(err, sendingStatus) {
                        let lineToLog;
                        if (err) {
                            debug(err.message);

                            lineToLog = {
                                sendingStatus,
                                full_name, //change to full_name
                            };
                        }

                        if (lineToLog) {
                            helper.logToS3(lineToLog, function afterLogging(err, loggingStatus) {
                                if (err) {
                                    debug(err.message);
                                }
//                                console.log(loggingStatus);
                            });
                        }
                    });
                }

                index++;
            }
        });
    });
}

naive();