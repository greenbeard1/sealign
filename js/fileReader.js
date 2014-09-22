/**
 * Created by art on 2014-09-18.
 */
// Event handlers.........................................

var reader = new FileReader(),
    alignment = [];

var aln_canvas,
    aln_context,
    lab_canvas,
    lab_context;

window.onload = function() {
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}

    // set up canvases
    aln_canvas = document.getElementById('alignment_canvas');
    aln_context = aln_canvas.getContext('2d');
    lab_canvas = document.getElementById('label_canvas');
    lab_context = lab_canvas.getContext('2d');

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

    function initialize() {
        window.addEventListener('resize', resizeCanvas, false);
        resizeCanvas();
    }
    initialize();

    // bind mouse-over event handlers
    aln_canvas.addEventListener('mousemove', function(e) {
        getPos(e, aln_canvas);
    }, true);

};



function fileReadComplete (f) {
    /**
     * Parse FASTA from file contents
     */

    var contents = f.target.result,
        lines = contents.split(/\r\n|\r|\n/g),
        header = '',
        sequence = '',
        maxlen = 0;  // maximum sequence length

    // parse FASTA file
    for (var line, i = 0; i < lines.length; i++) {
        line = lines[i];
        if (line[0] == '>') {
            if (sequence.length > 0) {
                alignment.push({'header': header, 'rawseq': sequence});
                if (sequence.length > maxlen) {
                    maxlen = sequence.length;
                }
                sequence = '';
            }
            header = line.slice(1);  // drop leading '>'
        } else {
            sequence += line;
        }
    }
    // add last entry
    alignment.push({'header': header, 'rawseq': sequence});

    resizeCanvas();
    redraw_alignment(0, alignment.length);

    // activate and configure horizontal slider
    $('#alignment_slider').slider('option', 'disabled', false)
        .slider('option', 'min', 0)
        .slider('option', 'max', maxlen);
    $('#vertical_slider').slider('option', 'disabled', false)
        .slider('option', 'min', Math.floor(aln_canvas.height / base_h))
        .slider('option', 'max', alignment.length)
        .slider('option', 'value', alignment.length);
}
