import Split from 'split.js'


function splitPanels () {
    Split(['#splitter-left-pane', '#splitter-right-pane'], {
        sizes: [30, 70]
    });
        Split(['#splitter-left-top-pane', '#splitter-left-bottom-pane'], {
        sizes: [70, 30],
        direction: 'vertical',
    });
}

export {splitPanels};