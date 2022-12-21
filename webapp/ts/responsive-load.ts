
function responsiveHack() {
    $("#phoneView").addClass( "d-lg-none" );
    $("#desktopView").addClass( "d-none" );
    $("#desktopView").addClass( "d-lg-block");
    $("#phoneView").removeClass( "position-absolute" );
    $("#loadingModal").remove();
}

export {responsiveHack}