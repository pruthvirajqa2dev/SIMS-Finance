/* eslint-disable no-undef */
import testData from '../../fixtures/example.json'
describe('Postchecks TC 1 to 9', () => {
  beforeEach(() => {
    cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin', {
      failOnStatusCode: false,
    }
    )
  })

  //Handling uncaught exceptions to avoid false errors
  Cypress.on('uncaught:exception', (err) => {
    // returning false here prevents Cypress from
    // failing the test
    console.log(err)
    return false
  })

  //Test case #1
  it('Login', () => {
    const username = testData.username
    const screenshotFolder = 'Postchecks/RunOn'+new Date().toLocaleDateString('en-GB').replaceAll('/','')
    +'/'+'Hour '+new Date().getHours()+'/Login/'
    let textUsername = ''
    if (username.includes('FINCLERK')) {
      textUsername = 'Finance Clerk'
    }
    else if (username.includes('FINDIR')) {
      textUsername = 'Finance Director'
    }
    const password = testData.password
    cy.login(username, password, screenshotFolder)
    cy.get('#esr_user_profile_menu')
      .should('be.visible')
      .should('contain.text', textUsername)
  })

  //Test case #2
  it('Logout', () => {
    const username = testData.username
    const screenshotFolder = 'Postchecks/RunOn'+new Date().toLocaleDateString('en-GB').replaceAll('/','')
    +'/'+'Hour '+new Date().getHours()+'/Logout/'

    const password = testData.password
    cy.login(username, password, screenshotFolder)
    cy.get('#esr_user_profile_menu')
      .should('be.visible')
      .click()
    let i = 2
    cy.screenshot(screenshotFolder + (++i))
    cy.get('*[id*=esr_user_profile]')
      .find('*[aria-label="Click to Logout"]')
      .click()
    cy.screenshot(screenshotFolder + (++i))
    cy.get('.ui-dialog')
      .should('be.visible')
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#esr_messagebox_yes')
      .click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#login')
      .should('be.visible')
  })

  //Test case #3
  it('File upload using SPC420', () => {
    const screenshotFolder = 'Postchecks/RunOn'+new Date().toLocaleDateString('en-GB').replaceAll('/','')
    +'/'+'Hour '+new Date().getHours()+'/SPC420 - File Upload/'
    let fileCreationFlag = "Y"
    let fileExt = '.txt'
    if (fileCreationFlag.includes("Y")) {
      cy.task('fsWriteFile', fileExt).then((data) => {
        cy.wrap(data).as('writeFile')
        cy.get('@writeFile').should('eq', 'File created')
      })
    }
    const username = testData.username
    const password = testData.password
    const screen = testData.SPC420
    const treeItem = 'LOGS'

    cy.login(username, password, screenshotFolder)
    let i = 2
    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()
    cy.screenshot(screenshotFolder + (++i))

    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)
    cy.screenshot(screenshotFolder + (++i))

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-menu-item')
      .contains(screen).click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('.esr_banner_environment > .title').should('contain', 'SPC420 - File Manager')
    cy.screenshot(screenshotFolder + (++i))

    cy.get('*[id$=main_SERVER_DIR_TREE]')
      .should('be.visible')
      .find('*[class^=esr_tree_selectable]')
      .contains(treeItem).click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('.multibutton_content')
      .find('.esr_multibutton:contains("Upload File")')
      .eq(0).click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('.ui-dialog-titlebar').invoke('text').should('contain', 'Upload File')
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#upload_button').click()
    cy.screenshot(screenshotFolder + (++i))

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

    cy.screenshot(screenshotFolder + (++i))

    cy.get('*[class^=dhx_item--success-mark]').should('be.visible')
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#ok').click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('@onlyFileNameWithExt').then((data) => {
      const splitFileName = data.split(".")
      let file = splitFileName[0].toUpperCase()
      let ext = splitFileName[1].toUpperCase()
      cy.wrap(file).as('fileNameWithoutExt')
      cy.wrap(ext).as('fileExt')
      cy.get('#physical_file').invoke('val').should('contain', file)
      cy.get('#rep_name').invoke('val').should('contain', file)
    })
    cy.screenshot(screenshotFolder + (++i))

    //Select school id
    cy.get('#company_id_icon')
      .click()
    cy.screenshot(screenshotFolder + (++i))

    cy.wait(2000)
    cy.get('*[id^=ui-id]').contains('School ID').should('be.visible')
    cy.get('[axes="COMP_DESC"] > div')
      .contains(testData.schoolName)
      .parent()
      .parent()
      .contains('Select')
      .click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#update_button').click()
    cy.screenshot(screenshotFolder + (++i))

    //Record assertions
    cy.get('[axes="COMPANY_ID"] > div').eq(0).invoke('text').should('eq', testData.schoolId)
    cy.screenshot(screenshotFolder + (++i))

    cy.get('@fileNameWithoutExt').then((data) => {
      cy.get('[axes="REP_NAME"] > div').eq(0).invoke('text').should('contain', data)
    })
    cy.get('@fileExt').then((data) => {
      cy.get('[axes="EXT"]').invoke('text').should('contain', data)
    })
    //View dropdown
    cy.get('.multibutton_content > a').eq(0)
      .click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('.ui-menu-item')
      .contains('Delete').click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('*[id^=ui-id]').contains('Delete File').should('be.visible')
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#esr_messagebox_yes').click()
    cy.screenshot(screenshotFolder + (++i))
  })

  //Test case #4
  it('RSS570 - Crystal Report', () => {
    const screenshotFolder = 'Postchecks/RunOn'+new Date().toLocaleDateString('en-GB').replaceAll('/','')
    +'/'+'Hour '+new Date().getHours()+'/RSS570 - Crystal Report/'
    const username = testData.username
    const password = testData.password
    const screen = testData.RSS570
    const schoolId = testData.schoolId
    const supplierOrNominalSort = testData.supplierOrNominalSort
    cy.login(username, password, screenshotFolder)
    let i = 2

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()
    cy.screenshot(screenshotFolder + (++i))

    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)
    cy.screenshot(screenshotFolder + (++i))

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-menu-item')
      .contains(screen).click()
    cy.screenshot(screenshotFolder + (++i))

    //Complete the form for Outstanding Accruals
    cy.selectUsingSearchIcon('company_id', schoolId)
    cy.screenshot(screenshotFolder + (++i))

    //#1
    cy.get('input[aria-label=School]').invoke('val').should('contain', schoolId)
    //#2
    cy.get('#supplier_or_normal').type(supplierOrNominalSort, { force: true })
    //#3
    cy.get('#currency_control_0').check().should('be.checked')
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#submit').click()
    cy.screenshot(screenshotFolder + (++i))

    cy.jobProcessingDialog()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#spc_rep_0').invoke('text').should('contain', 'RSS570')
      .should('contain', '.PDF')
      .should('contain', 'Outstanding Accruals')
    cy.screenshot(screenshotFolder + (++i))

    cy.window().then((win) => {
      const orig = win.open
      win.open = function (url, target, features) {
        return orig.call(this, url, '_self', features)
      }
    })

    cy.get('#save_all').click()
    cy.screenshot(screenshotFolder + (++i))

    const fileExt = '.zip'
    cy.task('newestFileName', './cypress/downloads/'+screen+'*' + fileExt).then((data) => {
      cy.log("Newest zip file:" + data)
      cy.task('unzipFile', data)
      cy.task('newestFileName', './cypress/downloads/unzip*/*.PDF').then((fileName) => {
        cy.log("Newest unzipped PDF:" + fileName)
        cy.task('readPdf', fileName).then(function (data) {
          cy.log("Text: " + data.text)
          cy.wrap(data.text).as('PDFdata')
          cy.get('@PDFdata')
            .should('contain', schoolId)
            .should('contain', testData.schoolName)
            .should('contain', username)
            .should('contain', 'Sorted By:\nS')
        })
      })
    })
  })

  //Test case #5
  it('NML510 - Trial Balance Report', () => {
    const screenshotFolder = 'Postchecks/RunOn'+new Date().toLocaleDateString('en-GB').replaceAll('/','')
    +'/'+'Hour '+new Date().getHours()+'/NML510 - Trial Balance Report/'
    const username = testData.username
    const password = testData.password
    const screen = testData.NML510
    const schoolId = testData.schoolId

    cy.login(username, password, screenshotFolder)
    let i = 2

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()
    cy.screenshot(screenshotFolder + (++i))

    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)
    cy.screenshot(screenshotFolder + (++i))

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-menu-item')
      .contains(screen).click()
    cy.screenshot(screenshotFolder + (++i))

    //Complete the form for Outstanding Accruals
    cy.selectUsingSearchIcon('company_id', schoolId)
    cy.screenshot(screenshotFolder + (++i))

    //Submit
    cy.get('#submit_button').click()
    cy.screenshot(screenshotFolder + (++i))

    cy.jobProcessingDialog()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#spc_rep_0').invoke('text').should('contain', 'NML510')
      .should('contain', '.PDF')
      .should('contain', 'Trial Balance')
      .should('contain', schoolId)
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#spc_rep_1').invoke('text').should('contain', 'NML510')
      .should('contain', '.XLSX')
      .should('contain', 'Trial Balance')
      .should('contain', schoolId)
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#save_all').click()
    cy.screenshot(screenshotFolder + (++i))

    const fileExt = '.zip'
    cy.task('newestFileName', './cypress/downloads/'+screen+'*' + fileExt).then((data) => {
      cy.log("Newest zip file:" + data)
      cy.task('unzipFile', data)
      cy.task('newestFileName', './cypress/downloads/unzip*/*.PDF').then((fileName) => {
        cy.log("Newest unzipped PDF:" + fileName)
        cy.task('readPdf', fileName).then(function (data) {
          cy.log("Text: " + data.text)
          cy.wrap(data.text).as('PDFdata')
          cy.get('@PDFdata')
            .should('contain', schoolId)
            .should('contain', testData.schoolName)
            .should('contain', username)
        })
      })
    })
    cy.get('#btn_close').click()
    cy.screenshot(screenshotFolder + (++i))
  })

  //Test case #6
  it.only('SIMS_TB_SCHOOL - XQuery Report - Execute', () => {
    const screenshotFolder = 'Postchecks/RunOn'+new Date().toLocaleDateString('en-GB').replaceAll('/','')
    +'/'+'Hour '+new Date().getHours()+'/SIMS_TB_SCHOOL - XQuery Report - Execute/'
    const username = testData.username
    const password = testData.password
    const screen = testData.SIMS_TB_SCHOOL
    const schoolId = testData.schoolId
    const period = testData.period.split("/")

    cy.login(username, password, screenshotFolder)
    let i = 2

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()
    cy.screenshot(screenshotFolder + (++i))

    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)
    cy.screenshot(screenshotFolder + (++i))

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-autocomplete-category').contains('XQuery').next('.ui-menu-item')
      .contains(screen).click()
    cy.screenshot(screenshotFolder + (++i))

    //Complete form
    cy.get('#p_comp_icon')
      .click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('tbody').find('[axes="COMPANY_ID"] > div')
      .contains(schoolId)
      .parent()
      .parent()
      .find('#esr_action')
      .click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#p_ye_ar').select(period[0])
    cy.get('#p_period').select(period[1])
    cy.screenshot(screenshotFolder + (++i))

    cy.window().then((win) => {
      const orig = win.open
      win.open = function (url, target, features) {
        return orig.call(this, url, '_self', features)
      }
    })
    cy.get('#execute_in_eseries').click()
    cy.screenshot(screenshotFolder + (++i))

    // const description = 'VAT recoverable'
    const glCode = '240100-00'
    // const amt = 2042.92
    const amt1 = 4361.00
    cy.get('.TITLE_XQ').invoke('text').should('contain', schoolId)
      .should('contain', 'Year ' + period[0]).should('contain', 'Period ' + period[1])
    cy.screenshot(screenshotFolder + (++i))

    // cy.get('html').contains(description)
    //   .siblings(':nth-child(5)').invoke('text')
    //   .should('contains', amt.toLocaleString())
    // cy.screenshot(screenshotFolder + (++i))

    cy.get('html').contains(glCode).parent()
      .siblings(':nth-child(5)').invoke('text')
      .should('contains', amt1.toLocaleString())
    cy.screenshot(screenshotFolder + (++i))
  })

  //Test case #7
  it('SIMS_TB_SCHOOL - XQuery Report - Submit', () => {
    const screenshotFolder = 'Postchecks/RunOn'+new Date().toLocaleDateString('en-GB').replaceAll('/','')
    +'/'+'Hour '+new Date().getHours()+'/SIMS_TB_SCHOOL - XQuery Report - Submit/'
    const username = testData.username
    const password = testData.password
    const screen = testData.SIMS_TB_SCHOOL
    const schoolId = testData.multiSiteUserSchoolId
    const emailId = testData.emailId
    const period = testData.period.split("/")

    cy.login(username, password, screenshotFolder)
    let i = 2

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()
    cy.screenshot(screenshotFolder + (++i))

    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)
    cy.screenshot(screenshotFolder + (++i))

    //Click on the menu item displayed from XQuery
    cy.log("Click on the menu item displayed")
    cy.get('.ui-autocomplete-category').contains('XQuery').next('.ui-menu-item')
      .contains(screen).click()
    cy.screenshot(screenshotFolder + (++i))

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
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#distribute_via_workflow').click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('*[id^=ui-id]').contains('SIMS_TB_SCHOOL - SIMS Trial Balance School').should('be.visible')
    cy.screenshot(screenshotFolder + (++i))

    //Check email content to be sent
    cy.get('#email_address').type(emailId)
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#subject').invoke('val')
      .should('contain', period[0])
      .should('contain', period[1])
      .should('contain', schoolId)
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#time').invoke('val')
      .should('contain', new Date().toLocaleDateString('en-GB'))
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#ok_button').click()
    cy.screenshot(screenshotFolder + (++i))

    // insert code to check if the mail is received on the specified mail address
  })

  //Test case #8
  it('RSS310Q - Attachments', () => {
    const screenshotFolder = 'Postchecks/RunOn'+new Date().toLocaleDateString('en-GB').replaceAll('/','')
    +'/'+'Hour '+new Date().getHours()+'/RSS310Q - Attachments/'
    let fileCreationFlag = "Y"
    let fileExt = '.docx'
    if (fileCreationFlag.includes("Y")) {
      cy.task('fsWriteFile', fileExt).then((data) => {
        cy.wrap(data).as('writeFile')
        cy.get('@writeFile').should('eq', 'File created')
      })
    }
    const username = testData.username
    const password = testData.password
    const screen = testData.RSS310Q
    const schoolId = testData.schoolId

    cy.login(username, password, screenshotFolder)
    let i = 2

    //Click Hamburger
    cy.log("Click on Hamburger")
    cy.get('#banner_navigation_navigate')
      .should('be.visible').click()
    cy.screenshot(screenshotFolder + (++i))

    //Click on the text box in Quick launch
    cy.log("Type screen in the text box")
    cy.get('.quick-lunch').eq(1)
      .find('#esr_launch_text').clear().type(`${screen}`)
    cy.screenshot(screenshotFolder + (++i))

    //Click on the menu item displayed
    cy.log("Click on the menu item displayed")
    cy.get('.ui-menu-item')
      .contains(screen).click()
    cy.screenshot(screenshotFolder + (++i))

    cy.selectUsingSearchIcon('company_id', schoolId)
    cy.screenshot(screenshotFolder + (++i))

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
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#search_button')
      .click()
    cy.screenshot(screenshotFolder + (++i))

    const random = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(1) + 1) + Math.ceil(1)-1)
    cy.log("Selecting random record #" + random)
    cy.get('.multibutton_content')
      .find('.esr_multibutton:contains("View")')
      .eq(random)
      .click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('div[id*=esr_breadcrumb]').should('have.length', 3).invoke('text')
      .should('contain', 'Search Criteria')
      .should('contain', 'Header Results')
      .should('contain', 'Header Details')
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#esr_attachment_manager').click()
    cy.get('*[id^=ui-id]').contains('Attachments').should('be.visible')
    cy.get('.multibutton_content').contains('Add File').click()
    cy.screenshot(screenshotFolder + (++i))

    cy.task('newestFileName', 'Test Files/*' + fileExt).then((data) => {
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
    cy.screenshot(screenshotFolder + (++i))

    cy.get('*[class^=dhx_item--success-mark]').should('be.visible')
    cy.screenshot(screenshotFolder + (++i))

    cy.get('#ok').click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('*[id^=ui-id]').contains('Attachment Details').should('be.visible')
    cy.screenshot(screenshotFolder + (++i))

    cy.get('@onlyFileNameWithExt').then((data) => {
      const splitFileName = data.split(".")
      let file = splitFileName[0]
      let ext = splitFileName[1]
      cy.wrap(file).as('fileNameWithoutExt')
      cy.wrap(ext).as('fileExt')
      cy.get('#file_title').invoke('val').should('contain', file)
      cy.get('#filename').invoke('text').should('contain', file + '.' + ext)
    })
    cy.get('#esr_attach_button').click()
    cy.screenshot(screenshotFolder + (++i))

    cy.get('@fileNameWithoutExt').then((data) => {
      cy.get('[axes="DOCUMENT_TITLE"]').contains(data).should('be.visible')
      cy.get('@fileExt').then((extData) => {
        cy.get('[data-internal-ref] > [axes="DOCUMENT_TITLE"]').contains(data).eq(0).parent()
          .siblings('[axes="FILE_EXT"]').invoke('text')
          .should('contain', extData)

      })
      cy.screenshot(screenshotFolder + (++i))
      cy.get('[axes="DOCUMENT_TITLE"]').contains(data).eq(0).parent()
        .siblings('[axes="SAVED_DATE"]').invoke('text')
        .should('contain', new Date().toLocaleDateString('en-GB'))
    })
    cy.screenshot(screenshotFolder + (++i))
    cy.get('#esr_close_button').click()
  })

  //Test case #9
  it.only('Help Screen', () => {
    const screenshotFolder = 'Postchecks/RunOn'+new Date().toLocaleDateString('en-GB').replaceAll('/','')
    +'/'+'Hour '+new Date().getHours()+'/Help Screen/'
    const username = testData.username
    const password = testData.password
    cy.login(username, password, screenshotFolder)
    let i = 2
    cy.window().then((win) => {
      const orig = win.open
      win.open = function (url, target, features) {
        return orig.call(this, url, '_self', features)
      }
    })
    cy.get('[aria-label=Help]').should('be.visible').click()
    cy.screenshot(screenshotFolder + (++i))

    cy.url().then((url) => {
      cy.log('Current URL is: ' + url)
    })
    cy.url().should('eq', "https://uat-v2.pecuniam-online.co.uk/" + testData.tenant + "/help/int/webhelp/int.htm")
    cy.screenshot(screenshotFolder + (++i))
  })
})