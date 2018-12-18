function hslToRgb(h, s, l) 
// source https://gist.github.com/mjackson/5311256
{
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}

function mandelDepth(a, b, h, w, iteration) {
	let ca = a;
	let cb = b;
	
	var n = 0;

	while (n < iteration) {
		let aa = a * a - b * b;
	    let bb = 2 * a * b;
	    a = aa + ca;
	    b = bb + cb;
	    if (a * a + b * b > 5) {
	      break;
	    }
		n++;
	}
	return n;
}

let genericMandel = function(c, div, w, h){
	function genericMandelHelper(p){
		let iteration;
		let flags;
		//let  w = 900;
		//let  h = 700;
		p.setup = function(){
			p.createCanvas(w, h);
			p.pixelDensity(1);
			p.frameRate(5);
			iteration = 0;
			//flags = new Array(w*h).fill(0);
		};

		p.draw = function(){
			p.loadPixels();
			for (var x = 0; x < w; x++){
				for (var y = 0; y < h; y++){
					if(true){

						let a = p.map(x, 0, w, -2.3, 1.3);
						let b = p.map(y, 0, h, -1.5, 1.5);

						let n = mandelDepth(a, b, h, w, iteration);

					    //if(n < iteration) flags[x+y*w] = 1; // hit the limit, no need to recalc

					    let color = iteration == 0? 0 : hslToRgb(c, 1, ( (n/iteration)));

						let pix = (x + y * w) * 4;

						p.pixels[pix + 0] = color[0];
						p.pixels[pix + 1] = color[1];
						p.pixels[pix + 2] = color[2];
						p.pixels[pix + 3] = 255; // alpha channel
					}
				} 
			}
			iteration++;
			if(iteration == 30){ 
				iteration = 0;
				//flags.fill(0);
			}
			p.updatePixels();
		}
	}
	return new p5(genericMandelHelper, div);
}

let genericStaticMandel = function(c, div, w, h, deep){
	function genericMandelHelper(p){
		//let iteration;
		let flags;
		//let  w = 900;
		//let  h = 700;
		p.setup = function(){
			p.createCanvas(w, h);
			p.pixelDensity(1);

			p.loadPixels();
			
			for (var x = 0; x < w; x++){
				for (var y = 0; y < h; y++){
					if(true){

						let a = p.map(x, 0, w, -2.3, 1.3);
						let b = p.map(y, 0, h, -1.3, 1.3);
						let n = mandelDepth(a, b, h, w, deep);
						let color =  hslToRgb(c, 1, ( (n/deep)));
						let pix = (x + y * w) * 4;

						p.pixels[pix + 0] = color[0];
						p.pixels[pix + 1] = color[1];
						p.pixels[pix + 2] = color[2];
						p.pixels[pix + 3] = 255; // alpha channel
					}
				} 
			}
		p.updatePixels();
		var event = new Event('setupDone');
		document.getElementById(div).dispatchEvent(event);
		}
	}
	return new p5(genericMandelHelper, div);
}

let genericInteractiveMandel = function(c, div, w, h, deep, ox1, ox2, oy1, oy2, x1, x2, y1, y2){
	function genericMandelHelper(p){
		//let iteration;
		let flags;
		//let  w = 900;
		//let  h = 700;
		p.setup = function(){
			p.createCanvas(w, h);
			p.pixelDensity(1);

			p.loadPixels();

			let lx = p.map(x1, 0, w, ox1, ox2);
			let rx = p.map(x2, 0, w, ox1, ox2);
			let ly = p.map(y1, 0, h, oy1, oy2);
			let ry = p.map(y2, 0, h, oy1, oy2);
			
			for (var x = 0; x < w; x++){
				for (var y = 0; y < h; y++){
					if(true){
						
						let a = p.map(x, 0, w, lx, rx);
						let b = p.map(y, 0, h, ly, ry);
						let n = mandelDepth(a, b, h, w, deep);
						let color =  hslToRgb(c, 1, ( (n/deep)));
						let pix = (x + y * w) * 4;

						p.pixels[pix + 0] = color[0];
						p.pixels[pix + 1] = color[1];
						p.pixels[pix + 2] = color[2];
						p.pixels[pix + 3] = 255; // alpha channel
					}
				} 
			}
		p.updatePixels();
		let evt = new CustomEvent('setupDone', {detail: {x1: lx, 
					x2: rx, 
					y1: ly, 
					y2: ry}});
		document.getElementById(div).dispatchEvent(evt);
		}
	}
	return new p5(genericMandelHelper, div);
}

