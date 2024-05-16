export type ConsoleTab = {
    console:JQuery,
    clear: JQuery,
    parent: JQuery
}


export class KarelConsole {
    consoleTab:ConsoleTab

    constructor (data:ConsoleTab) {
        this.consoleTab = data;
        this.consoleTab.clear.on("click", ()=> this.ClearConsole());

    }

    SendMessageToConsole(message: string, style:string) {
        if (style !== "raw") {
            const currentDate = new Date();
            const hour = currentDate.getHours() % 12 || 12;
            const minute = currentDate.getMinutes();
            const second = currentDate.getSeconds();
            const amOrPm = currentDate.getHours() < 12 ? "AM" : "PM";
            
            const html = `<div style="text-wrap: wrap;"><span class="text-${style}">[${hour}:${minute}:${second} ${amOrPm}]</span> ${message}</div>`;
            this.consoleTab.console.prepend(html);
            this.ScrollToBottom();
            return;
        }
        const html = `<div>${message}</div>`;
        this.consoleTab.console.prepend(html);
        this.ScrollToBottom();
        
    }

    
    
    ClearConsole() {
        this.consoleTab.console.empty();
    } 

    private ScrollToBottom() {
        if (this.consoleTab.console.is(":hidden") === false) {
            this.consoleTab.parent.scrollTop(
                this.consoleTab.parent.prop("scrollHeight")
            );
        }
    }

}