/**
 * sealign.js
 * Combine redraw operations and raw data to render view of alignment,
 * using SVG.
 */

var aln_canvas,
    aln_context,
    lab_canvas,
    lab_context;

var palette = {'A': 'rgb(200,0,0)', 'C': 'rgb(0,150,0)', 'G': 'rgb(90,90,90)', 'T': 'rgb(0,0,200)'}


function initialize_canvas () {
    /**
     * Initialize alignment canvas
     * @type {*|jQuery|HTMLElement}
     */
    var aln_container = $('#alignment_container');

    aln_canvas = document.getElementById('alignment_canvas');
    aln_canvas.width = aln_container.width();
    aln_canvas.height = aln_container.height();

    aln_context = aln_canvas.getContext('2d');
    aln_context.textAlign = 'center';
    aln_context.font = '12px Courier New, Courier, serif';
    aln_context.textBaseline = 'middle';
    aln_context.strokeStyle = 'white';

    // initialize label canvas
    var lab_container = $('#label_container');
    lab_canvas = document.getElementById('label_canvas');
    lab_canvas.width = lab_container.width();
    lab_canvas.height = lab_container.height();

    lab_context = lab_canvas.getContext('2d');
    lab_context.font = '12px Courier New, Courier, serif';
    lab_context.textBaseline = 'middle';
    lab_context.strokeStyle = 'black';
}

function redraw_alignment (offset) {
    /**
     * Display the alignment within the x, y boundaries of the canvas.
     * @param {number} offset An integer ranging from 0 to the maximum
     *  sequence length.
     */
    var nuc, header, seq,
        w = 16, // width of base cell
        h = 20, // height of base cell
        window_width = Math.round(aln_canvas.width / w),  // number of bases that fit in window
        maxlen = $('#alignment_slider').slider('option', 'max'),
        left_bound = Math.min(offset, maxlen-window_width);

    // clear the canvases
    aln_context.clearRect(0, 0, aln_canvas.width, aln_canvas.height);
    lab_context.clearRect(0, 0, lab_canvas.width, lab_canvas.height);

    // TODO: set bounds to r on vertical slider
    for (var r = 0; r < alignment.length; r++) {
        header = alignment[r]['header'];
        lab_context.strokeText(header, 1, (0.5+r)*h);

        seq = alignment[r]['rawseq'];
        for (var c = 0; c < window_width; c++) {
            nuc = seq[left_bound+c];
            aln_context.fillStyle = palette[nuc];
            aln_context.fillRect(c*w, r*h, w-1, h-1);
            aln_context.strokeText(nuc, c*w + w/2, (0.5+r)*h);
        }
    }
}
