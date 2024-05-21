import { DefaultWRStyle } from "./KarelStyles";
import { DesktopController } from "./desktop/desktop-ui";
import { responsiveHack, SetResponsiveness, SetDesktopView, SetPhoneView } from "./responsive-load";
import { SetDarkTheme, SetLightTheme, SetSystemTheme } from "./appTheme";
import {  WRStyle } from "./worldRenderer";
import { DarkEditorThemes } from "./editor/themes/themeManager";

const APP_SETTING = 'appSettings';
const SETTINGS_VERSION = "0.5.0";

type fontSizes = number;
type responsiveInterfaces = "auto" | "desktop" | "mobile";
type themeSettings = "system" | "light" | "dark";

type AppSettings = {
    version:string,
    interface: responsiveInterfaces,
    theme: themeSettings
    editorTheme:string
    editorFontSize: fontSizes,
    worldRendererStyle: WRStyle
    
}

let appSettings: AppSettings = {
    version:SETTINGS_VERSION,
    interface: "desktop",
    editorTheme: "classic",
    editorFontSize: 12,
    theme: "system",
    worldRendererStyle: DefaultWRStyle
}

function isFontSize(str: number): str is fontSizes {
    return 6 < str && str < 31;
}
function isResponsiveInterfaces(str: string): str is responsiveInterfaces {
    return ["auto", "desktop", "mobile"].indexOf(str) > -1;
}
function isTheme(str: string): str is themeSettings {
    return ["system", "light", "dark"].indexOf(str) > -1;
}
let DesktopUI: DesktopController

function applySettings(settings: AppSettings, desktopUI:DesktopController) {
    switch (settings.interface) {
        case "auto":
            SetResponsiveness();
            break;
        case "desktop":
            SetDesktopView();
            break;
        case "mobile":
            SetPhoneView();
            break;
        default:
            SetDesktopView();
            break;
    }
    if (!(settings.editorTheme in DarkEditorThemes)) settings.editorTheme = "classic";
    switch (settings.theme) {
        case "system":
            SetSystemTheme(settings.editorTheme);
            break;
        case "light":
            SetLightTheme(settings.editorTheme);
            break;
        
        case "dark":
            SetDarkTheme(settings.editorTheme);
            break;
        default:            
            SetDarkTheme(settings.editorTheme);
    }
    const root = $(":root")[0];
    root.style.setProperty("--editor-font-size", `${settings.editorFontSize}pt`);
    root.style.setProperty("--waffle-color", `${settings.worldRendererStyle.waffleColor}`);
    if (settings.interface == "desktop")
        desktopUI.ResizeCanvas();
    desktopUI.worldController.renderer.style = settings.worldRendererStyle;
    desktopUI.worldController.Update();
    if (localStorage)
        localStorage.setItem(APP_SETTING, JSON.stringify(appSettings))

    
}

function setSettings(event:  JQuery.SubmitEvent<HTMLElement, undefined, HTMLElement, HTMLElement>, desktopUI:DesktopController) {
    let interfaceType = <string>$("#settingsForm select[name=interface]").val();
    let fontSize = <number>$("#settingsForm input[name=fontSize]").val();
    let theme = <string>$("#settingsForm select[name=theme]").val();
    let style = <string>$("#settingsForm select[name=editorStyle]").val();
    console.log(fontSize);
    if (isResponsiveInterfaces(interfaceType)) {
        appSettings.interface = interfaceType;
    }
    if (isFontSize(fontSize)) {
        appSettings.editorFontSize = fontSize;
    }
    if (isTheme(theme)) {
        appSettings.theme = theme;
    }
    appSettings.editorTheme = style;

    console.log(appSettings);
    applySettings(appSettings, desktopUI);


    event.preventDefault();
    return false;
}

function loadSettingsFromMemory() {
    const jsonString = localStorage?.getItem(APP_SETTING);
    if (jsonString) {
        const memorySettings = JSON.parse(jsonString);
        if (memorySettings.version == null) return;
        if (memorySettings.version !== SETTINGS_VERSION) {
            localStorage.removeItem(memorySettings);
        }
        appSettings = memorySettings;
    } 
}

function loadSettingsToModal() {
    console.log("show", appSettings)
    $("#settingsInterface").val(appSettings.interface );
    $("#settingsFontSize").val(appSettings.editorFontSize);
    $("#settingsTheme").val(appSettings.theme);
    $("#settingsStyle").val(appSettings.editorTheme);
}

export function InitSettings(desktopUI:DesktopController) {    
    DesktopUI = desktopUI;
    loadSettingsFromMemory();
    $("#settingsModal").on("show.bs.modal", (e)=> {
        loadSettingsToModal();
    });

    $("#settingsForm").on("submit", (e)=> {
        setSettings(e , desktopUI)
    });
    
    
}



export function StartSettings(desktopUI:DesktopController) {

    applySettings(appSettings, desktopUI);
        
    $(document).on("keydown", (e) => {
        if (e.ctrlKey && e.which === 75) {
            let fontSize = appSettings.editorFontSize;
            fontSize--;
            if (fontSize < 7) fontSize = 7;
            appSettings.editorFontSize = fontSize;
            applySettings(appSettings, desktopUI);
            e.preventDefault();
            return false;
        }
        if (e.ctrlKey && e.which === 76) {
            let fontSize = appSettings.editorFontSize;
            fontSize++;
            if (fontSize > 30) fontSize = 30;
            appSettings.editorFontSize = fontSize;
            applySettings(appSettings, desktopUI);
            e.preventDefault();
            return false;
        }

    });
}


export function SetWorldRendererStyle(style :WRStyle) {
    appSettings.worldRendererStyle = style;
    applySettings(appSettings, DesktopUI);
}


export function GetCurrentSetting(){ return appSettings;}