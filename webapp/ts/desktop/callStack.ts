import { KarelController } from "../KarelController";


export type CallStackUI = {
    panel:JQuery
}

let MAX_STACK_SIZE = 650;

export class CallStack {
    panel:JQuery
    constructor(data:CallStackUI ) {
        this.panel = data.panel;

        KarelController.GetInstance().RegisterNewWorldObserver((a,_)=>this.OnStackChanges());
        // this.OnStackChanges();
        KarelController.GetInstance().RegisterResetObserver((_)=>this.clearStack());
    }


    private OnStackChanges() {
        //FIXME: Don't hardcode the id. #pilaTab
        const karelController = KarelController.GetInstance();
        let runtime = karelController.GetRuntime();
        // @ts-ignore
        runtime.addEventListener('call', evt=> {   
            if (runtime.state.stackSize == MAX_STACK_SIZE+1) {
                this.panel.prepend(
                    '<div class="well well-small">' +
                      `<span class="text-secondary">${MAX_STACK_SIZE+1} - ${runtime.state.stackSize}</span>` +

                      '<span class="text-danger"> Hay demasiadas funciones en la pila, las más recientes no se muestran en la interfaz, pero estan ahí </span></div>',
                  );
                return;
            } 
            if (runtime.state.stackSize > MAX_STACK_SIZE) {
                this.panel.find('>:first-child').html(
                    '<div class="well well-small">' +
                      `<span class="text-secondary">${MAX_STACK_SIZE+1} - ${runtime.state.stackSize}</span>` +

                      '<span class="text-danger"> Hay demasiadas funciones en la pila, las más recientes no se muestran en la interfaz, pero estan ahí </span></div>',
                  );
                return;
            }
            this.panel.prepend(
              '<div class="well well-small">' +
                `<span class="text-info">${runtime.state.stackSize}</span> - ` +
                evt.function +
                ' (' +
                `<span class="text-warning">${evt.param}</span>` +
                ') <span class="badge bg-info"> Desde línea ' +
                (evt.line + 1) +
                '</span></div>',
            );
          });
          // @ts-ignore
          runtime.addEventListener('return', evt=> {
            if (runtime.state.stackSize > MAX_STACK_SIZE) return;
            var arreglo = this.panel.find('>:first-child').remove();
          });
          // @ts-ignore
          runtime.addEventListener('start', evt=> {
            this.clearStack();
          });
    }
    private clearStack() {
        var arreglo = this.panel.empty();
    }

}