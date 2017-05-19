var _ = require('lodash'),
    spawn = require('child_process').spawn,
    execSync = require('child_process').execSync,
    fs = require('fs'),
    tcpPortUsed = require('tcp-port-used'),
    ps = require('ps-node'),
    path = require('path');

var manager = {

    run: (options) => {
        options = _.extend({
            cmd: '',
            delay: 30000,
            args: [],
            output: false,
            port: false
        }, options);

        var logFile = 'ignore';

        if (options.output) {
            try {
                logFile = fs.openSync(options.output, 'w');
            } catch (error) {
                execSync('mkdir -p ' + path.dirname(options.output));

                logFile = fs.openSync(options.output, 'w');
            }
        }

        // Spawn new process and detach it from the current process (ie. gulp) so that
        // the current task can complete
        var process = spawn(options.cmd, options.args, {
            detached: true,
            stdio: ['ignore', logFile, logFile]
        });

        console.log('Starting process with PID ', process.pid);

        process.unref();

        return new Promise(function (resolve, reject) {
            if (!options.port) {
                resolve();
                return;
            }

            // If the new process is supposed to be listening on a port wait
            // until this port is taken before returning as a means to "verify"
            // that the process has finished starting up.
            tcpPortUsed.waitUntilUsed(options.port, 500, options.delay)
                .then(function () {
                    console.log('Process port opened', options.port);
                    resolve();
                }, function (err) {
                    console.error('Error waiting for port ' + options.port + ' to open:', err.message);
                    reject(err);
                });
        });
    },

    kill: (processName) => {
        'use strict';

        execSync('pkill -9 -f ' + processName + ' || echo ' + processName + ' stop failed - probably no process to stop exists', {stdio: ['ignore', 1, 2]});
        console.log(processName + ' killed');

        /**
         * This is used in order to wait 200ms after the kill process(`pkill`) is being used.
         * The problem was that when we run the appium(and every other) process
         * without having successfully killed the previous process(with `pkill`),
         * the start process was returning an error once the `pkill` command haven't finished
         */
        var end = Date.now() + 200;
        while (Date.now() < end) ;
    },

    getArgument: (options, argName) => {
        return new Promise(function (resolve, reject) {
            ps.lookup({command: options.cmd, arguments: options.args, psargs: 'ux'}, function (err, resultList) {
                if (err) {
                    reject(err);
                }

                console.log('Found ' + resultList.length + ' processe(s)');
                var process = resultList[0];

                if (process) {
                    process.arguments.forEach(function(value, index) {
                       if (value === argName) {
                           resolve(process.arguments[index + 1]);
                       }
                    });
                    reject('Argument ' + argName + ' not found');
                }
                else {
                    console.log('No such process found!');
                    reject('No such process found!');
                }
            });
        });
    }
};


module.exports = manager;
