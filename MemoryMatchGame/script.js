const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const difficultyButtons = document.getElementById('difficulty-buttons');
const startButton = document.getElementById('start-button');
const pauseReplayButtons = document.getElementById('pause-replay-buttons');
const countdownElement = document.getElementById('countdown');

// 카드 세트 정의
const easyCards = [
  '\u{1F34E}', '\u{1F34E}', // 🍎
  '\u{1F34C}', '\u{1F34C}', // 🍌
  '\u{1F347}', '\u{1F347}', // 🍇
  '\u{1F349}', '\u{1F349}', // 🍉
  '\u{1F353}', '\u{1F353}', // 🍓
  '\u{1F34D}', '\u{1F34D}', // 🍍
  '\u{1F95D}', '\u{1F95D}', // 🥝
  '\u{1F352}', '\u{1F352}'  // 🍒
];

const normalCards = [
  '\u{1F370}', '\u{1F370}', // 🍰
  '\u{1F36A}', '\u{1F36A}', // 🍪
  '\u{1F382}', '\u{1F382}', // 🎂
  '\u{1F36B}', '\u{1F36B}', // 🍫
  '\u{1F36C}', '\u{1F36C}', // 🍬
  '\u{1F36D}', '\u{1F36D}', // 🍭
  '\u{1F36E}', '\u{1F36E}', // 🍮
  '\u{1F36F}', '\u{1F36F}', // 🍯
  '\u{1F37F}', '\u{1F37F}', // 🍿
  '\u{1F9C0}', '\u{1F9C0}'  // 🧀
];

const hardCards = [
  '\u{1F98A}', '\u{1F98A}', // 🦊
  '\u{1F431}', '\u{1F431}', // 🐱
  '\u{1F42F}', '\u{1F42F}', // 🐯
  '\u{1F436}', '\u{1F436}', // 🐶
  '\u{1F43B}', '\u{1F43B}', // 🐻
  '\u{1F418}', '\u{1F418}', // 🐘
  '\u{1F42D}', '\u{1F42D}', // 🐭
  '\u{1F439}', '\u{1F439}', // 🐹
  '\u{1F42E}', '\u{1F42E}', // 🐮
  '\u{1F430}', '\u{1F430}', // 🐰
  '\u{1F438}', '\u{1F438}', // 🐸
  '\u{1F98B}', '\u{1F98B}'  // 🦋
];

const crazyCards = [
  '\u{1F455}', '\u{1F455}', // 👕
  '\u{1F456}', '\u{1F456}', // 👖
  '\u{1F457}', '\u{1F457}', // 👗
  '\u{1F458}', '\u{1F458}', // 👘
  '\u{1F459}', '\u{1F459}', // 👙
  '\u{1F45A}', '\u{1F45A}', // 👚
  '🩳', '🩳', // 🩳
  '\u{1F45C}', '\u{1F45C}', // 👜
  '\u{1F45D}', '\u{1F45D}', // 🎒
  '🧦', '🧦', // 🧦
  '\u{1F45F}', '\u{1F45F}', // 👟
  '\u{1F460}', '\u{1F460}', // 👠
  '\u{1F461}', '\u{1F461}', // 👡
  '\u{1F462}', '\u{1F462}', // 👢
  '\u{1F451}', '\u{1F451}', // 👑
  '\u{1F452}', '\u{1F452}', // 👒
  '\u{1F3A9}', '\u{1F3A9}', // 🎩
  '\u{1F393}', '\u{1F393}', // 🎓
  '\u{1F484}', '\u{1F484}', // 💄
  '🥽', '🥽'  // 🥽
];

// 게임 상태 변수들
let cards = [];
let flippedCards = [];
let matchedCards = [];
let timer;
let time = 0;
let gamePaused = false;

// 난이도 설정에 따라 카드 및 보드 구성
function setDifficulty(level) {
  switch(level) {
    case 'easy':
      cards = [...easyCards];
      gameBoard.style.gridTemplateColumns = 'repeat(4, 100px)';
      break;
    case 'normal':
      cards = [...normalCards];
      gameBoard.style.gridTemplateColumns = 'repeat(5, 100px)';
      break;
    case 'hard':
      cards = [...hardCards];
      gameBoard.style.gridTemplateColumns = 'repeat(6, 100px)';
      break;
    case 'crazy':
      cards = [...crazyCards];
      gameBoard.style.gridTemplateColumns = 'repeat(8, 100px)';
      break;
  }
  difficultyButtons.style.display = 'none';
  gameBoard.style.display = 'grid';
  startButton.parentElement.style.display = 'flex'; // START 버튼과 타이머 표시
  createBoard(); // 게임 보드 생성
}

// 게임 시작 시 동작
function startGame() {
  startButton.style.display = 'none';
  timerElement.style.display = 'block'; // 타이머를 게임 화면에서 보이도록 설정
  pauseReplayButtons.style.display = 'block';
  showAllCards();
}


// 게임 일시 정지/재개
function pauseGame() {
  gamePaused = !gamePaused;
}

// 게임 초기화
function replayGame() {
  location.reload();
}

// 카드 섞기
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 게임 보드 생성
function createBoard() {
  gameBoard.innerHTML = '';
  shuffle(cards); // 카드를 섞고
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.index = index;
    cardElement.dataset.value = card;
    cardElement.addEventListener('click', flipCard); // 카드 클릭 시 동작 추가
    gameBoard.appendChild(cardElement);
  });
}

// 모든 카드 잠깐 보여주기
function showAllCards() {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    card.textContent = card.dataset.value;
  });

  let countdown = 3;
  countdownElement.textContent = countdown;
  countdownElement.style.display = 'flex';

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;
    if (countdown === 0) {
      clearInterval(countdownInterval);
      countdownElement.style.display = 'none';
      allCards.forEach(card => {
        card.textContent = '';
      });
      startTimer(); // 타이머 시작
    }
  }, 1000);
}

// 타이머 시작
function startTimer() {
  timer = setInterval(() => {
    if (!gamePaused) {
      time++;
      timerElement.textContent = `⏰ ${time}`;
    }
  }, 1000);
}

// 카드 뒤집기
function flipCard() {
  if (gamePaused) return;
  const cardIndex = this.dataset.index;
  if (flippedCards.length < 2 && !flippedCards.includes(cardIndex)) {
    this.textContent = cards[cardIndex];
    this.classList.add('flipped');
    flippedCards.push(cardIndex);
    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 500); // 0.5초 후 짝 확인
    }
  }
}

// 짝 맞추기 확인
function checkForMatch() {
  const [firstIndex, secondIndex] = flippedCards;
  const firstCard = document.querySelector(`.card[data-index='${firstIndex}']`);
  const secondCard = document.querySelector(`.card[data-index='${secondIndex}']`);

  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCards.push(firstIndex, secondIndex);
  } else {
    firstCard.textContent = '';
    secondCard.textContent = '';
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
  }

  flippedCards = [];

  if (matchedCards.length === cards.length) {
    clearInterval(timer);
    setTimeout(() => alert(`Congratulations! You matched all the cards in ${time} seconds!`), 300);
  }
}

createBoard();
