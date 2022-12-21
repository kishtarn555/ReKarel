function getTheme() {
    return (
      (typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem('karel.js:theme')) ||
      'karel'
    );
  }


function createditor(id) {
    return
    let editor = CodeMirror.fromTextArea(document.getElementById(id), {
        lineNumbers: true,
        firstLineNumber: 1,
        styleActiveLine: true,
        viewportMargin: Infinity,
        mode: 'karelpascal',
        theme: getTheme(),
        foldGutter: {
            rangeFinder: CodeMirror.fold.indent,
        },
        gutters: [
            'CodeMirror-foldgutter',
            'errors',
            'breakpoints',
            'CodeMirror-linenumbers',
        ],
    });
    editor.numBreakpoints = 0;
    editor.on('gutterClick', function (instance, line, gutter, clickEvent) {
        if (gutter == 'CodeMirror-foldgutter') return;
        function makeBreakpoint() {
            var marker = document.createElement('div');
            marker.style.color = '#822';
            marker.innerHTML = '●';
            return marker;
        }
        var markers = instance.lineInfo(line).gutterMarkers;
        if (markers && markers.breakpoints) {
            instance.setGutterMarker(line, 'breakpoints', null);
            editor.numBreakpoints--;
        } else {
            instance.setGutterMarker(line, 'breakpoints', makeBreakpoint());
            editor.numBreakpoints++;
        }
    });
    
    return editor;
}
// Iniciar co editor
let desktopEditor;
let phoneEditor;
let editor = desktopEditor;

function setEditors() {
    desktopEditor = createditor("desktopEditor");
    phoneEditor = createditor("phoneEditor");
    // phoneEditor.setOption('readOnly', true);
    editor=desktopEditor;
}



function validatorCallbacks(message) {
    if (message.type == 'error') {
        $('#mensajes').trigger('error', { mensaje: message.message });
    } else if (message.type == 'info') {
        $('#mensajes').trigger('info', { mensaje: message.message });
    } else if (message.type == 'invalidCell') {
        $('#mensajes').trigger('error', {
            mensaje: 'La celda (' + message.x + ', ' + message.y + ') es inválida',
        });
    } else {
        console.error('Mensaje no reconocido', message);
    }
}


// Save Modal code
const fileRegex = /^[a-zA-Z0-9._]+$/;
function setFileNameLink() {
    let newFilename = $("#codeName").val();    
    if (!fileRegex.test(newFilename)) {
        $("#wrongCodeName").removeAttr("hidden");
        newFilename="code.txt";
    } else {
        $("#wrongCodeName").attr("hidden", "");
    }
    let blob = new Blob([editor.getValue()], { type: 'text/plain'});
    $("#downloadCode").attr("href", window.URL.createObjectURL(blob));
    $("#downloadCode").attr("download", newFilename);
}
$( "#saveCodeModal" ).on('shown', setFileNameLink);
$("#codeName").change(setFileNameLink)


function recalcDimensions() {
    world.width = $('#splitter-right-pane').width();
    world.height = $('#splitter-right-pane').height();
    // wRender.paint(mundo, world.width, world.height, {
    //   editable: mundo_editable,
    // });
  }
  
   recalcDimensions();
  $(window).resize(recalcDimensions);


  $(document).ready(()=> {
    setEditors();
    //Weird responsive hack
    $("#phoneView").addClass( "d-lg-none" );
    $("#desktopView").addClass( "d-none" );
    $("#desktopView").addClass( "d-lg-block");
    $("#phoneView").removeClass( "position-absolute" );
    $("#loadingModal").remove();
  });

  $("#infiniteBeepersBtn").click(()=>{
        if ($("#beeperBag").attr("hidden")!== undefined) { 
            $("#beeperBag").removeAttr("hidden");
            $("#beeperBag").val("0");
            $("#infiniteBeepersBtn").removeClass("btn-danger");
            
            $("#infiniteBeepersBtn").addClass("btn-light");            
        } else {
            $("#beeperBag").attr("hidden", "");
            $("#beeperBag").val("-1");
            $("#infiniteBeepersBtn").removeClass("btn-light");            
            $("#infiniteBeepersBtn").addClass("btn-danger");
        }
});


// =================== Mobile code =====================


function setLine(str) {
    phoneEditor.replaceSelection(str);
}




$("#pAvanza").click(()=>setLine('avanza;'))