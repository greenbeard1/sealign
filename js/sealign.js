/**
 * Created by art on 2014-09-22.
 */

var canvasState;

window.onload = function() {
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}

    // set up canvases
    var aln_canvas = document.getElementById('alignment_canvas');
    var lab_canvas = document.getElementById('label_canvas');
    canvasState = new CanvasState(aln_canvas, lab_canvas);

	// bind file browser to HTML5 FileReader
	$('#id_inputFile').on('change', function (e) {
        var files = e.target.files; // FileList object
	    var f = files[0];
        // TODO: check file MIME type, should be a plain text file
        reader.onload = fileReadComplete;
        reader.readAsText(f);
    });

    // de-activate sliders until user loads alignment
    $('#alignment_slider').slider('option', 'disabled', true);
    $('#vertical_slider').slider('option', 'disabled', true)
        .slider('option', 'value', 100); // default max, so handle at top

    // bind window resizing to function
    $( window ).on('resize', canvasState.resizeCanvas);
};
