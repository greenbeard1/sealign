/**
 * sealign.js
 * Combine redraw operations and raw data to render view of alignment,
 * using SVG.
 */


function CanvasState(aln_canvas, lab_canvas) {
    /**
     * A JS prototype for storing persistent information
     */

    this.palette = {'A': 'rgb(200,0,0)', 'C': 'rgb(0,150,0)', 'G': 'rgb(90,90,90)', 'T': 'rgb(0,0,200)'};
    this.base_w = 16;  // width of a residue (nucleotide/amino acid)
    this.base_h = 20;  // height of  "  "

    // set up alignment canvas
    this.aln_canvas = aln_canvas;
    this.aln_width = aln_canvas.width;
    this.aln_height = aln_canvas.height;
    this.aln_pos_y = aln_canvas.offsetTop;
    this.aln_pos_x = aln_canvas.offsetLeft;
    this.aln_context = aln_canvas.getContext('2d');

    // used to adjust for some issues with mouse coordinates
    this.aln_stylePaddingLeft = 0;
    this.aln_stylePaddingTop = 0;
    this.aln_styleBorderLeft = 0;
    this.aln_styleBorderTop = 0;
    if (window.getComputedStyle) {
        this.aln_stylePaddingLeft = parseInt(getComputedStyle(aln_canvas, null).getPropertyValue('padding-left'));
        this.aln_stylePaddingTop = parseInt(getComputedStyle(aln_canvas, null).getPropertyValue('padding-top'));
        this.aln_styleBorderLeft = parseInt(getComputedStyle(aln_canvas, null).getPropertyValue('border-left-width'));
        this.aln_styleBorderTop = parseInt(getComputedStyle(aln_canvas, null).getPropertyValue('border-top-width'));
    }

    // set up label canvas
    this.lab_canvas = lab_canvas;
    this.lab_width = lab_canvas.width;
    this.lab_height = lab_canvas.height;
    this.lab_pos_y = lab_canvas.offsetTop;
    this.lab_pos_x = lab_canvas.offsetLeft;
    this.lab_context = lab_canvas.getContext('2d');

    this.lab_stylePaddingLeft = 0;
    this.lab_stylePaddingTop = 0;
    this.lab_styleBorderLeft = 0;
    this.lab_styleBorderTop = 0;
    if (window.getComputedStyle) {
        this.lab_stylePaddingLeft = parseInt(getComputedStyle(lab_canvas, null).getPropertyValue('padding-left'));
        this.lab_stylePaddingTop = parseInt(getComputedStyle(lab_canvas, null).getPropertyValue('padding-top'));
        this.lab_styleBorderLeft = parseInt(getComputedStyle(lab_canvas, null).getPropertyValue('border-left-width'));
        this.lab_styleBorderTop = parseInt(getComputedStyle(lab_canvas, null).getPropertyValue('border-top-width'));
    }

    // adjust for fixed-position bars at top or left of page
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    this.valid = false; // if false, canvas will redraw everything
    this.dragging = false; // if mouse drag
    this.selection = null; // reference to active (selected) object
    this.dragoffx = 0; // where in the object we clicked
    this.dragoffy = 0;

    //this.v_slider = $('#vertical_slider');

    this.operations = [];  // alignment operations

    var myState = this;

    // bind mouse-over event handlers
    aln_canvas.addEventListener('mousemove', function(e) {
        myState.getAlignPos(e);
    }, true);

    $('#vertical_slider').slider({
        slide: function (event, ui) {
            myState.redraw_alignment($('#alignment_slider').slider('value'), ui.value);
        }
    });

    $('#alignment_slider').slider({
        slide: function(event, ui) {
            myState.redraw_alignment(ui.value, $('#vertical_slider').slider('value'));
        }
    });
}


CanvasState.prototype.redraw_alignment = function (x, y) {
    /**
     * Display the alignment within the x, y boundaries of the canvas.
     * @param {number} x  An integer ranging from 1 to the maximum
     *  sequence length.
     * @param {number} y  An integer ranging from 1 to the number of
     *  sequences in the alignment.
     */
    // TODO: apply alignment operations
    if (alignment.length == 0) {
        return;
    }

    var nuc, header, seq;

    var window_width = Math.floor(this.aln_canvas.width / this.base_w),
        maxlen = $('#alignment_slider').slider('option', 'max'),
        left_bound = Math.min(x, maxlen-window_width);

    var window_height = Math.floor(this.aln_canvas.height / this.base_h),
        upper_bound = alignment.length - Math.max(y, window_height);

    console.log(this.aln_canvas.width, this.aln_canvas.height);

    // clear the canvases
    this.aln_context.clearRect(0, 0, this.aln_canvas.width, this.aln_canvas.height);
    this.lab_context.clearRect(0, 0, this.lab_canvas.width, this.lab_canvas.height);

    // redraw only bases in canvas range
    for (var r = 0; r < window_height; r++) {
        if ((upper_bound + r) >= alignment.length) {
            break;
        }
        header = alignment[upper_bound + r]['header'];
        this.lab_context.strokeText(header, 1, (0.5+r)*this.base_h);

        seq = alignment[upper_bound + r]['rawseq'];
        for (var c = 0; c < window_width; c++) {
            nuc = seq[left_bound+c];
            this.aln_context.fillStyle = this.palette[nuc];
            this.aln_context.fillRect(
                    c*this.base_w,
                    r*this.base_h,
                    this.base_w-1,
                    this.base_h-1);
            this.aln_context.strokeText(nuc, (c+0.5)*this.base_w, (r+0.5)*this.base_h);
        }
    }
};

CanvasState.prototype.resizeCanvas = function() {
    /**
     * Whenever window is resized, reset canvas dimensions
     * accordingly, and redraw contents.
     */

    this.aln_canvas.style.width = "100%";
    this.aln_canvas.style.height = "100%";
    this.aln_canvas.width = this.aln_canvas.offsetWidth;
    this.aln_canvas.height = this.aln_canvas.offsetHeight;

    this.lab_canvas.style.width = "100%";
    this.lab_canvas.style.height = "100%";
    this.lab_canvas.width = this.lab_canvas.offsetWidth;
    this.lab_canvas.height = this.lab_canvas.offsetHeight;

    this.lab_context.font = '12px Courier New, Courier, serif';
    this.lab_context.textBaseline = 'middle';
    this.lab_context.strokeStyle = 'black';

    this.aln_context.textAlign = 'center';
    this.aln_context.font = '12px Courier New, Courier, serif';
    this.aln_context.textBaseline = 'middle';
    this.aln_context.strokeStyle = 'white';

    // update slider min value
    var vslider = $('#vertical_slider');
    vslider.slider('option', 'min', Math.floor(this.aln_canvas.height / this.base_h));

    this.redraw_alignment($('#alignment_slider').slider('value'), vslider.slider('value'));
};

