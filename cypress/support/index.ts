import "cypress-real-events";
declare namespace Cypress{
    interface Chainable<>{

        login(username:string,password:string);
        decrypt(encryptedText:string);
        selectUsingSearchIcon(acronym:string,valueToSelect:string);
        selectCostCentre(costCentre:string);
        getModifiedTime(filePath:string);
    }
}