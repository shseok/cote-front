// import path from 'path';
const path = require('path');
const srcDir = path.resolve(__dirname, './src');
const outputDir = path.resolve(__dirname, 'dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) => {
	const devMode = argv.mode !== 'production';
	console.log(argv.mode, devMode);

	return [
		{
			entry: srcDir + '/ts/index.ts',
			devtool: 'inline-source-map',
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						use: 'ts-loader',
						exclude: /node_modules/,
					},
					// {
					// 	// test: /\.(sa|sc|c)ss$/i,
					// 	test: /\.css$/i,
					// 	// include: path.join(__dirname, 'src/css'),
					// 	use: [
					// 		devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					// 		'css-loader',
					// 		// "sass-loader",
					// 	],
					// },
				],
			},
			resolve: {
				extensions: ['.tsx', '.ts', '.js'],
			},
			devServer: {
				port: 9000,
			},
			plugins: [
				new HtmlWebpackPlugin({
					title: 'our coding test history',
					template: './src/index.html',
					inject: 'body',
				}),
				// new MiniCssExtractPlugin({ filename: 'app.css' }),
			],
			output: {
				filename: 'index_bundle.js',
				path: outputDir,
				clean: true,
			},
		},
		{
			// entry: path.resolve(__dirname, './src/scss/app.scss'),
			entry: srcDir + '/css/style.css',
			output: {
				path: outputDir,
			},
			optimization: {
				minimizer: [
					new CssMinimizerPlugin({}),
				],
			},
			plugins: [
				new MiniCssExtractPlugin({
					filename: 'style.css',
				}),
			],
			devServer: {
				port: 9000,
			},
			module: {
				rules: [
					{
						test: /\.s?css$/,
						use: [
							MiniCssExtractPlugin.loader,
							'css-loader',
							// 'sass-loader',
						],
					},
				],
			},
		},
	];
};
