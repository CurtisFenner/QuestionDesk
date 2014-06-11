function Answer(fragment) {
	var res = [];
	// First; reorder the fragment into a list of objects and their modifiers
	var link = [];
	Links(fragment,link);

	for (var i = 0; i < link.length; i++) {
		res.push(link[i][0].plain + " &rarr; " + link[i][1].plain);
	}
	return "Find object restricted by:<ul><li>" + res.join("<li>") + "</ul>";
}

function starContain(a,b) {
	return (a.indexOf(b) >= 0 || (a == b.substring(1) && b.charAt(0) == "*"));
}

function Links(fragment,modout) {
	var mods = [
		["adv","verb"],
		["adv","adj"],
		["prep","verb"],
		["prep-phrase","cop"],
		["prep-phrase","noun"],
		["prep-phrase","uncount"],
		["obj","cop"],
		["cop","sub"],
		["sub","verb"],
		["verb","sub"],
		["obj","verb"],
		["aux","cop"],
		["aux","verb"],
		["*not","cop"],
		["*not","verb"],
		["qword","obj"],
		["qword","noun"],
		["qword","uncount"],
		["det","noun"],
		["det","uncount"],
		["det","plural"],
		["qword","cop"],
		["obj","cop"]
	];
	var c = fragment.component;
	if (c instanceof Array) {
		for (var i = 0; i < c.length; i++) {
			for (var j = 0; j < c.length; j++) {
				if (i != j) {
					var a = c[i].type;
					var b = c[j].type;
					for (var k = 0; k < mods.length; k++) {
						var u = mods[k][0];
						var v = mods[k][1];
						if (starContain(a,u) && starContain(b,v)) {
							modout.push([c[i],c[j]]);
						}
					}
				}
			}
			Links(c[i],modout);
		}
	}
}