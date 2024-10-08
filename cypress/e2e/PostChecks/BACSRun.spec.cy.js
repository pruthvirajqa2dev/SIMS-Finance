/* eslint-disable no-undef */
import testData from "../../fixtures/example.json";
import "cypress-if";
describe("Postchecks TC9 onwards", () => {
    let logs = []; // Temporary store for logs
    beforeEach(() => {
        // cy.setResolution([2560, 1440]);
        cy.viewport("macbook-13");
        cy.visit("/");
    });

    //Handling uncaught exceptions to avoid false errors
    Cypress.on("uncaught:exception", (err) => {
        // returning false here prevents Cypress from
        // failing the test
        cy.log(err);
        return false;
    });
    Cypress.on("log:added", (log) => {
        console.log("Added log:" + logs);
        // Instead of calling cy.task directly, store logs
        logs.push({
            name: log.displayName,
            message: log.message
        });
    });

    afterEach(() => {
        // After each test, send the stored logs to Allure via cy.task()
        cy.task("allure:logBatch", logs).then(() => {
            logs.forEach((log) => {
                cy.allure().attachment(
                    log.displayName,
                    log.message,
                    "text/plain"
                );
            });
        }); // Sending all logs at once
        logs = []; // Reset logs after sending
    });
    var screenshotCount;

    it.only("BACS Run", () => {
        const chequeOrBacs = testData.BACS;
        const screenshotFolder =
            chequeOrBacs +
            " Run/RunOn" +
            new Date().toLocaleDateString("en-GB").replaceAll("/", "") +
            "/" +
            "Hour " +
            new Date().getHours() +
            "/" +
            +new Date().getHours() +
            "-" +
            +new Date().getMinutes() +
            "-" +
            "Seconds " +
            new Date().getSeconds();
        const username = testData.username;
        const password = testData.password;
        var screen = testData.PRL614Q;
        cy.login(username, password, screenshotFolder);
        //Click Hamburger
        cy.log("Click on Hamburger");
        cy.get("#banner_navigation_navigate").should("be.visible").click();
        cy.screenshot(screenshotFolder);
        //Click on the text box in Quick launch
        cy.log("Type screen in the text box");
        cy.get(".quick-lunch")
            .eq(1)
            .find("#esr_launch_text")
            .clear()
            .type(`${screen}`);

        //Click on the menu item displayed
        cy.log("Click on the menu item displayed");
        cy.get(".ui-menu-item").contains(screen).click();
        cy.screenshot(screenshotFolder);
        cy.get('[axes="STATUS"]')
            .contains("Entered/Not Confirmed")
            .if()
            .parent()
            .parent()
            .find("#esr_action")
            .find(".multibutton_content > a")
            .click()
            .then(() => {
                cy.get(".ui-menu-item").contains("Cancel BACS Run").click();
                cy.get("*[id^=ui-id]")
                    .contains("BACS Processing")
                    .should("exist");
                cy.get("*[id$=PRL614Q0_esr_prompt] > div")
                    .invoke("text")
                    .should(
                        "contain",
                        "This will cancel the current BACS run for School ID " +
                            testData.schoolId
                    );
                cy.get("#esr_messagebox_ok").click();
                cy.get("#processing_controls", { timeout: 1000000 })
                    .contains("Processing: Processing Complete", {
                        timeout: 1000000
                    })
                    .should("be.visible");
                //
            });

        cy.get('[axes="STATUS"]')
            .contains("Entered/Not Confirmed")
            .should("not.exist");
        cy.task("newestFileName", "./Test Data/" + chequeOrBacs + "*.TXT").then(
            (fileName) => {
                cy.log("filename" + fileName);
                cy.readFile(fileName).then((content) => {
                    cy.log("Content" + content.split(","));
                    const suppWithBACS = content.split(",");
                    cy.log("Arr:" + suppWithBACS.length);
                    cy.wrap(suppWithBACS).as("listOfSuppliers");
                    expect(suppWithBACS.length).to.not.be.equal(0);
                    cy.log(
                        "Total number of suppliers with BACS Payment Method =" +
                            suppWithBACS.length
                    );
                    var screen = testData.PRL300Q;
                    screenshotCount = 2;
                    cy.wrap(screenshotCount).as("screenshotCount");
                    for (let i = 3; i < 6; i++) {
                        let costCentreArr = [
                            "ESFA Grants",
                            "Pupil Premium",
                            "NCTL Grants",
                            "LA Grants",
                            "Catering",
                            "Lettings",
                            "Music Lessons",
                            "Services of Staff",
                            "Donations",
                            "Capital Funding"
                        ];
                        const costCentre =
                            costCentreArr[
                                Math.floor(Math.random() * costCentreArr.length)
                            ];
                        //############Invoice calculation START #################################
                        let quantArr = [
                            1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 9.1
                        ];
                        const quantity = String(
                            quantArr[
                                Math.floor(Math.random() * quantArr.length)
                            ].toFixed(2)
                        );
                        cy.log("Quantity: " + quantity);
                        let unitPriceArr = [
                            120.12, 230.23, 340.34, 450.45, 560.56, 670.67,
                            780.78
                        ];
                        const unitprice = String(
                            unitPriceArr[
                                Math.floor(Math.random() * unitPriceArr.length)
                            ].toFixed(2)
                        );
                        cy.log("Unit price: " + unitprice);
                        let vatCodeArr = ["EXM", "NON", "RED", "STD", "ZER"];
                        const vatCode =
                            vatCodeArr[
                                Math.floor(Math.random() * vatCodeArr.length)
                            ];
                        cy.log("VAT Code: " + vatCode.toString());
                        var vatPercent;
                        switch (vatCode.toString()) {
                            case "EXM":
                            case "NON":
                            case "ZER":
                                vatPercent = 0;
                                break;
                            case "RED":
                                vatPercent = 5;
                                break;
                            case "STD":
                                vatPercent = 20;
                                break;
                            default:
                                vatPercent = undefined;
                                break;
                        }
                        cy.log("Vat Percent: " + vatPercent);
                        let netInvoice =
                            Math.round(quantity * unitprice * 100) / 100;
                        cy.log("Net Invoice: " + netInvoice);
                        const vatAmount =
                            Math.round(
                                ((netInvoice * vatPercent) / 100) * 100
                            ) / 100;
                        cy.log("VAT Amount: " + vatAmount);

                        const totalInvoiceValue =
                            Math.round((netInvoice + vatAmount) * 100) / 100;
                        cy.log("Total Invoice: " + totalInvoiceValue);
                        //############Invoice calculation END #################################

                        cy.log(
                            "Adding invoice for Supplier:" + suppWithBACS[i]
                        );
                        //Click Hamburger
                        cy.log("Click on Hamburger");
                        cy.get("#banner_navigation_navigate")
                            .should("be.visible")
                            .click();

                        //Click on the text box in Quick launch
                        cy.log("Type screen in the text box");
                        cy.get(".quick-lunch")
                            .eq(1)
                            .find("#esr_launch_text")
                            .clear()
                            .type(`${screen}`);
                        cy.screenshot(screenshotFolder);

                        //Click on the menu item displayed
                        cy.log("Click on the menu item displayed");
                        cy.get(".ui-menu-item").contains(screen).click();
                        cy.screenshot(screenshotFolder);

                        //Select school
                        cy.selectUsingSearchIcon(
                            "company_id",
                            testData.schoolId
                        );

                        cy.log("************PRL300Q screen**************");
                        cy.log("Click on search button");

                        cy.get("#search_button").click();

                        //New Button
                        cy.log("Click in new button(with dropdown)");
                        cy.get(".multibutton_content")
                            .find('.esr_multibutton:contains("New")')
                            .eq(0)
                            .click();
                        cy.screenshot(screenshotFolder);

                        if (
                            testData.invoiceType == "Non Purchase Order Invoice"
                        ) {
                            cy.get("#invoice_type2")
                                .check()
                                .should("be.checked");
                        } else {
                            cy.get("#invoice_type2")
                                .check()
                                .should("be.checked");
                        }

                        cy.get("#select_button").click();

                        cy.get(".esr_breadcrumb_selected").contains(
                            "Non Purchase Order Details"
                        );

                        cy.get("#supplier_icon").click();
                        cy.get('[axes="SUPP_NAME"]')
                            .contains(suppWithBACS[i])
                            .parent()
                            .parent()
                            .contains("Select")
                            .click();

                        cy.get('[for="supplier"]')
                            .eq(1)
                            .should("have.text", suppWithBACS[i]);
                        cy.get("#doc_date").type(testData.invoiceDate);

                        cy.get('[for="authority_code"]').eq(0).click();

                        cy.get(".ui-pnotify-text").should(
                            "contain",
                            testData.period
                        );
                        cy.get("#tot_value").type(totalInvoiceValue);
                        cy.get("#tot_vat").type(vatAmount);

                        //Add unique invoice refernce
                        const timestamp = String(
                            "" +
                                new Date().getDate() +
                                new Date().getMonth() +
                                new Date().getHours() +
                                new Date().getMinutes() +
                                new Date().getSeconds()
                        );
                        const supplierInvoiceRef = "INV" + timestamp;
                        cy.wrap(supplierInvoiceRef).as("invoiceRef" + i);
                        cy.get("#supp_own_ref").type(supplierInvoiceRef);

                        //***Add line
                        cy.log("Add line");
                        cy.get(".multibutton_content > .esr_hover")
                            .contains("Add")
                            .click();

                        //Dialog title verification
                        cy.log("Dialog title verification");
                        cy.get(".ui-dialog-title").should(
                            "contain",
                            "Invoice/Credit Note"
                        );

                        cy.get("#narr_desc").type("Description" + timestamp);

                        //GL Code
                        cy.log("GL Code");
                        cy.selectCostCentre(costCentre);
                        cy.selectFirstLedgerCodeAndFundCode();

                        cy.get("#line_quantity").type(quantity);
                        cy.get("#unit_price").type(unitprice);
                        cy.get("*[id^=ui-id]")
                            .contains("Invoice/Credit Note")
                            .click();

                        cy.get("#vat_code_icon").click();

                        cy.get('[axes="VACODE"] > div')
                            .contains(vatCode)
                            .parent()
                            .parent()
                            .find("#esr_action")
                            .click();

                        cy.get("*[id^=ui-id]")
                            .contains("Invoice/Credit Note")
                            .click();

                        cy.get("#vat_value")
                            .invoke("val")
                            .then((text) => {
                                expect(
                                    String(
                                        text != 0
                                            ? text.toLocaleString({
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2
                                              })
                                            : "0.00"
                                    ),
                                    "Compare VAT value"
                                ).to.be.eq(
                                    String(
                                        vatAmount != 0
                                            ? vatAmount.toLocaleString({
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2
                                              })
                                            : "0.00"
                                    )
                                );
                            });
                        cy.get("#vat_value")
                            .invoke("val")
                            .should(
                                "eq",
                                vatAmount != 0
                                    ? vatAmount.toLocaleString({
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2
                                      })
                                    : "0.00"
                            );

                        // cy.get("#total_line_value")
                        //     .invoke("val")
                        //     .should(
                        //         "eq",
                        //         totalInvoiceValue.toFixed(2).toString()
                        //     );

                        cy.get('[data-originalvalue="Save"]').click();
                        cy.get('[axes="LINE_QUANTITY"] > div')
                            .invoke("text")
                            .then(parseFloat)
                            .as("quantAlias");

                        cy.get('[axes="UNIT_PRICE"] > div')
                            .invoke("text")
                            .then(parseFloat)
                            .as("unitPriceAlias");

                        cy.then(function () {
                            expect(
                                this.quantAlias.toFixed(2),
                                "Compare quantity"
                            ).to.be.eq(quantity);
                            expect(
                                this.unitPriceAlias.toFixed(2),
                                "Compare unit price"
                            ).to.be.eq(unitprice);
                        });
                        // cy.get('[axes="VAT_EXCLUSIVE"] > div')
                        //     .invoke("text")
                        //     .then(parseFloat)
                        //     .as("netInvoiceAlias");
                        // cy.then(function () {
                        //     expect(
                        //         this.netInvoiceAlias.toFixed(2),
                        //         "Compare net invoice value"
                        //     ).to.be.eq(String(netInvoice.toLocaleString()));
                        // });
                        cy.get('[axes="VAT_CODE"] > div')
                            .invoke("text")
                            .should("contain", vatCode);
                        cy.get('[axes="VAT_VALUE"] > div')
                            .invoke("text")
                            .as("vatAmountAlias");

                        cy.then(function () {
                            expect(
                                String(
                                    this.vatAmountAlias != 0
                                        ? this.vatAmountAlias.toLocaleString({
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2
                                          })
                                        : "0.00"
                                ),
                                "Compare VAT value"
                            ).to.be.eq(
                                String(
                                    vatAmount != 0
                                        ? vatAmount.toLocaleString({
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2
                                          })
                                        : "0.00"
                                )
                            );
                        });
                        cy.screenshot(screenshotFolder);

                        cy.get('[data-originalvalue="Finish & Save"]').click();

                        cy.log("Handling the dialog for ");
                        cy.get("*[id$=esr_mb_PRL300Q0_esr_prompt] > div", {
                            timeout: 10000
                        })
                            .if()
                            .invoke("text")
                            .should(
                                "contain",
                                "The Net Total for all Matched Lines"
                            );
                        cy.get("#esr_messagebox_ok", { timeout: 10000 })
                            .if()
                            .click();
                        cy.get('[axes="VAT_EXCLUSIVE"] > div', {
                            timeout: 10000
                        })
                            .if()
                            .invoke("text")
                            .then((text) => {
                                cy.get("#tot_value").type(text);
                                cy.get(
                                    '[data-originalvalue="Finish & Save"]'
                                ).click();
                            });
                        cy.get("*[id*=summary_details]").should("be.visible");
                        // cy.get("#tot_value")
                        //     .invoke("text")
                        //     .then(parseFloat)
                        //     .as("totalValAlias");
                        cy.get("#tot_vat")
                            .invoke("text")
                            .then(parseFloat)
                            .as("totalVatAlias");

                        cy.then(function () {
                            // expect(
                            //     this.totalValAlias.toFixed(2),
                            //     "Validate invoice value"
                            // ).to.be.eq(String(totalInvoiceValue.toLocaleString()));
                            expect(
                                this.totalVatAlias.toFixed(2),
                                "Validate VAT"
                            ).to.be.eq(
                                String(
                                    vatAmount != 0
                                        ? vatAmount.toLocaleString({
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2
                                          })
                                        : "0.00"
                                )
                            );
                        });
                        cy.screenshot(screenshotFolder);

                        cy.get("#ok_button").click();
                    }
                });
            }
        );
        screen = testData.PRL614Q;
        //Click Hamburger
        cy.log("Click on Hamburger");
        cy.get("#banner_navigation_navigate").should("be.visible").click();

        //Click on the text box in Quick launch
        cy.log("Type screen in the text box");
        cy.get(".quick-lunch")
            .eq(1)
            .find("#esr_launch_text")
            .clear()
            .type(`${screen}`);

        //Click on the menu item displayed
        cy.log("Click on the menu item displayed");
        cy.get(".ui-menu-item").contains(screen).click();

        cy.log("Click on new button");
        cy.get(".multibutton_content")
            .find('.esr_multibutton:contains("New")')
            .eq(0)
            .click();
        cy.screenshot(screenshotFolder);

        cy.log("Select School Id");
        cy.selectUsingSearchIcon("company_id", testData.schoolId);

        const narrative =
            "TestNarrBACSRun" + new Date().getHours() + new Date().getMinutes();
        cy.get("#run_narr").type(narrative);
        cy.get("#refresh").dblclick();
        // cy.get("#refresh").click();

        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");
        cy.get("#processing_controls").contains("Pending").should("be.visible");
        cy.get('[axes="SUPP_NAME"] > div', { timeout: 150000 }).should(
            "be.visible"
        );

        //Assert invoice reference
        // cy.get('[axes="SUPP_REF"] > div')
        //     .invoke("text")
        //     .should("contain", new Date().getDate())
        //     .should("contain", new Date().getDate())
        //     .should("contain", new Date().getMonth());

        cy.log("Check all invoices");
        cy.get("*[id^=esr_grid_column_row_check_all]").check();
        cy.screenshot(screenshotFolder);

        cy.log("Click next");
        cy.get("#next_button").click();
        const alertTitle = "Record Selection";
        cy.log("Dialog box for negative ");
        cy.get("*[id^=ui-id]").contains(alertTitle).should("be.visible");

        cy.get("*[id$=PRL614Q0_esr_prompt] > div")
            .invoke("text")
            .should(
                "contain",
                "New Balance will be negative. Do you want to continue?"
            );
        cy.screenshot(screenshotFolder);

        cy.get("#esr_messagebox_yes").click();

        cy.log("Dialog box for payment run");
        cy.get("*[id^=ui-id]").contains(alertTitle).should("be.visible");

        cy.get("*[id$=PRL614Q1_esr_prompt] > div")
            .invoke("text")
            .should(
                "contain",
                "Payment run must be confirmed on same date as entered."
            );

        cy.screenshot(screenshotFolder);
        cy.get("#esr_messagebox_ok").click();

        cy.get("#INV_CRN_STEP").should("be.visible");

        //Assert Supplier name
        cy.get("@listOfSuppliers").then((data) => {
            cy.get('[axes="SUPP_NAME"] > div')
                .invoke("text")
                .should("contain", data[3]);
        });
        cy.log("Click print report button");
        cy.get("#print_report").click();
        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");

        cy.get("#spc_rep_0", { timeout: 200000 })
            .invoke("text")
            .should("contain", "Audit")
            .should("contain", "Summary");
        cy.wait(5000);
        cy.get("#spc_rep_0").click();
        cy.get("#spc_rep_1", { timeout: 150000 })
            .invoke("text")
            .should("contain", "Audit")
            .should("contain", "Detailed");
        cy.wait(5000);
        cy.get("#spc_rep_1").click();
        cy.screenshot(screenshotFolder);

        cy.task("newestFileName", "./Test Data/" + chequeOrBacs + "*.TXT").then(
            (fileName) => {
                cy.log("filename" + fileName);
                cy.readFile(fileName).then((content) => {
                    cy.log("Content:" + content);
                    const suppWithBACS = content.split(",");
                    cy.log("Arr:" + suppWithBACS.length);
                    cy.task(
                        "newestFileName",
                        "./cypress/downloads/PRLBACS_AUDIT*.PDF"
                    ).then((fileName) => {
                        cy.log("Newest unzipped PDF:" + fileName);
                        cy.task("readPdf", fileName).then(function (data) {
                            // cy.log("Text: " + data.text);
                            cy.wrap(
                                data.text.replaceAll(/(\r\n|\n|\r)/gm, "")
                            ).as("PDFdata");
                            cy.get("@PDFdata")
                                .should("contain", suppWithBACS[3], {
                                    message:
                                        "First supplier failed after clicking print report"
                                })
                                .should("contain", suppWithBACS[4], {
                                    message:
                                        "Second supplier failed after clicking print report"
                                })
                                .should("contain", suppWithBACS[5], {
                                    message:
                                        "Third supplier failed after clicking print report"
                                });
                        });
                    });
                });
            }
        );
        cy.get("#save_all", { timeout: 150000 }).click();
        cy.screenshot(screenshotFolder);

        cy.get("#yes_button").click();
        cy.task("newestFileName", "./Test Data/" + chequeOrBacs + "*.TXT").then(
            (fileName) => {
                cy.log("filename" + fileName);
                cy.readFile(fileName).then((content) => {
                    cy.log("Content:" + content);
                    const suppWithBACS = content.split(",");
                    cy.log("Arr:" + suppWithBACS.length);
                    const fileExt = ".zip";
                    cy.task(
                        "newestFileName",
                        "./cypress/downloads/PRL610Q*" + fileExt
                    ).then((data) => {
                        cy.log("Newest zip file:" + data);
                        cy.task("unzipFile", data);
                        cy.task(
                            "newestFileName",
                            "./cypress/downloads/unzip*/PRLBACS_AUDIT*.PDF"
                        ).then((fileName) => {
                            cy.log("Newest unzipped PDF:" + fileName);
                            cy.task("readPdf", fileName).then(function (data) {
                                // cy.log("Text: " + data.text);
                                // const text = data.text.replace("\n", "");
                                // cy.log("Text is:" + text);
                                cy.wrap(
                                    data.text.replaceAll(/(\r\n|\n|\r)/gm, "")
                                ).as("PDFdata");
                                cy.get("@PDFdata")
                                    .should("contain", suppWithBACS[3], {
                                        message:
                                            "First supplier failed after clicking save all"
                                    })
                                    .should("contain", suppWithBACS[4], {
                                        message:
                                            "Second supplier failed after clicking save all"
                                    })
                                    .should("contain", suppWithBACS[5], {
                                        message:
                                            "Third supplier failed after clicking save all"
                                    });
                            });
                        });
                    });
                });
            }
        );
        cy.log("Click Create BACs file button");
        cy.get("#print_cheques_button").click();
        cy.screenshot(screenshotFolder);

        cy.get("#esr_messagebox_yes").click();
        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");

        cy.log("Click Download button");
        cy.screenshot(screenshotFolder);

        cy.get("#dnload_button", { timeout: 400000 }).click();
        cy.log("Click Yes button");
        cy.get("#yes_button").click();

        cy.get("*[id$=PRL614Q3_esr_prompt] > div", { timeout: 200000 })
            .invoke("text")
            .should("contain", "Payment run confirmed.");
        cy.screenshot(screenshotFolder);

        cy.log("Click Ok button");
        cy.get("#esr_messagebox_ok").click();

        cy.get("#spc_rep_0", { timeout: 200000 })
            .invoke("text")
            .should("contain", "Audit")
            .should("contain", "Summary");
        cy.wait(5000);
        cy.get("#spc_rep_0").click();
        cy.get("#spc_rep_1", { timeout: 150000 })
            .invoke("text")
            .should("contain", "Audit")
            .should("contain", "Detailed");
        cy.wait(5000);
        cy.get("#spc_rep_1").click();
        cy.screenshot(screenshotFolder);

        cy.task("newestFileName", "./Test Data/" + chequeOrBacs + "*.TXT").then(
            (fileName) => {
                cy.log("filename" + fileName);
                cy.readFile(fileName).then((content) => {
                    cy.log("Content:" + content);
                    const suppWithBACS = content.split(",");
                    cy.log("Arr:" + suppWithBACS.length);
                    cy.task(
                        "newestFileName",
                        "./cypress/downloads/PRLBACS_AUDIT*.PDF"
                    ).then((fileName) => {
                        cy.log("Newest unzipped PDF:" + fileName);
                        cy.task("readPdf", fileName).then(function (data) {
                            // cy.log("Text: " + data.text);
                            cy.wrap(
                                data.text.replaceAll(/(\r\n|\n|\r)/gm, "")
                            ).as("PDFdata");
                            cy.get("@PDFdata")
                                .should("contain", suppWithBACS[3], {
                                    message:
                                        "First supplier failed after downloading individual report"
                                })
                                .should("contain", suppWithBACS[4], {
                                    message:
                                        "Second supplier failed after downloading individual report"
                                })
                                .should("contain", suppWithBACS[5], {
                                    message:
                                        "Third supplier failed after downloading individual report"
                                });
                        });
                    });
                });
            }
        );
        cy.screenshot(screenshotFolder);
        cy.get("#yes_button").click();
        screen = testData.PRL614Q;
        //Click Hamburger
        cy.log("Click on Hamburger");
        cy.get("#banner_navigation_navigate").should("be.visible").click();

        //Click on the text box in Quick launch
        cy.log("Type screen in the text box");
        cy.get(".quick-lunch")
            .eq(1)
            .find("#esr_launch_text")
            .clear()
            .type(`${screen}`);
        cy.screenshot(screenshotFolder);

        //Click on the menu item displayed
        cy.log("Click on the menu item displayed");
        cy.get(".ui-menu-item").contains(screen).click();
        cy.get('[axes="RUN_NARR"]')
            .contains(narrative)
            .parent()
            .parent()
            .find('[axes="STATUS"]')
            .invoke("text")
            .should("contain", "Confirmed");
        cy.screenshot(screenshotFolder);
    });
    it("test", () => {
        const vatValue = "1,020.22";

        cy.log(
            vatValue.toLocaleString({
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        );

        // const quantity = 1; // String(quantArr[Math.floor(Math.random() * quantArr.length)])
        // cy.log("Quantity: " + quantity);
        // const unitprice = 111.1; // String(unitPriceArr[Math.floor(Math.random() * unitPriceArr.length)])
        // cy.log("Unit price: " + unitprice.toFixed(2));
        // const vatCode = "RED"; // vatCodeArr[Math.floor(Math.random() * vatCodeArr.length)]
        // cy.log("VAT Code: " + vatCode.toString());
        // var vatPercent;
        // switch (vatCode.toString()) {
        //     case "EXM":
        //     case "NON":
        //     case "ZER":
        //         vatPercent = 0;
        //         break;
        //     case "RED":
        //         vatPercent = 5;
        //         break;
        //     case "STD":
        //         vatPercent = 20;
        //         break;
        //     default:
        //         vatPercent = undefined;
        //         break;
        // }
        // cy.log("Vat Percent: " + vatPercent);
        // let netInvoice = Math.round(quantity * unitprice * 100) / 100;
        // cy.log("Net Invoice: " + netInvoice.toFixed(2));
        // const vatAmount =
        //     Math.round(((netInvoice * vatPercent) / 100) * 100) / 100;
        // cy.log("VAT Amount: " + vatAmount.toFixed(2));

        // const totalInvoiceValue =
        //     Math.round((netInvoice + vatAmount) * 100) / 100;
        // cy.log("Total Invoice: " + totalInvoiceValue.toFixed(2));
    });
    it("PRL614Q - BACS Processing", () => {
        const username = testData.username;
        const password = testData.password;
        var screen = testData.PRL614Q;
        const chequeOrBacs = testData.BACS;
        cy.login(username, password, screenshotFolder);
        //Click Hamburger
        cy.log("Click on Hamburger");
        cy.get("#banner_navigation_navigate").should("be.visible").click();

        //Click on the text box in Quick launch
        cy.log("Type screen in the text box");
        cy.get(".quick-lunch")
            .eq(1)
            .find("#esr_launch_text")
            .clear()
            .type(`${screen}`);

        //Click on the menu item displayed
        cy.log("Click on the menu item displayed");
        cy.get(".ui-menu-item").contains(screen).click();

        cy.log("Click on new button");
        cy.get(".multibutton_content")
            .find('.esr_multibutton:contains("New")')
            .eq(0)
            .click();
        cy.log("Select School Id");
        cy.selectUsingSearchIcon("company_id", testData.schoolId);

        const narrative =
            "TestNarrBACSRun" + new Date().getHours() + new Date().getMinutes();
        cy.get("#run_narr").type(narrative);
        cy.get("#refresh").dblclick();
        // cy.get("#refresh").click();

        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");
        cy.get("#processing_controls").contains("Pending").should("be.visible");
        cy.get('[axes="SUPP_NAME"] > div', { timeout: 150000 }).should(
            "be.visible"
        );
        //Assert invoice reference
        // cy.get('[axes="SUPP_REF"] > div')
        //     .invoke("text")
        //     .should("contain", new Date().getDate())
        //     .should("contain", new Date().getDate())
        //     .should("contain", new Date().getMonth());

        cy.log("Check all invoices");
        cy.get("*[id^=esr_grid_column_row_check_all]").check();

        cy.log("Click next");
        cy.get("#next_button").click();
        const alertTitle = "Record Selection";
        cy.log("Dialog box for negative ");
        cy.get("*[id^=ui-id]").contains(alertTitle).should("be.visible");

        cy.get("*[id$=PRL614Q0_esr_prompt] > div")
            .invoke("text")
            .should(
                "contain",
                "New Balance will be negative. Do you want to continue?"
            );

        cy.get("#esr_messagebox_yes").click();

        cy.log("Dialog box for payment run");
        cy.get("*[id^=ui-id]").contains(alertTitle).should("be.visible");

        cy.get("*[id$=PRL614Q1_esr_prompt] > div")
            .invoke("text")
            .should(
                "contain",
                "Payment run must be confirmed on same date as entered."
            );

        cy.get("#esr_messagebox_ok").click();

        cy.get("#INV_CRN_STEP").should("be.visible");

        //Assert Supplier name
        cy.get('[axes="SUPP_NAME"] > div')
            .invoke("text")
            .should("contain", "YPO");

        cy.get("#print_report").click();
        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");

        cy.get("#spc_rep_0", { timeout: 200000 })
            .invoke("text")
            .should("contain", "Audit")
            .should("contain", "Summary");
        cy.wait(15000);
        cy.get("#spc_rep_0").click();
        cy.get("#spc_rep_1", { timeout: 150000 })
            .invoke("text")
            .should("contain", "Audit")
            .should("contain", "Detailed");
        cy.wait(15000);
        cy.get("#spc_rep_1").click();
        cy.task("newestFileName", "./Test Data/" + chequeOrBacs + "*.TXT").then(
            (fileName) => {
                cy.log("filename" + fileName);
                cy.readFile(fileName).then((content) => {
                    cy.log("Content:" + content);
                    const suppWithBACS = content.split(",");
                    cy.log("Arr:" + suppWithBACS.length);
                    cy.task(
                        "newestFileName",
                        "./cypress/downloads/PRLBACS_AUDIT*.PDF"
                    ).then((fileName) => {
                        cy.log("Newest unzipped PDF:" + fileName);
                        cy.task("readPdf", fileName).then(function (data) {
                            // cy.log("Text: " + data.text);
                            cy.wrap(
                                data.text.replaceAll(/(\r\n|\n|\r)/gm, "")
                            ).as("PDFdata");
                            cy.get("@PDFdata")
                                .should("contain", suppWithBACS[0])
                                .should("contain", suppWithBACS[1])
                                .should("contain", suppWithBACS[2]);
                        });
                    });
                });
            }
        );
        cy.get("#save_all", { timeout: 150000 }).click();
        cy.get("#yes_button").click();
        cy.task("newestFileName", "./Test Data/" + chequeOrBacs + "*.TXT").then(
            (fileName) => {
                cy.log("filename" + fileName);
                cy.readFile(fileName).then((content) => {
                    cy.log("Content:" + content);
                    const suppWithBACS = content.split(",");
                    cy.log("Arr:" + suppWithBACS.length);
                    const fileExt = ".zip";
                    cy.task(
                        "newestFileName",
                        "./cypress/downloads/PRL610Q*" + fileExt
                    ).then((data) => {
                        cy.log("Newest zip file:" + data);
                        cy.task("unzipFile", data);
                        cy.task(
                            "newestFileName",
                            "./cypress/downloads/unzip*/PRLBACS_AUDIT*.PDF"
                        ).then((fileName) => {
                            cy.log("Newest unzipped PDF:" + fileName);
                            cy.task("readPdf", fileName).then(function (data) {
                                // cy.log("Text: " + data.text);
                                cy.wrap(
                                    data.text.replaceAll(/(\r\n|\n|\r)/gm, "")
                                ).as("PDFdata");
                                cy.get("@PDFdata")
                                    .should("contain", suppWithBACS[0])
                                    .should("contain", suppWithBACS[1])
                                    .should("contain", suppWithBACS[2]);
                            });
                        });
                    });
                });
            }
        );
        cy.get("#print_cheques_button").click();
        cy.get("#esr_messagebox_yes").click();
        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");

        cy.get("#dnload_button", { timeout: 400000 }).click();

        cy.get("#yes_button").click();

        screen = testData.PRL610Q;
        //Click Hamburger
        cy.log("Click on Hamburger");
        cy.get("#banner_navigation_navigate").should("be.visible").click();

        //Click on the text box in Quick launch
        cy.log("Type screen in the text box");
        cy.get(".quick-lunch")
            .eq(1)
            .find("#esr_launch_text")
            .clear()
            .type(`${screen}`);

        //Click on the menu item displayed
        cy.log("Click on the menu item displayed");
        cy.get(".ui-menu-item").contains(screen).click();
        cy.get('[axes="RUN_NARR"]')
            .contains(narrative)
            .parent()
            .parent()
            .find(".multibutton_content > a")
            .click();

        cy.get("#next_button").click();
    });
});
