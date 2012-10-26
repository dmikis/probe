var path = require('path');

var server = require('express')();

var serverRootDir = process.cwd();

server.get('/', function (req, res) {
    res.sendfile(path.join(serverRootDir, '/index.html'));
});

server.get(/\.js$/, function (req, res) {
    var script = req.path;
    var b = require('browserify')({
        exports: ['require'],
        debug: true
    });

    b.prepend('(function (window, undefined) {\n');
    b.require(path.join(serverRootDir, 'src', script));
    b.append('\nrequire("/' + path.basename(script) + '");\n}(window));');

    res.header('Content-Type', 'text/javascript;charset=utf-8');
    res.send(b.bundle());
});

server.listen(8080);
