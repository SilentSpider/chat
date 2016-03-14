module.exports = function(renderPipe, crypto, qr, config, fs, useSSL, xml) {
	return {
		frontPage: function(req, res) {
            var random = "";
            var phonetic = ""
            for(var i = 0; i < 4; i++) {
                var idx = Math.floor(Math.random() * config.alphabet.length);
                random += config.alphabet.charAt(idx);
                phonetic += config.phonetic[idx] + "\n";
            }
			renderPipe.deliver('about.html', {random: random, phonetic:phonetic}, res);
		},

		room: function(req, res) {
			console.log("requesting " + req.url);
			if(req.params && req.params.room) {	
				console.log('entering room ' + req.params.room);	
			}
			renderPipe.deliver('room.html', 
					{room:req.params.room, user:req.params.user}, res);
		},
		login: function(req, res) {
			if(req.query.user) {
				 res.redirect('/'+ req.params.room + '/' +
				 	req.query.user);
				 res.end();
			}
			else {
				renderPipe.deliver('login.html', 
					{room:req.params.room}, res);
			}
		},
		advanced: function(req, res) {
			renderPipe.deliver('advanced.html', {room:req.params.room, user:req.params.user}, res);
		},
		advancedJs: function(req, res) {
			res.setHeader('content-type', 'text/javascript');
			renderPipe.deliver('advanced.js', {room:req.params.room, user:req.params.user}, res);
		},
		socketioJs: function(req, res) {
			res.setHeader('content-type', 'text/javascript');
			renderPipe.deliver('socket.io-1.2.0.js', {room:req.params.room, user:req.params.user}, res);
		},
		jqueryJs: function(req, res) {
			res.setHeader('content-type', 'text/javascript');
			renderPipe.deliver('jquery-1.11.3.min.js', {room:req.params.room, user:req.params.user}, res);
		},
		faviconIco: function(req, res) {
			res.setHeader('content-type', 'image/x-icon');
			renderPipe.raw('favicon.ico', res);
		},
        logoSvg: function(req, res) {
            res.setHeader('content-type', 'image/svg+xml');
            renderPipe.raw('logo.svg', res);
        },
		qrSvg: function(req, res) {
			var content = '' + fs.readFileSync(config.torHostFile);
			res.setHeader('content-type', 'image/svg+xml');
			var protocol = "http";
			if(useSSL) {
				protocol = https;
			}
            var room = "";
            if(req.params.room) {
                room = "/" + req.params.room;
            }
			var qrSvg = qr.imageSync(protocol + '://' + content.trim() + room, { type: 'svg' });

			var qrXml = new xml.XML(qrSvg);

			var outline = new xml.XML('<path stroke="#8e0d14" fill="none" d="M1.5 1.5h6v6h-6z M23.5 1.5h6v6h-6z M1.5 23.5h6v6h-6z"/>');
            qrXml.appendChild(outline);

			var centers = new xml.XML('<path stroke="#8e0d14" fill="#8e0d14" d="M3.5 3.5h2v2h-2z M25.5 3.5h2v2h-2z M3.5 25.5h2v2h-2z"/>');
			qrXml.appendChild(centers);

            var middle = new xml.XML('<path stroke="#fff" fill="#fff" d="M12.45 12.45h6.1v6.1h-6.1z"/>');
            qrXml.appendChild(middle);

			var logo = new xml.XML('<g transform="scale(0.05) translate(239 239)">\
					<path fill="#8e0d14" d="M135.808,70.802c0,35.809-29.029,64.838-64.838,64.838c-35.809,0-64.838-29.029-64.838-64.838\
			c0-35.81,29.029-64.838,64.838-64.838C106.778,5.963,135.808,34.992,135.808,70.802"/>\
			<polygon fill="#fff" points="85.218,19.679 106.668,42.481 97.256,52.881 119.693,72.641 78.016,125.188 78.016,119.468 \
			109.294,71.575 89.455,53.688 99.804,42.403 85.218,24.255 "/>\
			<polygon fill="#fff" points="78.535,28.233 90.496,43.392 80.615,53.791 96.735,69.989 78.016,103.166 78.016,97.057 \
			88.416,69.911 74.115,55.091 85.035,43.417 78.535,33.563 "/>\
			<polygon fill="#fff" points="56.722,19.679 35.271,42.481 44.684,52.881 22.246,72.641 63.923,125.188 63.923,119.468 \
			32.646,71.575 52.483,53.688 42.135,42.403 56.722,24.255 "/>\
			<polygon fill="#fff" points="63.403,28.233 51.443,43.392 61.323,53.791 45.204,69.989 63.923,103.166 63.923,97.057 \
			53.523,69.911 67.823,55.091 56.903,43.417 63.403,33.563 "/>\
			</g>');
			qrXml.appendChild(logo);

			res.end(qrXml.toXMLString());
		},
        css: function(req, res) {
			res.setHeader('content-type', 'text/css');
			renderPipe.deliver('style.css', {}, res);
		}
	}
}