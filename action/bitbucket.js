var parser = require('parse-rss'),
	cheerio = require('cheerio'),
	entities = require('entities');

module.exports = function() {
	
	this.app.get('/bitbucket', function(req, res) {
		parser('https://bitbucket.org/' + req.query.username + '/rss/feed?token=' + req.query.token, function(err, rss) {
			if(err)
				return;
				
			var response = '<table id="commits">';
				
			rss.forEach(function(item) {
				var description = cheerio.load(entities.decode(item.description));
				
				if(typeof description('p ul li')[0] == 'undefined')
					return;
							
				response += '<tr>';
				response += '<td class="repo">' + description('a')[1].children[0].data + '</td>';
				response += '<td class="user">' + description('a')[0].children[0].data + '</td>';
				response += '<td class="commit">' + description('p ul li')[0].children[0].data.split(' - ')[1] + '</td>';
				response += '</tr>';
			});
			
			response += '</table>';
		
			res.send(response);
		});
	});
	
}