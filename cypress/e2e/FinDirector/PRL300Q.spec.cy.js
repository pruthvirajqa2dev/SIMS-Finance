/* eslint-disable no-undef */
import testData from "../../fixtures/example.json";
describe.skip("Scenario 30", () => {
    beforeEach(() => {
        cy.visit("https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin", {
            failOnStatusCode: false
        });
    });

    it("Check if Up", () => {
        //cy.visit('https://uat-v2.pecuniam-online.co.uk/auth/esr.elogin',{failOnStatusCode: false})

        const errorMsg =
            "502 - Web server received an invalid response while acting as a gateway or proxy server.";
        cy.get("h2", { timeout: 0 }).first().should("not.have.text", errorMsg);
    });
    it.only("Multi line Invoice entry - PRL300Q as a Finance Director for default school", () => {
        const screen = testData.PRL300Q;
        cy.login(testData.username, testData.password, screen);
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
            costCentreArr[Math.floor(Math.random() * costCentreArr.length)];
        //############Invoice calculation START #################################
        let quantArr = [1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 9.1];
        const quantity = String(
            quantArr[Math.floor(Math.random() * quantArr.length)].toFixed(2)
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

        cy.log("Adding invoice for Supplier:" + testData.supplierName);
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
            .contains(testData.supplierName)
            .parent()
            .parent()
            .contains("Select")
            .click();

        cy.get('[for="supplier"]')
            .eq(1)
            .should("have.text", testData.supplierName);
        cy.get("#doc_date").type(testData.invoiceDate);

        cy.get('[for="authority_code"]').eq(0).click();

        cy.get(".ui-pnotify-text").should("contain", testData.period);
        cy.get("#tot_value").type(totalInvoiceValue);
        cy.get("#tot_vat").type(vatAmount);

        //Add unique invoice refernce
        const timestamp = Date.now();
        const supplierInvoiceRef = "INVChequeRUN" + timestamp;
        cy.get("#supp_own_ref").type(supplierInvoiceRef);

        //***Add line
        cy.get(".multibutton_content > .esr_hover").contains("Add").click();

        //Dialog title verification
        cy.get(".ui-dialog-title").should("contain", "Invoice/Credit Note");

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
                vatAmount != 0 ? vatAmount.toFixed(2).toLocaleString() : "0.00"
            );
        cy.get("#total_line_value")
            .invoke("val")
            .should("eq", totalInvoiceValue.toFixed(2).toString());

        cy.get('[data-originalvalue="Save"]').click();
        //Assert
        cy.get('[axes="LINE_QUANTITY"] > div')
            .invoke("text")
            .should("contain", quantity);
        cy.get('[axes="UNIT_PRICE"] > div')
            .invoke("text")
            .should("contain", unitprice);
        cy.get('[axes="VAT_EXCLUSIVE"] > div')
            .invoke("text")
            .should("contain", String(netInvoice.toLocaleString()));
        cy.get('[axes="VAT_CODE"] > div')
            .invoke("text")
            .should("contain", vatCode);
        cy.get('[axes="VAT_VALUE"]')
            .invoke("text")
            .should("contain", String(vatAmount.toFixed(2)));

        cy.get('[data-originalvalue="Finish & Save"]').click();

        cy.get("*[id*=summary_details]").should("be.visible");
        //Assert
        cy.get("#tot_value")
            .invoke("text")
            .should("eq", String(totalInvoiceValue.toLocaleString()));
        cy.get("#tot_vat")
            .invoke("text")
            .should("contain", String(vatAmount.toLocaleString()));
        cy.get("#company_id").invoke("text").should("eq", testData.schoolId);
        cy.get("#ok_button").click();
    });
});
