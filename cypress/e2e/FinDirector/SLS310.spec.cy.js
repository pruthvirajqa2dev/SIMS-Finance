/* eslint-disable no-undef */
describe('Scenario 30', () => {
  beforeEach(() => {
    cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin', { failOnStatusCode: false })
  })

  it('Multi line Invoice entry - SLS310 as a Finance Director for default school', () => {
    const username = 'FINDIR99D102'
    const password = 'SIMSFinance2018#'
    const screen = 'SLS310'
    const schoolId = '000001'
    const despatchDate = '01/09/2023'
    const invoiceDate = '01/09/2023'
    const dueDate = '01/09/2023'
    const customerCodeAddressSectionName = 'Johnny'
    const customerCodeAddressSectionShortName = 'John'
    const customerCodeAddressSectionPostCode = 'SW1W 0NY'
    const customerCodeAddressSectionAddress = '1, East Street, West Avenue, Northampton, Southall, England'
    const customerTypeText = 'Customer Type'
    const countryCodeText = 'Country Code'
    const customerTypeValue = '000001'
    const countryCodeValue = '000001'

    cy.login(username, password, screen)

    //***Click Hamburger
    cy.get('#banner_navigation_navigate')
      .should('be.visible')
      .click()

    //***Click on the text box in Quick launch
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text')
      .clear({ force: true })
      .type(`${screen}`, { force: true })

    //***Click on the menu item displayed
    cy.get('.ui-menu-item')
      .contains(screen)
      .click()
    cy.selectUsingSearchIcon('company_id', 'School ID', schoolId, 'Green Abbey School')
    // cy.selectUsingSearchIcon('custmf_code','Customer Code',schoolId,'Green Abbey School')
    //***Enter despatch date */
    cy.get('#desp_date_vax')
      .type(despatchDate)

    //***Enter invoice date */
    cy.get('#trans_date_vax')
      .type(invoiceDate)
    //**Enter due date */
    cy.get('#date_due_vax')
      .type(dueDate)

    //***Customer code address section
    cy.get('#name')
      .type(customerCodeAddressSectionName)

    cy.get('#short_name')
      .type(customerCodeAddressSectionShortName)

    cy.get('#post_code')
      .type(customerCodeAddressSectionPostCode)

    cy.get('#address_0')
      .type(customerCodeAddressSectionAddress)

    //***Analysis code section
    //***Select customer type
    cy.selectUsingSearchIcon('cutype_code', customerTypeText, customerTypeValue, 'Parent/Guardian')
    //***Select Country Code
    cy.selectUsingSearchIcon('country_code', countryCodeText, countryCodeValue, 'Not Used')
    //***Select Area Code
    cy.selectUsingSearchIcon('areacd_code', 'Area Code', countryCodeValue, 'Not used')
    //***Representative
    cy.selectUsingSearchIcon('repmas_code', 'Representative', countryCodeValue, 'Not used')
    //***Email/Print
    cy.selectUsingSearchIcon('crcont_code', 'Print/E-Mail', 'EMAIL', 'E-Mail Invoice/Credit Notes')
  })
})