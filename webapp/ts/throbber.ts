
class Throbber {
    element:JQuery
    shouldBeVisible:boolean;
    visible:boolean;
    constructor(element:JQuery) {
        this.element = element;
        this.shouldBeVisible = false;
        this.visible= false;
        this.hide();
    }
    
    show() {
        this.element.show();        
        this.visible = true;
    }
    hide() {
        this.shouldBeVisible=false;
        this.visible= false;
        this.element.hide();
    }

    showInSeconds(seconds:number) {
        this.shouldBeVisible = true;
        setTimeout(()=> {
            if (this.shouldBeVisible) {
                this.show();
            }
        },seconds*1000);
    }


    async performTask<T>(task:()=>T) {
        this.show()
        const promise = new Promise<T>(
            (resolve,reject)=> setTimeout(
                ()=> {
                    let result= task();
                    this.hide();
                    resolve(result)
                }
            )            
        );        
        return promise;
    }
}



export const throbber = new Throbber($("#throbber"));