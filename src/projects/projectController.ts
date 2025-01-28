import { AppVars } from "../volatileMemo"
import { KarelProject } from "./project";

type ProjectChangeObserver = (project: KarelProject | null) => void;
export class ProjectController {
    private _projectHandle: FileSystemDirectoryHandle | null
    private _project: KarelProject | null
    private _projectChangeObservers: ProjectChangeObserver[];
    constructor() {
        this._projectHandle = null;
        this._projectChangeObservers = []
        this._Hook();
    }

    RegisterProjectChangeObserver(observer:ProjectChangeObserver) {
        this._projectChangeObservers.push(observer);
    }

    CloseCurrentProject() {
        this._projectHandle = null;
        this._project = null;
        this._NotifyProjectChange();
    }

    /**
     * Loads to memory the project settings
     */
    RefreshProject() {
        //TODO: IMPLEMENT ME
        this._project = {}
    }

    /**
     * Checks if a project is loaded
     * @returns true if there's is a project,
     */
    HasProject() {
        return this._projectHandle != null;
    }

    SetProject(directory: FileSystemDirectoryHandle | null) {
        this.CloseCurrentProject();
        if (directory == null) {
            return;
        }
        this._projectHandle = directory;
        if (!this._ValidateProject()) {
            this.CloseCurrentProject();
            return;
        }
        this.RefreshProject();
        this._NotifyProjectChange();


    }

    private _ValidateProject(): boolean {
        if (!this.HasProject())
            return false;
        //TODO: Add a proper validation
        return true;
    }
    private _Hook() {
        AppVars.registerProjectsEnableListener((val) => {
            if (!val) {
                this.CloseCurrentProject();
            }
        });
    }

    private _NotifyProjectChange() {
        for (const observer of this._projectChangeObservers) {
            observer(this._project);
        }
    }
}