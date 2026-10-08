// ReKarel must work without internet access (e.g. at contest venues),
// so every resource of the app and the docs has to come from the same server.
const LOCAL_URL = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;

const APP_URL = 'http://localhost:5500/webapp/';
// Every built docs page, listed by setupNodeEvents in cypress.config.ts
const docsPages: string[] = Cypress.expose('docsPages') ?? [];
const pages = [APP_URL, ...docsPages.map((page) => APP_URL + page)];

describe('Works without internet', () => {
    it('finds the built docs pages', () => {
        expect(docsPages, 'pages in webapp/docs/ (build before running Cypress)').to.not.be.empty;
    });

    pages.forEach((page) => {
        it(`loads ${page} using only local resources`, () => {
            const externalRequests: string[] = [];
            const failedRequests: string[] = [];
            cy.intercept(/.*/, (req) => {
                if (!LOCAL_URL.test(req.url)) {
                    externalRequests.push(req.url);
                    req.destroy(); // behave as if there were no internet
                    return;
                }
                req.continue((res) => {
                    if (res.statusCode >= 400) {
                        failedRequests.push(`${res.statusCode} ${req.url}`);
                    }
                });
            });

            cy.visit(page);

            cy.window().its('jQuery').should('exist');
            cy.window().its('bootstrap').should('exist');
            cy.document().then((doc) => doc.fonts.ready).then((fonts) => {
                const iconFontLoaded = Array.from(fonts).some(
                    (font) => font.family.replace(/"/g, '') === 'bootstrap-icons' && font.status === 'loaded'
                );
                expect(iconFontLoaded, 'bootstrap-icons font loaded').to.be.true;
            });
            cy.wrap(externalRequests).should('be.empty');
            cy.wrap(failedRequests).should('be.empty');
        });
    });
});
