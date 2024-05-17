

export function SetLightTheme () {
    $(":root").attr("data-bs-theme", "light");
}

export function SetDarkTheme () {
    $(":root").attr("data-bs-theme", "dark");
}
export function SetSystemTheme () {
    if (window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            SetDarkTheme();
        } else {
            SetLightTheme();
        }
        return;
    }
    SetLightTheme(); //Default light theme
}