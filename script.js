// User Settings Object

const settings = {
	defaultArmPosition: 2, //default index is where the tick is by default
	totalSteps: 12, //total steps for completing 360 deg
	timeEachStep: 5,
}

const state = {
	minutes: null,
}

// Formulas Object
const formulas = {
	calcDegreePerStep: () => -(360 / settings.totalSteps),
	calcDefaultDegree: () => -(360 / settings.totalSteps) * settings.defaultArmPosition,
}

const getTotalTime = (degree = formulas.calcDefaultDegree()) =>
	(degree / formulas.calcDegreePerStep()) * settings.timeEachStep

const getDeltaDeg = (degree = formulas.calcDefaultDegree()) => degree / formulas.calcDegreePerStep()

const changeOpacity = (transition, opacity) => {
	for (i = 0; i < pointerShort.length; i++) {
		pointerShort[i].style.transition = transition
		pointerShort[i].style.opacity = opacity
	}
}

// Some Queries

const timerCirclePath = document.querySelector('.timerCirclePath')
const timerDisplay = document.querySelector('.timerDisplay')
const timerBox = document.querySelector('.timerBox')
const timerArm = document.querySelector('.timerArm')
const startButton = document.querySelector('.btn')
const pointerShort = document.querySelectorAll('.pointerShort')

/**
 Event When Document Loads
 */
document.addEventListener('DOMContentLoaded', () => documentDidLoad())

function documentDidLoad() {
	console.log('Document Loaded')
	state.minutes = getTotalTime()
	timerArm.style.transform = `rotate(${formulas.calcDefaultDegree()}deg)`
	draw(formulas.calcDefaultDegree())
	timerDisplay.textContent = `${getTotalTime()}:00`
	changeOpacity('', 0)
}

/**
 Event When Timer Arm Is Grabbed
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
	const calcLiveDegree = e => {
		const radians = Math.atan2(e.pageX - (rect.x + radius), e.pageY - (rect.y + radius))
		return radians * (180 / Math.PI) * -1 - 180
	}

	function onRotateStart(e) {
		changeOpacity('opacity 0.5s linear 0s', 1)

		const calcSnapped =
			Math.round(calcLiveDegree(e) / formulas.calcDegreePerStep()) * formulas.calcDegreePerStep()

		draw(calcLiveDegree(e))
		// console.log('liveDegree: ' + calcLiveDegree(e))
		// console.log('currentDegree: ' + calcSnapped)
		// console.log('deltaDegree => ' + getDeltaDeg(calcSnapped))
		// console.log('totalTimer => ' + getTotalTime(calcSnapped))
		// console.log('')
		rotating ? (event.target.style.transform = `rotate(${calcLiveDegree(e)}deg)`) : null
		timerDisplay.textContent = `${getTotalTime(calcSnapped)}:00`
	}

	function onRotateRelease(e) {
		changeOpacity('opacity 0.5s linear 0s', 0)
		const calcSnapped =
			Math.round(calcLiveDegree(e) / formulas.calcDegreePerStep()) * formulas.calcDegreePerStep()

		draw(calcSnapped)
		console.log(getTotalTime(calcSnapped))
		state.minutes = getTotalTime(calcSnapped)

		rotating ? (event.target.style.transform = `rotate(${calcSnapped}deg)`) : null

		rotating = !rotating
		document.removeEventListener('mousemove', onRotateStart)
		document.removeEventListener('mouseup', onRotateRelease)
	}

	document.addEventListener('mousemove', onRotateStart)
	document.addEventListener('mouseup', onRotateRelease)
}

startButton.addEventListener('click', timer)

function timer() {
	let minute = state.minutes - 1
	let sec = 59

	setInterval(() => {
		timerDisplay.textContent = minute + ':' + pad(sec)
		sec--
		if (sec < 0) {
			minute--
			sec = 59
			if (minute === 0) {
				console.log('times up')
			}
		}
	}, 1000)
}
function startTimer() {
	console.log('start')
}

function pad(n) {
	return n < 10 ? '0' + n : n
}
