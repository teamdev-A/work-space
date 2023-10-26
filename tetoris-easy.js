//落下サイクル
// const speed = 100;
// ブロック1マスの大きさ
const blockSize = 30;
// ボードサイズ
const boardRow = 20;
const boardCol = 10;
// キャンバスの取得
const cvs = document.getElementById("cvs");
// 2dコンテキストを取得
const ctx = cvs.getContext("2d");
// キャンバスサイズ
const canvasW = blockSize * boardCol;
const canvasH = blockSize * boardRow;
cvs.width = canvasW;
cvs.height = canvasH;
// コンテナの設定
const container = document.getElementById("container");
container.style.width = canvasW + 'px';
//tet1辺の大きさ
const tetSize = 4;
//T型のテトリミノ
let tetTypes = [
  [],
  [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
  ],
  [
  [0, 0, 0, 0],
  [0, 1, 0, 0],
  [1, 1, 1, 0],
  [0, 0, 0, 0],
  ],
  [
  [0, 0, 0, 0],
  [1, 1, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
  ],
  [
  [0, 0, 0, 0],
  [0, 0, 1, 1],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
  ],
  [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  ],
  [
  [0, 0, 0, 0],
  [1, 1, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 0],
  ],
  [
  [0, 0, 0, 0],
  [0, 0, 1, 0],
  [1, 1, 1, 0],
  [0, 0, 0, 0],
  ],
];

//テトリミノの色
const tetColors = [
  '',//空のテトリス
  '#f6fe85',
  '#07e0e7',
  '#7ced77',
  '#f78ff0',
  '#f94246',
  '#9693fe',
  '#f2b907',
]
//テトリミノのindex
let tet_idx;
//選択されたtet
let tet;

//テトリミノのオフセット量
let offsetX = 0;
let offsetY = 0;

//ボード本体
const board = [];

//タイマーID
let timerId = NaN;

//ゲームオーバー
let isGameOver = false;

// 描画処理
const draw = () => {
  // 塗りに黒を設定
  ctx.fillStyle = '#000';
  // キャンバスを塗りつぶす
  ctx.fillRect(0, 0, canvasW, canvasH);

  //ボードに存在しているブロックを塗る
  for (let y = 0; y < boardRow; y++) {
    for(let x = 0; x < boardCol; x++) {
      if (board[y][x]) {
        drawBlock(x, y, board[y][x]);
      }
    }
  }
  //ゲームオーバーのチェック
  if (isGameOver) {
    const s = 'GAME OVER';
    ctx.font = "50px MS ゴシック";
    const w = ctx.measureText(s).width;
    const x = canvasW / 2 - w / 2;
    const y = canvasH / 2 - 20;
    ctx.fillStyle = 'white';
    ctx.fillText(s, x, y);
    init();

  }

  //テトリミノの描画
  for (let y = 0; y < tetSize; y++) {
    for (let x = 0; x < tetSize; x++) {
      if (tet[y][x] == 1) {
        drawBlock(offsetX+x, offsetY+y, tet_idx);
      }
    }
  }
};

//ブロック一つを描画する
const drawBlock = (x, y, tet_idx) => {
  let px = x * blockSize;
  let py = y * blockSize;

  //塗りを設定
  ctx.fillStyle = tetColors[tet_idx];
  ctx.fillRect(px, py, blockSize, blockSize);
  //線を設定
  ctx.strokeStyle = 'black';
  //線を描画
  ctx.strokeRect(px, py, blockSize, blockSize);

};
//指定された方向に移動可能か
const canMove = (dx, dy, nowTet = tet) => {
  for (let y = 0; y < tetSize; y++) {
    for (let x = 0; x < tetSize; x++) {
      //その場所にブロックがあれば
      if(nowTet[y][x]) {
        let nx = offsetX + x + dx;
        let ny = offsetY + y + dy;
        if (ny < 0 || nx < 0 || ny >= boardRow || nx >= boardCol || board[ny][nx]) {
          return false;
        }
      }
    }
  }
  return true;
};

//回転
//スペースキーで操作
const createRotateTet = () => {
  let newTet = [];
  for (let y = 0; y < tetSize; y++) {
    newTet[y] = [];
    for (let x = 0; x < tetSize; x++) {
      //時計周りに90回転
      newTet[y][x] = tet[tetSize -1 - x][y];
    }
  }
  return newTet;
};

// キーボードの操作
document.onkeydown = (e) => {
  if(isGameOver) return;
  switch (e.keyCode) {
    case 37: //左
      if (canMove(-1, 0)) offsetX--;
      break;
    case 39: //右
      if (canMove(1, 0)) offsetX++;
      break;
    case 40: //下
      if (canMove(0, 1)) offsetY++;
      break;
    case 32:
      let newTet = createRotateTet();
      if(canMove(0, 0, newTet)) {
        tet = newTet;
      }
  }
  draw();
};

//動きが止まったtetをボード座標に書き写す
const fixTet = () => {
  for (let y = 0; y < tetSize; y++) {
    for (let x = 0; x < tetSize;  x++) {
      if (tet[y][x]) {
        //ボードに書き込む
        board[offsetY + y][offsetX + x] = tet_idx;

      }
    }
  }
};

const clearLine = () => {
  //ボードの行を上から調査
  for (let y = 0; y < boardRow; y++) {
    //一列そろっていると過程
    let isLineOK = true;
    //列に0が入ってないか調査
    for (let x = 0; x < boardCol; x++) {
      if (board[y][x] == 0) {
        //0が入ったのでフラグをfalse
        isLineOK = false;
        break;
      }
    }
    if (isLineOK) {
      for (let ny = y;  ny > 0; ny--) {
        for (let nx = 0; nx < boardCol; nx++) {
          //一列上の情報をコピーする
          board[ny][nx] = board[ny - 1][nx];
        }
      }
    }
  }
};

//繰り返し行われる落下処理
const dropTet = () => {
  if (isGameOver) return;
  //下に行けたら
  if (canMove(0, 1)) {
    //下に行く
    offsetY++;
  } else {
    //行けなかったら固定する
    fixTet();
    //揃ったラインを消す
    clearLine();
    //抽選
    tet_idx = randomIdx();
    tet = tetTypes[tet_idx];
    //初期位置に戻す
    initStartPos();
    //次のtetを出せなかったらGameOver
    if (!canMove(0, 0) ) {
      isGameOver = true;
      clearInterval(timerId);
    }
  }
  draw();
};

const initStartPos=()=>{
  offsetX = boardCol / 2 - tetSize / 2;
  offsetY = 0;
};

//テトリミノのindexを抽選
const randomIdx = () => {
  return Math.floor(Math.random() * (tetTypes.length - 1)) + 1;
};

// 初期化処理
const init = (speed) => {
  //ボード(20*10を0埋め)
  for (let y = 0; y < boardRow; y++) {
    board[y] = [];
    for (let x = 0; x < boardCol; x++) {
      board[y][x] = 0;

    }
  }

  //テスト用

  //最初のテトリミノを抽選
  tet_idx = randomIdx();
  tet = tetTypes[tet_idx];

  initStartPos();
  //繰り返し処理
  timerId = setInterval(dropTet, speed);

  draw();
}


