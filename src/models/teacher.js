const { getClient } = require("../config/postgres");
const teacherM = require("../models/teacher");

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

exports.getDiemChuan = async function () {
  const client = await getClient();
  const rs = await client.query(
    'SELECT * FROM PUBLIC."QuiDinh" WHERE "maQD" = $1 ',
    ["qddiemchuan"]
  );
  return rs.rows[0];
};

exports.getReport = async function (info, diemchuan) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT HS."maLop",L."tenLop",count(HS."maLop") AS "SoHocSinhPass" FROM PUBLIC."KetQua" AS KQ, PUBLIC."HocSinh" AS HS, PUBLIC."HocKiNamHoc" AS HK, PUBLIC."Lop" AS L WHERE KQ."maHS" = HS."maHS" AND KQ."maMH" = $1 AND KQ."maHKNH" = HK."maHKNH" AND HK."tenHK" = $2 AND HK."tenNH" = $3 AND KQ."DiemTKMON" >= $4 AND L."maLop" = HS."maLop" GROUP BY HS."maLop",L."tenLop"',
    [info.subjects, info.semester, info.year, diemchuan]
  );
  return rs.rows;
};

exports.getSoHocSinh = async function (cl) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT COUNT(*) FROM PUBLIC."HocSinh" AS HS, PUBLIC."Lop" AS L WHERE HS."maLop" = L."maLop" AND L."tenLop" = $1 ',
    [cl]
  );
  return rs.rows;
};

exports.getSiSo = async function (arr) {
  const Arrs = arr.map(async (obj) => {
    const data = await teacherM.getSoHocSinh(obj.tenLop);
    obj.siso = data[0].count;

    return obj;
  });
  return Promise.all(Arrs);
};

exports.getNameSub = async function (mmh) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT "tenMH" FROM PUBLIC."MonHoc" WHERE "maMH" = $1 ',
    [mmh]
  );
  return rs.rows;
};
