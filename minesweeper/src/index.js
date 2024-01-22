import './index.html';
import './scss/style.scss';
import addCell from './Cell';
import gameOverSound from './sounds/videogame-death-sound.mp3';
import winSound from './sounds/win-sound.mp3';
import arrow from './img/arrow.svg';
import bomb from './img/bomb.svg';
import clock from './img/clock.svg';
import close from './img/close.svg';
import lvl from './img/lvl.svg';
import gameoverPic from './img/game-over.svg';
import winPic from './img/win.svg';
import back from './img/back-btn.svg';
import flagPic from './img/flag.svg';
let arr = [];
let rows = 10;
let cols = 10;
let bombCount = localStorage.getItem('bombs') ? Number(localStorage.getItem('bombs')) : 10;
let clickCounter = 0;
let isStart = false;
let isPaused = false;
let isClickOnce = false;
let flagCount = 0;
let level = localStorage.getItem('level') ? localStorage.getItem('level') :'easy';
let time = null;
const body = document.querySelector('body');
const loseSound = new Audio(gameOverSound);
const victorySound = new Audio(winSound);

function createMatrix() {
    arr = [];
    for (let i = 0; i < rows; i++) {
        arr[i] = [];
        for (let j = 0; j < cols; j++) {
            arr[i][j] = 0;
        }
    }
    return generateBombs(arr);
}


function init() {
    localStorage.setItem('bombs', bombCount);
    localStorage.setItem('level', level);
    changeLevel(level);
    body.innerHTML += createPage();
    initialTheme();
    const startBtn = document.querySelector('.btn.btn--start');
    const themeBtn = document.querySelector('.header__switch-theme-btn');
    const menuBtn = document.querySelector('.header__menu-btn');
    const closeBtn = document.querySelector('.menu-popup__close-btn');
    if (startBtn) startBtn.addEventListener('click', () => {getStarted()});
    if (themeBtn) themeBtn.addEventListener('click', e => {switchTheme(e)});
    if (menuBtn) menuBtn.addEventListener('click', e => {openMenu(e)});
    if (closeBtn) closeBtn.addEventListener('click', () => {closeMenu()});
}

