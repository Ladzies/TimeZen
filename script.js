//rotate handler
const rotateHand = event => {
	const elem = event.target
	elem.style.cursor = 'grabbing'
	let rotating = true
	const clock = document.querySelector('.gamut__timePicker__clock')
	const radius = 252 / 2
	const rotateHandler = e => {
		const radians = Math.atan2(e.pageX - radius, e.pageY - radius)
		let rotateDegrees = radians * (180 / Math.PI) * -1 - 180
		if (rotating) {
			elem.style.transform = `rotate(${rotateDegrees}deg)`
		}
	}
	document.addEventListener('mousemove', rotateHandler)
	const cancelRotate = event => {
		elem.style.cursor = 'grab'
		rotating = !rotating
		document.removeEventListener('mousemove', rotateHandler)
		document.removeEventListener('mouseup', cancelRotate)
	}
	document.addEventListener('mouseup', cancelRotate)
}

document.querySelector('.gamut__timePicker__minHand').addEventListener('mousedown', rotateHand)
document.querySelector('.gamut__timePicker__hrHand').addEventListener('mousedown', rotateHand)
