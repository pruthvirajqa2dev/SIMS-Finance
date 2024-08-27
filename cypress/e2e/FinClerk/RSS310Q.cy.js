describe('SIMS Finance Trial', () => {
  beforeEach(() => {
    cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin', { failOnStatusCode: false })
  })

  it.only('Check if Up', () => {


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
  it('Create a new single line purchase order as a Fin Clerk', () => {

    //const username = '7ebddd7ed8863753da3b357bed62d122'
    const username = 'FINCLERK01D130'
    const password = 'SIMSFinance2018#'
    const screen = 'RSS310Q'
    let supplierNamesArr = ["YPO", "British Telecom", "Sportscene", "Digicom Computers",
      "3663", "Eastern Water Authority", "The Consortium", "Global Construction Ltd", "OVO Energy",
      "Promethean Limited", "Jones & Co - Solicitors", "ESPO", "Southern Examination Board", "GLS",
      "ABC Personnel Services"]
    const supplierName = String(supplierNamesArr[Math.floor(Math.random() * supplierNamesArr.length)])
    const supplierItemRefText = 'Test item reference'
    const descText = "Test description"
    const descText1 = "Test description 1"
    const descText2 = "Test description 2"
    const descText3 = "Test description 3"
    let quantArr = [1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 9.1]
    const quantity = String(quantArr[Math.floor(Math.random() * quantArr.length)])
    let unitPriceArr = [120.12, 230.23, 340.34, 450.45, 560.56, 670.67, 780.78]
    const unitprice = String(unitPriceArr[Math.floor(Math.random() * unitPriceArr.length)])

    let vatCodeArr = ["EXM", "NON", "RED", "STD", "ZER"]
    const vatCode = vatCodeArr[Math.floor(Math.random() * vatCodeArr.length)]
    const costCentre = "Music Lessons"
    const completedOrderText = "The following 1 Purchase Order(s) have been created."

    cy.login(username, password)

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible')
      .click()


    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text')
      .clear()
      .type(`${screen}`)

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-menu-item')
      .contains(screen)
      .click()
    //************RSS310Q screen**************
    cy.log("************RSS310Q screen**************")
    cy.log("Click on search button")

    cy.get('body')
      .then(($body) => {
        if ($body.find('h1[id*=defaultCompanyEntry]').length) {
          cy.get('button[data-alias="SAVE"]').click().then(() => {
            return 'h1[id*=defaultCompanyEntry]';
          })
        }

      })

    cy.get('#search_button')
      .click()
    //Single Line PO
    //New Button
    cy.log("Click in new button(with dropdown)")
    cy.get('.multibutton_content')
      .find('.esr_multibutton:contains("New")')
      .eq(0)
      .click()


    //Purchase Orders screen
    //Select Supplier
    cy.log("Select supplier")
    cy.get('#supplier_icon')
      .click()


    //Find supplier and select
    cy.log("Find supplier and select")
    cy.get('[data-esr-clean-page="lookupresults"]')
      .within(() => {
        cy.get('[axes="SUPP_NAME"]')
          .contains(supplierName)
          .parent()
          .parent()
          .contains('Select')
          .click()
      })
    //Assert supplier selection
    cy.get('#supp_name')
      .should('have.value', `${supplierName}`)
      .get('#cancel')
      .click()

    // New order button
    cy.get('.multibutton_content > .esr_hover')
      .contains("New")
      .click()

    //Purchase order form fillup
    cy.get('[data-esr-clean-page="purchaseorder"]')
      .should('be.visible')


    cy.get('button')
      .contains('Free Format')
      .click()

    cy.get('#supp_item')
      .type(supplierItemRefText)

    cy.get('#description')
      .type(descText)

    cy.get('#description_1')
      .type(descText1)

    cy.get('#description_2')
      .type(descText2)

    cy.get('#description_3')
      .type(descText3)

    cy.get('#qty')
      .type(quantity)

    cy.get('#unit_price')
      .type(unitprice)

    cy.get('#vat_code')
      .select(vatCode)
      .invoke("val")
      .should("eq", vatCode)

    cy.selectCostCentre(costCentre, "Music Lessons Income from music")


    cy.get('span[for="gl_code"]')
      .invoke("text")
      .should("eq", "Music Lessons Income from music")


    // //Cost centre and Fund code selection for GL Code

    cy.get('#save_button')
      .click()

    //Assertions on the Line Details table
    cy.get('[axes="SUPP_ITEM"] > div')
      .invoke('text')
      .should("eq", supplierItemRefText)

    cy.get('[axes="NSV_DESC_0"] > div')
      .invoke('text')
      .should("eq", descText)

    cy.get('[axes="QTY"] > div')
      .invoke('text')
      .should("contain", quantity)

    cy.get('[axes="UNIT_PRICE"] > div')
      .invoke('text')
      .should("contain", unitprice)

    const totalOrderValue = Math.round((quantity * unitprice) * 100) / 100
    cy.get('[axes="TOT_VAL_ORD"] > div')
      .invoke('text')
      .should('contain', totalOrderValue)


    //Click on Summary page
    cy.contains('Summary')
      .click()


    //Assertions for Summary page--
    cy.get('#tot_value_0')
      .invoke('text')
      .should('contain', totalOrderValue)


    cy.get('[for="supplier_0"]')
      .eq(1)
      .invoke('text')
      .then(supp => {
        const suppname = String(supp).trim()
        cy.wrap(suppname).as('suppname')
      })

    cy.get('@suppname').then(suppname => {
      expect(suppname).to.eq(supplierName)
    })
    //Click Complete Order  
    cy.get('#complete_po')
      .click()

    //Order completed page

    cy.get('#top_label')
      .invoke('text')
      .should('eq', completedOrderText)
  })
})