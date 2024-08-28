import { jsxLanguage } from "@codemirror/lang-javascript";
import { KarelController } from "./KarelController";
import { SetText, setLanguage } from "./editor/editor";
import { getEditors } from "./editor/editorsInstances";

export function HookSession() {
    KarelController.GetInstance().RegisterCompileObserver((_,__, lan)=> SaveSession(lan));
}

export function SaveSession(lang:string) {
    if (sessionStorage == null) {
        return;
    }
    let code = getEditors()[0].state.doc.toString();
    sessionStorage.setItem("rekarel:code", code);
    sessionStorage.setItem("rekarel:lang", lang);

    let world = KarelController.GetInstance().world.save("start");
    sessionStorage.setItem("rekarel:world", world);
}

function parseWorld(xml:string) {
    // Parses the xml and returns a document object.
    return new DOMParser().parseFromString(xml, 'text/xml');
  }

export function RestoreSession() {
    if (sessionStorage == null) {
        return;
    }
    
    
    let source =  sessionStorage.getItem("rekarel:code");
    if (source) {
        SetText(getEditors()[0], source);
    }
    let world = sessionStorage.getItem("rekarel:world");
    if (world) {
        KarelController.GetInstance().LoadWorld(parseWorld(world))
    }
    let language = sessionStorage.getItem("rekarel:lang");
    if (language==="java") {
        setLanguage(getEditors()[0],"java");
    }
    if (language==="pascal") {
        setLanguage(getEditors()[0],"pascal");
    }
}