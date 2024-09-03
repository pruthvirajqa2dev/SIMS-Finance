/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const { defineConfig } = require("cypress");
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

module.exports = defineConfig({
  projectId: 'asx1dc',
  trashAssetsBeforeRuns: false,
  viewportWidth: 1100,
  viewportHeight: 800,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    "reportDir": "reports/mochawesome",
    "overwrite": false,
    "html": false,
    "json": true
  },
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', {
        readPdf(pdfPath) {
          return new Promise((resolve) => {
            const filePath = path.resolve(pdfPath)
            const dataBuffer = fs.readFileSync(filePath)
            pdf(dataBuffer).then(function (data) {
              resolve(data);
            })
          })
        }
      })
      on('task', {
        getModifiedTime(filePath) {
          return new Promise((resolve) => {
            const stats = fs.statSync(filePath);
            let lastModified = stats.mtime;

            lastModified = lastModified.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

            resolve(lastModified);
          })
        }
      })
      on('task', {
        getCurrentTime() {
          return new Promise((resolve) => {
            resolve(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
          })
        }
      })
      on('task', {
        getDifferenceBetCurrAndModTime(modDate) {
          return new Promise((resolve) => {
            resolve(
              Math.abs(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) - modDate) / 1000
            )
          })
        }
      })
      on('task', {
        fsWriteFile(ext) {
          return new Promise((resolve) => {
            var fs = require("fs");
            fs.writeFile("./Test Files/test" + Date.now() + ext, "SIMS Finance", function (err) {
              if (err) {
                resolve(null)
              }
            })
            resolve("File created")
          })
        }
      })
      on('task', {
        newestFileName(directory) {
          return new Promise((resolve) => {
            const fs = require('fs')
            const glob = require('glob')

            const newestFile = glob.sync(directory)
              .map(name => ({ name, ctime: fs.statSync(name).ctime }))
              .sort((a, b) => b.ctime - a.ctime)[0].name
            console.log(newestFile)
            resolve(newestFile)
          })
        }
      })
      on('task', {
        unzipFile(directory) {
          return new Promise((resolve) => {
            console.log('Into unzip file')
            console.log('directory:' + directory)
            const decompress = require("decompress");
            decompress(directory, "./cypress/downloads/unzip" + Date.now().toString())
              .then((files) => {
                resolve(files)
              })
              .catch((error) => {
                console.log(error);
              });
          })
        }
      })
    },
  },
  video: true,
});
