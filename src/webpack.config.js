const webpack = require('webpack');

var config = {
    entry: {
        app: __dirname + '/app/index.js',
        vendor: ['angular', '@uirouter/angularjs', 'oclazyload/dist/ocLazyLoad' ]
    },

    output: {
        path: __dirname + '/app',
        filename: 'js/bundle.js'
    },

    plugins: [ new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "js/vendor.bundle.js" }) ],

    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.html$/, loader: 'raw-loader', exclude: /node_modules/ },
            { test: /\.css$/,
                use: [
                    { loader: 'style-loader' }, 
                    { loader: 'css-loader', options: { minimize: true } }
                ]
            },
        ]
    }

};

if(process.env.NODE_ENV === 'production'){
    config.output.path = __dirname + '/dist';
}

module.exports = config;