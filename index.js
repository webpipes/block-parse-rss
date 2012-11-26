var fs = require('fs'),
	_ = require('underscore'),
	feedparser = require('feedparser'),
	express = require('express'),
	app = express();

app.use(express.bodyParser());

// Simple logger
app.use(function (request, response, next) {
	console.log('%s %s', request.method, request.url);
	next();
});

// Handle uncaughtException
process.on('uncaughtException', function (error) {
	exit('Error: ' + error.message);
});

var exit = function (message) {
	if (message) {
		console.log(message);
	}
	console.log('Exiting...');
	process.exit(1);
};

app.options('/', function (request, response) {

	// CORS support
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Methods', 'OPTIONS,POST');
	response.set('Access-Control-Allow-Headers', 'Content-Type');

	// The block definition
	response.send({
		name: "Parse RSS",
		description: "Parse an RSS feed into a series of records.",
		inputs: [{
			name: "url",
			type: "string",
			description: "The URL for the RSS feed."
		}],
		outputs: [{
			name: "entries",
			type: "array",
			description: "All entries from the RSS feed."
		}]
	});
});

app.post('/', function (request, response) {

	if (!_.has(request.body, 'inputs') && _.isObject(request.body.inputs)) {
		exit('WebPipe "input" is missing or formatted incorrectly.');
	}

	var inputs = request.body.inputs[0];
	var outputs = {
		outputs: []
	};
	
	// Verify input key exist
	if (!_.has(inputs, 'url')) {
		exit('Required "url" is missing.');
	}

	feedparser.parseFile(inputs.url, function callback(error, meta, articles) {
		if (error) {
			console.error(error);
			response.send(500);
		} else {
			articles.forEach(function (article) {
				outputs.outputs.push({
					date: article.date,
					title: article.title,
					link: article.link
				});
			});

			response.json(outputs);
		}
	});
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Listening on ' + port);
});