import Split from 'split.js'


function splitPanels (ResizeCanvas: ()=>void) {
    Split(['#splitter-left-pane', '#splitter-right-pane'], {
        sizes: [30, 70],
        onDragEnd: ResizeCanvas
    });
    Split(['#splitter-left-top-pane', '#splitter-left-bottom-pane'], {
        sizes: [70, 30],
        direction: 'vertical',
        minSize: 0,
    });
}

export {splitPanels};