// User Settings Object

const settings = {
	defaultArmPosition: 2, //default index is where the tick is by default
	totalSteps: 12, //total steps for completing 360 deg
	timeEachStep: 10,
}

const state = {
	minutes: null,
	degree: null,
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

const timeStart = document.querySelector('.timeStart')
const timeEnd = document.querySelector('.timeEnd')

/**
 Event When Document Loads
 */

document.addEventListener('DOMContentLoaded', () => documentDidLoad())

function documentDidLoad() {
	console.log('Document Loaded')
	startButton.disabled = false
	state.minutes = getTotalTime()
	state.degree = formulas.calcDefaultDegree()
	// console.log(state.degree)
	timerArm.style.transform = `rotate(${state.degree}deg)`
	draw(state.degree)
	timerDisplay.textContent = `${state.minutes}:00`
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
		state.minutes = getTotalTime(calcSnapped) // state minutes
		state.degree = calcSnapped // state degree
		console.log('liveDegree: ' + calcLiveDegree(e))
		console.log('currentDegree: ' + calcSnapped)
		console.log('deltaDegree => ' + getDeltaDeg(calcSnapped))
		console.log('totalTimer => ' + getTotalTime(calcSnapped))
		console.log('state.degree: ' + state.degree)
		console.log('state.minutes: ' + state.minutes)
		console.log('')
		rotating ? (timerArm.style.transform = `rotate(${calcLiveDegree(e)}deg)`) : null
		timerDisplay.textContent = `${getTotalTime(calcSnapped)}:00`
	}

	function onRotateRelease(e) {
		changeOpacity('opacity 0.5s linear 0s', 0)
		const calcSnapped =
			Math.round(calcLiveDegree(e) / formulas.calcDegreePerStep()) * formulas.calcDegreePerStep()

		draw(calcSnapped)
		state.minutes = getTotalTime(calcSnapped) // state minutes
		state.degree = calcSnapped // state degree
		console.log(getTotalTime(calcSnapped))
		console.log('state.degree: ' + state.degree)
		console.log('state.minutes: ' + state.minutes)

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
	startButton.disabled = true
	let minute = state.minutes - 1
	let sec = 59
	let full = -360

	// const deltaVelocity = -(formulas.calcDefaultDegree() / (getTotalTime() * 60))
	const deltaVelocity = -state.degree / (state.minutes * 60)
	const deltaFullVelocity = 360 / (state.minutes * 60)

	const timer = setInterval(() => {
		let varOne = (state.degree += deltaVelocity) // option 1
		let varTwo = (full += deltaFullVelocity) // option 2

		draw(varTwo) // rotates the inner fill
		timerArm.style.transform = `rotate(${varTwo}deg)` // rotates the arm

		// draw((full += deltaFullVelocity))
		const formattedSec = sec < 10 ? '0' + sec : sec
		timerDisplay.textContent = minute + ':' + formattedSec
		sec--
		if (sec < 0) {
			minute--
			sec = 59
		}
		if (minute < 0) {
			console.log('times up')
			clearInterval(timer)
		}
	}, 1000)
}
function startTimer() {
	console.log('start')
}
