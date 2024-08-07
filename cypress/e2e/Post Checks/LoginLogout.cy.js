describe('SIMS Finance Trial', () => {
    beforeEach(() => {
      cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin', {
        failOnStatusCode: false,
      }
      )
    })
  
    it('Check if Up', () => {
  
      //cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin',{failOnStatusCode: false})
  
      const errorMsg = '502 - Web server received an invalid response while acting as a gateway or proxy server.'
      cy.get('h2', { timeout: 0 })
        .first()
        .should('not.have.text', errorMsg)
  
    })
    //Handling uncaught exceptions to avoid false errors
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    it('Login', () => {
      const username = 'FINCLERK01D130'
      let textUsername = ''
      if(username.includes('FINCLERK')){
        textUsername = 'Finance Clerk'
      }
      const password = 'SIMSFinance2018#'
      cy.login(username, password)
    
      cy.get('#esr_user_profile_menu')
        .should('be.visible')
        .should('contain.text',textUsername)
    })
  })