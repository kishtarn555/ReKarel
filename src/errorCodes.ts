
export const ERRORCODES = {
    WALL: 'Karel ha chocado con un muro!',
    WORLDUNDERFLOW: 'Karel intentó tomar zumbadores en una posición donde no había!',
    BAGUNDERFLOW: 'Karel intentó dejar un zumbador pero su mochila estaba vacía!',
    INSTRUCTION: 'Karel ha superado el límite de instrucciones!',
    STACK: 'La pila de karel se ha desbordado!',
};

interface executionLimits {
    maxInstructions: number
    stackSize: number
    callMaxParam: number
    stackMemory: number
}
export function decodeRuntimeError(error: string, limits:executionLimits):string {
    if (error === "INSTRUCTION") {
        return `Karel ha superado el límite de ${limits.maxInstructions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} instrucciones!`
    }
    if (error === "STACK") {
        return `La pila de karel se ha desbordado! El tamaño de la pila es de ${limits.stackSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }
    if (error === "CALLMEMORY") {
        return `Límite de parámetros superados.`
        +`<br>Solo puedes llamar con a lo más ${limits.callMaxParam.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
    if (error === "STACKMEMORY") {
        return `El límite de memoria del stack a sido superado.`
        +`<br>Limite de memoria: ${limits.stackMemory.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
        +`<br>El costo de una función es igual al mayor entre uno y la cantidad de parámetros que usa.`;
    }
    if (error in ERRORCODES) {
        return ERRORCODES[error];
    } else {
        return `Karel tubo un error de ejecución desconocido: ${error}`
    }
}