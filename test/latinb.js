
var testName = "LatinB";
var offset = 0x180;
var end = 0x27f;

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