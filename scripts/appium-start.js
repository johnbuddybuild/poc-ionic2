let runner = require('./util/runner');

runner.run({
  cmd: 'appium',
  args: ['--session-override'],
  output: 'output/logs/appium.log',
  port: 4723
});
