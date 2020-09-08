const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.game-area');

//create car-player
const car = document.createElement('div');
car.classList.add('car');

//object keys
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

//play settings
const settings = {
    start: false,
    score: 0,
    speed: 3
};

//start races
const startGame = () => {
    start.classList.add('hide');
    settings.start = true;
    gameArea.appendChild(car);
    requestAnimationFrame(playGame);
};

const playGame = () => {
    console.log('play');
    if (settings.start) {
        requestAnimationFrame(playGame);
    }
};

//start moving cars
const startMove = (e) => {
    e.preventDefault();
    keys[event.key] = true;
};

//stop moving cars
const stopMove = (e) => {
    e.preventDefault();
    keys[event.key] = false;
};

document.addEventListener('keydown', startMove);
document.addEventListener('keyup', stopMove);
start.addEventListener('click', startGame);
