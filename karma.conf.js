const webpackConfig = require("./webpack.config.js");

const CI =  !!process.env.CI;

delete webpackConfig.entry;
delete webpackConfig.output;
delete webpackConfig.externals;
webpackConfig.mode = process.env.BUNDLE === "production" ? "production" : "development";
// webpackConfig.module.rules.push({
//     test: /\.(png|jpg)$/,
//     use: "arraybuffer-loader"
// });
// // BEGIN typescript support
// webpackConfig.module.rules.unshift({
//     test: /\.js$/,
//     use: [{
//         loader: "babel-loader",
//         options: {
//             "presets": [
//                 ["@babel/preset-env", {
//                     "useBuiltIns": false,
//                     "targets": {
//                         "firefox": "70"
//                     }
//                 }]
//             ],
//             "plugins": [
//                 "@babel/plugin-proposal-class-properties",
//                 "@babel/plugin-proposal-object-rest-spread"
//             ]
//         }
//     }]
// });
// const tsRule = webpackConfig.module.rules.find(rule => rule.test && /\.ts/.test(rule.test.toString()));
// tsRule.use.options.configFile = tsRule.use.options.configFile.replace("tsconfig.web.json", "tsconfig.web.test.json");
// // END typescript support

module.exports = config => config.set({

    basePath: __dirname,

    browsers: ["FirefoxHeadless"],

    captureTimeout: 30000,

    colors: true,

    coverageReporter: {
        dir: "coverage/",
        reporters: [
            { type: "html" },
            { type: "text" },
            { type: "text-summary" }
        ]
    },

    exclude: [],

    files: [
        // { pattern: "src/index.js" },
        // { pattern: "test/web/index.js" },
        { pattern: "test/specs/**/*.spec.js" }
    ],

    frameworks: ["mocha", "chai", "sinon", "webpack"],

    plugins: [
        require("karma-webpack"),
        // require("istanbul-instrumenter-loader"),
        // require("karma-chrome-launcher"),
        require("karma-firefox-launcher"),
        require("karma-mocha"),
        require("karma-chai"),
        require("karma-sinon"),
        // require("karma-coverage"),
        require("karma-spec-reporter")
    ],

    preprocessors: {
        "*.js": ["webpack"],
        "*.jsx": ["webpack"],
        "test/specs/**/*.spec.js": ["webpack"]
    },

    reporters: ["spec", "progress"],

    singleRun: true,

    webpack: webpackConfig

});
