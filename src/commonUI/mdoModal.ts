import { deserializeMdoKec } from "@rekarel/binary";
import { KarelController } from "../KarelController";
import bootstrap from "bootstrap";

export interface MdoModal {
    modal: string,
    mdoFile: string,
    kecFile: string,
    importBtn:string
}


export function HookMdoModal(data: MdoModal, controller: KarelController) {
    $(data.importBtn).on("click", async () => {
        const mdoFileInput = $(data.mdoFile).prop("files") as FileList;
        const kecFileInput = $(data.kecFile).prop("files") as FileList;

        if (!mdoFileInput || mdoFileInput.length === 0) {
            //TODO: Show this
            console.error("MDO file is required.");
            return;
        }

        const mdoFile = mdoFileInput[0];
        const mdo = await readFileAsUint16Array(mdoFile);

        const kec = kecFileInput && kecFileInput.length > 0 
            ? await readFileAsUint16Array(kecFileInput[0]) 
            : undefined;

        // Use the deserializeMdoKec function
        const world = controller.world;
        try {
            controller.Reset();
            deserializeMdoKec(world, mdo, kec);
            controller.Reset();
            bootstrap.Modal.getOrCreateInstance($(data.modal)[0]).hide();
        } catch(e) {
            console.log(e);
            //TODO: Show this
        }

    });
}

// Helper function to read a file as Uint16Array
function readFileAsUint16Array(file: File): Promise<Uint16Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                const arrayBuffer = reader.result as ArrayBuffer;
                resolve(new Uint16Array(arrayBuffer));
            } else {
                reject(new Error("Failed to read file"));
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

