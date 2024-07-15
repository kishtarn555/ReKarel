import { KarelController } from "../KarelController";


export type CallStackUI = {
    panel:JQuery
}

let MAX_STACK_SIZE = 650;

export class CallStack {
    panel:JQuery
    constructor(data:CallStackUI ) {
        this.panel = data.panel;

        KarelController.GetInstance().RegisterNewWorldObserver((a,_, newInstance)=> {if (newInstance) this.OnStackChanges();});
        this.OnStackChanges();
        KarelController.GetInstance().RegisterResetObserver((_)=>this.clearStack());
        KarelController.GetInstance().RegisterSlowModeObserver((_,limit)=>this.slowMode(limit));
    }

    private getCollapsedHTML(evt) {
      const karelController = KarelController.GetInstance();

      let runtime = karelController.GetRuntime();
      
      let msg = this.getCallInfo(evt);
      if (runtime.state.stackSize === MAX_STACK_SIZE +1) {
        return msg;
      }
      msg += `<br><span class="text-primary">${MAX_STACK_SIZE+1} - ${runtime.state.stackSize-1}</span>` +
          '<span> Funciones ocultas </span><br/><span>Hay demasiadas funciones en la pila, las más recientes no se muestran en la interfaz, pero estan ahí </span>';
      return msg
    }

    private getCallInfo(evt) {
      const karelController = KarelController.GetInstance();

      let runtime = karelController.GetRuntime();
      
      const onclick = `karel.MoveEditorCursorToLine(${evt.line +1})`;
      return `<span class="text-info">${runtime.state.stackSize}</span> - ` +
                evt.function +
                ' (' +
                `<span class="text-primary"><b>${evt.param}</b></span>` +
                `) <a href="#" class="badge bg-primary text-decoration-none" onclick="${onclick}"> Desde línea ` +
                (evt.line + 1) +
                '</a>';
    }
    private OnStackChanges() {
        //FIXME: Don't hardcode the id. #pilaTab
        const karelController = KarelController.GetInstance();
        let runtime = karelController.GetRuntime();
        // @ts-ignore
        runtime.addEventListener('call', evt=> {   
            if (runtime.state.stackSize == MAX_STACK_SIZE+1) {
                this.panel.prepend(
                    '<div class="alert alert-warning">' +
                    this.getCollapsedHTML(evt)+                      
                      '</div>',
                  );
                return;
            } 
            if (runtime.state.stackSize > MAX_STACK_SIZE) {
                this.panel.find('>:first-child').html(this.getCollapsedHTML(evt));
                return;
            }

            this.panel.prepend(
              '<div class="well well-small">' + this.getCallInfo(evt)+'</div>',
            );
          });
          // @ts-ignore
          runtime.addEventListener('return', evt=> {
            if (runtime.state.stackSize > MAX_STACK_SIZE) {

              runtime.raw_opcodes

              this.panel.find('>:first-child').html(this.getCollapsedHTML(evt));

              return;
            }
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

    private slowMode(limit:number) {
      const txt = limit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      this.panel.prepend(
        '<div class="alert alert-danger">'+

        `<span> <i class="bi bi-exclamation-triangle-fill"></i> Se ejecutaron más de ${txt} instrucciones, por lo que se activo el modo de ejecución rápido, así que la pila muestra el estado en el que se encontraba hasta la instrucción ${txt} </span></div>`
      );
    }

}