function createPage() {
    return `
        <div class="container">
            <header class="header minesweeper__header">
                <button id="switch-theme" class="header__switch-theme-btn"><span class="header__theme-text">Theme:</span>
                    <span class="header__theme-icon header__theme-icon--light"></span>
                    <span class="header__theme-icon header__theme-icon--hidden header__theme-icon--dark"></span>
                </button>
                <h1 class="header__title">Minesweeper</h1>
                <button id="menu-btn" class="btn btn--menu header__menu-btn">
                    <span class="header__menu-btn-text">Menu</span>
                </button>
            </header>
            <main class="gamefield minesweeper__gamefield">
                <header class="gamefield__header">
                    <button id="start-btn" class="btn btn--start gamefield__btn">Start</button>
                    <ul class="gamefield__stats-list gamefield__stats-list--hidden">
                        <li class="gamefield__stats-item">
                            <p class="counter">
                                <label class="counter__name" for="counter-field">Moves:</label>
                                <input id="counter-field" class="counter__field" type="number" min="0" max="999" value="0" readonly>
                            </p>
                        </li>
                        <li class="gamefield__stats-item">
                            <p class="bomb-counter">
                                <span class="bomb-counter__icon-wrapper">
                                    <img class="bomb-counter__icon" src=${bomb}>
                                </span>
                                <span class="bomb-counter__value">x <b>${localStorage.getItem('bombs')}</b></span>
                            </p>
                        </li>
                        <li class="gamefield__stats-item">
                            <p class="flag-counter">
                                <label class="flag-counter__name" for="flag-counter-field">
                                    <img class="flag-counter__icon" src=${flagPic}>
                                </label>
                                <input id="flag-counter-field" class="flag-counter__field" type="number" min="0" max="99" value=${flagCount} readonly>
                            </p>
                        </li>
                        <li class="gamefield__stats-item">
                            <p class="timer">
                                <label class="timer__name" for="timer-field">
                                    <img class="timer__icon" src=${clock}>
                                </label>
                                <input id="timer-field" class="timer__field" type="number" min="0" max="999" value="0" readonly>
                            </p>
                        </li>
                        <li class="gamefield__stats-item">
                            <p class="level">
                                <span class="level__icon-wrapper">
                                    <img class="level__icon" src=${lvl}>
                                </span>
                                <span class="level__value">${localStorage.getItem('level')}</span>
                            </p>
                        </li>
                    </ul>
                </header>
                <div class="gamefield__game"></div>
            </main>
            <footer class="footer">
                <ul class="footer__links-list">
                    <li class="footer__links-item">
                        <a class="footer__link footer__link--rss" href="https://app.rs.school/profile?githubId=idiamondcat" target="_blank">RSS</a>
                    </li>
                    <li class="footer__links-item">
                        <a class="footer__link footer__link--git" href="https://github.com/idiamondcat" target="_blank">
                            <svg class="footer__link-icon" viewBox="0 0 539.67 560.47"><path fill="#fff" d="M539.67 200.47h-19.8v-40.11h-20v-40.11h-20.06V100.3h-19.88V80.35h-20.04V60.46h-20.01v-20h-20.19v-19.7h-40.07V0H180.06v20.76h-39.93v19.65h-20.25v20.03H99.97v19.94H79.94v19.93H60.09v20.23H39.97v39.82H19.94v40.02H0v179.81h19.84v40.06h20.03v20.18h20.06v19.98h19.91v19.98h19.99v20.13h20.02v19.84h20.09v20.13h39.95v19.98h39.84v-80.08h-79.79v-19.98h-20.03v-19.98H99.83v-19.99H79.84v19.99h-.09v-20.18h.09v-19.84h40.07v20.03h20.03v19.99h20.02v19.98h39.86v-19.98h19.98v-19.99h20.06v-20.03h-79.9v-20.13h-20.02v-20.12h-20.03v-19.85H99.59v-119.9h20.32v-20.03h19.93v-19.99h-19.93v-60.14h60.15v20.09h19.97v20.02h19.81v-20.02h100.14v20.02h19.81v-20.02h19.83v-20.09H420v60.1h-20.06v20.02H420v20.04h20.08v119.9h-20.17v20.23h-19.99v19.79h-19.98v20.08H300v19.84h19.94v20.08h19.93v119.95h39.95v-19.93h20.05v-19.99h20.04v-20.27h19.65v-19.84h20.31v-20.08h19.75v-19.84h20.46v-19.84h19.79v-40.16h19.8V200.47z"/></svg>
                        </a>
                    </li>
                </ul>
                <span class="footer__date">2023</span>
            </footer>
            <div class="pop-up-overlay pop-up-overlay--off">
                <div class="pop-up menu-popup">
                    <button class="close-btn menu-popup__close-btn">
                        <img class="close-btn__icon" src=${close}>
                    </button>
                    <div class="menu-popup__content"></div>
                </div>
            </div>
            <div class="pop-up-overlay pop-up-overlay--end-game pop-up-overlay--off">
                <div class="pop-up game-over-pop-up visually-hidden">
                    <div class="game-over-pop-up__title-wrapper">
                        <img class="game-over-pop-up__title" src=${gameoverPic}>
                    </div>
                    <span class="game-over-pop-up__text">Try again?</span>
                    <div class="game-over-pop-up__btn-wrapper">
                        <button class="game-over-pop-up__btn new-game-btn">Yes <img class="game-over-pop-up__icon" src=${arrow}></button>
                        <button class="game-over-pop-up__btn exit-btn">No <img class="game-over-pop-up__icon" src=${arrow}></button>
                    </div>
                </div>
                <div class="pop-up win-pop-up visually-hidden">
                    <div class="win-pop-up__title-wrapper">
                        <img class="win-pop-up__title" src=${winPic}>
                    </div>
                    <div class="win-pop-up__btn-wrapper">
                        <button class="win-pop-up__btn new-game-btn">New game <img class="win-pop-up__icon" src=${arrow}></button>
                        <button class="win-pop-up__btn exit-btn">Exit <img class="win-pop-up__icon" src=${arrow}></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function createField() {
    const cont = document.querySelector('.gamefield > .gamefield__game');
    cont.innerHTML = '';
    const gameField = document.createElement('div');
    const matrix = createMatrix();
    gameField.id = 'minesweeper';
    gameField.className = `gamefield__content ${level}`;
    cont.append(gameField);
    matrix.forEach((row, i) => {
        row.forEach((col, j) => {
            let cell = addCell(matrix[i][j], i, j, matrix, clickCounter);
            matrix[i][j] = cell;
            gameField.append(cell.currentElem);
        })
    })
    gameField.addEventListener('contextmenu', e => {
        const parent = e.target.parentNode;
        const flaggedCells = parent.querySelectorAll('.cell.flagged').length;
        flagCount = flaggedCells;
        document.querySelector('.flag-counter__field').setAttribute('value', flagCount);
        openAllCells(parent);
    });
    gameField.addEventListener('click', e => {
        openAllCells(e.target.parentNode);
    });
}

function generateBombs(arr) {
    let bombs = bombCount;
    let arr2 = [...arr];
    while (bombs) {
        const i = Math.floor(Math.random() * ((rows - 1) - 0 + 1) + 0);
        const j = Math.floor(Math.random() * ((cols - 1) - 0 + 1) + 0);
        let matrixCell = arr2[i][j];
        if (!matrixCell) {
            arr2[i][j] = 1;
            bombs--;
        }
    }
    return arr2;
}

function openAllCells(parent) {
    const gameField = parent;
    const notOpenedCells = Array.from(gameField.querySelectorAll('.cell')).filter(item => !item.classList.contains('opened')).length;
    const f = notOpenedCells - flagCount;
    if (flagCount === bombCount && f === 0) {
        openWinPopup();
    }
}

function getStarted() {
    const startBtn = document.querySelector('.gamefield__btn');
    const stats = document.querySelector('.gamefield__stats-list');
    if (stats.classList.contains('gamefield__stats-list--hidden')) {
        stats.classList.remove('gamefield__stats-list--hidden');
        startBtn.classList.add('btn--hidden');
        createField();
        createTimer();
        document.querySelector('.level__value').innerHTML = `${localStorage.getItem('level')}`;
        isStart = true;
    }
}

function restartGame() {
    createField();
    clearInterval(time);
    document.querySelector('.timer__field').setAttribute('value', '0');
    document.querySelector('.counter__field').setAttribute('value', '0');
    document.querySelector('.flag-counter__field').setAttribute('value', '0');
    document.querySelector('.level__value').innerHTML = `${localStorage.getItem('level')}`;
    createTimer();
    isStart = true;
}

function createTimer() {
    const timer = document.querySelector('.timer__field');
    let startTime = timer.value;
    time = setInterval(() => {
        if (!isPaused) {
            startTime = Number(startTime) + 1;
            timer.setAttribute('value', startTime.toString());
        }
    }, 1000);
}


function switchTheme(e) {
    e.preventDefault();
    const darkIcon = document.querySelector('.header__theme-icon--dark');
    const lightIcon = document.querySelector('.header__theme-icon--light');
    if (localStorage.getItem('theme') === 'dark-theme') {
        setTheme('light-theme');
        if (lightIcon.classList.contains('header__theme-icon--hidden')) {
            darkIcon.classList.add('header__theme-icon--hidden');
            lightIcon.classList.remove('header__theme-icon--hidden');
        }
    } else {
        setTheme('dark-theme');
        if (darkIcon.classList.contains('header__theme-icon--hidden')) {
            lightIcon.classList.add('header__theme-icon--hidden');
            darkIcon.classList.remove('header__theme-icon--hidden');
        }
    }
}


function initialTheme() {
    const darkIcon = document.querySelector('.header__theme-icon--dark');
    const lightIcon = document.querySelector('.header__theme-icon--light');
    if (localStorage.getItem('theme') === 'dark-theme') {
        setTheme('dark-theme');
        if (darkIcon.classList.contains('header__theme-icon--hidden')) {
            lightIcon.classList.add('header__theme-icon--hidden');
            darkIcon.classList.remove('header__theme-icon--hidden');
        }
    } else {
        setTheme('light-theme');
        if (lightIcon.classList.contains('header__theme-icon--hidden')) {
            darkIcon.classList.add('header__theme-icon--hidden');
            lightIcon.classList.remove('header__theme-icon--hidden');
        }
    }
}


function setTheme(name) {
    localStorage.setItem('theme', name);
    document.documentElement.className = name;
}


function changeLevel(lvl) {
    const gamefieldCont = document.querySelector('.gamefield__content');
    switch(lvl) {
        case 'easy' : rows = cols = 10;
        level = 'easy';
        if (gamefieldCont) {
            gamefieldCont.classList.add('easy');
            gamefieldCont.classList.remove('medium');
            gamefieldCont.classList.remove('hard');
        }
        break;
        case 'medium' : rows = cols = 15;
        level = 'medium';
        if (gamefieldCont) {
            gamefieldCont.classList.add('medium');
            gamefieldCont.classList.remove('easy');
            gamefieldCont.classList.remove('hard');
        }
        break;
        case 'hard' : rows = cols = 25;
        level = 'hard';
        if (gamefieldCont) {
            gamefieldCont.classList.add('hard');
            gamefieldCont.classList.remove('easy');
            gamefieldCont.classList.remove('medium');
        }
        break;
    }
}


function createMenuPopupContent() {
    return `
    <section class="main-menu menu-popup__screen menu-popup__screen--active">
        <ul class="main-menu__list">
            ${isStart === true ? '<li class="main-menu__item"><button class="main-menu__btn continue-btn">Continue</button></li>' : ''}
            <li class="main-menu__item">
                ${isStart === true ? '<button class="main-menu__btn restart-btn">Restart</button>' : '<button class="main-menu__btn new-game-btn">New game</button>'}
            </li>
            <li class="main-menu__item">
                <button class="main-menu__btn rate-btn">Rate <img class="main-menu__icon" src=${arrow}></button>
            </li>
            <li class="main-menu__item">
                <button class="main-menu__btn level-btn">Level <img class="main-menu__icon" src=${arrow}></button>
            </li>
            <li class="main-menu__item">
                <button class="main-menu__btn bombs-btn">Bombs <img class="main-menu__icon" src=${arrow}></button>
            </li>
            <li class="main-menu__item">
                <button class="main-menu__btn stop-btn">Exit</button>
            </li>
        </ul>
    </section>
    <section class="results menu-popup__screen visually-hidden">
        <div class="results__wrapper">
            <button class="back-btn results__back-btn"><img class="back-btn__icon" src="${back}"></button>
            <h3 class="category-name results__title">Results</h3>
        </div>
        <div class="results__list">
            <div class="results__thead">
                <div class="results__time-col"><img class="results__time-icon" src=${clock}><span class="results__unit">(s)</span></div>
                <div class="results__moves-col"><span class="results__subtitle">Moves</span></div>
            </div>
        </div>
    </section>
    <section class="change-bomb-count menu-popup__screen visually-hidden">
            <div class="change-bomb-count__wrapper">
                <button class="back-btn change-bomb-count__back-btn"><img class="back-btn__icon" src="${back}"></button>
                <h3 class="category-name change-bomb-count__title">Bombs</h3>
            </div>
            <div class="change-bomb-count__field-wrapper">
                <button class="change-bomb-count__arrow-btn change-bomb-count__arrow-btn--right">
                    <img class="change-bomb-count__icon change-bomb-count__icon--right" src=${arrow}>
                </button>
                <input class="field change-bomb-count__field" type="text" size="2" maxlength="2" value="${localStorage.getItem('bombs')}" readonly>
                <button class="change-bomb-count__arrow-btn change-bomb-count__arrow-btn--left">
                    <img class="change-bomb-count__icon change-bomb-count__icon--left" src=${arrow}>
                </button>
            </div>
            <button class="btn change-bomb-count__ok-btn">Ok</button>
        </section>
        <section class="change-level menu-popup__screen visually-hidden">
            <div class="change-level__wrapper">
                <button class="back-btn change-level__back-btn"><img class="back-btn__icon" src="${back}"></button>
                <h3 class="category-name change-level__title">Level</h3>
            </div>
            <div class="change-level__field-wrapper">
                <input class="change-level__field" id="easy" type="radio" name="level" value="easy">
                <label class="btn change-level__lvl-btn" for="easy">Easy</label>
                <input class="change-level__field" id="medium" type="radio" name="level" value="medium">
                <label class="btn change-level__lvl-btn" for="medium">Medium</label>
                <input class="change-level__field" id="hard" type="radio" name="level" value="hard">
                <label class="btn change-level__lvl-btn" for="hard">Hard</label>
            </div>
            <button class="btn change-level__ok-btn">Ok</button>
        </section>
    `;
}


function openMenu(e) {
    e.preventDefault();
    const overlay = document.querySelector('.pop-up-overlay');
    const menuPopup = document.querySelector('.menu-popup');
    const content = menuPopup.querySelector('.menu-popup__content');
    content.innerHTML = '';
    overlay.classList.remove('pop-up-overlay--off');
    content.innerHTML += createMenuPopupContent();
    isPaused = true;
    const mainMenuScreen = document.querySelector('.main-menu');
    const resultsBtn = mainMenuScreen.querySelector('.rate-btn');
    const changeBombBtn = mainMenuScreen.querySelector('.bombs-btn');
    const levelBtn = mainMenuScreen.querySelector('.level-btn');
    const restartBtn = mainMenuScreen.querySelector('.restart-btn');
    const continueBtn = mainMenuScreen.querySelector('.continue-btn');
    const newGameBtn = mainMenuScreen.querySelector('.main-menu__btn.new-game-btn');
    const exitBtn = mainMenuScreen.querySelector('.stop-btn');
    exitBtn.addEventListener('click', () => {
        if (isStart) {
            exitGame();
            closeMenu();
        } else {
            closeMenu();
        }
    });
    if (newGameBtn) newGameBtn.addEventListener('click', () => {
        getStarted();
        closeMenu();
    });
    if (resultsBtn) resultsBtn.addEventListener('click', () => {
        const resultSection = document.querySelector('.results');
        const backBtn = resultSection.querySelector('.back-btn');
        const resultList = resultSection.querySelector('.results__list');
        const resultsArr = JSON.parse(localStorage.getItem('results'));
        addActiveScreen(resultSection);
        if (resultsArr !== null) {
            resultsArr.forEach(elem => {
                const resultBlock = document.createElement('div');
                resultBlock.className = 'results__item';
                resultBlock.innerHTML = `
                    <div class="results__result-time">${elem.time}</div>
                    <div class="results__result-moves">${elem.moves}</div>
                `;
                resultList.append(resultBlock);
            })
        }
        backBtn.addEventListener('click', () => {addActiveScreen(mainMenuScreen)});
    })
    if (isStart) {
        changeBombBtn.setAttribute('disabled', true);
        levelBtn.setAttribute('disabled', true);
    }
    if (changeBombBtn) changeBombBtn.addEventListener('click', () => {
        const changeBombSection = document.querySelector('.change-bomb-count');
        const bombValCont = document.querySelector('.bomb-counter__value');
        addActiveScreen(changeBombSection);
        const bombField = document.querySelector('.change-bomb-count__field');
        let bombValue = Number(bombField.value);
        const rightArrow = document.querySelector('.change-bomb-count__arrow-btn--right');
        const leftArrow = document.querySelector('.change-bomb-count__arrow-btn--left');
        const confirmBtn = document.querySelector('.change-bomb-count__ok-btn');
        const backBtn = changeBombSection.querySelector('.back-btn');
        backBtn.addEventListener('click', () => {addActiveScreen(mainMenuScreen)});
        rightArrow.addEventListener('click', () => {
            if (bombValue > 10) {
                bombValue = bombValue - 1;
                bombField.setAttribute('value', bombValue);
                return bombValue;
            }
        })
        leftArrow.addEventListener('click', () => {
            if (bombValue < 99) {
                bombValue = bombValue + 1;
                bombField.setAttribute('value', bombValue);
                return bombValue;
            }
        })
        confirmBtn.addEventListener('click', () => {
                bombCount = bombValue;
                localStorage.setItem('bombs', bombCount);
                bombValCont.innerText = 'x' + bombCount;
                addActiveScreen(mainMenuScreen);
        })
    })
    if (levelBtn) levelBtn.addEventListener('click', () => {
        const lvlSection = document.querySelector('.change-level');
        addActiveScreen(lvlSection);
        checkCurrentLvl();
        const confirmLvlBtn = document.querySelector('.change-level__ok-btn');
        const backBtn = lvlSection.querySelector('.back-btn');
        confirmLvlBtn.addEventListener('click', () => {
            const radioBtns = document.querySelectorAll('input[name="level"]');
            for (const radio of radioBtns) {
                if (radio.checked) {
                    level = radio.value;
                    changeLevel(level);
                    localStorage.setItem('level', level);
                    addActiveScreen(mainMenuScreen);
                }
            }
        })
        backBtn.addEventListener('click', () => {addActiveScreen(mainMenuScreen)});
    })
    if (restartBtn) restartBtn.addEventListener('click', () => {
        restartGame();
        closeMenu();
    })
    if (continueBtn) continueBtn.addEventListener('click', () => {
        closeMenu();
    })
}

function checkCurrentLvl() {
    const radioBtns = document.querySelectorAll('input[name="level"]');
    for (const radio of radioBtns) {
        if (radio.value === localStorage.getItem('level')) radio.checked = true;
    }
}


function closeMenu() {
    const overlay = document.querySelector('.pop-up-overlay');
    overlay.classList.add('pop-up-overlay--off');
    if (isPaused) isPaused = false;
}


function addActiveScreen(screen) {
    const content = document.querySelector('.menu-popup__content');
    let activeScreen = content.querySelector('.menu-popup__screen--active');
    activeScreen.classList.remove('menu-popup__screen--active');
    activeScreen.classList.add('visually-hidden');
    screen.classList.add('menu-popup__screen--active');
    screen.classList.remove('visually-hidden');
}

export default function openGameOverPopup() {
    const overlay = document.querySelector('.pop-up-overlay--end-game');
    const gameOverPopup = document.querySelector('.game-over-pop-up');
    const newGameBtn = gameOverPopup.querySelector('.game-over-pop-up__btn.new-game-btn');
    const exitBtn = gameOverPopup.querySelector('.game-over-pop-up__btn.exit-btn');
    gameOverPopup.classList.remove('visually-hidden');
    overlay.classList.remove('pop-up-overlay--off');
    clearInterval(time);
    loseSound.play();
    if (newGameBtn) newGameBtn.addEventListener('click', () => {
        restartGame();
        loseSound.pause();
        loseSound.currentTime = 0;
        gameOverPopup.classList.add('visually-hidden');
        overlay.classList.add('pop-up-overlay--off');
    });
    if (exitBtn) exitBtn.addEventListener('click', (e) => {
        exitGame();
        loseSound.pause();
        loseSound.currentTime = 0;
        gameOverPopup.classList.add('visually-hidden');
        overlay.classList.add('pop-up-overlay--off');
    });
}


function openWinPopup() {
    const overlay = document.querySelector('.pop-up-overlay--end-game');
    const winPopup = document.querySelector('.win-pop-up');
    const newGameBtn = document.querySelector('.win-pop-up__btn.new-game-btn');
    const exitBtn = document.querySelector('.win-pop-up__btn.exit-btn');
    const getTime = document.querySelector('.timer__field').value;
    const getMoves = document.querySelector('.counter__field').value;
    winPopup.classList.remove('visually-hidden');
    overlay.classList.remove('pop-up-overlay--off');
    clearInterval(time);
    victorySound.play();
    addResult(getTime, getMoves);
    console.log(JSON.parse(localStorage.getItem('results')));
    exitBtn.addEventListener('click', (e) => {
        exitGame();
        victorySound.pause();
        victorySound.currentTime = 0;
        winPopup.classList.add('visually-hidden');
        overlay.classList.add('pop-up-overlay--off');
    })
    if (newGameBtn) newGameBtn.addEventListener('click', () => {
        restartGame();
        victorySound.pause();
        victorySound.currentTime = 0;
        winPopup.classList.add('visually-hidden');
        overlay.classList.add('pop-up-overlay--off');
    });
}
function exitGame() {
    const btn = document.querySelector('.btn.btn--start');
    const stats = document.querySelector('.gamefield__stats-list');
    const cont = document.querySelector('.gamefield > .gamefield__game');
    if (!stats.classList.contains('gamefield__stats-list--hidden')) {
        stats.classList.add('gamefield__stats-list--hidden');
        btn.classList.remove('btn--hidden');
        clearInterval(time);
        document.querySelector('.timer__field').setAttribute('value', '0');
        document.querySelector('.counter__field').setAttribute('value', '0');
        document.querySelector('.flag-counter__field').setAttribute('value', '0');
        cont.innerHTML = '';
        isStart = false;
    }
}
function addResult(time, moves) {
    let resultsArr = JSON.parse(localStorage.getItem('results'));
    console.log(resultsArr);
    if (resultsArr == null) resultsArr = [];
    let newResult = {time: time, moves: moves};
    localStorage.setItem('result', JSON.stringify(newResult));
    resultsArr.push(newResult);
    if (resultsArr.length > 10) {
        resultsArr.pop();
    }
    localStorage.setItem('results', JSON.stringify(resultsArr));
}
// function clearLS() {
//     localStorage.clear();
// }

// ToDo: create Score
init();