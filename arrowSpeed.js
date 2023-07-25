import { ARROW_SPEED_SCORE_KEY } from "./constants/localStorage.js";
import {makeDOMwithProperties} from "./utils/dom.js"
import { handleModalClose, handleModalOpen } from "./utils/modal.js";
import { getNowTime, getResultTimeString, setTimer, startTimer, stopTimer } from "./utils/timer.js";

const MAX_ARROW = 8;
const MAX_ROUND = 3;

let arrowDOMList = [];
let currentIndex= 0;
let round = 1;

const arrowFieldDOM = document.getElementById('arrow-field');

const clearArrowDOM = () => {
  arrowDOMList.forEach((arrowDOM) => {
    arrowDOM.remove();
  });
  arrowDOMList = [];
};

const setArrowDOM = () => {
  clearArrowDOM();
  for(let i=0; i<MAX_ARROW; i++) {
    const direction = Math.random() < 0.5 ? 'left' : 'right';
    const arrowDOM = makeDOMwithProperties('span',{
      className: `arrow arrow-${direction}`,
      innerHTML: direction === 'left' ? '&lt;' : '&gt;',
    });
    arrowDOMList.push(arrowDOM);
    arrowFieldDOM.appendChild(arrowDOM);
  }
};

const handleSuccessGame = () => {
    stopTimer();
    handleModalOpen({
      isSuccess: true,
      timeString: getResultTimeString(),
    });
    const nowSpendTime = getNowTime();
    const currentSpendTime = localStorage.getItem(ARROW_SPEED_SCORE_KEY);
    if (!currentSpendTime || currentSpendTime > nowSpendTime) {
      localStorage.setItem(ARROW_SPEED_SCORE_KEY,nowSpendTime);
    };
    setTimer(0);
};

const handleFailedGame = () => {
    stopTimer();
    handleModalOpen({
      isSuccess: false,
    });
    setTimer(0);
};


const setKeyboardEvent = () => {

  const handleCorrect = () => {
    arrowDOMList[currentIndex].style.display = 'none';
    currentIndex++;
    if (currentIndex === MAX_ARROW) {
      if (round === MAX_ROUND) {
        handleSuccessGame();
        return;
      }
      currentIndex = 0;
      setArrowDOM();
      round += 1;
    }
  };

  window.addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight'].includes(event.code)) return;
    const isFirst = currentIndex === 0 && round === 1;
    if (isFirst) startTimer(handleFailedGame);
    const isLeft = arrowDOMList[currentIndex].innerHTML === '&lt;';
    if(isLeft && event.code === 'ArrowLeft'){
      handleCorrect();
    }
    if (!isLeft && event.code === 'ArrowRight') {
      handleCorrect();
    }
  });
};

const onArrowSpeedGameEnd = () => {
  stopTimer();
  setTimer(0);
  currentIndex = 0;
  round = 1;
  setArrowDOM();
};

const initialize = () => {
  const [headerRetryButton, modalRetryButton] = document.getElementsByClassName('retry-button');
  headerRetryButton.onclick = () => {
    handleModalClose(onArrowSpeedGameEnd);
  };
  modalRetryButton.onclick = () => {
    handleModalClose(onArrowSpeedGameEnd);
  };
};

setArrowDOM(); 
setKeyboardEvent();
initialize();