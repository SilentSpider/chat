module.exports = function (io, broadcaster, renderPipe, dicer, util, persist) {
    return {
        start: function () {
            io.on('connection', function (socket) {

                console.log('a user connected');
                socket.on('disconnect', function () {
                    console.log('user disconnected');
                });

                socket.on('m', function (jsonMsg) {

                    var msg = JSON.parse(jsonMsg);
                    var timestamp = Math.floor(new Date().getTime() / 1000);

                    // On message
                    if (msg.m) {
                        console.log('New message: ' + JSON.stringify(msg));
                        broadcaster.emit(msg.m, null, timestamp, msg.r, msg.u);
                    }
                });
            });
            broadcaster.global(io);
        },
        chat: function(req, res) {
            var msgs = broadcaster.history(req.params.room);
            renderPipe.deliver('advancedChat.html', {room:req.params.room, msgs: msgs, user:req.params.user}, res);
        },
        post: function(req, res) {

            var RE_BOUNDARY = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i;
            var m = RE_BOUNDARY.exec(req.headers['content-type']);
            var d = new dicer({boundary: m[1] || m[2]});
            var fileName = "hmm";
            var uploadId = null;
            var timestamp = Math.floor(new Date().getTime() / 1000);
            var totalLength = req.headers["content-length"];
            var accLength = 0;

            d.on('part', function (p) {
                var type = null;
                p.on('header', function (header) {
                    for (var h in header) {
                        var k = util.inspect(h);
                        var v = util.inspect(header[h]);
                        if(k === "'content-disposition'") {
                            type = v.substring(20, v.length - 4);
                        }
                    }
                });
                p.on('data', function (data) {
                    if(type === 'uploadId') {
                        var rawMsg = util.inspect(data.toString());
                        uploadId = rawMsg.substring(1, rawMsg.length - 1);
                    }
                    else if(type.slice(0, 4) === 'file') {
                        fileName = type.substring(17);
                        persist.addFile(req.params.room, timestamp, data);
                        accLength += data.length;
                        var proc = Math.floor(100 * accLength / totalLength);
                        res.write(proc + "%");
                    }
                });
            });
            d.on('finish', function () {
                broadcaster.emit("", fileName, timestamp, req.params.room, req.params.user);
                res.end("OK")
            });
            req.pipe(d);
        }
    }
}