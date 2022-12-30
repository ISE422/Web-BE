const { getClient } = require("../config/postgres");

exports.getInfoClass = async function (uid) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT GV.*,L."tenLop",L."maLop",MH."tenMH" FROM PUBLIC."GiaoVien" AS GV, PUBLIC."PhanCong" AS PC, PUBLIC."Lop" AS L, PUBLIC."MonHoc" AS MH WHERE GV."maGV" = $1 AND PC."maGV" = GV."maGV" AND PC."maLop" = L."maLop" AND GV."maMH" = MH."maMH" ',
    [uid]
  );
  return rs.rows;
};

exports.getScoreStudents = async function (info) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT HS."hoTen",KQ.* FROM PUBLIC."KetQua" AS KQ, PUBLIC."HocKiNamHoc" AS HK, PUBLIC."HocSinh" AS HS WHERE KQ."maHKNH" = HK."maHKNH" AND HK."tenHK" = $1 AND HK."tenNH" = $2 AND KQ."maHS" = HS."maHS" AND HS."maLop" = $3 AND KQ."maMH" = $4 ORDER BY KQ."maHS"',
    [info.semester, info.year, info.class, info.idSubject]
  );
  return rs.rows;
};

exports.updateScoreStudent = async function (info) {
  const upDiemTk = (
    (Number(info.diem15) + Number(info.diem45) + Number(info.diemFinal)) /
    3
  ).toFixed(1);
  const client = await getClient();
  const rs = await client.query(
    'UPDATE public."KetQua" SET "diem15" = $1, "diem45" = $2 , "diemHK" = $3 , "DiemTKMON" = $4  WHERE "maKQ" = $5',
    [info.diem15, info.diem45, info.diemFinal, upDiemTk, info.idkq]
  );
  return rs.rows;
};
