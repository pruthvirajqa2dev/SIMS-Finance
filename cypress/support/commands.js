// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password, screenshotFolder) => {
    //Populate username
    cy.get(".username").should("be.visible").type(`${username}`);
    // Populate password
    cy.get(".password").should("be.visible").type(`${password}`);
    cy.screenshot(screenshotFolder + "1");
    // Hit enter
    cy.get(".go_button").should("be.visible").click();
    cy.screenshot(screenshotFolder + "2");

    cy.url().then((url) => {
        cy.log("Current URL is: " + url);
    });
});
Cypress.Commands.add("selectUsingSearchIcon", (acronym, valueToSelect) => {
    cy.get("#" + acronym + "_icon").click();

    cy.get("tbody")
        .find('[axes="' + acronym.toUpperCase() + '"] > div')
        .contains(valueToSelect)
        .parent()
        .parent()
        .find("#esr_action")
        .click();
});
Cypress.Commands.add("selectCostCentre", (costCentre) => {
    //Cost centre and Fund code selection for GL Code
    cy.get("#c1_part_code_lookup").click();

    cy.get('[data-esr-clean-page="glcodepartlookup"]').should("be.visible");

    cy.get('[axes="DESCR"]')
        .contains(costCentre)
        .parent()
        .parent()
        .contains("Select")
        .click();
});
Cypress.Commands.add("jobProcessingDialog", () => {
    //Job processing dialog
    cy.get("*[id^=ui-id]").contains("Job Processing").should("be.visible");
    cy.get("#btn_ok").click();
    //Background Processing
    cy.get("*[id^=ui-id]")
        .contains("Background Processing")
        .should("be.visible");
    cy.get('.faicon > i[style*="color:green"]', { timeout: 60000 }).should(
        "be.visible"
    );
});

Cypress.Commands.add("selectFirstLedgerCodeAndFundCode", () => {
    cy.get("#e1_part_code_lookup").click();
    cy.get('[aria-describedby$="glcodepartlookup_container"]')
        .find(".multibutton_content")
        .find('.esr_hover:contains("Select")')
        .eq(0)
        .click();

    cy.get("#e2_part_code_lookup").click();
    cy.get('[aria-describedby$="glcodepartlookup_container"]')
        .find(".multibutton_content")
        .find('.esr_hover:contains("Select")')
        .eq(0)
        .click();
});
