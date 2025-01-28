

export namespace AppVars {
    type DelayListener = (value:number)=> void
    type ProjectsEnableListener = (value:boolean)=> void
    const onDelayChangeListeners:DelayListener[] = []
    const onProjectsEnableListeners:ProjectsEnableListener[] = []
    export let randomBeeperMinimum = 1;
    export let randomBeeperMaximum = 99;
    let delay = 300;
    let projectsEnabled = false;

    export function getDelay() {
        return delay;
    }
    export function setDelay(_delay:number) {
        delay = _delay;
        for (const listener of onDelayChangeListeners) {
            listener(delay);
        }
    }

    export function registerDelayChangeListener(listener:DelayListener) {
        onDelayChangeListeners.push(listener);
    }

    export function setProjectsEnable(_projectsEnabled:boolean) {
        projectsEnabled= _projectsEnabled;
        for (const listener of onProjectsEnableListeners) {
            listener(projectsEnabled);
        }
    }

    
    export function registerProjectsEnableListener(listener:ProjectsEnableListener) {
        onProjectsEnableListeners.push(listener);
    }


}
