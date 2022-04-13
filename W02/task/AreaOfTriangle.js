function AreaOfTriangle(v1, v2, v3) {
  var v12 = new Vec3(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
  var v13 = new Vec3(v3.x - v1.x, v3.y - v1.y, v3.z - v1.z);
  console.log("v12 = (%f, %f, %f)", v12.x, v12.y, v12.z);
  console.log("v13 = (%f, %f, %f)", v13.x, v13.y, v13.z);

  var s = 0.5 * Math.sqrt(Math.pow(v12.y * v13.z - v12.z * v13.y, 2) + Math.pow(v12.z * v13.x - v12.x * v13.z, 2) + Math.pow(v12.x * v13.y - v12.y * v13.x, 2));

  return s;
}