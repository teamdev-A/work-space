let difficulty = document.getElementById('difficulty');

// スタートボタンをクリックしたときの処理
document.getElementById("start-button").addEventListener("click", function () {
  // スタート画面を非表示にし、ゲームコンテナを表示
  document.getElementById("start-screen").style.visibility = "hidden";

  switch(difficulty.value) {
    case 'easy':
      GameStart(200);
      break;
    case 'normal':
      GameStart(150);
      break;
    case 'hard':
      GameStart(80);
      break;
  }
});
