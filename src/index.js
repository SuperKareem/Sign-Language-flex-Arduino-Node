import five from "johnny-five";
// import dweetClient from "node-dweetio";

import Hand from "./hand";

const board = new five.Board();
// const dweetio = new dweetClient();

// Arduino Pins
const A0 = "A0";
const A1 = "A1";
const A2 = "A2";
const A3 = "A3";
const A4 = "A4";

function onBoardReady() {
  const hand = new Hand([A0, A1, A2, A3, A4]);
}

board.on("ready", onBoardReady);
