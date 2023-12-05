function setHotkey(cmd, callback, override=true) {
	let tokens = cmd.replace("++", "+plus").toLowerCase().split("+")
	let ctrl = splouse(tokens, "ctrl")
	let shift = splouse(tokens, "shift")
	let alt = splouse(tokens, "alt")
}

function splouse(arr, el) {
	let id = arr.findIndex( v => v === el )
	if(id === -1) return false
	arr.splice(id, 1)
	return true
}