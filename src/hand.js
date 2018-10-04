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
      throw new Error("you need to pass five pens!!");
    }

    fingers.map((finger, index) => {
      this.sensors[index] = new FlexSensor({
        pin: finger,
        onChange: state => this.onSensorValueChanges(index, state)
        // debug: true
      });
    });

    this.calibrateFlexSensors();
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

  calibrateFlexSensors = async () => {
    console.log("----- Calibration Started ----- \n");

    console.log("please `open` all five fingers at max and then press enter");
    await this.waitForEvent(this.setStraightResestance);

    console.log("please `close` all five fingers at max and then press enter");
    await this.waitForEvent(this.setBendResestance);

    console.log(
      "please `open` all five fingers (again) at max and then press enter"
    );
    this.waitForEvent(() => {});

    console.log(
      "please `close` all five fingers again  - but not too much - and then press enter"
    );
    await this.waitForEvent(this.setMinAngle);

    this.printSensorsValues();

    console.log(
      "do you want to reset the calibration, if so type yes and press enter: \n"
    );

    const resetRequired = await this.waitForEvent(this.isResetRequired());

    if (resetRequired) this.calibrateFlexSensors();
    else this.debugSensors();
  };

  debugSensors = () => this.sensors.map(sensor => sensor.debug === true);

  isResetRequired = enteredString =>
    enteredString.toLowerCase().trim() === "yes" ? true : false;

  printSensorsValues = () =>
    this.sensors.map(sensor => sensor.logToConsoleSensorValues());

  setStraightResestance = () => {
    this.sensors.map(sensor => {
      sensor.setStraightResestance();
    });
  };

  setBendResestance = () => {
    this.sensors.map(sensor => {
      sensor.setBendResestance();
      sensor.setMaxAngle();
    });
  };

  setMinAngle = () => {
    this.sensors.map(sensor => {
      sensor.setMinAngle();
    });
  };

  waitForEvent = fn => {
    return new Promise(resolve => {
      process.stdin.on("data", chunk => {
        fn();
        resolve(chunk.toString());
      });
    });
  };
}
