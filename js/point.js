class Point {
  x; y;

  /**
   * @param {number} pointX
   * @param {number} pointY
   */
  constructor(pointX, pointY) {
    this.x = pointX;
    this.y = pointY;
  }

  /**
   * @param {Point} a
   */
  minus(a) {
    return new Point(this.x - a.x, this.y - a.y);
  }

  /**
   * @param {number} scale
  */
  multiply(scale) {
    return new Point(this.x * scale, this.y * scale);
  }

  toString() {
    return `(${this.x};${this.y})`;
  }
}