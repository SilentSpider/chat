module.exports = function(handlebars, fs, format) {
	var templatesDir = __dirname + '/../templates/';
	var templatesCache = {};

    handlebars.registerHelper('ifEquals', function(v1, v2, options) {
        if(v1.toUpperCase() === v2.toUpperCase()) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    handlebars.registerHelper('ifExists', function(v1, options) {
        if(v1) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    handlebars.registerHelper('addSubtract', function(v1, v2, v3) {
        return v1 + v2 - v3;
    });

    handlebars.registerHelper('formatTime', function(timestamp) {
        return format.time(timestamp);
    });

	var render = function(template, data) {

		console.log("Rendering json: " + JSON.stringify(data));

		var cachedCompiled = templatesCache[template];
		if(!cachedCompiled) {
			var content = '' + fs.readFileSync(templatesDir + template);
			cachedCompiled = handlebars.compile(content);
			templatesCache[template] = cachedCompiled;
		}
		return cachedCompiled(data);
	}

	return {
		deliver:function(template, data, res) {
			var html = render(template, data);
			res.end(html);
		},
		render:function(template, data, callback) {
			var html = render(template, data);
			callback(html);
		},
		raw:function(template, res) {
			var content = fs.readFileSync(templatesDir + template);
			res.end(content);
		}
	}
}