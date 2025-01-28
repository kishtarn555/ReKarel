import { CreateDefaultProject } from "../projects/project";

export interface NewProjectModalUI {
    modal: string,
    selectedDirLabel: string,
    selectDirBtn: string,
    projectNameInput: string,
    projectNameWarning: string,
    createBtn: string

}
let dirHandle: FileSystemDirectoryHandle | null = null;
function clearModal(ui: NewProjectModalUI) {
    $(ui.selectedDirLabel).text("No se ha seleccionado ningún directorio");
    $(ui.projectNameInput).val("");
    dirHandle = null;
    $(ui.createBtn).addClass("disabled")
}

function isValidFolderName(folderName) {
    // Check if folder name is empty
    if (!folderName || folderName.trim() === "") {
        return { valid: false, message: "Folder name cannot be empty." };
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g; // Includes control characters
    if (invalidChars.test(folderName)) {
        return { valid: false, message: "Folder name contains invalid characters." };
    }

    // Check for reserved names (Windows-specific)
    const reservedNames = [
        "CON", "PRN", "AUX", "NUL",
        "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
        "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"
    ];
    if (reservedNames.includes(folderName.toUpperCase())) {
        return { valid: false, message: "Folder name is a reserved system name." };
    }

    // Check if it ends with a dot or space (Windows-specific)
    if (folderName.endsWith(".") || folderName.endsWith(" ")) {
        return { valid: false, message: "Folder name cannot end with a dot or space." };
    }

    // Optional: Check max length (255 characters is common)
    if (folderName.length > 255) {
        return { valid: false, message: "Folder name is too long (max 255 characters)." };
    }

    return { valid: true, message: "Folder name is valid." };
}

function selectDir(ui: NewProjectModalUI) {
    let dirPromise = window.showDirectoryPicker({
        mode: "readwrite"
    });

    dirPromise.then((dir) => {
        dirHandle = dir;
        UpdateChange(ui)
    });
}
function UpdateChange(ui: NewProjectModalUI) {
    let projectName = `${$(ui.projectNameInput).val()}`;
    let validName = isValidFolderName(projectName).valid;
    if (dirHandle) {
        $(ui.selectedDirLabel).text(`Guardar en ${dirHandle.name}/${validName ? projectName : "<Proyecto>"}`)
    }
    if (validName) {
        $(ui.projectNameWarning).attr("hidden", "");
    } else if (projectName.length > 0) {
        $(ui.projectNameWarning).removeAttr("hidden");
    }
    if (!validName || dirHandle == null) {
        $(ui.createBtn).addClass("disabled")
    }
    if (validName && dirHandle != null) {
        $(ui.createBtn).removeClass("disabled")
    }
}

async function createProjectStructure(dirHandle, projectName) {
    try {
        // Create `project.rkpj` file
        const projectFile = await dirHandle.getFileHandle("project.rkpj", { create: true });
        const writable = await projectFile.createWritable();
        await writable.write(JSON.stringify({ projectName, createdAt: new Date().toISOString() }, null, 2));
        await writable.close();

        // Create `solution.kj` file
        const solutionFile = await dirHandle.getFileHandle("solution.kcode", { create: true });
        const solutionWritable = await solutionFile.createWritable();
        await solutionWritable.write(""); // Empty content
        await solutionWritable.close();

        // Create `cases` folder
        await dirHandle.getDirectoryHandle("cases", { create: true });

        // Create `subtasks` folder
        await dirHandle.getDirectoryHandle("subtasks", { create: true });
        console.log("Created subtasks/ folder");
    } catch (error) {
        console.error("Error creating project structure:", error);
    }
}

async function Create(ui: NewProjectModalUI, callback: (dirHandle: FileSystemDirectoryHandle) => void) {
    let projectName = `${$(ui.projectNameInput).val()}`;
    let validName = isValidFolderName(projectName).valid;
    if (!validName || dirHandle == null) return;
    dirHandle.getDirectoryHandle(projectName, {
        create: true
    }).then((projectDir) => {
        createProjectStructure(projectDir, projectName)
            .then(() => callback(projectDir));
    }
    ).catch(err => {
        console.error("Error opening subfolder", err);
    });
}
export function CreateNewProjectModal(ui: NewProjectModalUI, callback: (dirHandle: FileSystemDirectoryHandle) => void) {
    $(ui.modal).on("show.bs.modal", () => {
        clearModal(ui);
    })
    $(ui.selectDirBtn).on("click", () => selectDir(ui));
    $(ui.projectNameInput).on("input", () => UpdateChange(ui))
    $(ui.createBtn).on("click", () => Create(ui, callback));
}


