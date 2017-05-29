var {defineSupportCode} = require('cucumber');
let world = require('./ui-world');

defineSupportCode(function ({Then}) {
  Then(/^I take screenshot (.*)$/, (name) => {
    if (browser.params.plat === 'android') {
      return;
    }
    browser.driver.sleep(1000);

    let refScreenshotFolder = 'test/functional/screenshots/';
    let testScreenshotFolder = 'output/functional/screenshots/compare/';
    let screenshotFolder = testScreenshotFolder;
    if (browser.params.screens === 'record') {
      screenshotFolder = refScreenshotFolder;
    }

    return world.getScreenshot(screenshotFolder, name).then(() => {
      return world.cropStatusbar(screenshotFolder + name).then(() => {
        if (browser.params.screens === 'record') {
          return;
        }

        return world.compareScreenshot(refScreenshotFolder + name,
          testScreenshotFolder + name, testScreenshotFolder + name + '_diff');
      })
    });
  })

});
