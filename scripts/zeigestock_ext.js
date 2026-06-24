/*
If you modify this Extension, please also consider modifying the original Script:
- https://codeberg.org/haesemeyer/pages
*/

var zeigestockDefaultEnabled = true; // enabled by default with extension

((defaultEnabled) => {

    /* Canvas */

    // Create Canvas
    let canvas = document.createElement('canvas');
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 123450;
    canvas.style.display = "none";
    // allow clicking through canvas, disable this so you can't click anything anymore
    canvas.style.pointerEvents = "none";

    // Canvas is always the size of the viewport
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    // allow resizing window without having to reload page
    window.addEventListener('resize', () => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    });

    document.body.appendChild(canvas);

    // Zeigestock Image Definition
    let zeigestock = new Image();
    zeigestock.onload = function() {
        drawZeigestock(0);
    };
    zeigestock.src = browser.runtime.getURL("assets/zeigestock.png"); // local copy of zeigestock
    zeigestock.style.objectFit = "cover";

    let ctx = canvas.getContext('2d');

    // Function to draw Zeigestock on the Canvas
    function drawZeigestock(angle, mouseX, mouseY) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.save();
        ctx.translate(window.innerWidth, window.innerHeight);
        ctx.rotate((Math.PI/2)+0.02);
        ctx.rotate(angle);
        zeigestock.height = Math.sqrt( Math.pow((mouseY), 2) + Math.pow((mouseX), 2) );
        ctx.drawImage(zeigestock, -zeigestock.width, -zeigestock.height, );
        ctx.restore();
    }

    // Function to draw Zeigestock at Mouse Position
    function moveMouse(x, y) {
        let dx = x - window.innerWidth;
        let dy = y - window.innerHeight;
        let theta = Math.atan2(dy, dx);
        drawZeigestock(theta, dx, dy);
    }

    // Mouse Move Event
    window.addEventListener('pointermove', (e) => {
        moveMouse(e.clientX, e.clientY);
    });
    // Touch Screen Event
    window.addEventListener('touchmove', (e) => {
        moveMouse(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
    });

    /* Menu */

    let zeigestockToggleText = document.createElement('span');
    zeigestockToggleText.innerText = "Zeigestock: ";

    let zeigestockToggleBox = document.createElement('input');
    zeigestockToggleBox.type = "checkbox";
    zeigestockToggleBox.addEventListener('input', () => {
        // Toggle Canvas Visibility
        canvas.style.display = (zeigestockToggleBox.checked ? "block" : "none");
        // Toggle Hidden Cursor
        if (zeigestockToggleBox.checked) {
            let hiddenCursor = document.createElement('style');
            hiddenCursor.id = 'zeigestock-hidden-cursor-style';
            hiddenCursor.textContent = "* { cursor: none !important; }";
            document.head.appendChild(hiddenCursor);
        } else {
            document.getElementById('zeigestock-hidden-cursor-style').remove();
        }
    });

    let zeigestockToggle = document.createElement('label');
    zeigestockToggle.append(zeigestockToggleText, zeigestockToggleBox);

    let zeigestockMenu = document.createElement('div');
    zeigestockMenu.ariaHidden = true;
    zeigestockMenu.style.position = "fixed";
    zeigestockMenu.style.bottom = 0;
    zeigestockMenu.style.right = 0;
    zeigestockMenu.style.zIndex = 123451;
    zeigestockMenu.appendChild(zeigestockToggle);

    document.body.appendChild(zeigestockMenu);

    if (defaultEnabled) {
        zeigestockToggleBox.checked = true;
        zeigestockToggleBox.dispatchEvent(new Event('input'));
    }

})(zeigestockDefaultEnabled);

