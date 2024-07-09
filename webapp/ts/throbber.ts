
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


    async performTask<T>(task:()=>Generator<T>) {
        const iter = task();
        let curr = iter.next();
        let last = curr.value;
        const startTime = Date.now();

        while (!curr.done && (Date.now() - startTime) < 1000) {
            last = curr.value;
            curr = iter.next();
        }
        if (curr.done) {
            return last;
        }
        this.show()
        const promise = new Promise<T>(

            (resolve,reject)=> setTimeout(
                ()=> {                    
                    while (!curr.done) {
                        last = curr.value;
                        curr = iter.next();
                    }
                    this.hide();
                    resolve(last)
                }
            )            
        );        
        return promise;
    }
}



export const throbber = new Throbber($("#throbber"));