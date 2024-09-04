/* eslint-disable no-undef */
describe.skip("SIMS Finance Trial", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Check if Up", () => {
        //cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin',{failOnStatusCode: false})

        const errorMsg =
            "502 - Web server received an invalid response while acting as a gateway or proxy server.";
        cy.get("h2", { timeout: 0 }).first().should("not.have.text", errorMsg);
    });
    //Handling uncaught exceptions to avoid false errors
    Cypress.on("uncaught:exception", (err) => {
        // returning false here prevents Cypress from
        // failing the test
        console.log(err);
        return false;
    });
    it.only("Read PDF", () => {
        const screenshotFolder = "Read PDF";
        const username = "FINCLERK01D130";
        const password = "SIMSFinance2018#";
        const screen = "RSS310Q";

        cy.login(username, password, screenshotFolder);

        //Click Hamburger
        cy.log("Click on Hamburger");
        cy.get("#banner_navigation_navigate").should("be.visible").click();

        //Click on the text box in Quick launch
        cy.log("Type screen in the text box");
        cy.get(".quick-lunch")
            .eq(1)
            .find("#esr_launch_text")
            .clear()
            .type(`${screen}`);

        //Click on the menu item displayed
        cy.log("Click on the menu item displayed");
        cy.get(".ui-menu-item").contains(screen).click();
        //************RSS310Q screen**************
        cy.log("************RSS310Q screen**************");
        cy.log("Click on search button");

        cy.get("body").then(($body) => {
            if ($body.find("h1[id*=defaultCompanyEntry]").length) {
                cy.get('button[data-alias="SAVE"]')
                    .click()
                    .then(() => {
                        return "h1[id*=defaultCompanyEntry]";
                    });
            }
        });
        cy.get("#search_button").click();

        cy.get("#print").should("be.disabled");

        cy.get("[axes='USER_AREA']")
            .contains("Rejected")
            .parent()
            .parent()
            .find("input.check_box")
            .check();

        cy.get("#print").should("be.enabled").click();

        cy.wait(3000);
        const filePath = "./cypress/downloads/output.pdf";

        cy.task("readPdf", filePath).then(function (data) {
            cy.log("Text: " + data.text);
            cy.log("Info: " + data.info);
        });

        cy.task("getModifiedTime", filePath).then((date) => {
            let modDate = date;
            cy.wrap(modDate).as("modDate");
            cy.task("getDifferenceBetCurrAndModTime", date).then((data) => {
                cy.log("Diff: " + data);
                cy.wrap(data).as("diff");
            });
        });

        cy.task("getCurrentTime").then((date) => {
            let currDate = date;
            cy.wrap(currDate).as("currDate");
        });
    });
});
