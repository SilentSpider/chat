module.exports = function(fs, config) {
	var basePath = config.externalStoragePath + '/rooms/';
	var CHAT_FILE = '/chat.json';
	
	var ensureRoomExists = function(room) {
		try {
			return fs.statSync(basePath + room);
		}
		catch(e) {
			try {
				fs.mkdirSync(basePath);
			}
			catch(e) {
				// Ignore since directory may exist
			}
			fs.mkdirSync(basePath + room);
		}
	};
	return {
		addMsg: function(msg, fileName, room, user, timestamp) {
			ensureRoomExists(room);

			var toPersist = '{';
			if(msg) {
				toPersist += '"m":"' + msg + '",';
			}
			if(fileName) {
				toPersist += '"f":"' + fileName + '",';
			}
			toPersist += '"u":"' + user + '","t":"' + timestamp + '"},';
			fs.appendFileSync(basePath + room + CHAT_FILE, toPersist,'utf8');
		},
		getMsgs: function(room) {
			try {
				var content = '' + fs.readFileSync(basePath + room + CHAT_FILE);
				var json = '[' + 
							content.substring(0, content.length - 1) +
							']';
				console.log("parsing")
				var msgs = JSON.parse(json);
				console.log("parsed");
				return msgs;
			}
			catch(e) {
				console.log("Error " + e);
				return [];
			}
		},
		addFile: function(room, fileName, fileContent) {
			ensureRoomExists(room);
			fs.appendFileSync(basePath + room + '/' + fileName, fileContent);
		},
		getFile: function(room, fileName) {
			return fs.readFileSync(basePath + room + '/' + fileName);
		}
	}
}