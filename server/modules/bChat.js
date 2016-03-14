module.exports = function(renderPipe, broadcaster, lodash, dicer, util, persist) {
	return {
		chat: function(req, res) {
            var MAX_MESSAGES = 3;
            var isHistory = req.query.m === 'h';
            var msgs = [];
            if(isHistory) {
                msgs = broadcaster.history(req.params.room);
                renderPipe.render('chat.html', {mode:'history'},
                    function(rendered) {
                        renderPipe.render('chatHistory.html',
                            {room:req.params.room, msgs:msgs, user:req.params.user},
                            function(rendered2) {
                                res.end(rendered + rendered2);
                            });
                    });
            }
            else {
                msgs = lodash.takeRight(broadcaster.history(req.params.room), MAX_MESSAGES);
                req.offset = msgs.length;
                renderPipe.render('chat.html', {mode:'realtime'},
                    function(rendered) {
                        renderPipe.render('chatMessages.html',
                            {room:req.params.room, msgs:msgs, user:req.params.user, offset: 0},
                            function(rendered2) {
                                res.write(rendered + rendered2);
                            });
                    });
            }

			var subscriber = {
				message: function(msg, fileName, user, timestamp) {
                    var msgs = [];
                    msgs.push({m:msg,u:user,t:timestamp,f:fileName});
                    renderPipe.render('chatMessages.html',
                        {room:req.params.room, msgs:msgs, user:req.params.user, offset: req.offset++},
                        function(rendered) {
                            res.write(rendered);
                        });
				},
				heartbeat: function() {
					res.write(' ');
				}
			};
			broadcaster.subscribe(req.params.room, subscriber);
			req.on("close", function() {
			 // request closed unexpectedly
				broadcaster.unsubscribe(req.params.room, subscriber);
				console.log("close -> unsubscribing");
			});
			req.on("end", function() {
 			 // request ended normally
 				broadcaster.unsubscribe(req.params.room, subscriber);
 				console.log("end -> unsubscribing");
			});
		},
		post: function(req, res) {

            if (req.method === 'POST') {
                var RE_BOUNDARY = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i;
                var m = RE_BOUNDARY.exec(req.headers['content-type']);
                var d = new dicer({boundary: m[1] || m[2]});
                var fileContent = null;
                var fileName = null;
                var msg = null;
                var timestamp = Math.floor(new Date().getTime() / 1000);

                d.on('part', function (p) {
                    console.log('New part!');
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

                        if(type === 'msg') {
                            console.log("message");
                            var rawMsg = util.inspect(data.toString());
                            msg = rawMsg.substring(1, rawMsg.length - 1);
                        }
                        else if(type.slice(0, 4) === 'file') {
                            fileName = type.substring(17);
                            console.log("fileName '" + fileName + "' length " + data.length);
                            persist.addFile(req.params.room, timestamp, data);
                        }
                    });
                });
                d.on('finish', function () {
                    broadcaster.emit(msg, fileName, timestamp, req.params.room, req.params.user);
                    renderPipe.deliver('post.html', {room: req.params.room}, res);
                });
                req.pipe(d);
            }
            else {
                renderPipe.deliver('post.html', {room: req.params.room}, res);
            }
		}
	}
}