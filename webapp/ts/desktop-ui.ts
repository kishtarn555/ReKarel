import bootstrap from 'bootstrap';

function toggleInfinityBeepers () {
    if ($("#beeperBag").attr("hidden")!== undefined) { 
        $("#beeperBag").removeAttr("hidden");
        $("#beeperBag").val("0");
        $("#infiniteBeepersBtn").removeClass("btn-info");
        
        $("#infiniteBeepersBtn").addClass("btn-light");            
    } else {
        $("#beeperBag").attr("hidden", "");
        $("#beeperBag").val("-1");
        $("#infiniteBeepersBtn").removeClass("btn-light");            
        $("#infiniteBeepersBtn").addClass("btn-info");
    }
}


function ToggleConextMenu() {
    // $("#contextMenuToggler")[0].click();
    let toggler = $("#contextMenuToggler");
    const dumb =new bootstrap.Dropdown(toggler[0]);
    function p() {
        dumb.show();
        toggler.off("hidden.bs.dropdown",p);
    };
    dumb.show();
   
}
//TODO: Add support for states
function GetDesktopUIHelper() {
    $("#worldCanvas").on("contextmenu", (e) => {
        const dumb =new bootstrap.Dropdown($("#contextMenuToggler")[0]);
    
        dumb.hide();
        console.log(e);  
        $("#contextMenuDiv")[0].style.setProperty("top", `${e.pageY}px`);
        $("#contextMenuDiv")[0].style.setProperty("left", `${e.pageX}px`);      
        ToggleConextMenu();
        e.preventDefault();
        
        
    })
    // $("#contextMenuToggler").on("hidden.bs.dropdown", ()=>{
    //     $("#contextMenuDiv")[0].style.setProperty("top", `0px`);
    //     $("#contextMenuDiv")[0].style.setProperty("left", `0px`); 
    // });
    return {
        toggleInfinityBeepers : toggleInfinityBeepers

    };
}



export {GetDesktopUIHelper, ToggleConextMenu};