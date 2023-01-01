const { pgp, db } = require("../config/postgres");

module.exports = {
  getUserByUserName: (username) => {
    let ans = {};
    switch (username) {
      case "admin1":
        ans.username = "admin1";
        ans.password = "123";
        ans.role = "admin";
        break;
      case "30000002":
        ans.username = "30000002";
        ans.password = "123";
        ans.role = "student";
        break;
      case "20000000":
        ans.username = "20000000";
        ans.password = "123";
        ans.role = "teacher";
        break;
      default:
        break;
    }
    return ans;
  },
  getInfoByID: () => {
    let obj = {};
    obj.id = "001";
    obj.name = "Nguyen Van A";
    obj.gender = "Nu";
    obj.dob = "01/01/2020";
    obj.address = "HCM city";
    obj.email = "123@abc";
    return obj;
  },
  updateInfoByID: () => {
    let obj = {};
    obj.id = "005";
    obj.name = "Nguyen Van C";
    obj.gender = "Nu";
    obj.dob = "01/01/2020";
    obj.address = "HCM city";
    obj.email = "123@abc";
    return obj;
  },
  getClasses: () => {
    return null;
  },
};
