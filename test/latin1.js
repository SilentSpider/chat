
var testName = "Latin1";
var offset = 0xA0;
var end = 0x17f;

var x = require('casper').selectXPath;
var iterator = require('testquick')();
var utils = require("utils");

casper.test.begin('Testing of character set', function(test) {

    iterator.launch('http://localhost:3000/', test, offset);
    casper.run(function() {
        this.capture(testName + "done.png");
        test.done();
    });
});

