import crypto from "crypto"; 
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

Cypress.Commands.add('login',(username,password)=>{
    //username =  cy.decrypt(username)
    //Populate username
     cy.get('.username')
     .should('be.visible')
     .type(`${username}`)   
   // Populate password
   cy.get('.password')
     .should('be.visible')   
     .type(`${password}`)
   
   // Hit enter
   cy.get('.go_button')
     .should('be.visible')  
     .click()

   cy.url().then((url) => {
       cy.log('Current URL is: ' + url)
     })
})
Cypress.Commands.add('selectUsingSearchIcon',(acronym,valueToSelect)=>{
  cy.get('#'+acronym+'_icon')
      .click()

    // cy.get('span')
    //   .contains(titleText)
    //   .should('have.text',titleText)

    cy.get('[axes="'+acronym.toUpperCase()+'"] > div')
      .contains(valueToSelect)
      .parent()
      .parent()
      .contains('Select')
      .click()
    
    // cy.get('[for="'+acronym+'"]')
    //   .eq(1)
    //   .should('have.text',expectedDescriptionText)

})
Cypress.Commands.add('selectCostCentre',(costCentre)=>{
   //Cost centre and Fund code selection for GL Code
   cy.get('#c1_part_code_lookup')
   .click()

 cy.get('[data-esr-clean-page="glcodepartlookup"]')
   .should('be.visible')
   

 cy.get('[axes="DESCR"]')
   .contains(costCentre)
   .parent()
   .parent()
   .contains('Select')
   
   .click()
})

Cypress.Commands.add('decrypt',(encryptedText)=>{
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
})

Cypress.Commands.add('getModifiedTime',(filePath)=>{
  
 
})