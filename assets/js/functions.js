import { canvas, canvasId, video } from "./variables.js";

import { ASCII } from "./ascii.js";
import { config } from "./config.js";

export const useEffect = async () => {
  useConfig();
  useAppend();
  useStream();
};

export const useStream = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  video.onplay = () => {
    function drawFrame() {
      if (video.paused || video.ended) return;
      const ascii = new ASCII(video);

      ascii.drawASCII(10);

      requestAnimationFrame(drawFrame);
    }
    drawFrame();
  };

  video.play();
};

export const useAppend = () => {
  if (!document.getElementById(canvasId)) {
    document.body.appendChild(canvas);
  }
};

export const useConfig = () => {
  canvas.id = canvasId;
  canvas.width = config.width;
  canvas.height = config.height;
};

export const useInput = () => {};
