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
* [x] Migrated to Bootstrap 5.3.0
* [x] Migrated to JQuery 3.6.1
* [x] Migrated to CodeMirror 6
* [x] Migrated Split.js
## Deprecated
* [x] Removed Karel Ruby as it didn't worked and it seemed to be in route of deprecation.
## Mobile
* [x] Supports touch control on both views.
* [ ] UI changes to one better suited for small screens, similar to "Karel blue", aka Karel.exe
* CodeEditor maybe edited without writing.

## Quality of live
* Settings that allow to set:
    * [ ] ~Prefered programming language (default is auto as Karel.js)~ 
        * ~If set, syntax higlighting and compile will always try that language.~
    * [ ] The view (force one view independent of screen size)
    * [x] Code Font size
* Hotkeys
    * [x] `Ctrl+K` Decreases editor's font.
    * [x] `Ctrl+L` Increases editor's font.
* [x] Added the ability to zoom in and out of the world.
* [x] Native scrolling with scrollbars for the world renderer.
    * The previous scroll was hard to use imo.
* [x] Added the ability to specify the name of the file to be downloaded, either code or world
* [x] Added clean button to remove old messages from console.
* [x] "Are you sure?" before reseting code
* [x] "Are you sure?" before reseting world
* [x] Added icons to Karel position.
* [x] If the execution ends in RTE, it is made more noticable by changing the world background color.
* [x] You can change Karel Codes
* [x] Dark and Light mode  
# World Editor
[x] Reworked world editor.

Now, it works similar to a spreadsheet software.

* World edition is based on cell selection and a toolbar.
* 
You can select a rectangular selection of cells and:
* [x] Place walls on the selection border (You may use the toolbar or WASD hot-keys)
* [x] Add, remove, clear, set the ammount of beepers in the selection (Use 1 ... 9 or Q E R C hot-keys)
* [x] Move/Rotate Karel (Use G or P hot-keys)
* [ ] 

# Execution
* [x] You can step into a function, out of a function or skip a function, similar to other debuggers
* [x] The stack now also reports what number it is in the stack for readability
