Rework of omegaup's [Karel.js](https://github.com/omegaup/karel.js).

It's main reason is so it works in mobile, currently it doesn't because

* CodeMirror 5 isn't mobile compatible
* WorldRenderer scroll doesn't work on all devices
* It is not responsive, toolbar is gone in mobile

This new version includes:

* Now with bootstrap 5
* Now with CodeMirror 6


# Features from Karel.js


## Migrations
* Migrated to Bootstrap 5.0.2
* Migrated to JQuery 3.6.1
* Migrated to CodeMirror 6
* Migrated Split.js
## Deprecated
* Removed Karel Ruby as it didn't worked and it seemed to be in route of deprecation.
## Mobile
* Supports touch control on both views.
* UI changes to one better suited for small screens, similar to "Karel blue", aka Karel.exe
* CodeEditor maybe edited without writing.

## Quality of live
* Settings that allow to set:
    * Prefered programming language (default is auto as Karel.js)
        * If set, syntax higlighting and compile will always try that language.
    * The view (force one view independent of screen size)
    * Code Font size
* World edited by toolbars, based on Google's spreadsheets.
* Hotkeys
    * `Ctrl+K` Decreases editor's font.
    * `Ctrl+L` Increases editor's font.
* Added the ability to zoom in and out of the world.
* Native scrolling with scrollbars for the world renderer.
    * The previous scroll was hard to use imo.
* Added the ability to specify the name of the file to be downloaded

# UX
Here are improvements in UX based on my used of the tool, but there's not a secondary opinion.
* Added clean button to remove old messages.
* "Are you sure?" before reseting code
* "Are you sure?" before reseting world
