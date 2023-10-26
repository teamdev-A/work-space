class TetrisGame {
  constructor() {
    this.speed = 100;
    this.blockSize = 30;
    this.boardRow = 20;
    this.boardCol = 10;
    this.canvas = document.getElementById("cvs");
    this.ctx = this.canvas.getContext("2d");
    this.canvasW = this.blockSize * this.boardCol;
    this.canvasH = this.blockSize * this.boardRow;
    cvs.width = this.canvasW;
    cvs.height = this.canvasH;
    this.container = document.getElementById("container");
    this.container.style.width = this.canvasW + 'px';
    this.tetSize = 4;

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

    this.tet_idx = null;
    this.tet = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.board = [];
    this.timerId = null;
    this.isGameOver = false;

    //初期化処理
    this.init();
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
      const s = 'GAME OVER';
      this.ctx.font = "50px MS ゴシック";
      const w = this.ctx.measureText(s).width;
      const x = this.canvasW / 2 - w / 2;
      const y = this.canvasH / 2 - 20;
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(s, x, y);
      this.init();
    }

    //テトリミノの描画
    for (let y = 0; y < this.tetSize; y++) {
      for (let x = 0; x < this.tetSize; x++) {
        if (this.tet[y][x] == 1) {
          this.drawBlock(this.offsetX + x, this.offsetY + y, this.tet_idx);
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

  canMove(dx, dy, nowTet = this.tet) {
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
        newTet[y][x] = this.tet[this.tetSize - 1 - x][y];
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
          this.tet = newTet;
        }
    }
    this.draw();
  }

  fixTet() {
    for (let y = 0; y < this.tetSize; y++) {
      for (let x = 0; x < this.tetSize; x++) {
        if (this.tet[y][x]) {
          this.board[this.offsetY + y][this.offsetX + x] = this.tet_idx;
        }
      }
    }
  };

  clearLine() {
    for (let y = 0; y < this.boardRow; y++) {
      let isLineOK = true;
      for (let x = 0; x < this.boardCol; x++) {
        if (this.board[y][x] == 0) {
          isLineOK = false;
          break;
        }
      }
      if (isLineOK) {
        for (let ny = y; ny > 0; ny--) {
          for (let nx = 0; nx < this.boardCol; nx++) {
            this.board[ny][nx] = this.board[ny - 1][nx];
          }
        }
      }
    }
  }

  dropTet() {
    if (this.isGameOver) return;
    if (this.canMove(0, 1)) {
      this.offsetY++;
    } else {
      this.fixTet();
      this.clearLine();
      this.tet_idx = this.randomIdx();
      this.tet = this.tetTypes[this.tet_idx];
      this.initStartPos();
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

    this.tet_idx = this.randomIdx();
    this.tet = this.tetTypes[this.tet_idx];
    this.initStartPos();
    this.timerId = setInterval(() => this.dropTet(), this.speed);
    this.draw();
  }
}

// ゲームを開始する関数
function GameStart() {
  const game = new TetrisGame();
  document.addEventListener('keydown', (e) => game.onKeyPress(e));
}

// ページ読み込み時にゲームを開始
window.onload = GameStart
