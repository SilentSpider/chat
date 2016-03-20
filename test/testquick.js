module.exports = function () {

    var numberOfChatMessagesToTest = end - offset;
    var shotCnt = 0;
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

    function getCharByCode(charCode) {
        var retStr = "";
        for(var i = 0; i <= numberOfChatMessagesToTest; i++) {
            retStr += String.fromCharCode(charCode + i);
        }
        return retStr;
    }

    casper.options.viewportSize = {width: 1172, height: 806};
    casper.on('page.error', function(msg, trace) {
        this.echo('Error: ' + msg, 'ERROR');
        for(var i=0; i<trace.length; i++) {
            var step = trace[i];
            this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
        }
    });

    return {
        launch: function (url, test, offset) {

            casper.start(url);

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
                    this.sendKeys("input[name='user']", casper.page.event.key.Enter, {keepFocus: true});
                    this.capture(testName + shotCnt++ + ".png");
                },
                function fail() {
                    test.assertExists("input[name='user']");
                });

            casper.withFrame('chatframe', function () {
                this.capture(testName + shotCnt++ + ".png");
                this.test.assertSelectorExists("input[name='msg']", 'Should show chat input');
                this.sendKeys("input[name='msg']", "Testing character " + getCharByCode(offset) + " " + offset, {keepFocus: true});
                console.log("Testing " + offset + " " + getCharByCode(offset));
                this.capture(testName + shotCnt++ + ".png");
                this.sendKeys("input[name='msg']", casper.page.event.key.Enter, {keepFocus: true});
                this.capture(testName + shotCnt++ + ".png");

                casper.waitForSelectorText("input[name='msg']", "",
                    function success() {
                        this.reload(function() {
                                casper.withFrame('chatframe', function () {
                                    test.assertTextExists("Testing character " + getCharByCode(offset) + " " + (offset), 'Page body contains same chars');
                                });
                        });
                    },
                    function fail() {
                        test.assertExists("input[name='user']");
                        this.capture(testName + shotCnt++ + ".png");
                        callback();
                    });

            });
        }
    }
}