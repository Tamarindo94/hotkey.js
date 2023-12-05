// Only single hotkeys are supported, with supported modifiers ctrl, shoft, alt
function setHotkey(cmd, callback, target=window, override=true) {
	let tokens = cmd.replace("++", "+plus").toLowerCase().split("+").map( tok => tok.trim() )
	let ctrl = splouseBool(tokens, "ctrl")
	let shift = splouseBool(tokens, "shift")
	let alt = splouseBool(tokens, "alt")
	let keyCode = tokens[0].charCodeAt(0)
	if(e.key === ":") e.keyCode = 190
	if(e.key === ";") e.keyCode = 188
	console.log("ctrl", ctrl, "shift", shift, "alt", alt, "keyCode outside", keyCode, "target", target)
	;["keydown", "keyup", "keypress"].forEach( evType => {
		target.addEventListener(evType, (e) => {
			console.log("ctrl", ctrl, "shift", shift, "alt", alt, "keyCode", e.keyCode, "key", e.key)
			if(ctrl !== e.ctrlKey || shift !== e.shiftKey || alt !== e.altKey || keyCode !== e.keyCode) return
			if(override) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation() }
			console.log("keycode inside", e.keyCode, e.key)
			if(e.type === "keyup" && callback) callback(e, cmd)
		}, true)
	})
	console.log("hotkey " + cmd + " seth")
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