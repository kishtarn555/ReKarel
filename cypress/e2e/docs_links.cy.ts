// Every internal link of the app and the docs (including the ones docs.js adds,
// like the breadcrumb) must lead to an existing page and, if it has one, anchor.
// Anchors are looked up in the page HTML as served, so an id created only at
// runtime would not count. External links are not checked: the suite has to run
// without internet.
export {}; // module scope, so these names don't clash with offline.cy.ts in the editor

const SITE_ORIGIN = 'http://localhost:5500/';
const APP_URL = 'http://localhost:5500/webapp/';
// Every built docs page, listed by setupNodeEvents in cypress.config.ts
const docsPages: string[] = Cypress.expose('docsPages') ?? [];
const pages = [APP_URL, ...docsPages.map((page) => APP_URL + page)];

interface LinkedPage {
    status: number;
    body: string;
}

// Every linked URL (without #anchor), shared by all tests so each URL is requested once
const linkedPages = new Map<string, LinkedPage>();

function requestOnce(url: string): Cypress.Chainable<LinkedPage> {
    const cached = linkedPages.get(url);
    if (cached) {
        return cy.wrap(cached, { log: false });
    }
    return cy.request({ url, failOnStatusCode: false }).then((res) => {
        const redirects = res.redirects ?? [];
        const finalUrl = redirects.length ? redirects[redirects.length - 1].replace(/^\d+: /, '') : url;
        // GitHub Pages answers 404 for a folder without index.html, while local servers list its files
        if (res.status < 400 && finalUrl.endsWith('/')) {
            return cy.request({ url: finalUrl + 'index.html', failOnStatusCode: false });
        }
        return cy.wrap(res, { log: false });
    }).then((res) => {
        const linked = { status: res.status, body: String(res.body) };
        linkedPages.set(url, linked);
        return linked;
    });
}

function hasAnchor(html: string, anchor: string): boolean {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.getElementById(anchor) !== null
        || Array.from(doc.getElementsByName(anchor)).some((element) => element.tagName === 'A');
}

describe('Internal links', () => {
    it('finds the built docs pages', () => {
        expect(docsPages, 'pages in webapp/docs/ (build before running Cypress)').to.not.be.empty;
    });

    pages.forEach((page) => {
        it(`${page} only links to existing pages`, () => {
            const broken: string[] = [];
            cy.visit(page);
            cy.document().then((doc) => {
                const hrefs = Array.from(doc.querySelectorAll('a[href]'))
                    .map((link) => (link as HTMLAnchorElement).href)
                    .filter((href) => href.startsWith(SITE_ORIGIN));
                return Array.from(new Set(hrefs));
            }).each((href: string) => {
                const [url, anchor] = href.split('#');
                requestOnce(url).then((linked) => {
                    if (linked.status >= 400) {
                        broken.push(`${linked.status} ${href}`);
                    } else if (anchor && !hasAnchor(linked.body, decodeURIComponent(anchor))) {
                        broken.push(`missing #${anchor} in ${href}`);
                    }
                });
            });
            cy.then(() => {
                expect(broken, `broken links:\n${broken.join('\n')}\n`).to.be.empty;
            });
        });
    });
});
