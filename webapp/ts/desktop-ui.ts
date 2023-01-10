import { redoDepth } from '@codemirror/history';
import bootstrap from 'bootstrap';
import { WorldRenderer, WRStyle } from './worldRenderer';

let renderer: WorldRenderer = undefined;

function scrollCanvas() {
    let left = 
            $("#worldContainer").scrollLeft() 
            / ($("#worldContainer")[0].scrollWidth-$("#worldContainer")[0].clientWidth);
    let top 
        = 1-$("#worldContainer").scrollTop() 
        / ($("#worldContainer")[0].scrollHeight-$("#worldContainer")[0].clientHeight);
    renderer.UpdateScroll(left, top);
}

function ResizeDesktopCanvas() {    
    $("#worldCanvas")[0].style.width= `${$("#worldContainer")[0].clientWidth}px`;    
    $("#worldCanvas")[0].style.height= `${$("#worldContainer")[0].clientHeight}px`;
    let scale = window.devicePixelRatio;
    $("#worldCanvas").attr(
        "width", Math.floor($("#worldContainer")[0].clientWidth * scale)
    );    
    $("#worldCanvas").attr(
        "height", Math.floor($("#worldContainer")[0].clientHeight * scale)
    );

    renderer.Draw();        
    scrollCanvas();
}

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
const lightWRStyle : WRStyle = {
    disabled: '#4f4f4f',
    exportCellBackground: '#f5f7a8',
    karelColor: '#315FB9',
    gridBackgroundColor: '#f8f9fA',
    gridBorderColor: '#c4c4c4',
    gutterBackgroundColor: '#e6e6e6',
    gutterColor: "#444444",
    beeperBackgroundColor: "#497029",    
    beeperColor: "#FAFAFA"
}
function GetDesktopUIHelper() {

    renderer = new WorldRenderer(
        ($("#worldCanvas")[0] as HTMLCanvasElement).getContext("2d"),
        lightWRStyle,
        $("#worldContainer")[0]    
    );
    $("#worldCanvas").on("contextmenu", (e) => {
        return;
        const dumb =new bootstrap.Dropdown($("#contextMenuToggler")[0]);
        dumb.hide();
        console.log(e);  
        $("#contextMenuDiv")[0].style.setProperty("top", `${e.pageY}px`);
        $("#contextMenuDiv")[0].style.setProperty("left", `${e.pageX}px`);      
        ToggleConextMenu();
        e.preventDefault();
    });
                
    $("#worldContainer").on("scroll", scrollCanvas);
    $(window).on("resize", () => {        
        ResizeDesktopCanvas();
    });
    renderer.FocusOrigin();
    return {
        toggleInfinityBeepers : toggleInfinityBeepers,
        renderer: renderer,
        ResizeDesktopCanvas: ResizeDesktopCanvas

    };
}



export {GetDesktopUIHelper, ToggleConextMenu, ResizeDesktopCanvas};