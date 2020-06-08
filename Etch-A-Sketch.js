// Create a webpage with 16x16 grid of square divs 

// Couple of ways I can go about doing this. 
// 1. innerHtml and insert as string (need to re-create/parse), but FASTER 
// see https://www.quirksmode.org/dom/innerhtml.html
// 1a. so you want to push strings into array then join array
// 2. createElement (Preserves existing references to DOMError, event handlers) 
// see https://stackoverflow.com/questions/2946656/advantages-of-createelement-over-innerhtml

// Creating an alias for commonly use (similar to jquery)
// getElementsByClassName returns an array-like HTMLCollection
let byClass = document.getElementsByClassName.bind(document); 
// function $(id) { return document.getElementById(id); };

function reset_grid(){
	let x = window.prompt("Square size?");
	if (x == null || x == ""){
		create_grid(64)
	} else {
		create_grid(parseInt(x))
	}
}

// this way requires that the starting image have a transparncy < 1
function update_color(element, delta) {
	const value = getComputedStyle(element).getPropertyValue("background-color");
	const rgba_vals = value.match(/[\d.]+/g);
	// If alpha is not there, add it:
	if (rgba_vals.length === 3) {
		// get property value only returns rgb if a == 1 thus we add
		rgba_vals.push(1);
	}
	rgba_vals[3] = Math.min(1, Math.max(0, parseFloat(rgba_vals[3]) + delta));
	element.style.backgroundColor = `rgba(${rgba_vals.join(',')})`;
}

function create_grid(gridSize){
	let x = byClass("grid-container");
	// using innerHTML will destroy an event listeners... so you'll need to do by DOM methods (slower)
	// or add event listeners after done with innerHTML
	let grid = ""
	let sq = Math.pow(gridSize, 2);
	for (i = 0; i < sq; ++i){
		// grid = grid.concat("<div class='grid-boxes'></div>");
		grid += "<div class='grid-boxes'></div>"
	}

	// x[0].setAttribute("style", "grid-template-row: repeat(${gridSize), auto-fill)")
	// x[0].setAttribute("style", "grid-template-column: repeat(${gridSize))")

	// Template Literals are enclosed in backtics (generally with the tilda ~ button)
	// fr unit; (CSS Grid only) - a fraction
	// so for the below: we want a fraction of each... 
	// i.e take a pie chart split into 4 (or a quarter each)
	// 1 fr would be a quarter. and 2 fr would be a half, and 3 fr would be 3/4s of the pie.grid-container
	// so your asking for a fraction of what is split into. 
	// https://university.webflow.com/article/the-fr-unit
	x[0].setAttribute("style", `grid-template: repeat(${gridSize}, 1fr) / repeat(${gridSize}, 1fr);`)
	// remember the innerHTML will destroy anything you have inside. 
	// use += to append to innerHtml without destorying insides
	x[0].innerHTML	= grid;

	function pencil(element, delta){
		element.style.backgroundColor = "black";
		// if (element.style.opacity === 1 && delta > 0) {
		// 	return;
		// }
		if (!element.style.opacity){
			element.style.opacity = 0.1;
		}
		if (element.style.opacity){
			// the plus '+' changes the opacity from string to float so you can add then it is cast back into a string
			element.style.opacity = +element.style.opacity + delta;;
		}
	}
	function draw(element){ //LMB
		// element.style.backgroundColor = "black";
		update_color(element, 0.2);
		// pencil(element, 0.2);
	}
	function erase(element){ //RMB
		// element.style.backgroundColor = "black";
		update_color(element, -0.2);
		// pencil(element, -0.2);
	}

	document.querySelectorAll('div.grid-boxes').forEach(item => {
		item.addEventListener('mouseover', event =>{
			// if (event.type == "mousedown"){
			if (event.buttons === 1 ){
				// item.classList.add('drawn')
				draw(item);
			} else if (event.buttons === 2){
				erase(item);
			}
		})
		item.addEventListener('mousedown', event =>{
			// if (event.type == "mousedown"){
			if (event.buttons === 1 ){ 
				draw(item);
			} else if (event.buttons === 2){
				erase(item);
			}
		})
		item.addEventListener('contextmenu', item => item.preventDefault())
	})
	// This does the Same thing as the querySelectorAll
	// let box = byClass("grid-boxes");
	// box[0].onmouseover = function () {
	// 	box[0].style.backgroundColor = 'green';
	// }
	// box[0].onmouseout = function () {
	// 	box[0].style.backgroundColor = 'black';
	// }
}

// ####################### MAIN ###############################
// https://stackoverflow.com/questions/9015836/why-doesnt-javascript-need-a-main-function

// This is when windows have complete loaded...jss
// use 
window.addEventListener("load", function () {
	// https://stackoverflow.com/questions/807878/how-to-make-javascript-execute-after-page-load
	document.getElementsByClassName("grid-reset")[0].addEventListener("click", function(){
		reset_grid();
	})
})

