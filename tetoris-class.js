class TetrisGame {

  constructor(speed) {
    this.speed = speed;
    this.blockSize = 30;
    this.boardRow = 20;
    this.boardCol = 10;
    this.canvas = document.getElementById("cvs");
    this.ctx = this.canvas.getContext("2d");
    this.canvasW = this.blockSize * this.boardCol;
    this.canvasH = this.blockSize * this.boardRow;
    cvs.width = this.canvasW;
    cvs.height = this.canvasH;
    this.nexttetromino = document.getElementById("next");
    this.nextCanvasSize = this.blockSize * 5;
    this.nextCanvasW = this.nextCanvasSize;
    this.nextCanvasH = this.nextCanvasSize;
    this.nexttetromino.width = this.nextCanvasW;
    this.nexttetromino.height = this.nextCanvasH;
    this.next = this.nexttetromino.getContext("2d");

    this.tetSize = 4;
    // スコア
    this.score = 0;
    this.topScore = parseInt(localStorage.getItem('topScore') || '0');

    this.scoreElement = document.getElementById('score');
    this.topScoreElement = document.getElementById('top-score');

    this.updateScoreDisplay();
    this.updateTopScoreDisplay();

    this.tetTypes = [
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

    this.tetColors = [
      '',//空のテトリス
      '#f6fe85',
      '#07e0e7',
      '#7ced77',
      '#f78ff0',
      '#f94246',
      '#9693fe',
      '#f2b907',
    ];
    //現在のテトリミノ
    this.cur_tet_idx = null;
    this.cur_tet = null;

    //次のテトリミノ
    this.next_tet_idx = null;
    this.next_tet = null;

    this.offsetX = 0;
    this.offsetY = 0;
    this.board = [];
    this.timerId = null;
    this.isGameOver = false;
    //初期化処理
    this.init();
  }


  updateNextTet() {
    this.cur_tet_idx = this.next_tet_idx;
    this.cur_tet = this.next_tet;

    this.next_tet_idx = this.randomIdx();
    this.next_tet = this.tetTypes[this.next_tet_idx];
    this.nextTetroDraw();
  }

  nextTetroDraw() {
    this.next.fillStyle = '#000';
    this.next.fillRect(0, 0, this.nextCanvasW, this.nextCanvasH);

    const blockSize = this.blockSize;
    const tetTypes = this.tetTypes;
    const tetColors = this.tetColors;
    const next_tet = tetTypes[this.next_tet_idx];

    for (let y = 0; y < this.tetSize; y++) {
      for (let x = 0; x < this.tetSize; x++) {
        if (next_tet[y][x]) {
          const px = x * blockSize + (this.nextCanvasSize - this.blockSize * this.tetSize) / 2;
          const py = y * blockSize + (this.nextCanvasSize - this.blockSize * this.tetSize) / 2;
          const tet_idx = this.next_tet_idx;
          this.next.fillStyle = tetColors[tet_idx];
          this.next.fillRect(px, py, blockSize, blockSize);
          this.next.strokeStyle = 'black';
          this.next.strokeRect(px, py, blockSize, blockSize);
        }
      }
    }
  }

  // スコアの加算と表示更新
  addScore(points) {
    console.log(points);
    this.score += points;
    this.updateScoreDisplay();

    if (this.score > this.topScore) {
      this.topScore = this.score;
      this.updateTopScoreDisplay();
    }
  }

  // スコア表示の更新
  updateScoreDisplay() {
    this.scoreElement.textContent = this.score;
  }

  // トップスコア表示の更新
  updateTopScoreDisplay() {
    this.topScoreElement.textContent = this.topScore;
  }

  draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);
    for (let y = 0; y < this.boardRow; y++) {
      for (let x = 0; x < this.boardCol; x++) {
        if (this.board[y][x]) {
          this.drawBlock(x, y, this.board[y][x]);
        }
     }
    }

    if (this.isGameOver) {
      document.getElementById('game-over').play();
      let topScore = localStorage.getItem('topScore') || 0;
      const s = 'GAME OVER';
      this.ctx.font = "50px MS ゴシック";
      const w = this.ctx.measureText(s).width;
      const x = this.canvasW / 2 - w / 2;
      const y = this.canvasH / 2 - 20;
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(s, x, y);


	    document.getElementById("start-button").textContent = "Continue"; // ボタンのテキストを変更
	    document.getElementById("start-screen").style.visibility = "visible"; // スタート画面を表示

      // 今までの記録より高いスコアはlocalStorageに記録
      if (this.score > topScore) {
        localStorage.setItem('topScore', this.score);
      }

      this.init();
    }

    //現在のテトリミノの描画
    for (let y = 0; y < this.tetSize; y++) {
      for (let x = 0; x < this.tetSize; x++) {
        if (this.cur_tet[y][x]) {
          this.drawBlock(this.offsetX + x, this.offsetY + y, this.cur_tet_idx);
        }
      }
    }
  };


  //  ブロック一つを描画する
  drawBlock(x, y, tet_idx) {
    const px = x * this.blockSize;
    const py = y * this.blockSize;

    this.ctx.fillStyle = this.tetColors[tet_idx];
    this.ctx.fillRect(px, py, this.blockSize, this.blockSize);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(px, py, this.blockSize, this.blockSize);
  }

  canMove(dx, dy, nowTet = this.cur_tet) {
    for (let y = 0; y < this.tetSize; y++) {
      for (let x = 0; x < this.tetSize; x++) {
        if (nowTet[y][x]) {
          let nx = this.offsetX + x + dx;
          let ny = this.offsetY + y + dy;
          if (ny < 0 || nx < 0 || ny >= this.boardRow || nx >= this.boardCol || this.board[ny][nx]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  //回転の処理
  createRotateTet() {
    const newTet = [];
    for (let y = 0; y < this.tetSize; y++) {
      newTet[y] = [];
      for (let x = 0; x < this.tetSize; x++) {
        newTet[y][x] = this.cur_tet[this.tetSize - 1 - x][y];
      }
    }
    return newTet;
  };

  onKeyPress(e) {
    if (this.isGameOver) return;
    switch (e.keyCode) {
      case 37: // 左
        if (this.canMove(-1, 0)) this.offsetX--;
        break;
      case 39: // 右
        if (this.canMove(1, 0)) this.offsetX++;
        break;
      case 40: // 下
        if (this.canMove(0, 1)) this.offsetY++;
        break;
      case 32:
        const newTet = this.createRotateTet();
        if (this.canMove(0, 0, newTet)) {
          this.cur_tet = newTet;
        }
    }
    this.draw();
  }

  fixTet() {
    for (let y = 0; y < this.tetSize; y++) {
      for (let x = 0; x < this.tetSize; x++) {
        if (this.cur_tet[y][x]) {
          this.board[this.offsetY + y][this.offsetX + x] = this.cur_tet_idx;
        }
      }
    }
  };

  // ラインを消した時にスコアを計算する機能追加
  clearLine() {
    let cleardLines = 0;
    for (let y = 0; y < this.boardRow; y++) {
      let isLineOK = true;
      for (let x = 0; x < this.boardCol; x++) {
        if (this.board[y][x] == 0) {
          isLineOK = false;
          break;
        }
      }
      if (isLineOK) {
        cleardLines++;
        for (let ny = y; ny > 0; ny--) {
          for (let nx = 0; nx < this.boardCol; nx++) {
            this.board[ny][nx] = this.board[ny - 1][nx];
          }
        }
      }
    }
    if (cleardLines) {
      document.getElementById('clear-line').play();
      this.addScore(100 * cleardLines * cleardLines);
    }
  }

  dropTet() {
    if (this.isGameOver) return;
    if (this.canMove(0, 1)) {
      this.offsetY++;
    } else {
      document.getElementById('put').play();
      this.fixTet();
      this.clearLine();
      this.cur_tet_idx = this.randomIdx();
      this.cur_tet = this.tetTypes[this.cur_tet_idx];
      this.initStartPos();
      this.updateNextTet();
      if (!this.canMove(0, 0)) {
        this.isGameOver = true;
        clearInterval(this.timerId);
      }
    }
    this.draw();
  }
  initStartPos() {
    this.offsetX = this.boardCol / 2 - this.tetSize / 2;
    this.offsetY = 0;
  }

  randomIdx() {
    return Math.floor(Math.random() * (this.tetTypes.length - 1)) + 1;
  }

  init() {
    for (let y = 0; y < this.boardRow; y++) {
      this.board[y] = [];
      for (let x = 0; x < this.boardCol; x++) {
        this.board[y][x] = 0;
      }
    }

    //次のテトリミノを表示
    this.next_tet_idx = this.randomIdx();
    this.next_tet = this.tetTypes[this.next_tet_idx];
    //次のテトリスを描画する処理
    this.updateNextTet();

    this.initStartPos();
    this.timerId = setInterval(() => this.dropTet(), this.speed);
    this.draw();

  }
}

// ゲームを開始する関数
function GameStart(speed) {
  const game = new TetrisGame(speed);
  document.addEventListener('keydown', (e) => game.onKeyPress(e));
  game.init();
  document.getElementById('bgm').play();

}


