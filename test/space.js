
var testName = "Space";
var offset = 0x2b0;
var end = 0x3af;

var x = require('casper').selectXPath;
var iterator = require('testquick')(); // switch to require 'testiterator' to test chars one by one
var utils = require("utils");

casper.test.begin('Testing of character set', function(test) {

    iterator.launch('http://localhost:3000/', test, offset);
    casper.run(function() {
        this.capture(testName + "done.png");
        test.done();
    });
});