# express-status-error

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

Send JS Errors as pretty json to user

## Installation

```bash
$ npm install express-status-error --save
```
## Using

```javascript

var app          = require('express')(),
    statusError  = require('express-status-error');

app.use(statusError({debug:true}));

        - then -

if(err) res.sendError(err, 500);

         - or -

if(condition) res.sendError(new Error('Not Allowed'), 401);

```

[npm-image]: https://img.shields.io/npm/v/express-status-error.svg?style=flat
[npm-url]: https://npmjs.org/package/express-status-error
[downloads-image]: https://img.shields.io/npm/dm/express-status-error.svg?style=flat
[downloads-url]: https://npmjs.org/package/express-status-error
[travis-image]: https://img.shields.io/travis/strongloop/express-status-error.svg?style=flat
[travis-url]: https://travis-ci.org/strongloop/express-status-error
[coveralls-image]: https://img.shields.io/coveralls/strongloop/express-status-error.svg?style=flat
[coveralls-url]: https://coveralls.io/r/strongloop/express-status-error?branch=master
