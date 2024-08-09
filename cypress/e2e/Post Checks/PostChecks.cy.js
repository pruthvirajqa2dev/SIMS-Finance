describe('SIMS Finance Trial', () => {
  beforeEach(() => {
    cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin', {
      failOnStatusCode: false,
    }
    )
  })

  it('Check if Up', () => {
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
    if (username.includes('FINCLERK')) {
      textUsername = 'Finance Clerk'
    }
    const password = 'SIMSFinance2018#'
    cy.login(username, password)

    cy.get('#esr_user_profile_menu')
      .should('be.visible')
      .should('contain.text', textUsername)
  })
  it('Logout', () => {
    const username = 'FINCLERK01D130'
    let textUsername = ''
    if (username.includes('FINCLERK')) {
      textUsername = 'Finance Clerk'
    }
    const password = 'SIMSFinance2018#'
    cy.login(username, password)

    cy.get('#esr_user_profile_menu')
      .should('be.visible')
      .click()

    cy.get('*[id*=esr_user_profile]')
      .find('*[aria-label="Click to Logout"]')
      .click()

    cy.get('.ui-dialog')
      .should('be.visible')

    cy.get('#esr_messagebox_yes')
      .click()

    cy.get('#login')
      .should('be.visible')

  })
  it.only('File upload using SPC420', () => {
    let fileCreationFlag = "Y"
    if (fileCreationFlag.includes("Y")) {
      cy.task('fsWriteFile').then((data) => {
        cy.wrap(data).as('writeFile')
        cy.get('@writeFile').should('eq', 'File created')
      })
    }
    const username = 'FINDIR99D130'
    const password = 'SIMSFinance2018#'
    const screen = 'SPC420'
    const treeItem = 'LOGS'
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

    //
    cy.get('*[id$=main_SERVER_DIR_TREE]')
      .should('be.visible')
      .find('*[class^=esr_tree_selectable]')
      .contains(treeItem)
      .click()

    cy.get('.multibutton_content')
      .find('.esr_multibutton')
      .contains('Upload File')
      .click()

    cy.get('.ui-dialog-titlebar')
      .invoke('text')
      .should('contain', 'Upload File')

    cy.get('#upload_button').click()

    cy.task('newestFileName', 'Test Files/*txt').then((data) => {
      cy.wrap(data).as('filename')
      cy.get('@filename').then((data) => {
        cy.log(data)
        cy.get('.dhx-dropable-area').selectFile(data,{action: 'drag-drop' })
        const splitFileName = data.split("/")
        let fileName = splitFileName[1]
        cy.wrap(fileName).as('onlyFileName')
        cy.get('.dhx_list-item--name').invoke('text').should('contain',fileName)
      })
    })
    cy.get('*[class^=dhx_item--success-mark]').should('be.visible')
    cy.get('#ok').click()

    cy.get('@onlyFileName').then((data)=>{
      const splitFileName = data.split(".")
      let file = splitFileName[0]
      cy.get('input#rep_name').invoke('text').should('contain',file)
    })

  })
})