const { pgp, db } = require("../config/postgres");

exports.getInfo = async function () {
  let obj = {};
  obj.id = "001";
  obj.name = "Nguyen Van A";
  obj.gender = "Nu";
  obj.dob = "01/01/1999";
  obj.address = "HCM city";
  obj.email = "123@abc";
  return obj;
};

exports.updateInfo = async function (obj) {
  return obj;
};
