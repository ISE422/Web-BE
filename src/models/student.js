const { getClient } = require("../config/postgres");

exports.getInfo = async function (username) {
  const client = await getClient();
  const rs = await client.query(
    'select * from public."HocSinh"where"maHS" = $1',
    [username]
  );
  return rs;
};

exports.getEmail = async function (email, un) {
  const client = await getClient();
  const rs = await client.query(
    'select * from public."HocSinh"where"email" = $1 and "maHS" !=  $2 ',
    [email, un]
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

exports.getMaHKNH = async function (info) {
  const client = await getClient();
  const rs = await client.query(
    'select * from public."HocKiNamHoc" where "tenHK" = $1 and "tenNH" =  $2 ',
    [info.semester, info.year]
  );
  return rs;
};

exports.getMaHKNHS = async function (year) {
  const client = await getClient();
  const rs = await client.query(
    'select * from public."HocKiNamHoc" where "tenNH" =  $1 ',
    [year]
  );
  return rs;
};

exports.getScores = async function (maHS, maHKNH) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT KQ.*,HK."tenHK",MH."tenMH",HK."tenNH" FROM PUBLIC."KetQua" AS KQ, PUBLIC."HocKiNamHoc" AS HK , PUBLIC."MonHoc" AS MH WHERE HK."maHKNH" = KQ."maHKNH" AND KQ."maMH" = MH."maMH" AND KQ."maHKNH" = $1 AND KQ."maHS" = $2 ',
    [maHKNH, maHS]
  );
  return rs;
};

exports.getScoresYear = async function (maHS, hkArr) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT KQ.*,HK."tenHK",MH."tenMH",HK."tenNH" FROM PUBLIC."KetQua" AS KQ, PUBLIC."HocKiNamHoc" AS HK , PUBLIC."MonHoc" AS MH WHERE HK."maHKNH" = KQ."maHKNH" AND KQ."maMH" = MH."maMH" AND KQ."maHKNH" IN ($1, $2) AND KQ."maHS" = $3 ',
    [hkArr[0], hkArr[1], maHS]
  );
  return rs;
};
