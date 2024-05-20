import { classicHighlight } from "./classicHighlight";
import { darkClassicHighlight } from "./darkClassicHighlight";
import { LightReKarelHighlight, ReKarelHighlight } from "./reKarelTheme";
import { SepiaTheme } from "./sepiaTheme";

export const DarkEditorThemes = {
    'classic': darkClassicHighlight,
    'rekarel': ReKarelHighlight,
    'sepia': SepiaTheme,
}
export const LightEditorThemes = {
    'classic': classicHighlight,
    'rekarel': LightReKarelHighlight,
    'sepia': SepiaTheme,

}