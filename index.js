/**
 *
 * Express 4.0 Error Handling
 *
 * To use:
 *
 * var app          = require('express')(),
 *     statusError  = require('express-status-error');
 *
 * app.use(statusError({debug:true}));
 *
 *         - then -
 *
 * if(err) res.sendError(err, 500);
 *
 *          - or -
 *
 * if(condition) res.sendError(new Error('Not Allowed'), 401);
 *
 */

var codes = {
	400: {
		name: 'Bad Request',
		message: 'The request could not be understood by the server due to malformed syntax.'
	},
	401: {
		name: 'Unauthorized',
		message: 'The request requires user authentication.'
	},
	403: {
		name: 'Forbidden',
		message: 'The server understood the request, but is refusing to fulfill it.'
	},
	404: {
		name: 'Not Found',
		message: 'The server has not found anything matching the Request-URI.'
	},
	405: {
		name: 'Method Not Allowed',
		message: 'The method specified in the Request-Line is not allowed for the resource.'
	},
	409: {
		name: 'Conflict',
		message: 'The request could not be completed due to a conflict with the current state of the resource.'
	},
	500: {
		name: 'Internal Server Error',
		message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.'
	}
};

function JSONifyStack(stack){
	if(typeof stack != 'string') return {};
	var json = {};
	stack.split('\n').forEach(function(call, i){
		if(i == 0) call = call.replace('Error: ', '');
		json[i] = call;
	});
	return json;
}


module.exports = function statusError(params) {

	var options = params || { log: true, debug: app.get('env') == 'development' };

	// Add method to error to jsonify it for error handling
	Error.prototype.toJSON = function (code) {

		var json = {};

		Object.getOwnPropertyNames(this).forEach(function (key) {
			if (key == 'arguments') return false;
			if ((process.env !== 'development' || !options.debug) && (key == 'stack' || key == 'fileName' || key == 'lineNumber')) return false;
			json[key] = this[key];
		}, this);

		json.status = json.status || code || 500;
		json.name = json.name || codes[json.status || 500].name;
		json.message = json.message || codes[json.status || 500].message;

		return json;

	};

	// Expose SendError in Response object
	return function statusError(req, res, next) {
		res.sendError = function (err /* Error */, code) {
			var json = err instanceof Error ? err.toJSON(code) : {
				status: code || 500,
				name: codes[code || 500].name,
				message: err
			};
			if (options.debug && json.status == 500) json.error = JSONifyStack(err.stack);
			if (options.log) {
				if(json.status == 500){
					console.error(json.status + ' ' + json.message + '\n' + err.stack);
				} else {
					console.log(json.status + ' ' + json.message);
				}
			}
			res.setHeader('Content-Type', 'application/json');
			res.status(code || json.status).json(json);
		};
		next();
	}

};