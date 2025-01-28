/**
 * This represents a project
 * @beta
 */
export interface KarelProject {
    name: string,
    version: string,
    subtasks: any[]
}


export function CreateDefaultProject(name:string): KarelProject {
    return {
        name:name,
        version: "1.0.0",
        subtasks: []
    }
}