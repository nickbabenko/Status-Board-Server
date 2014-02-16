var express = require('express');

(function() {
	
	this.app = express();
	
	require('./action/jira').call(this);
	require('./action/sickbeard').call(this);
	require('./action/bitbucket').call(this);
	
	this.app.listen(3030);
	
})();