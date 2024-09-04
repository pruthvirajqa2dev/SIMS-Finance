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

    it("Login as a Fin Clerk", () => {
        //const username = '7ebddd7ed8863753da3b357bed62d122'
        const username = "FINCLERK01D130";
        const password = "SIMSFinance2018#";
        const screen = "RSS310Q";

        cy.login(username, password, screen);

        //Click Hamburger
        cy.get("#banner_navigation_navigate").should("be.visible").click();

        //Click on the text box in Quick launch
        cy.get(".quick-lunch")
            .eq(1)
            .find("#esr_launch_text")
            .clear({ force: true })
            .type(`${screen}`, { force: true });

        //Click on the menu item displayed
        cy.get(".ui-menu-item").contains(screen).click();

        //Scroll down
        cy.scrollTo("bottom");
        //RSS310Q screen
        cy.get("#search_button").click();
    });
});
