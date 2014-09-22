/**
 * Created by art on 2014-09-20.
 */

// TODO: detect which base mouse is over
// TODO: draw highlight box around base - in render.js

function getPos(e, canvas) {
    /** Bind this event handler to mouse-over trigger to calculate
     * the mouse coordinates relative to the Canvas.
     * @param  e {event}
     * @return  Coordinates of base under the mouse pointer, with respect to the sequence
     *  index in the alignment (row) and position in the sequence (column)
     */
    var element = canvas,
        offset_x = 0,
        offset_y = 0,
        mx, my;

    // go up hierarchy to compute total offsets
    if (typeof element.offsetParent !== 'undefined') {
        do {
            offset_x += element.offsetLeft;
            offset_y += element.offsetTop;
        } while (element = element.offsetParent);
    }

    //offset_x += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    //offset_y += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offset_x;
    my = e.pageY - offset_y;

    console.log(mx, my);
    return { x: mx, y: my };

}