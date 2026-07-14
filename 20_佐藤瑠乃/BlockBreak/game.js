// game.js: ゲームのメインロジックと状態管理
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SCENE = {
  TITLE: "TITLE",
  TUTORIAL: "TUTORIAL",
  PLAY: "PLAY",
  STAGE_SELECT: "STAGE_SELECT",
  RESULT: "RESULT",
};

const gameState = {
  scene: SCENE.TITLE,
  score: 0,
  lives: 3,
  animationId: null,
  currentStage: 1,
  unlockedStage: 1,
  stageMessage: "",
  resultMessage: "",
  animationTime: 0,
};

const paddle = {
  width: 100,
  height: 14,
  x: (canvas.width - 100) / 2,
  y: canvas.height - 36,
  speed: 8,
  color: "#00ff00",
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  radius: 9,
  speed: 4,
  dx: 4,
  dy: -4,
  color: "#ffff00",
};

const block = {
  width: 60,
  height: 20,
  padding: 10,
  offsetTop: 40,
  offsetLeft: 20,
  color: "#ff00ff",
};

let blocks = [];
let particles = [];

// パーティクル生成関数
function createParticles(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
    const speed = 3 + Math.random() * 3;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.02 + Math.random() * 0.03,
      color: color,
      size: 4 + Math.random() * 4,
    });
  }
}

// パーティクル更新関数
function updateParticles() {
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15; // 重力効果
    p.life -= p.decay;
  });
}

function buildBlocksForCurrentStage() {
  const stage = stageDefinitions[gameState.currentStage - 1];
  blocks = [];
  const rows = stage.pattern.length;
  const cols = stage.pattern[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const blockX = block.offsetLeft + col * (block.width + block.padding);
      const blockY = block.offsetTop + row * (block.height + block.padding);
      blocks.push({
        x: blockX,
        y: blockY,
        width: block.width,
        height: block.height,
        alive: stage.pattern[row][col] === "1",
      });
    }
  }
}

function resetGame() {
  gameState.score = 0;
  gameState.lives = 3;
  gameState.animationTime = 0;
  particles = [];
  const stage = stageDefinitions[gameState.currentStage - 1];
  paddle.width = stage.paddleWidth;
  paddle.x = (canvas.width - paddle.width) / 2;
  ball.speed = stage.ballSpeed;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  ball.dx = ball.speed;
  ball.dy = -ball.speed;
  buildBlocksForCurrentStage();
}

function startGame(stageNumber = 1) {
  gameState.currentStage = stageNumber;
  resetGame();
  const stage = stageDefinitions[gameState.currentStage - 1];
  gameState.scene = stage.isTutorial ? SCENE.TUTORIAL : SCENE.PLAY;
  if (gameState.animationId === null) {
    gameState.animationId = requestAnimationFrame(loop);
  }
}

function showStageSelect(message = "") {
  gameState.scene = SCENE.STAGE_SELECT;
  gameState.stageMessage = message;
}

function showResult(message = "") {
  gameState.scene = SCENE.RESULT;
  gameState.resultMessage = message;
}

function handleStageClear() {
  const currentStage = stageDefinitions[gameState.currentStage - 1];
  
  if (currentStage.isTutorial) {
    gameState.unlockedStage = 2;
    showStageSelect("チュートリアル完了！ ステージ1に挑戦してください。");
  } else if (gameState.currentStage < stageDefinitions.length) {
    gameState.unlockedStage = Math.max(gameState.unlockedStage, gameState.currentStage + 1);
    showStageSelect(`${currentStage.title}クリア！ 次のステージを選択してください。`);
  } else {
    showResult("おめでとう！ 全ステージクリアです！");
  }
}

function updateBallPosition() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.dx *= -1;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }
}

function updatePaddleCollision() {
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  ) {
    ball.dy *= -1;
    ball.y = paddle.y - ball.radius;
  }
}

function updateBlockCollision() {
  const stage = stageDefinitions[gameState.currentStage - 1];
  blocks.forEach((b) => {
    if (b.alive) {
      if (
        ball.x > b.x &&
        ball.x < b.x + b.width &&
        ball.y - ball.radius < b.y + b.height &&
        ball.y + ball.radius > b.y
      ) {
        ball.dy *= -1;
        b.alive = false;
        gameState.score += 10;
        // パーティクル生成
        createParticles(b.x + b.width / 2, b.y + b.height / 2, stage.color, 12);
      }
    }
  });
}

function updateLivesAndResult() {
  if (ball.y - ball.radius > canvas.height) {
    gameState.lives -= 1;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 60;
    ball.dx = ball.speed;
    ball.dy = -ball.speed;
    if (gameState.lives <= 0) {
      showResult(`ゲームオーバー。スコア: ${gameState.score}`);
    }
  }
}

function updateGame() {
  updateBallPosition();
  updatePaddleCollision();
  updateBlockCollision();
  updateParticles();
  updateLivesAndResult();

  const allCleared = blocks.every((b) => !b.alive);
  if (allCleared) {
    handleStageClear();
  }
}

function handleMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  paddle.x = mouseX - paddle.width / 2;

  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
}

function handleCanvasClick(event) {
  if (gameState.scene === SCENE.TITLE) {
    startGame(1);
    return;
  }

  if (gameState.scene === SCENE.STAGE_SELECT) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const actualStages = stageDefinitions.filter(s => !s.isTutorial);
    const buttonWidth = 150;
    const buttonHeight = 56;
    const gap = 18;
    const startX = (canvas.width - (buttonWidth * actualStages.length + gap * (actualStages.length - 1))) / 2;
    const y = 160;

    actualStages.forEach((stage, index) => {
      const x = startX + index * (buttonWidth + gap);
      const unlockedStageNumber = stage.id + 1;
      const unlocked = unlockedStageNumber <= gameState.unlockedStage;
      if (
        unlocked &&
        clickX >= x &&
        clickX <= x + buttonWidth &&
        clickY >= y &&
        clickY <= y + buttonHeight
      ) {
        startGame(stage.id + 1);
      }
    });
    return;
  }

  if (gameState.scene === SCENE.RESULT) {
    gameState.scene = SCENE.TITLE;
  }
}

function loop() {
  gameState.animationTime += 1;
  
  if (gameState.scene === SCENE.PLAY) {
    updateGame();
    drawPlayScene();
  } else if (gameState.scene === SCENE.TUTORIAL) {
    updateGame();
    drawTutorialScene();
  } else if (gameState.scene === SCENE.TITLE) {
    drawTitleScene();
  } else if (gameState.scene === SCENE.STAGE_SELECT) {
    drawStageSelectScene();
  } else if (gameState.scene === SCENE.RESULT) {
    drawResultScene();
  }

  gameState.animationId = requestAnimationFrame(loop);
}

function init() {
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("click", handleCanvasClick);
  drawTitleScene();
  gameState.animationId = requestAnimationFrame(loop);
}

init();
