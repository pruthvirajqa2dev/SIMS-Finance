import testData from '../../fixtures/example.json'
describe('Scenario 30', () => {
  beforeEach(() => {
    cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin', { failOnStatusCode: false })
  })

  it('Check if Up', () => {

    //cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin',{failOnStatusCode: false})

    const errorMsg = '502 - Web server received an invalid response while acting as a gateway or proxy server.'
    cy.get('h2', { timeout: 0 })
      .first()
      .should('not.have.text', errorMsg)

  })
  it.only('Multi line Invoice entry - PRL300Q as a Finance Director for default school', () => {

    

    cy.login(testData.username, testData.password)

    //***Click Hamburger
    cy.get('#banner_navigation_navigate')
      .should('be.visible')
      .click()

    //***Click on the text box in Quick launch
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text')
      .clear({ force: true })
      .type(testData.screen, { force: true })

    //***Click on the menu item displayed
    cy.get('.ui-menu-item')
      .contains(testData.screen)
      .click()

    cy.selectUsingSearchIcon('company_id', testData.schoolId)
    // cy.selectUsingSearchIcon('custmf_code','Customer Code',schoolId,'Green Abbey School')

    cy.log("************PRL300Q screen**************")
    cy.log("Click on search button")

    cy.get('#search_button')
      .click()

    //New Button
    cy.log("Click in new button(with dropdown)")
    cy.get('.multibutton_content')
      .find('.esr_multibutton')
      .contains('New')
      .click()

    if (testData.invoiceType == 'Non Purchase Order Invoice') {
      cy.get('#invoice_type2')
        .check()
        .should('be.checked')
    }
    else {
      cy.get('#invoice_type2')
        .check()
        .should('be.checked')
    }

    cy.get('#select_button')
      .click()

    cy.get('.esr_breadcrumb_selected')
      .contains('Non Purchase Order Details')

    cy.get('#supplier_icon')
      .click()

    cy.get('[axes="SUPP_NAME"]')
      .contains(testData.supplierName)
      .parent()
      .parent()
      .contains('Select')
      .click()

    cy.get('[for="supplier"]')
      .eq(1)
      .should('have.text', testData.supplierName)
    cy.get('#doc_date')
      .type(testData.invoiceDate)

    cy.get('[for="authority_code"]').eq(0).click()

    cy.get('.ui-pnotify-text')
      .should('contain', testData.period)
    cy.get('#tot_value')
      .type(testData.totalInvoiceValue)

    //Add unique invoice refernce
      const timestamp = Date.now()
    const supplierInvoiceRef = 'InvoiceRef'+timestamp
    cy.get('#supp_own_ref')
      .type(supplierInvoiceRef)
    
      //***Add line 
    cy.get('.multibutton_content > .esr_hover')
      .contains('Add')
      .click()
      
    //Dialog title verification
    cy.get('.ui-dialog-title')
      .should('contain','Invoice/Credit Note')
    
    cy.get('#narr_desc')
      .type('Test Description')
    
  })
})