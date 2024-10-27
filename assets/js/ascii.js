import { config } from "./config.js";
import { ctx } from "./variables.js";

export class ASCII {
  #imageCells = [];
  #pixels;
  #ctx = ctx;
  #width = config.width;
  #height = config.height;
  #resource;

  constructor(resource) {
    this.#ctx;
    this.#resource = resource;
    this.#ctx.drawImage(this.#resource, 0, 0, this.#width, this.#height);
    this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
  }
  #convertToASCII(averageColor = 0) {
    let val;
    if (averageColor > 250) val = "#";
    else if (averageColor > 240) val = "*";
    else if (averageColor > 220) val = "+";
    else if (averageColor > 200) val = "&";
    else if (averageColor > 180) val = "_";
    else if (averageColor > 160) val = "%";
    else if (averageColor > 140) val = "$";
    else if (averageColor > 120) val = "!";
    else if (averageColor > 100) val = "@";
    else if (averageColor > 80) val = ";";
    else if (averageColor > 60) val = ":";
    else if (averageColor > 40) val = ",";
    else if (averageColor > 20) val = ".";
    else val = " ";
    return val;
  }
  #scanResource(cellSize) {
    this.#imageCells = [];
    if (config.analyser) {
      config.analyser.getByteFrequencyData(config.dataArray);
      const test =
        config.dataArray.reduce((a, b) => a + b, 0) / config.dataArray.length;
      config.songDynamic = test;
    }
    for (let y = 0; y < this.#pixels.height; y += cellSize) {
      for (let x = 0; x < this.#pixels.width; x += cellSize) {
        const posX = x * 4;
        const posY = y * 4;

        const pos = posY * this.#pixels.width + posX;

        const red = this.#pixels.data[pos];
        const green = this.#pixels.data[pos + 1];
        const blue = this.#pixels.data[pos + 2];

        const total = red + green + blue;
        //3 количество цветов
        const averageColor = total / 3;
        const symbol = this.#convertToASCII(averageColor);

        const color = `rgb(${red}, ${green}, ${blue})`;
        // 256 - значение тени*
        if (total > 256) {
          this.#imageCells.push({ x, y, color, symbol });
        }
      }
    }
  }
  drawASCII(cellSize) {
    this.#scanResource(cellSize);
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    for (let i = 0; i < ~~config.songDynamic / 4; i++) {
      const randomIndex = parseInt(Math.random() * this.#imageCells.length);

      const cell = this.#imageCells[randomIndex];

      for (let j = 0; j < 8; j++) {
        this.#ctx.font = `10px Arial`;
        this.#ctx.fillStyle = "red";
        this.#ctx.fillText("■", cell.x + 5 * j, cell.y);
        for (let k = 0; k < 30; k++) {
          this.#ctx.font = `16px Arial`;
          this.#ctx.fillStyle = "red";
          this.#ctx.fillText("■", cell.x + 5 * j + k, cell.y + 10);
        }
      }
    }
    for (let i = 0; i < this.#imageCells.length; i++) {
      const cell = this.#imageCells[i];
      this.#ctx.font = `10px Arial`;

      this.#ctx.fillStyle = "#ffffff50";
      // this.#ctx.fillStyle = cell.color;
      this.#ctx.fillText(cell.symbol, cell.x, cell.y);
    }
  }
}
