var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var env = process.env.NODE_ENV;

var config = env === 'development' ? require('./webpack.config.dev') : require('./webpack.config');
var contentBase = env === 'development' ? '' : '/dist';
var indexRoot = env === 'development' ? 'index.html' : '/dist/index.html';

var server = new WebpackDevServer(webpack(config), {
  	stats: { colors: true },
	publicPath: config.output.publicPath,
	hot: true,
	historyApiFallback: {
		index: indexRoot
	},
	contentBase: contentBase
});

server.listen(9000, '0.0.0.0', function (err, result) {
	if (err) {
		console.log(err);
	}

	console.log('Listening at localhost:9000 - ' + env);
});
