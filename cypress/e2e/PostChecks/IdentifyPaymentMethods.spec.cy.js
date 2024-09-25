/* eslint-disable no-undef */
import testData from "../../fixtures/example.json";
describe.skip("Identify Payment Methods", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    //Handling uncaught exceptions to avoid false errors
    Cypress.on("uncaught:exception", (err) => {
        // returning false here prevents Cypress from
        // failing the test
        cy.log(err);
        return false;
    });

    //Test case #11
    it.only("Identify Payment Method", () => {
        const chequeOrBacs = "CHQ"; // CHQ or BACS
        const screenshotFolder =
            "Payment Methods/" +
            chequeOrBacs +
            "/RunOn" +
            new Date().toLocaleDateString("en-GB").replaceAll("/", "") +
            "/" +
            "Hour " +
            new Date().getHours() +
            "/";
        const username = testData.username;
        const password = testData.password;
        var screen = testData.PRL210;
        cy.log("Step 1");

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
        // screenshotCount = 4;
        cy.get('[data-internal-ref] > [axes="SUPPLIER"]').then((suppliers) => {
            let supplierCount = suppliers.length;
            cy.log("Total Supplier Count=" + supplierCount);

            if (supplierCount === 1) {
                return 0;
            }
            let suppList = 0;
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
                                if (paymentMethod.trim() === chequeOrBacs) {
                                    addValueToKey(
                                        paymentMethod.trim(),
                                        supplierName
                                    );
                                    count++;
                                }
                                cy.get("#cancel_button").click();
                                suppList = (
                                    "" + Array.from(mapOfSuppliers.values())
                                ).split(",");
                                cy.wrap(suppList).as("listOfSuppliers");
                                cy.log("Suppliers: " + suppList);
                                // if (paymentMethod.trim() === "CHQ") {
                                //     const timestamp = String(
                                //         "" +
                                //             new Date().getDate() +
                                //             new Date().getMonth() +
                                //             new Date().getHours() +
                                //             new Date().getMinutes()
                                //     );
                                //     const filePath =
                                //         "./Test Data/test" + timestamp + ".TXT";
                                //     const content = suppList;
                                //     cy.writeFile(filePath, content);
                                // }
                                if (count === 2) {
                                    return 0;
                                }
                            });
                    });
            }
        });
        cy.get("@listOfSuppliers").then((suppliers) => {
            const timestamp = String(
                "" +
                    new Date().getDate() +
                    new Date().getMonth() +
                    new Date().getHours() +
                    new Date().getMinutes()
            );
            const filePath = "./Test Data/" + chequeOrBacs + timestamp + ".TXT";
            const content = suppliers.toString();
            cy.writeFile(filePath, content);
        });
        cy.task("newestFileName", "./Test Data/" + chequeOrBacs + "*.TXT").then(
            (fileName) => {
                cy.log("filename" + fileName);
                cy.readFile(fileName).then((content) => {
                    cy.log("Content:" + content);
                    const arr = content.split(",");
                    cy.log("Arr:" + arr.length);
                });
            }
        );
    });
    it("test", () => {
        // const timestamp = String(
        //     "" +
        //         new Date().getDate() +
        //         new Date().getMonth() +
        //         new Date().getHours() +
        //         new Date().getMinutes()
        // );
        // const filePath = "./Test Data/test" + timestamp + ".TXT";
        // const content = "suppList";
        // cy.writeFile(filePath, content);
        cy.task("newestFileName", "./Test Data/cheque*.TXT").then(
            (fileName) => {
                cy.log("filename" + fileName);
                cy.readFile(fileName).then((content) => {
                    cy.log("Content" + content.split(","));
                    const arr = content.split(",");
                    cy.log("Arr:" + arr.length);
                });
            }
        );
    });
});
