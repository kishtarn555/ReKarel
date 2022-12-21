Split({ // gutters specified in options
    columnGutters: [{
        track: 1,
        element: document.querySelector('.gutter-column-1'),
    }, {
        track: 3,
        element: document.querySelector('.gutter-column-3'),
    }],
    rowGutters: [{
        track: 1,
        element: document.querySelector('.gutter-row-1'),
    }]
})