import { NewProjectModalUI, CreateNewProjectModal } from "../commonUI/newProjectModal";
import { AppVars } from "../volatileMemo";
import { ProjectController } from "./projectController";

interface ProjectUIData {
    navbar: string
    open: string
    close: string,
    newProject: NewProjectModalUI
}
export class ProjectUI {
    data: ProjectUIData
    projectController: ProjectController
    constructor(data: ProjectUIData, projectController: ProjectController) {
        this.data = data;
        this.projectController = projectController;
        this._Hook();
    }


    EnableProjects() {
        $(this.data.navbar)
            .removeAttr("hidden")
            .removeAttr("disabled");
    }

    DisableProjects() {
        $(this.data.navbar)
            .attr("hidden", "")
            .attr("disabled", "");
    }


    /**
     * Called to set an active project
     */
    SetActiveProjectMode() {
        $(this.data.close).removeClass("disabled")
    }
    /**
     * Called to set an active project
     */
    SetNoProjectMode() {
        $(this.data.close).addClass("disabled")
    }

    private _Hook() {
        $(this.data.open).on("click", () => this._OpenProject());
        $(this.data.close).on("click", () => this.projectController.CloseCurrentProject());
        AppVars.registerProjectsEnableListener((val) => {
            if (val) {
                this.EnableProjects();
            } else {
                this.DisableProjects();
            }
        });
        this.projectController.RegisterProjectChangeObserver((project)=> {
            if (project == null) {
                this.SetNoProjectMode();
            } else {
                this.SetActiveProjectMode();
            }
        })
        CreateNewProjectModal(this.data.newProject, (dir)=>this.projectController.SetProject(dir));
    }
    private _OpenProject() {
        let filePromise = window.showDirectoryPicker({
            mode: "readwrite"
        });
        filePromise.then((directory) => {
            this.projectController.SetProject(directory);
        })
    }


}