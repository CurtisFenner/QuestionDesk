"use strict";

String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var rules = [];

var dictionary = {};

var inference = {};
inference["[adv]"] = function(word) {
	return word.endsWith("ly");
}
inference["[comp-adj]"] = function(word) {
	return word.endsWith("er");
}
inference["[pos]"] = function(word) {
	return word.endsWith("'s") || word.endsWith("s'");
}

function Dictionary(word) {
	if (dictionary[word]) {
		return dictionary[word];
	}
	/*if (word.endsWith("family")) {
		return ["noun","adj"];
	}
	if (word.endsWith("ily")) {
		return ["adv"];
	}
	if (word.endsWith("ingly") && word.length > 7) {
		return ["adv"];
	}*/
	var q = ["[noun]","[adj]","[adv]","[trans-verb]","[intrans-verb]","[uncount]","[comp-adj]"];
	var r = [];
	for (var i = 0; i < q.length; i++) {
		if (inference[q[i]] && !inference[q[i]](word)) {

		} else {
			r.push(q[i]);
		}
	}
	return r;
}

function Rule(from,to) {
	if (!to) {
		console.log("RULE NOT DEFINNNN");
		(false).kill();
	}
	if (from instanceof Array) {

	} else {
		console.log("FROM NOT LIST");
		(false).kill();
	}
	rules.push({match:from,result:to});
}
