var x = require('casper').selectXPath;
var utils = require("utils");
var shotCnt = 0;
var testName = "LongChat";
var numberOfChatMessagesToTest = 100;

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

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

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
        this.sendKeys("input[name='msg']", "Chat message 0", {keepFocus: true});
        this.capture(testName + shotCnt++ + ".png");
        this.sendKeys("input[name='msg']", casper.page.event.key.Enter , {keepFocus: true});
        this.capture(testName + shotCnt++ + ".png");





        function addMessage(count, callback) {
            console.log('Hey doing some stuff!');

            casper.waitForSelectorText("input[name='msg']", "",
                function success() {
                    test.assertTextExists("Chat message " + count, 'Page body contains "Chat message ' + count + '"');
                    this.sendKeys("input[name='msg']", "Chat message " + ++count, {keepFocus: true});
                    this.sendKeys("input[name='msg']", casper.page.event.key.Enter , {keepFocus: true});
                    callback();
                },
                function fail() {
                    test.assertExists("input[name='user']");
                    this.capture(testName + shotCnt++ + ".png");
                    callback();
                });
        }

        asyncLoop(numberOfChatMessagesToTest, function(loop) {
                addMessage(loop.iteration(), function(result) {

                    // log the iteration
                    console.log("Iteration " + loop.iteration());

                    // Okay, for cycle could continue
                    loop.next();
                })},
            function(){console.log('cycle ended')}
        );
    });

    casper.run(function() {
        this.capture(testName + shotCnt++ + ".png");
        test.done();
    });
});