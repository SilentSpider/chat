
var testName = "Ascii";
var offset = 0x20;
var end = 0xff;

var x = require('casper').selectXPath;
var iterator = require('testiterator')();
var utils = require("utils");

casper.test.begin('Testing of character set', function(test) {

    iterator.launch('http://localhost:3000/', test, offset);
    casper.run(function() {
        this.capture(testName + "done.png");
        test.done();
    });
});