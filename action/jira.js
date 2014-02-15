var JiraApi = require('jira').JiraApi;
	
module.exports = function() {
	
	this.app.get('/jira', function(req, res) {
		var jira = new JiraApi('https', req.query.host, 443, req.query.user, req.query.password, '2', true, false);	
		
		jira.listProjects(function(error, projects) {		
			if(error || typeof projects != 'object')
				return;
		
			var response 		= '<table id="projects">',
				subQueryDone	= 0;
			
			projects.forEach(function(project) {
				jira.searchJira('project = ' + project.key + ' AND status in (Open, "In Progress", Reopened, "To Do")', {}, function(error, openTickets) {				
					if(error || typeof openTickets != 'object')
						openTickets = { issues: [] };
										
					response += '<tr>';
					response += '<td class="projectIcon"><img src="' + project.avatarUrls['16x16'] + '" /></td>';
					response += '<td class="projectName">' + project.name + '</td>';
					response += '<td class="projectIssues">' + openTickets.issues.length + '</td>';
					response += '</tr>';
					
					subQueryDone++;
					
					if(subQueryDone == projects.length - 1) {
						response += '</table>';
		
						res.send(response);
					}
				});	
			});
		});
	});
	
};