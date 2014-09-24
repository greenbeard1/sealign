/**
 * Created by art on 2014-09-18.
 */
// Event handlers.........................................

var reader = new FileReader(),
    alignment = [];


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

    canvasState.resizeCanvas();
    canvasState.redraw_alignment(0, alignment.length);

    // activate and configure horizontal slider
    $('#alignment_slider').slider('option', 'disabled', false)
        .slider('option', 'min', 0)
        .slider('option', 'max', maxlen);
    $('#vertical_slider').slider('option', 'disabled', false)
        .slider('option', 'min', Math.floor(aln_canvas.height / canvasState.base_h))
        .slider('option', 'max', alignment.length)
        .slider('option', 'value', alignment.length);
}
