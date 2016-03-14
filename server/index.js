var express = require('express')();
var fs = require('fs');

var useSSL = false;
if(useSSL) {
    var http = require('https').createServer({
        key: fs.readFileSync('privatekey.pem'),
        cert: fs.readFileSync('certificate.pem')
    }, express);
}
else {
    var http = require('http').createServer(express);
}

var io = require('socket.io')(http);
var crypto = require('crypto');
var util = require('util');
var compress = require('compression');
var config = require('./config.json');
var handlebars = require('handlebars');
var lodash = require('lodash');
var dicer = require('dicer');
var qr = require('qr-image');
var xml = require("node-jsxml");
var format = require('./modules/format')();
var renderPipe = require('./modules/handlebarPipe')(handlebars, fs, format);
var system = require('./modules/system')(http, config);
var render = require('./modules/render')(renderPipe, crypto, qr, config, fs, useSSL, xml);
var persist = require('./modules/filePersist')(fs);
var broadcaster = require('./modules/broadcaster')(persist);
var aChat = require('./modules/aChat')(io, broadcaster, renderPipe, dicer, util, persist);
var bChat = require('./modules/bChat')(renderPipe, broadcaster, lodash, dicer, util, persist);
var fileHandler = require('./modules/fileHandler')(persist);
var router = require('./modules/router')(express, system, render, aChat, bChat, compress, fileHandler);


router.setup();
aChat.start();
system.start();

