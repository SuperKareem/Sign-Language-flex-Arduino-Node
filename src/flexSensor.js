import five from "johnny-five";

const VCC = 4.98;
const R_DIV = 47500.0;

const STRAIGHT_RESESTANCE = 37300.0;
const BEND_RESISTANCE = 90000.0;

const MAX_ANGLE_DEFAULT = 15;
const MIN_ANGLE_DEFAULT = -25;

export default class FlexSensor {
  fiveSensor = {};
  flexADC;
  flexV;
  flexR;
  angle;
  maxAngle = MAX_ANGLE_DEFAULT;
  MIN_ANGLE_DEFAULT = MIN_ANGLE_DEFAULT;
  straightResestance = STRAIGHT_RESESTANCE;
  bendResistance = BEND_RESISTANCE;

  constructor({ pin, onChange, debug, minAngle, maxAngle }) {
    this.debug = debug;

    const sensor = new five.Sensor({
      pin,
      threshold: 4
    });

    this.pin = pin;
    this.fiveSensor = sensor;

    if (typeof minAngle === "number") this.minAngle = minAngle;

    if (typeof maxAngle === "numebr") this.maxAngle = maxAngle;

    this.fiveSensor.on("change", value => {
      this.onFiveSensorChange(value);
      onChange ? onChange(this.state) : undefined;
    });
  }

  get state() {
    return this.angle > this.minAngle && this.angle < this.this.maxAngle
      ? 1
      : 0;
  }

  onFiveSensorChange = flexADC => {
    this.flexADC = flexADC;
    this.flexV = (flexADC * VCC) / 1023.0;
    this.flexR = R_DIV * (VCC / this.flexV - 1.0);

    this.angle = five.Fn.map(
      this.flexR,
      this.straightResestance,
      this.bendResistance,
      0,
      90.0
    );

    if (!this.debug) return;
    this.logToConsoleSensorValues();
  };

  logToConsoleSensorValues = () => {
    console.log(
      `------------ START SENSOR # [${this.pin}] --------------------`
    );
    console.log("[FLEX] [" + this.pin + "] ADC => ", flexADC);
    console.log("[FLEX] [" + this.pin + "] RESISTANCE => ", this.flexR);
    console.log("[FLEX] [" + this.pin + "] ANGLE => ", this.angle);
    console.log("[FLEX] [" + this.pin + "] STATE => ", this.state);
    console.log(
      `-------------- END SENSOR # [${this.pin}] -------------------- \n`
    );
  };

  setStraightResestance = () => (this.straightResestance = this.flexR);
  setBendResestance = () => (this.bendResistance = this.flexR);

  setMaxAngle = () => {
    if (this.angle > this.maxAngle) {
      this.maxAngle = this.angle;
      this.maxAngleNotSet = false;
    } else this.maxAngleNotSet = true;
  };

  setMinAngle = () => {
    if (this.angle < this.minAngle) {
      this.minAngle = this.angle;
      this.minAngleNotSet = false;
    } else this.minAngleNotSet = true;
  };
}
