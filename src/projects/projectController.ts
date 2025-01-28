import {AppVars} from "../volatileMemo"
interface ProjectUI {
    navbar: string
}
export class ProjectController {
    ui: ProjectUI
    constructor(ui:ProjectUI) {
        this.ui = ui;
        AppVars.registerProjectsEnableListener((val)=> {
            if (val) {
                this.EnableProjects();
            } else {
                this.DisableProjects();
            }
        })
    }

    EnableProjects() {
        $(this.ui.navbar)
            .removeAttr("hidden")
            .removeAttr("disabled");
    }

    DisableProjects() {
        $(this.ui.navbar)
            .attr("hidden","")
            .attr("disabled", "");
        this.CloseCurrentProject();
    }

    CloseCurrentProject() {
        //TODO: IMPLEMENT ME
    }
}