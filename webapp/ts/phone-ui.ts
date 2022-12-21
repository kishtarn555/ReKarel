type Toolbar =  Record<string, ()=>void >

function activateButton (toolbar: Toolbar, buttonPressed:string) {
    for (const element in toolbar) {
        $(element).removeClass("text-primary");
    }    
    $(buttonPressed).addClass("text-primary");
    console.log(buttonPressed);
}

interface UIElements {
    codeTabToolbar: Toolbar
}
//TODO: Add support for states
function GetPhoneUIHelper(elements: UIElements) {
    return {
        changeCodeToolbar: (button:string) => 
            activateButton(elements.codeTabToolbar, button)
    };
}

export {GetPhoneUIHelper};