let squareOverlay = function(div, w, h) {
		function squareOverlayHelper(p){
		//let iteration;
		let draws;
		let square;
		let xcoord1, xcoord2, ycoord1, ycoord2;
		//let  w = 900;
		//let  h = 700;
		p.setup = function(){
			p.createCanvas(w, h);
			p.pixelDensity(1);
			p.stroke(255, 204, 0);
			p.noFill();
			function Sqr() {
				this.display = function() {
					p.rect(Math.min(xcoord1, xcoord2), 
						   Math.min(ycoord1, ycoord2), 
						   Math.max(xcoord1, xcoord2) - Math.min(xcoord1, xcoord2), 
						   Math.max(ycoord1, ycoord2) - Math.min(ycoord1, ycoord2));
				}
			}

			square = new Sqr();

			function firstCorner() {
				xcoord1 = p.pmouseX;
				ycoord1 = p.pmouseY;
				xcoord2 = p.pmouseX;
				ycoord2 = p.pmouseY;

				draws = 1;
				document.getElementById(div).removeEventListener("mousedown", firstCorner);
				document.getElementById(div).addEventListener("mouseup", secondCorner);
			}

			function secondCorner() {
				xcoord2 = p.pmouseX;
				ycoord2 = p.pmouseY;
				draws = 0;
				document.getElementById(div).removeEventListener("mouseup", secondCorner);
				document.getElementById(div).addEventListener("mousedown", firstCorner);
				let evt = new CustomEvent('zoom', {detail: {x1: Math.min(xcoord1, xcoord2), 
					x2: Math.max(xcoord1, xcoord2), 
					y1: Math.min(ycoord1, ycoord2), 
					y2: Math.max(ycoord1, ycoord2)}});
				document.getElementById(div).dispatchEvent(evt);
			}

			document.getElementById(div).addEventListener("mousedown", firstCorner);
		}

		p.draw = function() {
			p.clear();
			xcoord2 = p.pmouseX;
			ycoord2 = p.pmouseY;
			if(draws) {
				square.display();
				// console.log(Math.min(xcoord1, xcoord2), Math.min(ycoord1, ycoord2), Math.max(xcoord1, xcoord2), Math.max(ycoord1, ycoord2));
			}
		}
	}
	return new p5(squareOverlayHelper, div);
}
/*
for (i = 1; i < 10; i++){
	var x = document.createElement("div");
	x.id = 'c' + i;
	genericMandel(1/i, 'c'+i);
}*/
window.onload = function() {
	/*
	let colors = [0.9, 0.3, 0.6]
	let i = 0;
	setInterval(function() {
		document.getElementById("c1").innerHTML = '';
		col = Math.random();
		de = Math.floor(Math.random()*70);
		genericStaticMandel(col, 'c1', 1000, 700, de);
		console.log(col + ': ' + de);
		//i = (i+1)%colors.length;
	}, 1000);
	*/
	document.getElementById("c1").addEventListener('setupDone', function(e) {
		document.getElementById("c1").childNodes[0].nodeValue = '';
		ox1 = e.detail.x1;
		ox2 = e.detail.x2;
		oy1 = e.detail.y1;
		oy2 = e.detail.y2;
	});
	w = 1200;
	h = 800;

	let ox1 = -2.3;
	let ox2 = 1.3;
	let oy1 = -1.3;
	let oy2 = 1.3;

	genericInteractiveMandel(0.8115176388506955, 'c1', w, h, 200, ox1, ox2, oy1, oy2, 0, w, 0, h);
	squareOverlay('c2', w, h);
	document.getElementById('c2').addEventListener('zoom', function(e) {
		document.getElementById("c1").innerHTML = '';
		console.log(e)
		console.log(ox1, ox2, oy1, oy2, e.detail.x1, e.detail.y1, e.detail.x2, e.detail.y2)
		genericInteractiveMandel(0.8115176388506955, 'c1', w, h, 200, ox1, ox2, oy1, oy2, e.detail.x1, e.detail.x2, e.detail.y1, e.detail.y2);
		console.log('this worked')
	})
};

function reset() {
	location.reload();
}



// Simple example, see optional options for more configuration.

