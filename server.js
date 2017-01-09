var path = require('path');
var express = require('express');
var webpack = require('webpack');

var host = '0.0.0.0';
var port = 3333;

var webpackConfig = require('../webpack/makeup');
var compiler = webpack(webpackConfig);
var app = express();

var wdmInstance = require('webpack-dev-middleware')(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
});

app.use(wdmInstance);

// on build success notification https://github.com/webpack/webpack-dev-middleware
wdmInstance.waitUntilValid(function(){
  const cp = require('child_process');

  // Mac OS X
  cp.exec('osascript -e \'display notification "Ready" with title "MAKEUP"\'');
});

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('src/fixtures'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, host, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + host + ':' + port);
});
