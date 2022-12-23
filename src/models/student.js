const { getClient } = require("../config/postgres");

exports.getInfo = async function (username) {
  const client = await getClient();
  const rs = await client.query(
    'select * from public."HocSinh"where"maHS" = $1',
    [username]
  );
  return rs;
};

exports.getEmail = async function (email) {
  const client = await getClient();
  const rs = await client.query(
    'select * from public."HocSinh"where"email" = $1',
    [email]
  );
  return rs;
};

exports.updateInfo = async function (newInfo) {
  const client = await getClient();
  const rs = await client.query(
    'UPDATE public."HocSinh" SET "hoTen" = $1, "gioiTinh" = $2 , "email" = $3 , "ngaySinh" = $4 , "diaChi" = $5  WHERE "maHS" = $6 ',
    [
      newInfo.Name,
      newInfo.gioiTinh,
      newInfo.Email,
      newInfo.Birthday,
      newInfo.Address,
      newInfo.ID,
    ]
  );

  return rs;
};
