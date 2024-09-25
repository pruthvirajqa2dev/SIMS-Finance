/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
//require("@shelex/cypress-allure-plugin");
const { defineConfig } = require("cypress");
const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");

module.exports = defineConfig({
  projectId: "8b68kr",
  trashAssetsBeforeRuns: false,
  viewportWidth: 1100,
  viewportHeight: 800,
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    allure: true,
    reportDir: "reports/mochawesome",
    overwrite: false,
    html: false,
    json: true,
  },
  chromeWebSecurity: false,
  numTestsKeptInMemory: 1,
  e2e: {
    experimentalMemoryManagement: true,
    baseUrl: "http://uat-v2.pecuniam-online.co.uk",
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // require("cypress-mochawesome-reporter/plugin")(on);
      on("task", {
        readPdf(pdfPath) {
          return new Promise((resolve) => {
            const filePath = path.resolve(pdfPath);
            const dataBuffer = fs.readFileSync(filePath);
            pdf(dataBuffer).then(function (data) {
              resolve(data);
            });
          });
        },
      });
      on("task", {
        getModifiedTime(filePath) {
          return new Promise((resolve) => {
            const stats = fs.statSync(filePath);
            let lastModified = stats.mtime;

            lastModified = lastModified.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
            });

            resolve(lastModified);
          });
        },
      });
      on("task", {
        getCurrentTime() {
          return new Promise((resolve) => {
            resolve(
              new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
            );
          });
        },
      });
      on("task", {
        getDifferenceBetCurrAndModTime(modDate) {
          return new Promise((resolve) => {
            resolve(
              Math.abs(
                new Date().toLocaleString("en-US", {
                  timeZone: "Asia/Kolkata",
                }) - modDate
              ) / 1000
            );
          });
        },
      });
      on("task", {
        fsWriteFile(ext) {
          return new Promise((resolve) => {
            var fs = require("fs");
            fs.writeFile(
              "./Test Files/test" + Date.now() + ext,
              "SIMS Finance",
              function (err) {
                if (err) {
                  resolve(null);
                }
              }
            );
            resolve("File created");
          });
        },
      });
      on("task", {
        fsWriteFileWithContent(ext, content) {
          return new Promise((resolve) => {
            var fs = require("fs");
            const filepath = "./Test Data/test" + Date.now() + ext;
            console.log("Creating file " + filepath);
            console.log("Content:" + content);
            fs.writeFile(filepath, content, function (err) {
              if (err) {
                console.log("Error" + err);
                resolve(null);
              }
            });
            resolve("File created");
          });
        },
      });
      on("task", {
        newestFileName(directory) {
          return new Promise((resolve) => {
            const fs = require("fs");
            const glob = require("glob");

            const newestFile = glob
              .sync(directory)
              .map((name) => ({ name, ctime: fs.statSync(name).ctime }))
              .sort((a, b) => b.ctime - a.ctime)[0].name;
            console.log(newestFile);
            resolve(newestFile);
          });
        },
      });
      on("task", {
        unzipFile(directory) {
          return new Promise((resolve) => {
            console.log("Into unzip file");
            console.log("directory:" + directory);
            const decompress = require("decompress");
            decompress(
              directory,
              "./cypress/downloads/unzip" + Date.now().toString()
            )
              .then((files) => {
                resolve(files);
              })
              .catch((error) => {
                console.log(error);
              });
          });
        },
      });
      // on("file:preprocessor", webpackPreprocessor);
      on("task", {
        "allure:logBatch": (logs) => {
          logs.forEach((log) => {
            // Specify the location where Allure stores its results
            const resultsDir = "allure-results";

            // Create a custom file for logs
            const logFile = path.join(
              resultsDir,
              "cypress-logs-" +
                new Date().getDate() +
                new Date().getHours() +
                ".txt"
            );

            // Ensure the directory exists
            if (!fs.existsSync(resultsDir)) {
              fs.mkdirSync(resultsDir);
            }

            // Append the log message to the log file
            const logMessage = `${log.displayName}: ${log.message}\n`;
            fs.appendFileSync(logFile, logMessage);
          });
          return null;
        },
      });
      allureWriter(on, config);
      return config;
    },
    env: {
      allureReuseAfterSpec: true,
    },
  },
  video: false,
});
