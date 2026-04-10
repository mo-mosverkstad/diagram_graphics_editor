window.App = window.App || {};

const svgElem = document.getElementById("mySVG");
const canvasEl = document.getElementById("myCanvas");
const toggleBtn = document.getElementById("toggleBackend");

let renderer, dragHandler;

function init(backend) {
    if (backend === "canvas") {
        svgElem.style.display = "none";
        canvasEl.style.display = "";
        renderer = new App.CanvasRenderer(canvasEl, App.components);
    } else {
        canvasEl.style.display = "none";
        svgElem.style.display = "";
        renderer = new App.SvgRenderer(svgElem, App.components);
    }
    renderer.render();
    App.shapeStore = new App.Store(App._rawShapeData, () => renderer.render());
    dragHandler = new App.DragHandler(backend === "canvas" ? canvasEl : svgElem, renderer);
    toggleBtn.textContent = "Switch to " + (backend === "canvas" ? "SVG" : "Canvas");
}

let currentBackend = "svg";
init(currentBackend);

toggleBtn.addEventListener("click", () => {
    currentBackend = currentBackend === "svg" ? "canvas" : "svg";
    init(currentBackend);
});
