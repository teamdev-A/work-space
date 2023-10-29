let difficulty = document.getElementById('difficulty');

// スタートボタンをクリックしたときの処理
document.getElementById("start-button").addEventListener("click", function () {
  // スタート画面を非表示にし、ゲームコンテナを表示
  document.getElementById('game-start').play();
  document.getElementById("start-screen").style.visibility = "hidden";
  document.getElementById("score-board").classList.remove('hidden')


  switch(difficulty.value) {
    case 'easy':
      GameStart(500);
      break;
    case 'normal':
      GameStart(400);
      break;
    case 'hard':
      GameStart(300);
      break;
  }
});
