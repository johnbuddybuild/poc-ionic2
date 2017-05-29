'use strict';

var q = require('q');
var gm = require('gm');
var fs = require('fs');
var execSync = require('child_process').execSync;

var World = {};


/**
 * Takes a screenshot and saves in under the specified path and filename
 * @param path
 * @param filename
 * @returns {Promise.<TResult>}
 */
World.getScreenshot = (path, filename) => {
  return new Promise((resolve, reject) => {
    browser.takeScreenshot().then((screenshot) => {
      if (!screenshot.length) {
        console.error('Screenshot length is 0 - retaking');
        resolve(World.getScreenshot(path, filename));
      }

      if (!fs.existsSync(path)) {
        // Using execSync over fs in order to create the full path if needed
        execSync('mkdir -p ' + path);
      }
      let stream = fs.createWriteStream(
        path + filename + '.png'
      );
      stream.end(new Buffer(screenshot, 'base64'), null, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(screenshot);
        }
      });
    });
  });
};

/**
 * Crops the top of a screenshot in order to cut off the device statusbar. This is useful
 * in the case of screenshot comparison in order not to include the device clock in the comparison
 * which would cause the comparison to fail when the time changes.
 * @param filename The full patf of the screenshot to crop
 * @returns {*}
 */
World.cropStatusbar = (filename) => {
  let deferred = q.defer();
  gm(filename + '.png').size((err, size) => {
    if (err) {
      deferred.reject(err);
    }

    let statusbarHeight = 40;
    gm(filename + '.png').crop(size.width, size.height - statusbarHeight, 0, statusbarHeight)
      .write(filename + '.png', (err) => {
        if (err) {
          deferred.reject(err);
        }

        deferred.resolve();
      });
  });
  return deferred.promise;
};

/**
 * Compares 2 screenshots
 * @param baseScreen The full path of the reference screenshot
 * @param testScreen The full path of the screenshot to test
 * @param output The full path where the output will be saved. The output is an annotated
 * screenshot where the differences between the 2 screenshots being compared are marked in red.
 * @param tolerance The tolerance of the comparison. If not specified it will be 0 by default, meaning
 * the comparison will fail if the 2 screenshots are not exactly the same.
 * @returns {*}
 */
World.compareScreenshot = function(baseScreen, testScreen, output, tolerance) {
  let deferred = q.defer();
  if (!tolerance) {
    tolerance = 0;
  }
  let options = {
    tolerance: tolerance,
    file: output + '.png'
  };
  gm.compare(baseScreen + '.png', testScreen + '.png', options,
    (err, isEqual, equality) => {
      if (err) {
        throw err;
      }
      isEqual
        ? deferred.resolve('Screenshot comparison succeeded (equality: ' + equality + ' with tolerance: ' + options.tolerance + ')')
        : deferred.reject('Screenshot comparison failed (equality: ' + equality + ' with tolerance: ' + options.tolerance + ')');
    });
  return deferred.promise;
};


module.exports = World;
