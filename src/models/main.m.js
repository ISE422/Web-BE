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
      case "student1":
        ans.username = "student1";
        ans.password = "123";
        ans.role = "student";
        break;
      case "teacher1":
        ans.username = "student1";
        ans.password = "123";
        ans.role = "teacher";
        break;
      default:
        break;
    }
    return ans
  },
};
