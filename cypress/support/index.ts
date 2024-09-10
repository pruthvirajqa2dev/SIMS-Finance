/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
import "cypress-real-events";
declare namespace Cypress {
    interface Chainable<> {
        login(username: string, password: string, screenshotFolder: string);
        decrypt(encryptedText: string);
        selectUsingSearchIcon(acronym: string, valueToSelect: string);
        selectCostCentre(costCentre: string);
        getModifiedTime(filePath: string);
        fsWriteFile(ext: string);
        fsWriteFileWithContent(ext: string, content: string);
        newestFileName(directory: string);
        jobProcessingDialog();
        selectFirstLedgerCodeAndFundCode();
    }
}
