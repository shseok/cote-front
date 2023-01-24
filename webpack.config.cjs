// import path from 'path';
const path = require('path');
const srcDir = path.resolve(__dirname, './src');
const outputDir = path.resolve(__dirname, './dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
	const devMode = argv.mode !== 'production';
	console.log(argv.mode, devMode);

	return {
		entry: {
			index: [srcDir + '/ts/index.ts', srcDir + '/scss/style.scss'],
		},
		devtool: 'inline-source-map',
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.(sa|sc|c)ss$/i,
					// test: /\.css$/i,
					use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
					exclude: /node_modules/,
				},
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
				filename: 'index.html',
			}),
			new CleanWebpackPlugin(),
			new BundleAnalyzerPlugin({
				analyzerMode: "static",
				openAnalyzer: false,
				generateStatsFile: true,
				statsFilename: "bundle-report.json",
			})
		].concat(devMode ? [] : [new MiniCssExtractPlugin({ filename: 'css/style.css' })]),
		optimization: {
			minimizer: [
				new CssMinimizerPlugin(),
			],
		},
		output: {
			filename: 'js/[name]_bundle.js',
			path: outputDir,
			clean: true,
		},
	};
};
