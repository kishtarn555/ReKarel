import { KarelController } from "./KarelController";
import { SetText } from "./editor/editor";
import { getEditors } from "./editor/editorsInstances";

export function HookSession() {
    KarelController.GetInstance().RegisterCompileObserver((_,__)=> SaveSession());
}

export function SaveSession() {
    if (sessionStorage == null) {
        return;
    }
    let code = getEditors()[0].state.doc.toString();
    sessionStorage.setItem("rekarel:code", code);

    let world = KarelController.GetInstance().world.save();
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
}