var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given}) {
  Given(/^I click the menu button$/, () => {
    let selector = 'bar-button-menutoggle';
    browser.driver.wait(protractor.until.elementLocated(by.className(selector)), 3000);
    return element(by.className(selector)).click();
  });

  Given(/^I wait$/, () => {
    return browser.driver.sleep(1000);
  })
});
