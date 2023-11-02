const path = require("path");

module.exports = {
  target: "node", // Set the build target to Node.js
  entry: "./server.js", // The entry point of your server code
  output: {
    filename: "server.bundle.cjs", // The output filename
    path: path.resolve(__dirname, "dist"), // The output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
