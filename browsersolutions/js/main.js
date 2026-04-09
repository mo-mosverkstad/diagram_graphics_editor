window.App = window.App || {};

const svg = document.getElementById("mySVG");
const renderer = new App.Renderer(svg, App.components);

renderer.render();
new App.DragHandler(svg, renderer);
