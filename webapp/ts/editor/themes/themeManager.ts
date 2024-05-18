import { classicHighlight } from "./classicHighlight";
import { darkClassicHighlight } from "./darkClassicHighlight";
import { LightReKarelHighlight, ReKarelHighlight } from "./reKarelTheme";

export const DarkEditorThemes = {
    'classic': darkClassicHighlight,
    'rekarel': ReKarelHighlight,
}
export const LightEditorThemes = {
    'classic': classicHighlight,
    'rekarel': LightReKarelHighlight,
}