module.exports = function scheduler(conn, opt) {
  opt = opt || {};
  opt.separator = opt.separator || '.';
  opt.prefix = opt.prefix || 'schedule';
  opt.threshold = opt.threshold || 10000;
  opt.round = opt.round || 1000;

  return function scheduler(exchange, route, message, delay, cb) {

    if (delay instanceof Date) {
      delay = delay.getTime() - Date.now();
    }

    delay = Math.round(delay / opt.round) * opt.round;
    var ttl = delay;
    var time = { ms: 1000, s: 60, m: 60, h: 24, d: 30, mo: 12, y: 999999 };
    delay = Object.keys(time).map(function (unit, i, keys) {
      var mod = delay % time[unit];
      delay = Math.floor(delay / time[unit]);
      if (!mod) {
        return '';
      }
      return mod + unit;
    }).reverse().join('');
    var qname = opt.prefix + opt.separator + [exchange, route, delay].join(opt.separator);

    conn.createConfirmChannel(function (err, ch) {
      if (err !== null) cb(err, conf.conn);
      ch.assertQueue(qname, {
        durable: true,
        autoDelete: true,
        arguments: {
          'x-dead-letter-exchange': exchange,
          'x-dead-letter-routing-key': route,
          'x-message-ttl': ttl,
          'x-expires': ttl + opt.threshold
        }
      }, function (err, ok) {
        if (err !== null) cb(err, ch);
        ch.sendToQueue(qname, new Buffer(JSON.stringify(message)));
        ch.waitForConfirms(function (err) {
          cb(null, true);
        });
      });
    });
  }
}
