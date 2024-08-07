const { defineConfig } = require("cypress");
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
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
            resolve(new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"}))
          })
        }
      })
      on('task', {
        getDifferenceBetCurrAndModTime(modDate) {
          return new Promise((resolve) => {
            resolve(
              Math.abs(new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"}) - modDate)/1000
            )
          })
        }
      })
    },
  },
  video: true,
  videoCompression: true,
});
