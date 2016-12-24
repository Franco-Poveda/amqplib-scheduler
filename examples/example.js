var amqp = require('amqplib/callback_api');
var scheduler = require('../lib/scheduler');

//var dlx = 'yourDlx',
 //   key = 'yourDlxRoutingKey';

var dlx = 'payments',
    key = '1';

//Error handling callback function.
function bail(err, ok) {
  if (err !== null) {
    console.error(err);
    process.exit(1);
  }
  else if (ok === true) console.log("Scheduled message sent.");
}

//A stablished amqp connection is needed.
function on_connect(err, conn) {
  if (err !== null) return bail(err);

  //Scheduler initilization with custom options.
  var schedule = scheduler(conn, {prefix: 'prefix', separator: '-'});
  var date = new Date(Date.now() + 20000);

  schedule(dlx, key, { foobar: '30s ' + new Date() }, 30000, bail);
  schedule(dlx, key, { foobar: '@ ' + date }, date, bail);
}

amqp.connect(on_connect);
