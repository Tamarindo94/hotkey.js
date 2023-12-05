// Only single hotkeys are supported, with supported modifiers ctrl, shoft, alt
function setHotkey(cmd, callback, target, override=true) {
	let tokens = cmd.replace("++", "+plus").toLowerCase().split("+").map( tok => tok.trim() )
	let ctrl = splouseBool(tokens, "ctrl")
	let shift = splouseBool(tokens, "shift")
	let alt = splouseBool(tokens, "alt")
	console.log(tokens)
	let keyCode = tokens[0].charCodeAt(0)
	;["keydown", "keyup", "keypress"].forEach( evType => {
		(target || window).addEventListener(evType, e => {
			if(ctrl !== e.ctrlKey || shift !== e.shiftKey || alt !== e.altKey || keyCode !== e.keyCode) return
			if(override) { e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation() }
			callback()
		}, true)
	})
}

function splouse(arr, startEl, ct=1) {
	let id = arr.findIndex( v => v === startEl )
	if(id === -1) return arr
	arr.splice(id, ct)
	return arr
}

function splouseBool(arr, startEl, ct=1) {
	return arr.length !== splouse(arr, startEl, ct).length
}