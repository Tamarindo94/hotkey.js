function setHotkey(cmd, callback, override=true) {
	let tokens = cmd.replace("++", "+plus").toLowerCase().split("+")
	console.log(tokens)
	let ctrl = splouse(tokens "ctrl")
	console.log(tokens)
	let shift = splouse(tokens, "shift")
	console.log(tokens)
	let alt = splouse(tokens, "alt")
	console.log(tokens)
}

function splouse(arr, el) {
	return arr.splice(arr.findIndex( v => v === el ), 1)
}