import { EditorView } from "codemirror";
import { SetText } from "../editor";


export interface NavbarData {
    openCode: string
}


function getCode (editor:EditorView) {
    var file = document.createElement('input');
    file.type = 'file';
    file.addEventListener('change', function (evt) {
        //@ts-ignore
      var files = evt.target.files; // @ts-ignore FileList object 

      // Loop through the FileList and render image files as thumbnails.
      for (var i = 0, f; (f = files[i]); i++) {
        // Only process text files.
        if (
          f.type &&
          !(f.type.match('text.*') || f.type == 'application/javascript')
        ) {
          continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
          return function (e) {
            
            SetText(editor, reader.result as string); 
          };
        })(f);

        // Read in the file as a data URL.
        reader.readAsText(f);
      }
    });
    file.click();
}

export function HookNavbar(navbar:NavbarData ,editor:EditorView) {
   $(navbar.openCode).on("click", ()=>getCode(editor));
}

