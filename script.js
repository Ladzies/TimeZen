const settings = {
	defaultIndex: 5,
	totalSteps: 60,
	timeEachStep: 1,
}

const formulas = {
	calcDegreePerStep: () => -(360 / settings.totalSteps),
	calcDefaultDegree: () => -(360 / settings.totalSteps) * settings.defaultIndex,
}

const getTotalTime = (degree = formulas.calcDefaultDegree()) =>
	(degree / formulas.calcDegreePerStep()) * settings.timeEachStep

const getDeltaDeg = (degree = formulas.calcDefaultDegree()) => degree / formulas.calcDegreePerStep()

const timerCirclePath = document.querySelector('.timerCirclePath')
const timerDisplay = document.querySelector('.timerDisplay')
const timerBox = document.querySelector('.timerBox')
const timerArm = document.querySelector('.timerArm')
const pointerShort = document.querySelectorAll('.pointerShort')

function changeOpacity(transition, opacity) {
	for (i = 0; i < pointerShort.length; i++) {
		pointerShort[i].style.transition = transition
		pointerShort[i].style.opacity = opacity
	}
}

/**
 When Document Loads
 */
document.addEventListener('DOMContentLoaded', () => documentDidLoad())

function documentDidLoad() {
	console.log('Document Loaded')
	timerArm.style.transform = `rotate(${formulas.calcDefaultDegree()}deg)`
	draw(formulas.calcDefaultDegree())
	timerDisplay.textContent = `${getTotalTime()}:00`
	changeOpacity('', 0)
}

/**
 When Timer Arm Is Grabbed
 */
timerArm.addEventListener('mousedown', timerHandler)

const rect = timerBox.getBoundingClientRect()
const radius = rect.width / 2

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

function timerHandler(event) {
	let rotating = true
	const rotateDegrees = e => {
		const radians = Math.atan2(e.pageX - (rect.x + radius), e.pageY - (rect.y + radius))
		return radians * (180 / Math.PI) * -1 - 180
	}

	function onRotateStart(e) {
		changeOpacity('opacity 0.5s linear 0s', 1)

		const calcDegrees = rotateDegrees(e)
		const calcSnapped =
			Math.round(calcDegrees / formulas.calcDegreePerStep()) * formulas.calcDegreePerStep()

		draw(calcDegrees)
		console.log('currentDegree: ' + calcSnapped)
		console.log('deltaDegree => ' + getDeltaDeg(calcSnapped))
		console.log('totalTimer => ' + getTotalTime(calcSnapped))
		console.log('')

		rotating ? (event.target.style.transform = `rotate(${calcDegrees}deg)`) : null

		timerDisplay.textContent = `${getTotalTime(calcSnapped)}:00`
	}

	function onRotateRelease(e) {
		changeOpacity('opacity 0.5s linear 0s', 0)
		const calcDegrees = rotateDegrees(e)
		const calcSnapped =
			Math.round(calcDegrees / formulas.calcDegreePerStep()) * formulas.calcDegreePerStep()

		draw(calcSnapped)

		rotating ? (event.target.style.transform = `rotate(${calcSnapped}deg)`) : null

		rotating = !rotating
		document.removeEventListener('mousemove', onRotateStart)
		document.removeEventListener('mouseup', onRotateRelease)
	}

	document.addEventListener('mousemove', onRotateStart)
	document.addEventListener('mouseup', onRotateRelease)
}
