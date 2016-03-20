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
        var char = String.fromCharCode(charCode);
        return char;
    }

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

                function addMessage(count, callback) {

                    casper.waitForSelectorText("input[name='msg']", "",
                        function success() {
                            this.reload(function() {

                                    casper.withFrame('chatframe', function () {
                                        test.assertTextExists("Testing character " + getCharByCode(count + offset) + " " + (count + offset), 'Page body contains "Testing character " + getCharByCode(count) + " ' + count + '"');
                                        this.sendKeys("input[name='msg']", "Testing character " + getCharByCode(++count + offset) + " " + (count + offset), {keepFocus: true});
                                        this.sendKeys("input[name='msg']", casper.page.event.key.Enter, {keepFocus: true});
                                        console.log("Testing " + getCharByCode(count + offset));
                                        callback();
                                    });

                            });
                        },
                        function fail() {
                            test.assertExists("input[name='user']");
                            this.capture(testName + shotCnt++ + ".png");
                            callback();
                        });
                }

                asyncLoop(numberOfChatMessagesToTest, function (loop) {
                        addMessage(loop.iteration(), function (result) {
                            // Okay, for cycle could continue
                            loop.next();
                        })
                    },
                    function () {
                        console.log('cycle ended')
                    }
                );
            });
        }
    }
}