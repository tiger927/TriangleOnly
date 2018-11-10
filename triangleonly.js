var ai;
var target;
var tarr;
var interval;
var population = [];
var pop_s = 75;
var gn = 0;
var mr = 0.01;
var kn = 0.15;
var n = 75;
var ma = 0.1;
var backgroundc;
var sourcep;
var runyn = true;

function setup() {
	gn = 0;
	ai = document.getElementById("ai");
	target = document.getElementById("target");

	for(var i = 0;i < pop_s;i++) {
		population.push(new gene());
		for(var j = 0;j < 10 * n;j++) {
			population[i].gene.push(Math.random());
		}
	}
	var bi = new Image();
	bi.src = sourcep;
	bi.onload = function(){
    	target.getContext("2d").drawImage(bi, 0, 0);
    	tarr = target.getContext("2d").getImageData(0,0,200,200).data
	}
}

function draw() {
	if(!runyn) return;
	runyn = false;
	//noLoop();
	for(var i = 0;i < population.length;i++) {
		population[i].Cfitness();
	}
	population.sort(function(a,b){return b.fitness - a.fitness});
	population[0].show();
	gn++;
	document.getElementById("generation").innerHTML = "Generation " + gn;
	document.getElementById("fitness").innerHTML = "Fitness Value: " + population[0].fitness * 100 + "%"

	var tmp = [];
	var rc = Math.ceil(1 / kn);
	var cutOff = (pop_s * kn) >> 0;
	rc = (pop_s / cutOff) >> 0;
	for(var i = 0;i < cutOff;i++) {
		for(var j = 0;j < rc;j++) {
			var ranI = i;
			while(ranI == i) {
				ranI = (cutOff * Math.random()) >> 0
			}
			tmp.push(reproduce(population[i],population[ranI]));
		}
	}
	population = [];
	population = tmp;
	runyn = true;
}

function start() {
	interval = setInterval(function(){ draw() }, 100);
}

function stop() {
	clearInterval(interval);
}

function mean() {
	var tmp = 0;
	for(var i = 0;i < population.length;i++) {
		tmp += population[i].fitness;
	}
	return tmp/population.length;
}

function gene() {
	this.gene = [];
	this.fitness = -1;
}

function reproduce(s1,s2) {
	var result = new gene();
	for(var i = 0;i < n;i++) {
		var tmpGene = (Math.random() > 0.5) ? s1 : s2;
		for(var j = 0;j < 10;j++) {
			result.gene.push(tmpGene.gene[i * 10 + j]);
			if(Math.random() < mr) {
				result.gene[result.gene.length - 1] = Math.max(Math.min(result.gene[result.gene.length - 1] + ma * (2 * Math.random() - 1),1),0);
			}
		}
	}
	return result;
}


gene.prototype.show = function() {
	var ctx = ai.getContext("2d");
	ctx.fillStyle = backgroundc;
    ctx.fillRect(0,0,200,200);
	for(var i = 0;i < n * 10;i += 10) {
		//ai.fill(this.gene[i + 0] * 256,this.gene[i + 1] * 256,this.gene[i + 2] * 256,this.gene[i + 3] * 256)
		ctx.beginPath();
		ctx.moveTo(this.gene[i + 4] * 200,this.gene[i + 5] * 200);
		ctx.lineTo(this.gene[i + 6] * 200,this.gene[i + 7] * 200);
		ctx.lineTo(this.gene[i + 8] * 200,this.gene[i + 9] * 200);
		ctx.closePath();
		ctx.fillStyle = "rgba(" + this.gene[i + 0] * 255 + "," + this.gene[i + 1] * 255 + "," + (this.gene[i + 2] * 255) + "," + this.gene[i + 3] + ")";
		ctx.fill();
	}
}

gene.prototype.Cfitness = function() {
	this.show();
	var tmp = ai.getContext("2d").getImageData(0,0,200,200).data;
	var diff = 0;
	for (var i = 0; i < 200 * 200 * 4;i++) {
        var dp = tmp[i] - tarr[i];
        diff += dp * dp;
    }

    this.fitness = 1 - diff / (200 * 200 * 4 * 256 * 256);
}