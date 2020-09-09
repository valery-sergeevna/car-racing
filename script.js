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
    speed: 3,
    traffic: 3
};

const getQuantityElements = (heightElement) => {
    return document.documentElement.clientHeight / heightElement + 1;
};

//start races
const startGame = () => {
    start.classList.add('hide');

    //create lines
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    //create enemies
    for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * settings.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        gameArea.appendChild(enemy);
        enemy.style.background = "transparent url('./image/mercedes-benz.png') center / cover no-repeat";
    }
    settings.start = true;
    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    requestAnimationFrame(playGame);
};

//play game
const playGame = () => {
    if (settings.start) {
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && settings.x > 0) {
            settings.x -= settings.speed;
        }
        if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {
            settings.x += settings.speed;
        }
        if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
            settings.y += settings.speed;
        }
        if (keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed;
        }

        car.style.left = settings.x + 'px';
        car.style.top = settings.y + 'px';
        requestAnimationFrame(playGame);
    }
};

//move road
const moveRoad = () => {
    let lines = document.querySelectorAll('.line');
    lines.forEach(line => {
        line.y += settings.speed;
        line.style.top = line.y + 'px';

        if (line.y > document.documentElement.clientHeight) {
            line.y = -100;
        }
    });
};

//move enemies
const moveEnemy = () => {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(car => {
        car.y += settings.speed / 2;
        car.style.top = car.y + 'px';

        if (car.y > document.documentElement.clientHeight) {
            car.y = -100 * settings.traffic;
            car.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
};

//start moving cars
const startMove = (e) => {
    e.preventDefault();
    keys[e.key] = true;
};

//stop moving cars
const stopMove = (e) => {
    e.preventDefault();
    keys[e.key] = false;
};

document.addEventListener('keydown', startMove);
document.addEventListener('keyup', stopMove);
start.addEventListener('click', startGame);
