const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Webpack entry points. Mapping from resulting bundle name to the source file entry.
const entries = fs
  .readdirSync(path.join(__dirname, "src/Components"))
  .filter((dir) => fs.statSync(path.join("src/Components", dir)).isDirectory())
  .reduce((acc, dir) => ({ ...acc, [dir]: `./src/Components/${dir}/${dir}` }), {});

// Loop through subfolders in the "Components" folder and add an entry for each one
const componentsDir = path.join(__dirname, "src/Components");
fs.readdirSync(componentsDir).filter(dir => {
    if (fs.statSync(path.join(componentsDir, dir)).isDirectory()) {
        entries[dir] = "./" + path.relative(process.cwd(), path.join(componentsDir, dir, dir));
    }
});

module.exports = {
    entry: entries,
    devtool: "inline-source-map",
    output: {
        filename: "[name]/[name].js",
        publicPath: "/dist/",
    },
    devServer: {
        https: true,
        port: 3000,
      },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "azure-devops-extension-sdk": path.resolve("node_modules/azure-devops-extension-sdk")
        },
    },
    stats: {
        warnings: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "azure-devops-ui/buildScripts/css-variables-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.html$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
           patterns: [ 
               { from: "**/*.html", context: "src/Components" }
           ]
        })
    ]
};
