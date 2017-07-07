import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as webpack from "webpack";
import * as ManifestPlugin from "webpack-manifest-plugin";

const commonCSS = new ExtractTextPlugin("[chunkhash].min.css");
const vendorCSS = new ExtractTextPlugin("[name].min.css");

const config: webpack.Configuration = {
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          silent: true,
          compilerOptions: {
            module: "ESNext"
          }
        },
        test: /.tsx?$/
      },
      {
        exclude: /node_modules/,
        test: /.css$/,
        use: commonCSS.extract({
          fallback: "style-loader",
          use: {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              localIdentName: "[hash:base64:10]",
              module: true
            }
          }
        })
      },
      {
        include: /node_modules/,
        test: /.css$/,
        use: vendorCSS.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  output: {
    filename: "[chunkhash].min.js"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      filename: "common.min.js",
      minChunks(module) {
        return module.context && module.context.indexOf("node_modules") !== -1;
      },
      name: "common"
    }),
    vendorCSS,
    commonCSS,
    new ManifestPlugin()
  ]
};

export default config;