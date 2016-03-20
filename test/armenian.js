
var testName = "Armenian";
var offset = 0x530;
var end = 0x62f;

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