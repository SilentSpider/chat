module.exports = function(http, config, https) {
  return {
	  restart: function() {
	    setTimeout(function() {
	  		throw "Restarting";
	  	}, 10);
	  },
	       
	  start: function() {
		  http.listen(config.port, function(){
 		  console.log('Listening on *:' + config.port);
		});
	  }
  }
}