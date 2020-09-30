const path = require('path')

module.exports = {
    module: {
        rules: [
            {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-syntax-optional-chaining', '@babel/plugin-transform-modules-commonjs']
                }
            }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: '[name].js',
        library: 'Validator',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
}