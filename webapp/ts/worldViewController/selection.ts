


export type SelectionState = "normal"|"selecting"



export class CellSelection {
    r: number
    c: number
    rows: number
    cols: number
    dr: number
    dc: number
    state:SelectionState
}


