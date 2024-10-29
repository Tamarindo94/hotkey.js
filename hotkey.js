setHotkeys._LOCALE = "IT"
setHotkeys._keyEvTypes = ["keydown", "keyup", "keypress"]

setHotkeys._defaultOpts = { // freeze it?
	target: window,
	triggers: ["keyup"],
	override: true,
	once: false,
	log: false,
	ignoreModifiers: false,
	skipInputFields: true
}

function setHotkeysDefaultOpts(nuOpts) {
	setHotkeys._defaultOpts = {...setHotkeys._defaultOpts, ...nuOpts}
	return setHotkeys._defaultOpts
}

Event.prototype.suppress = function() {
	this.preventDefault()
	this.stopPropagation()
	this.stopImmediatePropagation()	
}

// Can only bind one key, with modifiers ctrl, shift, alt: shift+A is ok, ctrl+A+B is not
function setHotkeys(commands, callback, opts) {
	const self = setHotkeys
	if(typeof callback === "object" && typeof opts === "function")
		[callback, opts] = [opts, callback]
	opts = {...self._defaultOpts, ...opts}
	if(typeof opts.triggers === "string") opts.triggers = opts.triggers.split(" ")

	_toArray(commands).forEach( cmd => {
		let ctrl, shift, alt, tokens = _tokenizeCmd(cmd)
		if(!opts.ignoreModifiers) [ctrl, shift, alt] = ["ctrl", "shift", "alt"].map( k => !!_spliceValue(tokens, k) )
		let boundKey = self._MAPS["common"][tokens[0]] ||
				self._MAPS[self._LOCALE][tokens[0]] ||
				tokens[0].toUpperCase().charCodeAt(0) // tokens not in _maps must be uppercase for keyCode to match boundKey
		// console.log("ctrl", ctrl, "shift", shift, "alt", alt, "boundKey outside", boundKey, "target", target)
		const hotkeyCb = (e) => {
			if(opts.log) console.log(`boundkey: ${boundKey}, pressed: ${e.keyCode}, e: ${e.type}`)
			if(opts.log) console.log("ctrl",ctrl,"shift",shift,"alt",alt, "boundKey inside", boundKey, "key", e.keyCode)
			if(boundKey !== e.keyCode) return
			if(!opts.ignoreModifiers && (ctrl !== e.ctrlKey || shift !== e.shiftKey || alt !== e.altKey)) return
			if(opts.skipInputFields && e.target.matches('input, select, textarea, div[contenteditable="true"]')) return
			if(opts.override) e.suppress()
			else if(e.type === "keydown" && opts.triggers.join() === "keyup")
				e.suppress() // suppress keydown event even with override=false if only trigger is keyup
			if(opts.triggers.includes(e.type)) {
				if(opts.log) console.log(`Trigger for ${cmd}`)
				if(callback) callback(e, cmd)
				if(!opts.once) return
				self._keyEvTypes.forEach( evType => opts.target.removeEventListener(evType, hotkeyCb, {capture:true}) )
			}
		}
		self._keyEvTypes.forEach( evType => opts.target.addEventListener(evType, hotkeyCb, true) ) // use capture
		if(opts.log) console.log(`hotkey ${cmd} set`)
	})

	function _tokenizeCmd(cmd) {
		return [...new Set( cmd.toLowerCase().replace("++", "+plus").split("+").map( tok => tok.trim() ) )]
	}

	function _spliceValue(arr, splicer) {
		for(let i=0, n=arr.length; i < n; i++)
			if(arr[i] === splicer)
				return arr.splice(i, 1)[0]
	}
	
	function _toArray(obj) {
		return Array.isArray(obj) ? obj : [obj]
	}
}

setHotkeys._MAPS = {
	"common": {
		'backspace': 8,
		'tab': 9,
		'enter': 13, 'return': 13,
		'shift': 16,
		'ctrl': 17,
		'alt': 18, 'option': 18,
		'capslock': 20,
		'esc': 27, 'escape': 27,
		'space': 32,
		'pageup': 33, 'pagup': 33,
		'pagedown': 34,	'pagdown': 34,
		'end': 35,
		'home': 36,
		'left': 37,
		'up': 38,
		'right': 39,
		'down': 40,
		'ins': 45,
		'canc': 46, 'del': 46,
		'meta': 91,
		// 'meta': 93,
		// 'meta': 224,
		'plus': 107,
		'*': 106,
		'numpadplus': 107, 'numpadadd': 107,
		'numpad-': 109,	'numpadsub': 109,	'numpadminus': 109,
		'numpad.': 110,	'numpaddot': 110,
		'numpad/': 111,	'numpaddiv': 111, 'numpadslash': 111,
		'comma': 188,	',': 188,
		'minus': 189,	'-': 189,
		'dot': 190,	'.': 190,
		'backslash': 220,	'\\': 220,
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