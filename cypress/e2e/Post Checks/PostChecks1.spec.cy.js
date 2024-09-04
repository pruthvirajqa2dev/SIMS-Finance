/* eslint-disable no-undef */
import testData from "../../fixtures/example.json";
describe("Postchecks TC9 onwards", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    //Handling uncaught exceptions to avoid false errors
    Cypress.on("uncaught:exception", (err) => {
        // returning false here prevents Cypress from
        // failing the test
        console.log(err);
        return false;
    });

    //Test case #11
    it.only("Cheque Run", () => {
        const username = testData.username;
        const password = testData.password;
        var screen = testData.PRL210;
        cy.log("Step 1");

        cy.login(username, password);
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

        cy.log("Step 2");
        const mapOfSuppliers = new Map();
        function addValueToKey(key, value) {
            if (!mapOfSuppliers.has(key)) {
                mapOfSuppliers.set(key, []);
            }
            mapOfSuppliers.get(key).push(value);
            cy.log("Key-value- " + key + ":" + mapOfSuppliers.get(key));
        }
        cy.log("Step 3");
        let count = 0;
        cy.get('[data-internal-ref] > [axes="SUPPLIER"]').then((suppliers) => {
            let supplierCount = suppliers.length;
            cy.log("Total Supplier Count=" + supplierCount);

            if (supplierCount === 1) {
                return 0;
            }
            let suppChq = 0;
            for (let i = 0; i < supplierCount; i++) {
                cy.get('[data-internal-ref] > [axes="SUPPLIER"]')
                    .eq(i)
                    .dblclick();
                cy.get(
                    'span[data-control_type="TABCARD"]:contains("Contact Details")'
                ).click();
                cy.get("#supp_name")
                    .invoke("val")
                    .then((supplierName) => {
                        cy.get(
                            'span[data-control_type="TABCARD"]:contains("Payment Details")'
                        ).click();

                        cy.get("#pay_method_0")
                            .invoke("val")
                            .then((paymentMethod) => {
                                if (paymentMethod.trim() === "CHQ") {
                                    addValueToKey(
                                        paymentMethod.trim(),
                                        supplierName
                                    );
                                    count++;
                                }
                                cy.get("#cancel_button").click();
                                suppChq = (
                                    "" + Array.from(mapOfSuppliers.values())
                                ).split(",");
                                cy.wrap(suppChq).as("listOfSuppliers");
                                cy.log("Suppliers: " + suppChq);
                                if (count === 2) {
                                    return 0;
                                }
                            });
                    });
            }
        });
        cy.log("Step 4");
        cy.get("@listOfSuppliers").then((suppWithCHQ) => {
            cy.log(
                "Total number of suppliers with CHQ Payment Method =" +
                    suppWithCHQ.length
            );
            const screen = testData.PRL300Q;
            for (let i = 0; i < 3; i++) {
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
                let quantArr = [1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 9.1];
                const quantity = String(
                    quantArr[
                        Math.floor(Math.random() * quantArr.length)
                    ].toFixed(2)
                );
                cy.log("Quantity: " + quantity);
                let unitPriceArr = [
                    120.12, 230.23, 340.34, 450.45, 560.56, 670.67, 780.78
                ];
                const unitprice = String(
                    unitPriceArr[
                        Math.floor(Math.random() * unitPriceArr.length)
                    ].toFixed(2)
                );
                cy.log("Unit price: " + unitprice);
                let vatCodeArr = ["EXM", "NON", "RED", "STD", "ZER"];
                const vatCode =
                    vatCodeArr[Math.floor(Math.random() * vatCodeArr.length)];
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
                let netInvoice = Math.round(quantity * unitprice * 100) / 100;
                cy.log("Net Invoice: " + netInvoice);
                const vatAmount =
                    Math.round(((netInvoice * vatPercent) / 100) * 100) / 100;
                cy.log("VAT Amount: " + vatAmount);

                const totalInvoiceValue =
                    Math.round((netInvoice + vatAmount) * 100) / 100;
                cy.log("Total Invoice: " + totalInvoiceValue);
                //############Invoice calculation END #################################

                cy.log("Adding invoice for Supplier:" + suppWithCHQ[i]);
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

                //Click on the menu item displayed
                cy.log("Click on the menu item displayed");
                cy.get(".ui-menu-item").contains(screen).click();

                //Select school
                cy.selectUsingSearchIcon("company_id", testData.schoolId);

                cy.log("************PRL300Q screen**************");
                cy.log("Click on search button");

                cy.get("#search_button").click();

                //New Button
                cy.log("Click in new button(with dropdown)");
                cy.get(".multibutton_content")
                    .find('.esr_multibutton:contains("New")')
                    .eq(0)
                    .click();

                if (testData.invoiceType == "Non Purchase Order Invoice") {
                    cy.get("#invoice_type2").check().should("be.checked");
                } else {
                    cy.get("#invoice_type2").check().should("be.checked");
                }

                cy.get("#select_button").click();

                cy.get(".esr_breadcrumb_selected").contains(
                    "Non Purchase Order Details"
                );

                cy.get("#supplier_icon").click();
                cy.get('[axes="SUPP_NAME"]')
                    .contains(suppWithCHQ[i])
                    .parent()
                    .parent()
                    .contains("Select")
                    .click();

                cy.get('[for="supplier"]')
                    .eq(1)
                    .should("have.text", suppWithCHQ[i]);
                cy.get("#doc_date").type(testData.invoiceDate);

                cy.get('[for="authority_code"]').eq(0).click();

                cy.get(".ui-pnotify-text").should("contain", testData.period);
                cy.get("#tot_value").type(totalInvoiceValue);
                cy.get("#tot_vat").type(vatAmount);

                //Add unique invoice refernce
                cy.log("Add unique invoice refernce");
                const timestamp = Date.now();
                const supplierInvoiceRef = "INVChequeRUN" + timestamp;
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

                cy.get("#narr_desc").type("Test Description");

                //GL Code
                cy.log("GL Code");
                cy.selectCostCentre(costCentre);
                cy.selectFirstLedgerCodeAndFundCode();

                cy.get("#line_quantity").type(quantity);
                cy.get("#unit_price").type(unitprice);
                cy.get("*[id^=ui-id]").contains("Invoice/Credit Note").click();
                cy.get("#vat_exclusive").invoke("val");

                cy.get("#vat_code_icon").click();

                cy.get('[axes="VACODE"] > div')
                    .contains(vatCode)
                    .parent()
                    .parent()
                    .find("#esr_action")
                    .click();

                cy.get("*[id^=ui-id]").contains("Invoice/Credit Note").click();
                cy.get("#vat_value")
                    .invoke("val")
                    .should(
                        "eq",
                        vatAmount != 0
                            ? vatAmount.toFixed(2).toLocaleString()
                            : "0.00"
                    );
                cy.get("#total_line_value")
                    .invoke("val")
                    .should("eq", totalInvoiceValue.toFixed(2).toString());

                cy.get('[data-originalvalue="Save"]').click();
                cy.log("");
                cy.get('[axes="LINE_QUANTITY"] > div')
                    .invoke("text")
                    .then(parseFloat)
                    .should("contain", quantity);
                // cy.get('[axes="UNIT_PRICE"] > div')
                //     .invoke("text")
                //     .should("contain", unitprice);
                // cy.get('[axes="VAT_EXCLUSIVE"] > div')
                //     .invoke("text")
                //     .should("contain", String(netInvoice.toLocaleString()));
                // cy.get('[axes="VAT_CODE"] > div')
                //     .invoke("text")
                //     .should("contain", vatCode);
                // cy.get('[axes="VAT_VALUE"]')
                //     .invoke("text")
                //     .should("contain", String(vatAmount.toFixed(2)));

                cy.get('[data-originalvalue="Finish & Save"]').click();

                cy.get("*[id*=summary_details]").should("be.visible");
                //Assert
                // cy.get("#tot_value")
                //     .invoke("text")
                //     .should("eq", String(totalInvoiceValue.toLocaleString()));
                // cy.get("#tot_vat")
                //     .invoke("text")
                //     .should("contain", String(vatAmount.toLocaleString()));
                // cy.get("#company_id")
                //     .invoke("text")
                //     .should("eq", testData.schoolId);
                cy.get("#ok_button").click();
            }
        });
        screen = testData.PRL610Q;

        // cy.login(username, password);
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
            "TestNarrChqRun" + new Date().getHours() + new Date().getMinutes();
        cy.get("#run_narr").type(narrative);
        cy.get("#refresh").click();

        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");
        cy.get("#processing_controls").contains("Pending").should("be.visible");
        cy.get('[axes="SUPP_NAME"] > div', { timeout: 150000 }).should(
            "be.visible"
        );

        //Assert invoice reference
        cy.get('[axes="SUPP_REF"] > div')
            .invoke("text")
            .should("contain", "INVChequeRUN".toUpperCase());

        cy.log("Check all invoices");
        cy.get("*[id^=esr_grid_column_row_check_all]").check();

        cy.log("Click next");
        cy.get("#next_button").click();

        cy.log("Dialog box for negative ");
        cy.get("*[id^=ui-id]")
            .contains("Transaction Selection")
            .should("be.visible");

        cy.get("*[id$=PRL610Q0_esr_prompt] > div")
            .invoke("text")
            .should(
                "contain",
                "New Balance will be negative. Do you want to continue?"
            );

        cy.get("#esr_messagebox_yes").click();

        cy.log("Dialog box for payment run");
        cy.get("*[id^=ui-id]")
            .contains("Transaction Selection")
            .should("be.visible");

        cy.get("*[id$=PRL610Q1_esr_prompt] > div")
            .invoke("text")
            .should(
                "contain",
                "Payment run must be confirmed on same date as entered."
            );

        cy.get("#esr_messagebox_ok").click();

        cy.get("#INV_CRN_STEP").should("be.visible");

        cy.get(".multibutton_content")
            .find('.esr_multibutton:contains("Add All")')
            .eq(0)
            .click();

        cy.get(".multibutton_content").find(
            '.esr_multibutton:contains("Remove All")'
        );

        cy.get("*[id*=chequeprocessingpage2_esr_cn]").contains(
            "Cheque Books to be used in the order listed below"
        );
        cy.get('[axes="START_NO"] > div').should("be.visible");

        cy.get("#next_button").click();

        cy.get("#STEP_3").should("be.visible");

        //Assert Supplier name
        cy.get('[axes="SUPP_NAME"] > div')
            .invoke("text")
            .should("contain", "Eastern Water Authority");

        cy.get("#print_report").click();
        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");
        cy.get("#spc_rep_0", { timeout: 200000 })
            .invoke("text")
            .should("contain", "Proposed")
            .should("contain", "Summary");
        cy.get("#spc_rep_1", { timeout: 150000 })
            .invoke("text")
            .should("contain", "Proposed")
            .should("contain", "Detailed");
        cy.get("#save_all").click();
        cy.get("@listOfSuppliers").then((suppWithCHQ) => {
            const fileExt = ".zip";
            cy.task(
                "newestFileName",
                "./cypress/downloads/" + screen + "*" + fileExt
            ).then((data) => {
                cy.log("Newest zip file:" + data);
                cy.task("unzipFile", data);
                cy.task(
                    "newestFileName",
                    "./cypress/downloads/unzip*/CHEQUE_REPORT.PDF"
                ).then((fileName) => {
                    cy.log("Newest unzipped PDF:" + fileName);
                    cy.task("readPdf", fileName).then(function (data) {
                        // cy.log("Text: " + data.text);
                        cy.wrap(data.text).as("PDFdata");
                        cy.get("@PDFdata")
                            .should("contain", suppWithCHQ[0])
                            .should("contain", suppWithCHQ[1])
                            .should("contain", suppWithCHQ[2]);
                    });
                });
            });
        });
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
            .find(".multibutton_content > a")
            .click();

        cy.get(".ui-menu-item")
            .contains("Confirm")
            .should("be.visible")
            .click();

        cy.get("button[aria-label='Add All Books']").click();
        cy.log("Click next");
        cy.get("#next_button").click();

        cy.get("@listOfSuppliers").then((suppWithCHQ) => {
            cy.get("[axes='PAYEE_NAME']")
                .contains(suppWithCHQ[0])
                .should("be.visible");

            cy.get("[axes='PAYEE_NAME']")
                .contains(suppWithCHQ[1])
                .should("be.visible");

            cy.get("[axes='PAYEE_NAME']")
                .contains(suppWithCHQ[3])
                .should("be.visible");
        });
        cy.get("#print_report").click();
        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");

        cy.get("#save_all", { timeout: 150000 }).click();
        cy.get("@listOfSuppliers").then((suppWithCHQ) => {
            const fileExt = ".zip";
            cy.task(
                "newestFileName",
                "./cypress/downloads/" + screen + "*" + fileExt
            ).then((data) => {
                cy.log("Newest zip file:" + data);
                cy.task("unzipFile", data);
                cy.task(
                    "newestFileName",
                    "./cypress/downloads/unzip*/CHEQUE_REPORT.PDF"
                ).then((fileName) => {
                    cy.log("Newest unzipped PDF:" + fileName);
                    cy.task("readPdf", fileName).then(function (data) {
                        // cy.log("Text: " + data.text);
                        cy.wrap(data.text).as("PDFdata");
                        cy.get("@PDFdata")
                            .should("contain", suppWithCHQ[0])
                            .should("contain", suppWithCHQ[1])
                            .should("contain", suppWithCHQ[2]);
                    });
                });
            });
        });
        cy.get("#yes_button").click();
        cy.get("#print_cheques_button").click();

        cy.get("*[id$=PRL610Q1_esr_prompt] > div")
            .invoke("text")
            .should(
                "contain",
                "New Balance will be negative. Do you want to continue?"
            );

        cy.get("#esr_messagebox_yes").click();

        cy.log("Dialog box for payment run");
        cy.get("*[id^=ui-id]").contains("Cheque Document").should("be.visible");

        cy.get("#dnload_button").click();

        cy.task("newestFileName", "./cypress/downloads/*_CHEQUE.PDF").then(
            (fileName) => {
                cy.log("Newest unzipped PDF:" + fileName);
                cy.task("readPdf", fileName).then(function (data) {
                    // cy.log("Text: " + data.text);
                    cy.wrap(data.text).as("PDFdata");
                    cy.get("@PDFdata")
                        .should("contain", suppWithCHQ[0])
                        .should("contain", suppWithCHQ[1])
                        .should("contain", suppWithCHQ[2]);
                });
            }
        );
        cy.get("*[id$=PRL610Q2_esr_prompt] > div", { timeout: 200000 })
            .invoke("text")
            .should("contain", "Payment run confirmed.");
        cy.get("#esr_messagebox_ok").click();

        cy.get("#save_all").click();
        cy.get("@listOfSuppliers").then((suppWithCHQ) => {
            const fileExt = ".zip";
            cy.task(
                "newestFileName",
                "./cypress/downloads/" + "PRL611Q" + "*" + fileExt
            ).then((data) => {
                cy.log("Newest zip file:" + data);
                cy.task("unzipFile", data);
                cy.task(
                    "newestFileName",
                    "./cypress/downloads/unzip*/CHEQUE_REPORT.PDF"
                ).then((fileName) => {
                    cy.log("Newest unzipped PDF:" + fileName);
                    cy.task("readPdf", fileName).then(function (data) {
                        // cy.log("Text: " + data.text);
                        cy.wrap(data.text).as("PDFdata");
                        cy.get("@PDFdata")
                            .should("contain", suppWithCHQ[0])
                            .should("contain", suppWithCHQ[1])
                            .should("contain", suppWithCHQ[2]);
                    });
                });
            });
        });
    });

    it("BACS Run", () => {
        const username = testData.username;
        const password = testData.password;
        var screen = testData.PRL210;

        cy.login(username, password);
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

        const mapOfSuppliers = new Map();
        function addValueToKey(key, value) {
            if (!mapOfSuppliers.has(key)) {
                mapOfSuppliers.set(key, []);
            }
            mapOfSuppliers.get(key).push(value);
            cy.log("Key-value- " + key + ":" + mapOfSuppliers.get(key));
        }
        let count = 0;
        cy.get('[data-internal-ref] > [axes="SUPPLIER"]').then((suppliers) => {
            let supplierCount = suppliers.length;
            cy.log("Total Supplier Count=" + supplierCount);

            if (supplierCount === 1) {
                return 0;
            }
            let suppBacs = 0;
            for (let i = 0; i < supplierCount; i++) {
                cy.get('[data-internal-ref] > [axes="SUPPLIER"]')
                    .eq(i)
                    .dblclick();
                cy.get(
                    'span[data-control_type="TABCARD"]:contains("Contact Details")'
                ).click();
                cy.get("#supp_name")
                    .invoke("val")
                    .then((supplierName) => {
                        cy.get(
                            'span[data-control_type="TABCARD"]:contains("Payment Details")'
                        ).click();

                        cy.get("#pay_method_0")
                            .invoke("val")
                            .then((paymentMethod) => {
                                if (paymentMethod.trim() === "BACS") {
                                    addValueToKey(
                                        paymentMethod.trim(),
                                        supplierName
                                    );
                                    count++;
                                }
                                cy.get("#cancel_button").click();
                                suppBacs = (
                                    "" + Array.from(mapOfSuppliers.values())
                                ).split(",");
                                cy.wrap(suppBacs).as("listOfSuppliers");
                                cy.log("Suppliers: " + suppBacs);
                                if (count === 2) {
                                    return 0;
                                }
                            });
                    });
            }
        });
        cy.get("@listOfSuppliers").then((suppWithBACS) => {
            cy.log(
                "Total number of suppliers with BACS Payment Method =" +
                    suppWithBACS.length
            );
            const screen = testData.PRL300Q;
            for (let i = 0; i < 3; i++) {
                //############Invoice calculation START #################################
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
                let quantArr = [1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 9.1];
                const quantity = String(
                    quantArr[
                        Math.floor(Math.random() * quantArr.length)
                    ].toFixed(2)
                );
                cy.log("Quantity: " + quantity);
                let unitPriceArr = [
                    120.12, 230.23, 340.34, 450.45, 560.56, 670.67, 780.78
                ];
                const unitprice = String(
                    unitPriceArr[
                        Math.floor(Math.random() * unitPriceArr.length)
                    ].toFixed(2)
                );
                cy.log("Unit price: " + unitprice);
                let vatCodeArr = ["EXM", "NON", "RED", "STD", "ZER"];
                const vatCode =
                    vatCodeArr[Math.floor(Math.random() * vatCodeArr.length)];
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
                let netInvoice = Math.round(quantity * unitprice * 100) / 100;
                cy.log("Net Invoice: " + netInvoice);
                const vatAmount =
                    Math.round(((netInvoice * vatPercent) / 100) * 100) / 100;
                cy.log("VAT Amount: " + vatAmount);

                const totalInvoiceValue =
                    Math.round((netInvoice + vatAmount) * 100) / 100;
                cy.log("Total Invoice: " + totalInvoiceValue);
                //############Invoice calculation END #################################

                cy.log("Adding invoice for Supplier:" + suppWithBACS[i]);
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

                //Click on the menu item displayed
                cy.log("Click on the menu item displayed");
                cy.get(".ui-menu-item").contains(screen).click();

                //Select school
                cy.selectUsingSearchIcon("company_id", testData.schoolId);

                cy.log("************PRL300Q screen**************");
                cy.log("Click on search button");

                cy.get("#search_button").click();

                //New Button
                cy.log("Click in new button(with dropdown)");
                cy.get(".multibutton_content")
                    .find('.esr_multibutton:contains("New")')
                    .eq(0)
                    .click();

                if (testData.invoiceType == "Non Purchase Order Invoice") {
                    cy.get("#invoice_type2").check().should("be.checked");
                } else {
                    cy.get("#invoice_type2").check().should("be.checked");
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

                cy.get(".ui-pnotify-text").should("contain", testData.period);
                cy.get("#tot_value").type(totalInvoiceValue);
                cy.get("#tot_vat").type(vatAmount);

                //Add unique invoice refernce
                const timestamp = Date.now();
                const supplierInvoiceRef = "BACS RUN" + timestamp;
                cy.wrap(supplierInvoiceRef).as("invoiceRef" + i);
                cy.get("#supp_own_ref").type(supplierInvoiceRef);

                //***Add line
                cy.get(".multibutton_content > .esr_hover")
                    .contains("Add")
                    .click();

                //Dialog title verification
                cy.get(".ui-dialog-title").should(
                    "contain",
                    "Invoice/Credit Note"
                );

                cy.get("#narr_desc").type("Test Description");

                //GL Code
                cy.selectCostCentre(costCentre);
                cy.selectFirstLedgerCodeAndFundCode();

                cy.get("#line_quantity").type(quantity);
                cy.get("#unit_price").type(unitprice);
                cy.get("*[id^=ui-id]").contains("Invoice/Credit Note").click();
                cy.get("#vat_exclusive").invoke("val");

                cy.get("#vat_code_icon").click();

                cy.get('[axes="VACODE"] > div')
                    .contains(vatCode)
                    .parent()
                    .parent()
                    .find("#esr_action")
                    .click();

                cy.get("*[id^=ui-id]").contains("Invoice/Credit Note").click();
                cy.get("#vat_value")
                    .invoke("val")
                    .should(
                        "eq",
                        vatAmount != 0
                            ? vatAmount.toFixed(2).toLocaleString()
                            : "0.00"
                    );
                cy.get("#total_line_value")
                    .invoke("val")
                    .should("eq", totalInvoiceValue.toFixed(2).toString());

                cy.get('[data-originalvalue="Save"]').click();
                //Assert
                // cy.get('[axes="LINE_QUANTITY"] > div')
                //     .invoke("text")
                //     .should("contain", quantity);
                // cy.get('[axes="UNIT_PRICE"] > div')
                //     .invoke("text")
                //     .should("contain", unitprice);
                // cy.get('[axes="VAT_EXCLUSIVE"] > div')
                //     .invoke("text")
                //     .should("contain", String(netInvoice.toLocaleString()));
                // cy.get('[axes="VAT_CODE"] > div')
                //     .invoke("text")
                //     .should("contain", vatCode);
                // cy.get('[axes="VAT_VALUE"]')
                //     .invoke("text")
                //     .should("contain", String(vatAmount.toFixed(2)));

                cy.get('[data-originalvalue="Finish & Save"]').click();

                cy.get("*[id*=summary_details]").should("be.visible");
                //Assert
                // cy.get("#tot_value")
                //     .invoke("text")
                //     .should("eq", String(totalInvoiceValue.toLocaleString()));
                // cy.get("#tot_vat")
                //     .invoke("text")
                //     .should("contain", String(vatAmount.toLocaleString()));
                cy.get("#company_id")
                    .invoke("text")
                    .should("eq", testData.schoolId);
                cy.get("#ok_button").click();
            }
        });
    });
    it("test", () => {
        const quantity = 1; // String(quantArr[Math.floor(Math.random() * quantArr.length)])
        cy.log("Quantity: " + quantity);
        const unitprice = 111.1; // String(unitPriceArr[Math.floor(Math.random() * unitPriceArr.length)])
        cy.log("Unit price: " + unitprice.toFixed(2));
        const vatCode = "RED"; // vatCodeArr[Math.floor(Math.random() * vatCodeArr.length)]
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
        let netInvoice = Math.round(quantity * unitprice * 100) / 100;
        cy.log("Net Invoice: " + netInvoice.toFixed(2));
        const vatAmount =
            Math.round(((netInvoice * vatPercent) / 100) * 100) / 100;
        cy.log("VAT Amount: " + vatAmount.toFixed(2));

        const totalInvoiceValue =
            Math.round((netInvoice + vatAmount) * 100) / 100;
        cy.log("Total Invoice: " + totalInvoiceValue.toFixed(2));
    });
    it("PRL610Q - Cheque Processing", () => {
        const username = testData.username;
        const password = testData.password;
        const screen = testData.PRL610Q;

        cy.login(username, password);
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

        cy.get("#run_narr").type("TestNarrChqRun");
        cy.get("#refresh").click();

        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");
        cy.get("#processing_controls").contains("Pending").should("be.visible");
        cy.get('[axes="SUPP_NAME"] > div', { timeout: 150000 }).should(
            "be.visible"
        );

        //Assert invoice reference
        cy.get('[axes="SUPP_REF"] > div')
            .invoke("text")
            .should("contain", "INVChequeRUN".toUpperCase());

        cy.log("Check all invoices");
        cy.get("*[id^=esr_grid_column_row_check_all]").check();

        cy.log("Click next");
        cy.get("#next_button").click();

        cy.log("Dialog box for negative ");
        cy.get("*[id^=ui-id]")
            .contains("Transaction Selection")
            .should("be.visible");

        cy.get("*[id$=PRL610Q0_esr_prompt] > div")
            .invoke("text")
            .should(
                "contain",
                "New Balance will be negative. Do you want to continue?"
            );

        cy.get("#esr_messagebox_yes").click();

        cy.log("Dialog box for payment run");
        cy.get("*[id^=ui-id]")
            .contains("Transaction Selection")
            .should("be.visible");

        cy.get("*[id$=PRL610Q1_esr_prompt] > div")
            .invoke("text")
            .should(
                "contain",
                "Payment run must be confirmed on same date as entered."
            );

        cy.get("#esr_messagebox_ok").click();

        cy.get("#INV_CRN_STEP").should("be.visible");

        cy.get(".multibutton_content")
            .find('.esr_multibutton:contains("Add All")')
            .eq(0)
            .click();

        cy.get(".multibutton_content").find(
            '.esr_multibutton:contains("Remove All")'
        );

        cy.get("*[id*=chequeprocessingpage2_esr_cn]").contains(
            "Cheque Books to be used in the order listed below"
        );
        cy.get('[axes="START_NO"] > div').should("be.visible");

        cy.get("#next_button").click();

        cy.get("#STEP_3").should("be.visible");

        //Assert Supplier name
        cy.get('[axes="SUPP_NAME"] > div')
            .invoke("text")
            .should("contain", "Eastern Water Authority");

        cy.get("#print_report").click();
        cy.get("*[id^=ui-id]").contains("Please wait...").should("be.visible");
        cy.window().then((win) => {
            const orig = win.open;

            win.open = function (url, _target, features) {
                return orig.call(this, url, "_self", features);
            };
        });
        cy.get("#spc_rep_0", { timeout: 150000 }).click();
    });
});
