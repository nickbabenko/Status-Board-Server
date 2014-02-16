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
				response += '<td style="line-height: 50%;">';
				response += 	'<span style="font-size: 12px;">' + description('a')[1].children[0].data + '&nbsp;&nbsp;&nbsp;&nbsp;' + description('a')[0].children[0].data + '</span>';
				response += 	'<span style="font-size: 15px;">' + description('p ul li')[0].children[0].data.split(' - ')[1] + '</span>';
				response += '</td>';
				response += '</tr>';
			});
			
			response += '</table>';
		
			res.send(response);
		});
	});
	
}