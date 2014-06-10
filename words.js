"use strict";


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


function matches(fragments,match,from) {
	// *match* is a list of *type*s of fragments
	if (match.length == []) {
		return [{from:from,next:from,component:[]}];
	}
	var results = [];
	for (var i = 0; i < fragments.length; i++) {
		var fragment = fragments[i];
		if (fragment.from == from && fragment.type === match[0]) {
			var k = matches(fragments,match.slice(1),fragment.next);
			for (var j = 0; j < k.length; j++) {
				k[j].component.push(fragment);
			}
			results = results.concat(k);
		}
	}
	for (var i = 0; i < results.length; i++) {
		results[i].from = from;
	}
	return results;
}

function addOnce(list,element) {
	var serial = element.serial;
	for (var i = 0; i < list.length; i++) {
		if (list[i].serial == serial) {
			return false;
		}
	}
	list.push(element);
	return true;
}

function parses(wordList,rules,all) {
	var fragments = [];
	for (var i = 0; i < wordList.length; i++) {
		var word = wordList[i];
		var entry = Dictionary(word);
		if (!(entry instanceof Array)) {
			entry = [entry];
		}
		for (var j = 0; j < entry.length; j++) {
			var form = entry[j];
			fragments.push({from:i,next:i+1,type:form,component:[word]});
		}
		fragments.push({from:i,next:i+1,type: word,component:[word]});
	}
	var change = true;
	while (change) {
		change = false;
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			var rs = [];
			for (var j = 0; j < wordList.length; j++) {
				rs = rs.concat(matches(fragments,rule.match,j));
			}
			for (var j = 0; j < rs.length; j++) {
				rs[j].type = rule.result;
				rs[j].component.reverse();
				rs[j].serial = [];
				for (var k = 0; k < rs[j].component.length; k++) {
					var f = rs[j].component[k];
					rs[j].serial.push(fragments.indexOf(f));
				}
				rs[j].serial = rs[j].serial.join(",") + "->" + rule.result;
				if (addOnce(fragments,rs[j])) {
					change = true;
				}
			}
		}
	}
	if (all) {
		return fragments;
	}
	var result = [];
	for (var i = 0; i < fragments.length; i++) {
		var fragment = fragments[i];
		if (fragment.from == 0 && fragment.next == wordList.length) {
			result.push(fragment);
		}
	}
	return result;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


function Words(str) {
	str = str.replace(/([,"!.:;?])/g," $1 ");
	str = str.replace(/((?:'s)|(?:s'))/g," $1 ");
	str = str.replace(/[.!]/g,"");
	str = str.replace(/\s+/g," ").trim();
	return str.toLowerCase().split(" ");
}

function Parse(str) {
	return parses(Words(str),rules);
}