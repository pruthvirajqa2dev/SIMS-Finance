import testData from '../../fixtures/example.json'
describe('SIMS Finance Trial', () => {
  beforeEach(() => {
    cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin', {
      failOnStatusCode: false,
    }
    )
  })

  it.skip('Check if Up', () => {
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

  //Test case #1
  it('Login', () => {
    const username = testData.username
    let textUsername = ''
    if (username.includes('FINCLERK')) {
      textUsername = 'Finance Clerk'
    }
    else if (username.includes('FINDIR')) {
      textUsername = 'Finance Director'
    }
    const password = testData.password
    cy.login(username, password)

    cy.get('#esr_user_profile_menu')
      .should('be.visible')
      .should('contain.text', textUsername)
  })

  //Test case #2
  it('Logout', () => {
    const username = testData.username
    let textUsername = ''
    if (username.includes('FINCLERK')) {
      textUsername = 'Finance Clerk'
    }
    else if (username.includes('FINDIR')) {
      textUsername = 'Finance Director'
    }
    const password = testData.password
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

  //Test case #3
  it('File upload using SPC420', () => {
    let fileCreationFlag = "Y"
    if (fileCreationFlag.includes("Y")) {
      cy.task('fsWriteFile').then((data) => {
        cy.wrap(data).as('writeFile')
        cy.get('@writeFile').should('eq', 'File created')
      })
    }
    const username = testData.username
    const password = testData.password
    const screen = testData.SPC420
    const treeItem = 'LOGS'

    cy.login(username, password)

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()

    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-menu-item')
      .contains(screen).click()

    cy.get('.esr_banner_environment > .title').should('contain', 'SPC420 - File Manager')

    cy.get('*[id$=main_SERVER_DIR_TREE]')
      .should('be.visible')
      .find('*[class^=esr_tree_selectable]')
      .contains(treeItem).click()

    cy.get('.multibutton_content')
      .find('.esr_multibutton')
      .contains('Upload File').click()

    cy.get('.ui-dialog-titlebar').invoke('text').should('contain', 'Upload File')

    cy.get('#upload_button').click()

    cy.task('newestFileName', 'Test Files/*txt').then((data) => {
      cy.wrap(data).as('filename')
      cy.get('@filename').then((data) => {
        cy.log(data)
        cy.get('.dhx-dropable-area').selectFile(data, { action: 'drag-drop' })
        const splitFileName = data.split("/")
        let fileName = splitFileName[1]
        cy.wrap(fileName).as('onlyFileNameWithExt')
        cy.get('.dhx_list-item--name').invoke('text').should('contain', fileName)
      })
    })
    cy.get('*[class^=dhx_item--success-mark]').should('be.visible')
    cy.get('#ok').click()

    cy.get('@onlyFileNameWithExt').then((data) => {
      const splitFileName = data.split(".")
      let file = splitFileName[0].toUpperCase()
      let ext = splitFileName[1].toUpperCase()
      cy.wrap(file).as('fileNameWithoutExt')
      cy.wrap(ext).as('fileExt')
      cy.get('#physical_file').invoke('val').should('contain', file)
      cy.get('#rep_name').invoke('val').should('contain', file)
    })

    //Select school id
    cy.get('#company_id_icon')
      .click()
    cy.wait(2000)
    cy.get('*[id^=ui-id]').contains('School ID').should('be.visible')
    cy.get('[axes="COMP_DESC"] > div')
      .contains(testData.schoolName)
      .parent()
      .parent()
      .contains('Select')
      .click()

    cy.get('#update_button').click()

    //Record assertions
    cy.get('[axes="COMPANY_ID"] > div').eq(0).invoke('text').should('eq', testData.schoolId)
    cy.get('@fileNameWithoutExt').then((data) => {
      cy.get('[axes="REP_NAME"] > div').eq(0).invoke('text').should('contain', data)
    })
    cy.get('@fileExt').then((data) => {
      cy.get('[axes="EXT"]').invoke('text').should('contain', data)
    })
    //View dropdown
    cy.get('.multibutton_content > a').eq(0)
      .click()

    cy.get('.ui-menu-item')
      .contains('Delete').click()

    cy.get('*[id^=ui-id]').contains('Delete File').should('be.visible')

    cy.get('#esr_messagebox_yes').click()
  })

  //Test case #4
  it('RSS570 - Crystal Report', () => {
    const username = testData.username
    const password = testData.password
    const screen = testData.RSS570
    const schoolId = testData.multiSiteUserSchoolId
    const supplierOrNominalSort = testData.supplierOrNominalSort
    cy.login(username, password)

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()


    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-menu-item')
      .contains(screen).click()

    //Complete the form for Outstanding Accruals
    cy.selectUsingSearchIcon('company_id', schoolId)
    //#1
    cy.get('input[aria-label=School]').invoke('val').should('contain', schoolId)
    //#2
    cy.get('#supplier_or_normal').clear().type(supplierOrNominalSort)
    //#3
    cy.get('#currency_control_0').check().should('be.checked')

    cy.get('#submit').click()

    cy.jobProcessingDialog()
    cy.get('#spc_rep_0').invoke('text').should('contain', 'RSS570')
      .should('contain', '.PDF')
      .should('contain', 'Outstanding Accruals')

    cy.get('#btn_close').click()
  })


  //Test case #5
  it('NML510 - Trial Balance Report', () => {
    const username = testData.username
    const password = testData.password
    const screen = testData.NML510
    const schoolId = testData.multiSiteUserSchoolId

    cy.login(username, password)

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()


    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-menu-item')
      .contains(screen).click()

    //Complete the form for Outstanding Accruals
    cy.selectUsingSearchIcon('company_id', schoolId)
    //Submit
    cy.get('#submit_button').click()

    cy.jobProcessingDialog()
    cy.get('#spc_rep_0').invoke('text').should('contain', 'NML510')
      .should('contain', '.PDF')
      .should('contain', 'Trial Balance')
      .should('contain', schoolId)

    cy.get('#spc_rep_1').invoke('text').should('contain', 'NML510')
      .should('contain', '.XLSX')
      .should('contain', 'Trial Balance')
      .should('contain', schoolId)

    cy.get('#btn_close').click()
  })
  //Test case #6
  it('SIMS_TB_SCHOOL - XQuery Report - Execute', () => {
    const username = testData.username
    const password = testData.password
    const screen = testData.SIMS_TB_SCHOOL
    const schoolId = testData.multiSiteUserSchoolId
    const period = testData.period.split("/")

    cy.login(username, password)

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()


    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-autocomplete-category').contains('XQuery').next('.ui-menu-item')
      .contains(screen).click()

    //Complete form
    cy.get('#p_comp_icon')
      .click()

    cy.get('tbody').find('[axes="COMPANY_ID"] > div')
      .contains(schoolId)
      .parent()
      .parent()
      .find('#esr_action')
      .click()

    cy.get('#p_ye_ar').select(period[0])
    cy.get('#p_period').select(period[1])
    cy.window().then((win) => {
      const orig = win.open
    
      win.open = function (url, target, features) {
        return orig.call(this, url, '_self', features)
      }
    })
    cy.get('#execute_in_eseries').click()

    cy.get('.TITLE_XQ').invoke('text').should('contain',schoolId)
    .should('contain',period[0]).should('contain',period[1])
   
  })
  it.only('SIMS_TB_SCHOOL - XQuery Report - Submit', () => {
    const username = testData.username
    const password = testData.password
    const screen = testData.SIMS_TB_SCHOOL
    const schoolId = testData.multiSiteUserSchoolId
    const emailId = testData.emailId
    const period = testData.period.split("/")

    cy.login(username, password)

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()


    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)

    //Click on the menu item displayed from XQuery
    cy.log("Click on the menu item displayed")
    cy.get('.ui-autocomplete-category').contains('XQuery').next('.ui-menu-item')
      .contains(screen).click()

    //Complete form
    cy.get('#p_comp_icon')
      .click()

    cy.get('tbody').find('[axes="COMPANY_ID"] > div')
      .contains(schoolId)
      .parent()
      .parent()
      .find('#esr_action')
      .click()

    cy.get('#p_ye_ar').select(period[0])
    cy.get('#p_period').select(period[1])
    
    cy.get('#distribute_via_workflow').click()
    cy.get('*[id^=ui-id]').contains('SIMS_TB_SCHOOL - SIMS Trial Balance School').should('be.visible')
    
    cy.get('#email_address').type(emailId)
  })
})