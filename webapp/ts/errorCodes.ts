
export const ERRORCODES = {
    WALL: 'Karel ha chocado con un muro!',
    WORLDUNDERFLOW: 'Karel intentó tomar zumbadores en una posición donde no había!',
    BAGUNDERFLOW: 'Karel intentó dejar un zumbador pero su mochila estaba vacía!',
    INSTRUCTION: 'Karel ha superado el límite de instrucciones!',
    STACK: 'La pila de karel se ha desbordado!',
};

export function decodeRuntimeError(error: string, maxInstructions:number, stackSize:number ):string {
    if (error === "INSTRUCTION") {
        return `Karel ha superado el límite de ${maxInstructions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} instrucciones!`
    }
    if (error === "STACK") {
        return `La pila de karel se ha desbordado! El tamaño de la pila es de ${stackSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }
    return ERRORCODES[error];
}