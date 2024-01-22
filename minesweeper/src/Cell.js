import openGameOverPopup from './index';
import openCell from './sounds/opencell.wav';
import bombSound from './sounds/boom.wav';

class Cell {
    constructor(isBomb, i, j, arr, counter) {
        this.isBomb = Boolean(isBomb);
        this.isFlag = false;
        this.isOpen = false;
        this.i = i;
        this.j = j;
        this.arr = arr;
        this.currentElem = null;
        this.counter = counter;
    }
    createCell() {
        this.createAdjacentCells();
        const field = document.getElementById('#minesweeper');
        let myCell = document.createElement('div');
        myCell.className = `cell ${this.i}_${this.j}`;
        let myTxt = document.createElement('span');
        myTxt.innerHTML = this.value || '';
        myTxt.classList.add('value');
        myCell.append(myTxt);
        this.currentElem = myCell;
        if (this.value) {
            switch(this.value) {
                case 1: myTxt.style.color = '#2475F2';
                break;
                case 2: myTxt.style.color = '#24F290';
                break;
                case 3: myTxt.style.color = '#E64F39';
                break;
                case 4: myTxt.style.color = '#1251B3';
                break;
                case 5: myTxt.style.color = '#993B2E';
                break;
                case 6: myTxt.style.color = '#2ED6E6';
                break;
                case 7: myTxt.style.color = '#000000';
                break;
                case 8: myTxt.style.color = '#ffffff';
                break;
                case 'bomb': myTxt.className = 'value bm'; myTxt.innerHTML = '';
                break;
            }
            if (field) {
                field.append(myCell);
            }
        }
        myCell.addEventListener('contextmenu', e => {
            e.preventDefault();
            if (!this.isOpen && !this.isFlag) {
                this.isFlag = true;
                myCell.classList.add('flagged');
            } else {
                this.isFlag = false;
                myCell.classList.remove('flagged');
            }
        })
        myCell.addEventListener('click', () => {
            const openSound = new Audio(openCell);
            const boomSound = new Audio(bombSound);
            if (!this.isOpen && !this.isFlag) {
                if (this.isBomb) {
                    boomSound.play();
                } else {
                    openSound.pause();
                    openSound.currentTime = 0;
                    openSound.play();
                    const countField = document.querySelector('.counter__field');
                    let currVal = countField.value;
                    currVal = Number(currVal) + 1;
                    countField.setAttribute('value', currVal.toString());
                }
            }
        });
        myCell.addEventListener('click', this.onClickCell.bind(this));
        return myCell;
    }
    onClickCell() {
        // e.preventDefault();
        if (!this.isOpen && !this.isFlag) {
            this.isOpen = true;
            this.currentElem.classList.add('opened');
            if (this.isBomb) {
                openGameOverPopup();
            } else if (!this.value) {
                const adjacentCells = this.getAdjacentCells(this.i, this.j);
                adjacentCells.forEach(cell => {
                    cell.onClickCell();
                })
            } else if (this.value && typeof this.value === 'number') {
                this.currentElem.classList.add('opened');
            }
        }
    }
    setCounter() {
        return this.counter;
    }
    setNewValue(value) {
        this.value = value;
    }
    createAdjacentCells() {
        if (this.isBomb) {
            this.setNewValue('bomb');
            return;
        }
        const allCells = this.getAdjacentCells(this.i, this.j);
        let bombCount = 0;
        allCells.forEach(cell => {
            if (cell === 1 || cell.isBomb) {
                bombCount++;
            }
        });
        if (bombCount !== 0) {
            this.setNewValue(bombCount);
        }
    }
    getAdjacentCells(i, j) {
        return [this.arr[i - 1]?.[j], this.arr[i + 1]?.[j], this.arr[i]?.[j - 1], this.arr[i]?.[j + 1],
        this.arr[i + 1]?.[j + 1], this.arr[i - 1]?.[j - 1], this.arr[i + 1]?.[j - 1], this.arr[i - 1]?.[j + 1]]
        .filter(elem => elem !== undefined);
    }
}
export default function addCell(isBomb, i, j, arr, counter) {
    const cell = new Cell(isBomb, i, j, arr, counter);
    cell.createAdjacentCells();
    cell.createCell();
    return cell;
}