const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/biangvalidator.js',
    output: {
        library: 'BiangValidator',
        libraryTarget: 'umd',
        libraryExport: 'default',
        globalObject: `(typeof self === 'undefined'? this: self)`,
        filename: 'biangvalidator.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // 使用babel-loader处理es代码
                    options: {
                      presets: [['@babel/preset-env', {
                          modules: 'cjs'
                      }]],
                    }
                }
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin()
    ]
};