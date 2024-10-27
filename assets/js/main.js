import { config } from "./config.js";
import { input } from "./variables.js";
import { useEffect } from "./functions.js";

useEffect();

input.onchange = ({ target }) => {
  const [file] = target.files;

  const audio = new Audio(URL.createObjectURL(file));
  const audioContext = new AudioContext();

  let audioSource, analyser;

  audioSource = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);

  config.analyser = analyser;
  config.audioSource = audioSource;
  config.audio = audio;
  config.file = file;
  config.bufferLength = config.analyser.frequencyBinCount;
  config.dataArray = new Uint8Array(config.bufferLength);
  audio.volume = 0.2;
  audio.play();
};
