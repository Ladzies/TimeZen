const timerDigit = document.querySelector('.timerDigit')

const loader = document.getElementById('loader')
let α = 250
let π = Math.PI

const cursor = {
	X: 0,
	Y: 0,
}

const entry = {
	granted: false,
}

/**
 Rotate Handler
 */

const rotateHand = event => {
	let rotating = true
	const rect = document.querySelector('.timerFace').getBoundingClientRect() // get clock size and position

	const centerY = (rect.bottom - rect.top) / 2 + rect.top
	const threshY = -(centerY / innerHeight - 0.5)

	const radius = rect.width / 2 // calculate radius based on size
	const radians = e => Math.atan2(e.pageX - (rect.x + radius), e.pageY - (rect.y + radius)) // account for position

	const rotateHandler = e => {
		let rotateDegrees = radians(e) * (180 / Math.PI) * -1 - 180
		const snappedDegrees = Math.round(rotateDegrees / 30) * 30
		console.log(rotateDegrees)

		const draw = () => {
			const radius = 125
			α = 360 - rotateDegrees
			α %= 360
			var r = (α * π) / -180,
				x = Math.sin(r) * radius,
				y = Math.cos(r) * -radius,
				mid = α > 180 ? 1 : 0,
				anim =
					'M 0 0 v ' +
					-radius +
					' A ' +
					radius +
					' ' +
					radius +
					' 1 ' +
					mid +
					' 0 ' +
					x +
					' ' +
					y +
					' z'

			loader.setAttribute('d', anim)
		}

		cursor.X = e.clientX / innerWidth - 0.5
		cursor.Y = -(e.clientY / innerHeight - 0.5)

		// if (cursor.X > 0 && cursor.Y > threshY) {
		// 	console.log('RIGHT TOP')
		// } else if (cursor.X > 0 && cursor.Y < threshY) {
		// 	console.log('RIGHT BOTTOM')
		// } else if (cursor.X < 0 && cursor.Y < threshY) {
		// 	console.log('LEFT BOTTOM')
		// } else if (cursor.X < 0 && cursor.Y > threshY) {
		// 	console.log('LEFT TOP')
		// }

		draw()

		if (rotating) {
			event.target.style.transform = `rotate(${rotateDegrees}deg)`
		}
		timerDigit.innerHTML = `${-snappedDegrees / 6}:00`
	}

	const cancelRotate = e => {
		let rotateDegrees = radians(e) * (180 / Math.PI) * -1 - 180
		const snappedDegrees = Math.round(rotateDegrees / 30) * 30

		console.log(snappedDegrees)

		const draw = () => {
			const radius = 125
			α = 360 - snappedDegrees
			α %= 360
			var r = (α * π) / -180,
				x = Math.sin(r) * radius,
				y = Math.cos(r) * -radius,
				mid = α > 180 ? 1 : 0,
				anim =
					'M 0 0 v ' +
					-radius +
					' A ' +
					radius +
					' ' +
					radius +
					' 1 ' +
					mid +
					' 0 ' +
					x +
					' ' +
					y +
					' z'

			loader.setAttribute('d', anim)
		}
		draw()

		if (rotating) {
			event.target.style.transform = `rotate(${snappedDegrees}deg)`
		}
		rotating = !rotating
		document.removeEventListener('mousemove', rotateHandler)
		document.removeEventListener('mouseup', cancelRotate)
	}

	document.addEventListener('mousemove', rotateHandler)
	document.addEventListener('mouseup', cancelRotate)
}

//

document.querySelector('.timerHand').addEventListener('mousedown', rotateHand)
