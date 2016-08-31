const pty = require('pty.js');

module.exports = (io) => {
  io.on('connection', (socket) => {
    var sshuser = '';
    //var request = socket.request;
    console.log(`${ new Date() } Connection accepted.`);

    /*if (match = socket.request.headers.referer.match('/wetty/ssh/.+$')) {
      sshuser = match[0].replace('/wetty/ssh/', '') + '@';
    } else if (globalsshuser) {
      sshuser = globalsshuser + '@';
    }*/

    const term = pty.spawn('/bin/login', [], {
      name: 'xterm-256color',
      cols: 80,
      rows: 30
    });

    console.log(`${ new Date() } PID=${ term.pid } STARTED on behalf of user=${ sshuser }`);

    term.on('data', (data) => {
      socket.emit('output', data);
    });

    term.on('exit', (code) => {
      console.log(`${ new Date() }  PID=${ term.pid } ENDED`);
    });

    socket.on('resize', (data) => {
      term.resize(data.col, data.row);
    });

    socket.on('input', (data) => {
      term.write(data);
    });

    socket.on('disconnect', () => {
      term.end();
    });
  });
};
