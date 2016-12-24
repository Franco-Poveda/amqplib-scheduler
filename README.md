amqplib-scheduler
==================
Easy messages scheduling with amqplib.

This library is based on [purposeindustries/node-amqp-schedule](https://github.com/purposeindustries/node-amqp-schedule) ported to use with the  amqplib AMQP client library.

Install
-------

```
npm install amqplib-scheduler
```

Use with [squaremo/amqp.node](https://github.com/squaremo/amqp.node).

Usage
-----

```js
var amqp	  = require('amqplib/callback_api');
var scheduler = require('amqplib-scheduler');

//A stablished amqp connection in needed
amqp.connect(function (err, conn) {
  if (err !== null) return bail(err);

//Scheduler initialization
  var schedule = scheduler(conn, {prefix: 'qPrefix', separator: '.'});

  var date = new Date(Date.now() + 20000);
  schedule('dlExchange', 'dlxRoute', { foobar: '30s ' + new Date()}, 30000, cb);
  schedule('dlExchange', 'dlxRoute', { foobar: '@ ' + date }, date, cb);
}
```

Options
-------

the scheduler initialization accepts a second optional parameter (`options`) :
```json
{
	prefix: 	[temp queue name prefix, defaults to 'schedule'],
  	separator: 	[temp queue name separator, defaults to '.'],
    threshold: 	[temp queue expires after delay + threshold, defaults to 10000]
}
```