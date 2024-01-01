const _LOCALE = "IT"

// Only single bindings are supported, with supported modifiers ctrl, shift, alt: shift+A is ok, ctrl+A+B is not
function setHotkeys(commands, callback, target=window, triggers=["keyup"], override=true) {
	commands = toArray(commands)
	triggers = toArray(triggers)
	commands.forEach( cmd => {
		let tokens = tokenizeCmd(cmd)
		let [ctrl, shift, alt] = spliceByValues(tokens, "ctrl", "shift", "alt")
		let boundKey = _MAPS["common"][tokens[0]] || _MAPS[_LOCALE][tokens[0]] || tokens[0].charCodeAt(0)
		// console.log("ctrl", ctrl, "shift", shift, "alt", alt, "boundKey outside", boundKey, "target", target)
		;["keydown", "keyup", "keypress"].forEach( evType => {
			target.addEventListener(evType, (e) => {
				if(boundKey !== e.keyCode || ctrl !== e.ctrlKey || shift !== e.shiftKey || alt !== e.altKey) return
				// console.log("ctrl", ctrl, "shift", shift, "alt", alt, "boundKey inside", e.boundKey, "key", e.key)
				if(override) suppressEvent(e)
				if(callback && triggers.includes(e.type)) callback(e, cmd)
			}, true) // use capture
		})
		// console.log("hotkey " + cmd + " set")
	})
}

function suppressEvent(e) {
	e.preventDefault()
	e.stopPropagation()
	e.stopImmediatePropagation()
}

function tokenizeCmd(cmd) {
	return [...new Set( cmd.toLowerCase().replace("++", "+plus").split("+").map( tok => tok.trim() ) )]
}

function spliceByValues(arr, elems) {
	let ret = []
	for(let i=0, n=elems.length; i < n; i++) {
		let index = arr.findIndex( v => v === elems[i] )
		ret.push(arr.splice(index, 1)[0])
	}
	return ret
	// let ids = elems.map( el => arr.findIndex( v => v === el ) )
	// return ids.map( id => arr.splice(id, 1) )
}

function splouse(arr, ...elems) {
	for(let i=0, n=elems.length; i < n; i++) {
		let id = arr.findIndex( v => v === startEl )
		if(id !== -1) arr.splice(id, 1)
	}
	return arr
}

/** Returns true if any elem is spliced */
function splouseBool(arr, ...elems) {
	return arr.length !== splouse(arr, elems).length
}

function toArray(obj) {
	return Array.isArray(obj) ? obj : [obj]
}

const _MAPS = {
	"common": {
		'backspace': 8,
		'tab': 9,
		'enter': 13,
		'return': 13,
		'shift': 16,
		'ctrl': 17,
		'alt': 18,
		'option': 18,
		'capslock': 20,
		'esc': 27,
		'escape': 27,
		'space': 32,
		'pageup': 33,
		'pagup': 33,
		'pagedown': 34,
		'pagdown': 34,
		'pagdwn': 34,
		'end': 35,
		'home': 36,
		'left': 37,
		'up': 38,
		'right': 39,
		'down': 40,
		'ins': 45,
		'canc': 46,
		'del': 46,
		'meta': 91,
		// 'meta': 93,
		// 'meta': 224,
		'plus': 107,
		'*': 106,
		'+': 107,
		'-': 109,
		'.': 110,
		'/': 111,
		',': 188,
		'-': 189,
		'.': 190,
		'\\': 220,
	},
	"IT": {
		'scrolllock': 145,
		// 'meta': 93,
		// 'meta': 224,
		'<': 226,
		'à': 222,
		'è': 186,
		'ì': 221,
		'ò': 192,
		'ù': 191,
		"'": 219,
	},
	"US": {
		';': 186,
		'=': 187,
		'/': 191,
		'`': 192,
		'[': 219,
		']': 221,
		"'": 222,
	}
}