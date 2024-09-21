
(function() {

/**
 * Removes html
 * @param {string} res 
 */
function removeExtension(res) {
    res = res.replace(/#/g, '');
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
    const $breadcrumb = $("#breadcrumb");

    let url = "/webapp/docs/";
    links.forEach((el, idx) => {
        url += `${el}/`;
        
        // Create elements with jQuery
        const $li = $("<li>").addClass("breadcrumb-item");
        const $a = $("<a>")
            .text(capitalize(removeExtension(el)))
            .addClass("link-body-emphasis text-decoration-none")
            .attr("href", url);
        
        // Append anchor to list item and list item to breadcrumb
        $li.append($a);
        $breadcrumb.append($li);
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