module.exports = function(persist) {

	return {
		download:function(req, res) {
			var content = persist.getFile(req.params.room, req.params.fileId);
            res.setHeader('Content-disposition', 'attachment; filename=' + req.query.name);
            res.setHeader("Content-Type", "application/octet-stream" );
			res.end(content);
		}
	}
}