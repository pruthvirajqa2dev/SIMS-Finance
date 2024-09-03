/* eslint-disable no-undef */
describe.skip('Scenario 30', () => {
    beforeEach(() => {
        cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin', { failOnStatusCode: false })
    })


    it('Multi line Invoice entry - SLS310 as a Finance Director for a school', () => {
        const screenshotFolder = 'Multi line Invoice entry - SLS310'
        const username = 'T102FINDIR01'
        const password = 'T2LETmeSKI2#'
        const screen = 'SLS310'
        const schoolId = '000011'
        const despatchDate = '19/07/2024'
        const invoiceDate = '19/07/2024'
        let arrCustCode = [11001, 11003, 11004, 99001]
        let arrProd = ['00001', 'ASTRO']
        let arrVATCode = ['EXM', 'NON', 'RED', 'STD', 'ZER']

        let qtyMin = 20.94;
        let qtyMax = 29.89;

        let randomNum = Math.random() * (qtyMax - qtyMin) + qtyMin;
        var result = (randomNum - Math.floor(randomNum)) !== 0; 
        while(!result){
            randomNum = Math.random() * (qtyMax - qtyMin) + qtyMin;
        }
        let unitPriceMin = 54.4412;
        let unitPriceMax = 59.8812;

        let randomUnitPrice = Math.random() * (unitPriceMax - unitPriceMin) + unitPriceMax;
        var resultUnitPrice = (randomUnitPrice - Math.floor(randomUnitPrice)) !== 0; 
        while(!resultUnitPrice){
            randomUnitPrice =Math.random() * (unitPriceMax - unitPriceMin) + unitPriceMax;
        }
        cy.login(username, password,screenshotFolder)

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
        cy.selectUsingSearchIcon('company_id', schoolId)
        // cy.selectUsingSearchIcon('custmf_code','Customer Code',schoolId,'Green Abbey School')
        //***Enter despatch date */
        cy.get('#desp_date_vax')
            .type(despatchDate)

        //***Enter invoice date */
        cy.get('#trans_date_vax')
            .type(invoiceDate)


        cy.selectUsingSearchIcon('custmf_code', String(arrCustCode[(Math.floor(Math.random() * arrCustCode.length))]))

        cy.get('#next_button')
            .click()
        cy.selectUsingSearchIcon('prodmf_code', arrProd[(Math.floor(Math.random() * arrProd.length))])

        //    //prodmf_code //***Select customer type
        cy.selectUsingSearchIcon('vatcod_code', arrVATCode[(Math.floor(Math.random() * arrVATCode.length))])
        cy.get('#qty')
            .type(randomNum)
        cy.get('#price')
            .type(randomUnitPrice)

        cy.get('[axes="NOM_DESC"] > div')
            .contains('NOT FOUND')
            .parent().parent().dblclick()
            //.get('button[aria-label="Edit Nominal Details"]').dblclick()
        
    })
})