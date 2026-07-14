// render.js: ゲーム画面の描画処理
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawAnimatedBackground() {
  // ネオン背景 - 暗い黒
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ネオングリッドパターン
  ctx.strokeStyle = "rgba(0, 255, 255, 0.15)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // ネオン浮遊パーティクル（背景装飾）
  ctx.fillStyle = "rgba(0, 255, 255, 0.6)";
  for (let i = 0; i < 8; i++) {
    const x = (gameState.animationTime * 0.3 + i * 120) % (canvas.width + 100) - 50;
    const y = 60 + Math.sin(gameState.animationTime * 0.01 + i) * 30;
    const size = 2 + Math.sin(gameState.animationTime * 0.02 + i) * 1;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // 上部のネオンアクセント
  ctx.strokeStyle = "rgba(255, 0, 255, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 100);
  ctx.lineTo(canvas.width, canvas.height - 100);
  ctx.stroke();
}

function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
  ctx.globalAlpha = 1.0;
}

function drawText(text, x, y, fontSize = "24px", align = "center", color = "#ffffff") {
  ctx.fillStyle = color;
  ctx.font = `${fontSize} Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function drawStageButton(stage, x, y, width, height, unlocked) {
  ctx.fillStyle = unlocked ? "#00ff00" : "#333333";
  ctx.fillRect(x, y, width, height);
  ctx.shadowColor = unlocked ? "rgba(0, 255, 0, 0.5)" : "rgba(128, 128, 128, 0.3)";
  ctx.shadowBlur = unlocked ? 15 : 5;
  ctx.strokeStyle = unlocked ? "#00ff00" : "#666666";
  ctx.lineWidth = 2;
  ctx.shadowColor = "transparent";
  ctx.strokeRect(x, y, width, height);
  drawText(stage.title, x + width / 2, y + 22, "18px", "center", unlocked ? "#000000" : "#999999");
  if (!unlocked) {
    drawText("LOCK", x + width / 2, y + 44, "12px", "center", "#666666");
  }
}

function drawTitleScene() {
  clearCanvas();
  drawAnimatedBackground();
  drawText("ブロック崩し", canvas.width / 2, canvas.height / 2 - 44, "28px", "center", "#ff00ff");
  drawText("クリックでチュートリアルを開始", canvas.width / 2, canvas.height / 2 - 8, "18px", "center", "#00ffff");
  drawText("ステージをクリアすると次のステージを選べます", canvas.width / 2, canvas.height / 2 + 24, "16px", "center", "#ffff00");
}

function drawPlayScene() {
  clearCanvas();
  drawAnimatedBackground();
  const stage = stageDefinitions[gameState.currentStage - 1];

  drawText(`スコア: ${gameState.score}`, 10, 24, "18px", "left", "#00ffff");
  drawText(`ライフ: ${gameState.lives}`, canvas.width - 10, 24, "18px", "right", "#ff0080");
  drawText(`${stage.title} / ${stage.description}`, canvas.width / 2, 24, "16px", "center", "#ffff00");

  blocks.forEach((b) => {
    if (b.alive) {
      ctx.fillStyle = stage.color;
      ctx.fillRect(b.x, b.y, b.width, b.height);
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x, b.y, b.width, b.height);
    }
  });

  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctx.beginPath();
  ctx.fillStyle = ball.color;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  drawParticles();
}

function drawTutorialScene() {
  clearCanvas();
  drawAnimatedBackground();
  const stage = stageDefinitions[gameState.currentStage - 1];

  drawText(`スコア: ${gameState.score}`, 10, 24, "18px", "left", "#00ffff");
  drawText(`ライフ: ${gameState.lives}`, canvas.width - 10, 24, "18px", "right", "#ff0080");
  drawText(`${stage.title} / ${stage.description}`, canvas.width / 2, 24, "16px", "center", "#ffff00");

  // Draw instruction
  drawText("マウスを動かしてパドルを操作し、", canvas.width / 2, 150, "16px", "center", "#00ffff");
  drawText("ボールでブロックを壊してください！", canvas.width / 2, 175, "16px", "center", "#00ffff");

  blocks.forEach((b) => {
    if (b.alive) {
      ctx.fillStyle = stage.color;
      ctx.fillRect(b.x, b.y, b.width, b.height);
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.strokeRect(b.x, b.y, b.width, b.height);
    }
  });

  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctx.beginPath();
  ctx.fillStyle = ball.color;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  drawParticles();
}

function drawStageSelectScene() {
  clearCanvas();
  drawAnimatedBackground();
  drawText("ステージ選択", canvas.width / 2, 70, "28px", "center", "#ff00ff");
  if (gameState.stageMessage) {
    drawText(gameState.stageMessage, canvas.width / 2, 105, "16px", "center", "#00ffff");
  }

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
    drawStageButton(stage, x, y, buttonWidth, buttonHeight, unlocked);
  });

  drawText("選択したいステージをクリックしてください", canvas.width / 2, 250, "16px", "center", "#ffff00");
}

function drawResultScene() {
  clearCanvas();
  drawAnimatedBackground();
  drawText("結果", canvas.width / 2, canvas.height / 2 - 30, "28px", "center", "#ff00ff");
  drawText(gameState.resultMessage || `最終スコア: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 5, "20px", "center", "#00ffff");
  drawText("クリックでタイトルへ戻る", canvas.width / 2, canvas.height / 2 + 40, "16px", "center", "#ffff00");
}
