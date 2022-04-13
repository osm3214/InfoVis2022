class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this
  }

  sum() {
    return this.x + this.y + this.z;
  }

  min() {
    var m = this.x;
    if (m > this.y) m = this.y;
    if (m > this.z) m = this.z;
    return m;
  }

  max() {
    var m = this.x;
    if (m < this.y) m = this.y;
    if (m < this.z) m = this.z;
    return m;
  }

  mid() {
    var m = this.x;
    if (m > this.y && m > this.z) {
      if (this.y > this.z) m = this.y;
      else m = this.z;
    } else if (m < this.y && m < this.z) {
      if (this.y < this.z) m = this.y;
      else m = this.z;
    }
    return m;
  }
}