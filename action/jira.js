var JiraApi = require('jira').JiraApi;
	
module.exports = function() {
	
	this.app.get('/jira', function(req, res) {	
		var jira = new JiraApi('https', req.query.host, 443, req.query.user, req.query.password, '2', true, false);	
		
		jira.listProjects(function(error, projects) {		
			if(error || typeof projects != 'object')
				return;
				
			var response = {
				graph: {
					title: 'Issue Overview',
					type: 'bar',
					datasequences: []
				}	
			};
			var subQueryDone = 0;
			
			projects.forEach(function(project) {
				jira.searchJira('project = ' + project.key + ' AND status in (Open, "In Progress", Reopened, "To Do", Closed, Resolved, Fixed)', {}, function(error, issues) {								
					if(error || typeof issues != 'object') {
						subQueryDone++;
						
						if(subQueryDone == projects.length - 1)
							res.json([]);
						
						return;
					}
											
					var openTickets = 0,
						closedTickets = 0;
												
					issues.issues.forEach(function(issue) {
						if(issue.fields.status.name == 'Resolved' || 
						   issue.fields.status.name == 'Closed' ||
						   issue.fields.status.name == 'Fixed')
							closedTickets++;
						else
							openTickets++;
					});
						
					response.graph.datasequences.push({
						title: project.name,
						datapoints: [
							{ title: "Complete", value: openTickets },
							{ title: "Incomplete", value: closedTickets }
						]
					});
					
					subQueryDone++;
					
					if(subQueryDone == projects.length - 1)
						res.json(response);
				});	
			});
		});
	});
	
};