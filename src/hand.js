import FlexSensor from "./flexSensor";
import { isArrayEqualAnother } from "./helpers";

const letters = [
  {
    letter: "a",
    sign: [0, 1, 1, 1, 1]
  },
  {
    letter: "k",
    sign: [1, 0, 0, 1, 1]
  }
];

export default class Hand {
  sensors = [];
  fingers = [0, 0, 0, 0, 0];

  constructor(fingers) {
    if (!Array.isArray(fingers) && fingers.length !== 5) {
      console.log("HAND ARRAY IS INCOMPLETE!!");
    }

    fingers.map((finger, index) => {
      this.sensors[index] = new FlexSensor({
        pin: finger,
        onChange: state => this.onSensorValueChanges(index, state)
        // debug: true
      });
    });
  }

  onSensorValueChanges(index, state) {
    this.fingers[index] = state;
    this.checkLetter();
  }

  checkLetter() {
    const letterObj = letters.find(letter =>
      isArrayEqualAnother(letter.sign, this.fingers)
    );

    console.log("letter => ", letterObj && letterObj.letter);
  }
}
