
function responsiveHack() {
    if (false) {
        $("#phoneView").addClass( "d-lg-none" );
        $("#desktopView").addClass( "d-none" );
        $("#desktopView").addClass( "d-lg-block");
        $("#phoneView").removeClass( "position-absolute" );
    } else {
        $("#phoneView").addClass( "d-none" );
    }
    $("#loadingModal").remove();
}

export {responsiveHack}