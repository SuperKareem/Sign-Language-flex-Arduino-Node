import five from "johnny-five";

const VCC = 4.98;
const R_DIV = 47500.0;

const STRAIGHT_RESESTANCE = 37300.0;
const BEND_RESISTANCE = 90000.0;

export default class FlexSensor {
  fiveSensor = {};
  flexADC;
  flexV;
  flexR;
  angle;

  constructor({ pin, onChange, debug }) {
    this.debug = debug;

    const sensor = new five.Sensor({
      pin,
      threshold: 4
    });

    this.pin = pin;
    this.fiveSensor = sensor;

    this.fiveSensor.on("change", () => {
      this.onFiveSensorChange();
      onChange ? onChange(this.state) : undefined;
    });
  }

  onFiveSensorChange = flexADC => {
    this.flexADC = flexADC;
    this.flexV = (flexADC * VCC) / 1023.0;
    this.flexR = R_DIV * (VCC / this.flexV - 1.0);

    this.angle = five.Fn.map(
      this.flexR,
      STRAIGHT_RESESTANCE,
      BEND_RESISTANCE,
      0,
      90.0
    );

    if (!this.debug) return;

    console.log("[FLEX] [" + this.pin + "] RESISTANCE => ", this.flexR);
    console.log("[FLEX] [" + this.pin + "] ANGLE => ", this.angle);
    console.log("[FLEX] [" + this.pin + "] STATE => ", this.state);
  };

  get state() {
    return this.angle > -20 && this.angle < 15 ? 1 : 0;
  }
}
