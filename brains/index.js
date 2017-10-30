//
// Entry root to core code for Bot Brains setup
//
// module.exports = require('./greetings');
// module.exports = require('./alarm');
// module.exports = require('./dinner');

module.exports = function(connector){
	// var botBrain = require('./greetings');
	// var botBrain = require('./dinner');
	// var botBrain = require('./alarm');
	var botBrain = require('./kanapka');
	return botBrain(connector);
}