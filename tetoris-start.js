let difficulty = document.getElementById('difficulty');

// スタートボタンをクリックしたときの処理
document.getElementById("start-button").addEventListener("click", function () {
  // スタート画面を非表示にし、ゲームコンテナを表示
  document.getElementById("start-screen").style.visibility = "hidden";

  switch(difficulty.value) {
    case 'easy':
      init(200);
      break;
    case 'normal':
      init(150);
      break;
    case 'hard':
      init(100);
      break;
  }
});
