import "cypress-real-events";
declare namespace Cypress {
    interface Chainable<> {
        login(username: string, password: string, screenshotFolder: string);
        decrypt(encryptedText: string);
        selectUsingSearchIcon(acronym: string, valueToSelect: string);
        selectCostCentre(costCentre: string);
        getModifiedTime(filePath: string);
        fsWriteFile(ext: String);
        newestFileName(directory: string);
        jobProcessingDialog();
        selectFirstLedgerCodeAndFundCode();
    }
}
