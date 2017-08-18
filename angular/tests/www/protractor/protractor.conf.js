var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

exports.config = {  
      capabilities: {
          'browserName': 'chrome',
          'chromeOptions': {                
              args: ['--disable-web-security']
          } 
      },
      baseUrl: 'http://localhost:3000',
      specs: [
          '../../../app/components/**/*.e2e-test.js'
      ],
      jasmineNodeOpts: {
          isVerbose: true,
      },
      onPrepare: function() {
        jasmine.getEnv().addReporter(
          new Jasmine2HtmlReporter({
            savePath: './tests/www/reports/e2e/',
            screenshotsFolder: 'screenshots'
          })
        );
      }
};