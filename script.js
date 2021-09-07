const timerCirclePath = document.querySelector('.timerCirclePath')
const timerDisplay = document.querySelector('.timerDisplay')
const timerBox = document.querySelector('.timerBox')
const timerArm = document.querySelector('.timerArm')

/**
 When Document Loads
 */
document.addEventListener('DOMContentLoaded', () => documentDidLoad())

function documentDidLoad() {
	console.log('Document Loaded')
}

/**
 When Timer Arm Is Grabbed
 */
timerArm.addEventListener('mousedown', timerHandler)

function timerHandler(event) {
	let rotating = true
	const rect = timerBox.getBoundingClientRect()
	const radius = rect.width / 2
	const rotateDegrees = e => {
		const radians = Math.atan2(e.pageX - (rect.x + radius), e.pageY - (rect.y + radius))
		return radians * (180 / Math.PI) * -1 - 180
	}

	const onRotateStart = e => {
		const calcDegrees = rotateDegrees(e)
		const calcSnapped = Math.round(calcDegrees / 30) * 30
		console.log(calcSnapped)

		draw(calcDegrees)

		rotating ? (event.target.style.transform = `rotate(${calcDegrees}deg)`) : null

		timerDisplay.textContent = `${-calcSnapped / 6}:00`
	}

	const onRotateRelease = e => {
		const calcDegrees = rotateDegrees(e)
		const calcSnapped = Math.round(calcDegrees / 30) * 30

		draw(calcSnapped)

		rotating ? (event.target.style.transform = `rotate(${calcSnapped}deg)`) : null

		rotating = !rotating
		document.removeEventListener('mousemove', onRotateStart)
		document.removeEventListener('mouseup', onRotateRelease)
	}

	document.addEventListener('mousemove', onRotateStart)
	document.addEventListener('mouseup', onRotateRelease)
}

/**
 Logic
 */
function draw(degree) {
	let angle
	const radius = 125
	angle = 360 - degree
	angle %= 360
	const r = (angle * Math.PI) / -180,
		x = Math.sin(r) * radius,
		y = Math.cos(r) * -radius,
		mid = angle > 180 ? 1 : 0, // change this to 0 : 1 to reverse
		anim =
			'M 0 0 v ' +
			-radius +
			' A ' +
			radius +
			' ' +
			radius +
			' 1 ' +
			mid +
			' 0 ' + // change this to 1 to reverse
			x +
			' ' +
			y +
			' z'

	timerCirclePath.setAttribute('d', anim)
}
