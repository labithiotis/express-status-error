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

var codes = require('status-codes');

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
