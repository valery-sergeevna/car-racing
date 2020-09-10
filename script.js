const MAX_ENEMIES = 10;

const score = document.querySelector('.scores'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.game-area');

const audio = document.createElement('audio'),
    lights = document.createElement('audio'),
    crash = document.createElement('audio');
const count = document.createElement('img');

//play music and motor car
const playMusic = () => {
    audio.src = 'zvuk-motora.mp3';
    audio.volume = 1;
    audio.play();

    lights.src = 'The Weeknd - Blinding Lights (minus).mp3';
    lights.volume = 0.5;
    lights.play();
};
//play crash sound
const playCrashSound = () => {
    crash.src = 'crash.mp3';
    crash.volume = 1;
    crash.play();
};


//hide modal with max Scores
document.querySelector('.modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
        document.querySelector('.modal').classList.remove('show');
    }
});

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
    traffic: 5,
    maxScore: 0
};

//choose the game level
const btns = document.querySelectorAll('.btn');
document.querySelector('.btn-container').addEventListener('click', e => {
    btns.forEach(btn => {
        btn.classList.remove('active');
    });
    if (e.target.tagName === 'BUTTON') {
        e.target.classList.add('active');
    }
    //easy level
    if (e.target.classList.contains('easy')) {
        settings.speed = 3;
        settings.traffic = 5;
    }
    //average level
    if (e.target.classList.contains('aver')) {
        settings.speed = 4;
        settings.traffic = 4;
    }
    //hard level
    if (e.target.classList.contains('hard')) {
        settings.speed = 5;
        settings.traffic = 3;
    }
});

//choose the game car
const automobiles = document.querySelectorAll('.car-img');

document.querySelector('.car-container').addEventListener('click', e => {
    automobiles.forEach(auto => {
        auto.classList.remove('active');
    });
    if (e.target.tagName === 'IMG') {
        e.target.classList.add('active');
    }
    //choose one car
    if (e.target.classList.contains('one')) {
        car.style.background = 'transparent url("./image/player.png") center / cover no-repeat';
    }
    //choose second car
    if (e.target.classList.contains('two')) {
        car.style.background = 'transparent url("./image/enemy2.png") center / cover no-repeat';
    }
    //choose third car
    if (e.target.classList.contains('three')) {
        car.style.background = 'transparent url("./image/enemy1.png") center / cover no-repeat';
    }
});

const getQuantityElements = (heightElement) => {
    return document.documentElement.clientHeight / heightElement + 1;
};
//start races
const startGame = () => {
    start.classList.add('hide');
    gameArea.innerHTML = '';
    playMusic();

    //create traffic lights
    count.classList.add('count');
    count.src = './image/red-light.png';
    gameArea.append(count);
    setTimeout(() => count.src = './image/yel-light.png', 3000);
    setTimeout(() => count.src = './image/green-light.png', 6000);
    setTimeout(() => count.classList.add('hide'), 7000);
    //create lines
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.append(line);
    }
    //create enemies
    for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
        const enemy = document.createElement('div');
        const randomEnemy = Math.floor(Math.random() * MAX_ENEMIES) + 1;
        enemy.classList.add('enemy');
        enemy.y = -100 * settings.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        gameArea.append(enemy);
        enemy.style.background = `transparent url('./image/enemy${randomEnemy}.png') center / cover no-repeat`;
    }

    settings.start = true;
    settings.score = 0;
    gameArea.append(car);
    car.style.left = (gameArea.clientWidth / 2) - (car.offsetWidth / 2);
    car.style.top = 'auto';
    car.style.bottom = '10px';
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    //defer playGame() to 7 seconds (because of motor sound (7 sec))
    setTimeout(() => requestAnimationFrame(playGame), 7000);
};

//play game
const playGame = () => {
    if (settings.start) {
        settings.score += settings.speed;
        score.textContent = `Score: ${settings.score}`;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && settings.x > 0) {
            settings.x -= settings.speed;
        }
        if (keys.ArrowRight && settings.x < (gameArea.clientWidth - car.offsetWidth)) {
            settings.x += settings.speed;
        }
        if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
            settings.y += settings.speed;
        }
        if (keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed;
        }
        if (settings.score === 10000) {
            settings.speed += 1;
            settings.traffic -= 1;
        } else if (settings.score === 50000) {
            settings.speed += 1;
            settings.traffic -= 1;
        } else if (settings.score === 100000) {
            settings.speed += 1;
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
    enemy.forEach(elem => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = elem.getBoundingClientRect();

        //crash on the road
        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            settings.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
            //stop music
            lights.pause();
            //play crash sound
            playCrashSound();

            //save max scores in localStorage
            if (localStorage.getItem('maxScore')) {
                settings.maxScore = localStorage.getItem('maxScore');
                if (settings.score > settings.maxScore) {
                    localStorage.setItem('maxScore', settings.score);
                    document.querySelector('.modal').classList.add('show');
                    document.querySelector('.max').textContent = `${localStorage.getItem('maxScore')} scores`;
                }
            } else {
                settings.maxScore = settings.score;
                localStorage.setItem('maxScore', settings.score);
            }
        }

        elem.y += settings.speed / 2;
        elem.style.top = elem.y + 'px';

        if (elem.y > document.documentElement.clientHeight + 60) {
            elem.y = -100 * settings.traffic;
            elem.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 70)) + 'px';
            let randomEnemy = Math.floor(Math.random() * MAX_ENEMIES) + 1;
            elem.style.background = `transparent url('./image/enemy${randomEnemy}.png') center / cover no-repeat`;
        }
    });
};

//start moving cars
const startMove = (e) => {
    e.preventDefault();
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
};

//stop moving cars
const stopMove = (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
};

document.addEventListener('keydown', startMove);
document.addEventListener('keyup', stopMove);
start.addEventListener('click', startGame);
