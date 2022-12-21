import { splitPanels } from "./split";
import { responsiveHack } from "./responsive-load";
import { createEditors } from "./editor";
import { GetDesktopUIHelper } from "./desktop-ui";
import { GetPhoneUIHelper } from "./phone-ui";

splitPanels();

var [destkopEditor, phoneEditor] = createEditors();

let DesktopUI = GetDesktopUIHelper();
let PhoneUI = GetPhoneUIHelper({
    codeTabToolbar: {
        "#codeTabBtn": ()=>{},
        "#worldTabBtn": ()=>{},
        "#execTabBtn": ()=>{}
    }
})
//Hoock all UI
$("#infiniteBeepersBtn").click(DesktopUI.toggleInfinityBeepers);

$("#codeTabBtn").click(()=>PhoneUI.changeCodeToolbar("#codeTabBtn"));
$("#worldTabBtn").click(()=>PhoneUI.changeCodeToolbar("#worldTabBtn"));
$("#execTabBtn").click(()=>PhoneUI.changeCodeToolbar("#execTabBtn"));

$(document).ready(()=>{
    responsiveHack();
})