module.exports = function(express, system, render, aChat, bChat, compress, fileHandler) {
	return {
		setup: function() {
			express.use(compress());
			express.get('/', render.frontPage);
			express.get('/logo.svg', render.logoSvg);
			express.get('/qr.svg', render.qrSvg);
			express.get('/favicon.ico', render.faviconIco);
			express.get('/socket.io.js', render.socketioJs);
			express.get('/jquery.js', render.jqueryJs);
			express.get('/restart', system.restart);
			express.get('/style.css', render.css);
			express.get('/hostname', render.hostname);
			express.get('/:room/qr.svg', render.qrSvg);
			express.get('/:room/:user/advanced.js', render.advancedJs);
			express.get('/:room/:user/advanced', render.advanced);
			express.get('/:room/:user/advancedChat', aChat.chat);
			express.post('/:room/:user/advancedPost', aChat.post);
			express.get('/:room/:user/chat', bChat.chat);
			express.all('/:room/:user/post', bChat.post);
			express.get('/:room/:user/file/:fileId', fileHandler.download);
			express.get('/:room/:user', render.room);
			express.all('/:room', render.login);
		}
	}
}