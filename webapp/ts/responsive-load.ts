function clearAllDisplayClasses(element: string) {    
    $(element).removeClass( "d-none" );
    $(element).removeClass( "d-lg-block");    
    $(element).removeClass( "d-lg-none");
}
function hideElement(element: string) {    
    $(element).addClass( "d-none" );
}
function SetResponsiveness() {
    
    clearAllDisplayClasses("#desktopView");    
    clearAllDisplayClasses("#phoneView");

    $("#phoneView").addClass( "d-lg-none" );
    $("#desktopView").addClass( "d-none" );
    $("#desktopView").addClass( "d-lg-block");
}

function SetDesktopView() {
    clearAllDisplayClasses("#phoneView");
    clearAllDisplayClasses("#desktopView");
    hideElement("#phoneView");
}
function SetPhoneView() {
    
    clearAllDisplayClasses("#phoneView");
    clearAllDisplayClasses("#desktopView");
    hideElement("#desktopView");
}

function responsiveHack() {
    
    $("#phoneView").removeClass( "position-absolute" );
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

export {responsiveHack, SetResponsiveness, SetDesktopView, SetPhoneView}