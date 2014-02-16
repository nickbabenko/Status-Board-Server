var Sickbeard = require('sickbeard');

module.exports = function() {
	
	this.app.get('/sickbeard', function(req, res) {
	
		var port = req.query.port || 8081;
		
		var sickbeard = new Sickbeard('http://' + req.query.host + ':' + port, req.query.api_key);
		
		sickbeard.api('future', {
			type: 'today'
		},
		function(upcomingEpisodes) {
						
			sickbeard.api('history', {
				limit: 20,
				type: 'downloaded'
			},
			function(pastEpisodes) {
				var response = '<table id="shows">';
				
				if(upcomingEpisodes.data.today.length > 0) {
					response += '<tr><td colspan="2">TONIGHT</td></tr>';
					
					upcomingEpisodes.data.today.forEach(function(upcomingEpisode) {
						response += '<tr>';
						response += '<td class="showName">' + upcomingEpisode.show_name + '</td>';
						response += '<td class="showEpisode">S' + (upcomingEpisode.season < 9 ? '0' : '') + upcomingEpisode.season + 'E' + (upcomingEpisode.episode < 9 ? '0' : '') + upcomingEpisode.episode + '</td>';
						response += '</tr>';
					});
				}
				
				response += '<tr><td colspan="2">DOWNLOAD HISTORY</td></tr>';
				
				pastEpisodes.data.forEach(function(pastEpisode) {
					response += '<tr>';
					response += '<td class="showName">' + pastEpisode.show_name + '</td>';
					response += '<td class="showEpisode">S' + (pastEpisode.season < 9 ? '0' : '') + pastEpisode.season + 'E' + (pastEpisode.episode < 9 ? '0' : '') + pastEpisode.episode + '</td>';
					response += '</tr>';
				});
				
				response += '</table>';
		
				res.send(response);
			});
			
		});
		
	});
	
}