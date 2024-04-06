import { fileURLToPath } from 'url';
import path from 'path';
import nodeExternals from 'webpack-node-externals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default {
  target: "node",
  externals: [nodeExternals()],
  entry: {
    index: "./src/main.jsx",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
