// スタートボタンをクリックしたときの処理
document.getElementById("start-button").addEventListener("click", function () {
  // スタート画面を非表示にし、ゲームコンテナを表示
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("container").style.display = "block";
  
  // ゲームスクリプトの初期化関数を呼び出し、ゲームを開始
  init();
});