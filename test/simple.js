var x = require('casper').selectXPath;
var utils = require("utils");
var shotCnt = 0;
var testName = "00simple";

casper.options.viewportSize = {width: 1172, height: 806};
casper.on('page.error', function(msg, trace) {
    this.echo('Error: ' + msg, 'ERROR');
    for(var i=0; i<trace.length; i++) {
        var step = trace[i];
        this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
    }
});

casper.waitForSelectorText = function(selector, text, then, onTimeout, timeout){
    this.waitForSelector(selector, function _then(){
        this.waitFor(function _check(){
            var content = this.fetchText(selector);
            if (utils.isRegExp(text)) {
                return text.test(content);
            }
            return content.indexOf(text) !== -1;
        }, then, onTimeout, timeout);
    }, onTimeout, timeout);
    return this;
};

casper.test.begin('Simple walk from front page to submitting a few messages', function(test) {

    casper.start('http://localhost:3000/');
    casper.waitForSelector(".centerBox img",
        function success() {
            test.assertExists(".centerBox img");
            this.click(".centerBox img");
            this.capture(testName + shotCnt++ + ".png");
        },
        function fail() {
            test.assertExists(".centerBox img");
        });
    casper.waitForSelector("form#form1 input[name='user']",
        function success() {
            test.assertExists("form#form1 input[name='user']");
            this.click("form#form1 input[name='user']");
            this.capture(testName + shotCnt++ + ".png");
        },
        function fail() {
            test.assertExists("form#form1 input[name='user']");
        });
    casper.waitForSelector("input[name='user']",
        function success() {
            this.sendKeys("input[name='user']", "Alice", {keepFocus: true});
            this.sendKeys("input[name='user']", casper.page.event.key.Enter , {keepFocus: true});
            this.capture(testName + shotCnt++ + ".png");
        },
        function fail() {
            test.assertExists("input[name='user']");
        });


    casper.withFrame('chatframe', function() {
        this.capture(testName + shotCnt++ + ".png");
        this.test.assertSelectorExists("input[name='msg']", 'Should show chat input');
        this.sendKeys("input[name='msg']", "First chat message", {keepFocus: true});
        this.capture(testName + shotCnt++ + ".png");
        this.sendKeys("input[name='msg']", casper.page.event.key.Enter , {keepFocus: true});
        this.capture(testName + shotCnt++ + ".png");

        casper.waitForSelectorText("input[name='msg']", "",
            function success() {
                this.capture(testName + shotCnt++ + ".png");
                test.assertTextExists("First chat message", 'page body contains "First chat message"');
                this.sendKeys("input[name='msg']", "Second chat message", {keepFocus: true});
                this.capture(testName + shotCnt++ + ".png");
                this.sendKeys("input[name='msg']", casper.page.event.key.Enter , {keepFocus: true});
                this.capture(testName + shotCnt++ + ".png");
            },
            function fail() {
                test.assertExists("input[name='user']");
            });

        casper.waitForSelectorText("input[name='msg']", "",
            function success() {
                this.capture(testName + shotCnt++ + ".png");
                test.assertTextExists("Second chat message", 'page body contains "Second chat message"');
                this.sendKeys("input[name='msg']", "Third chat message", {keepFocus: true});
                this.capture(testName + shotCnt++ + ".png");
                this.sendKeys("input[name='msg']", casper.page.event.key.Enter , {keepFocus: true});
                this.capture(testName + shotCnt++ + ".png");
            },
            function fail() {
                test.assertExists("input[name='user']");
            });

    });

    casper.run(function() {test.done();});
});