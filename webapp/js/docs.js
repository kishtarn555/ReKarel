
(function() {

/**
 * Removes html
 * @param {string} res 
 */
function removeExtension(res) {
    if (res.endsWith(".html")) {
        return res.slice(0, -5);
    }
    return res;
}


function capitalize(str) {
    if (str === "rekarel") return "ReKarel";
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * 
 * @param {string[]} links
 */
function setBreadcrumbs(links) {
    const breadcrumb = document.getElementById("breadcrumb");
    if (breadcrumb == null) 
        return;
    let url = "webapp/docs/";
    links.forEach((el, idx)=> {
        url += `${el}/`;
        const li = document.createElement("li");
        li.className="breadcrumb-item";
        const a = document.createElement("a");
        a.innerText = 
            capitalize(removeExtension(el));
        a.className = "link-body-emphasis text-decoration-none";
        a.setAttribute("href", url);
        li.appendChild(a);
        breadcrumb.appendChild(li);
    });
}
function getPath() {
    const url = window.location.href;
    const parts = url.split('/');
    const docsIndex = parts.indexOf('docs');
    return parts.slice(docsIndex + 1);
}
setBreadcrumbs(getPath());

})();