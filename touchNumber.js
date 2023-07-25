import { TOUCH_NUMBER_SCORE_KEY } from "./constants/localStorage.js";
import { handleModalClose, handleModalOpen } from "./utils/modal.js";
import { getNowTime, getResultTimeString, setTimer, startTimer, stopTimer } from "./utils/timer.js";

const numberButtonList = document.getElementsByClassName('number-button');
const maxId = numberButtonList.length;
let currentNumber = 1;

const handleSuccessGame = () => {
  stopTimer();
  handleModalOpen({
    isSuccess: true,
    timeString: getResultTimeString(),
  });

  const nowSpendTime = getNowTime();
  const currentSpendTime = localStorage.getItem(TOUCH_NUMBER_SCORE_KEY);
  if (!currentSpendTime || currentSpendTime > nowSpendTime) {
    localStorage.setItem(TOUCH_NUMBER_SCORE_KEY, nowSpendTime)
  };
};

const handleFailedGame = () => {
  stopTimer();
  handleModalOpen({
    isSuccess: false,
  });
  setTimer(0);
};

const setButtonDOM = () => {
  for (let numberButton of numberButtonList) {
    numberButton.style.display ='block';
    numberButton.style.top = `${Math.floor(Math.random() * 100 * 0.9)}%`;
    numberButton.style.left = `${Math.floor(Math.random() * 100 * 0.9)}%`;
    numberButton.onclick = (event) => {
      
      const numId = Number(event.target.innerHTML);
      console.log(numId)
      if (isNaN(numId)) return;
      if(numId !== currentNumber) return;
      event.target.style.display = 'none';
      if (numId === maxId) {
        handleSuccessGame();
        return;
      };
      if (numId === 1) {
        startTimer(handleFailedGame);
      };
      currentNumber++;
    };
  };
};

const initializeTouchNumberGame = () => {
  setTimer(0);
  stopTimer();
  setButtonDOM();
  currentNumber = 1;
};

const initialize = () => {
  const [headerRetryButton, modalRetryButton] = document.getElementsByClassName('retry-button');
  headerRetryButton.onclick = () => {
    handleModalClose(initializeTouchNumberGame);
  };
  modalRetryButton.onclick = () => {
    handleModalClose(initializeTouchNumberGame);
  };
};


setButtonDOM();
initialize();