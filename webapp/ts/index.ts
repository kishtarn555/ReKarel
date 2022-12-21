import { splitPanels } from "./split";
import { responsiveHack } from "./responsive-load";
import { createEditors } from "./editor";


splitPanels();
createEditors();

$(document).ready(()=>{
    responsiveHack();
})