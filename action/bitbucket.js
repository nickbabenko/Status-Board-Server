var bitbucket = require('bitbucket-api');

module.exports = function() {
	
	this.app.get('/bitbucket', function(req, res) {
		var client = bitbucket.createClient({ username: req.query.username, password: req.query.password });
		
		client.user().repositories().getAll(function(err, repositories) {
			
		});
	});
	
}