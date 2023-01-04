// const { getClient } = require("../config/postgres");
const teacherM = require("../models/teacher");
const {db,pgp} = require("../config/postgres")

exports.getInfoClass = async function (uid) {
  
  const rs = await db.any(
    'SELECT GV.*,L."tenLop",L."maLop",MH."tenMH" FROM PUBLIC."GiaoVien" AS GV, PUBLIC."PhanCong" AS PC, PUBLIC."Lop" AS L, PUBLIC."MonHoc" AS MH WHERE GV."maGV" = $1 AND PC."maGV" = GV."maGV" AND PC."maLop" = L."maLop" AND GV."maMH" = MH."maMH" ',
    [uid]
  );
  return rs;
};

exports.getScoreStudents = async function (info) {
  
  const rs = await db.any(
    'SELECT HS."hoTen",KQ.* FROM PUBLIC."KetQua" AS KQ, PUBLIC."HocKiNamHoc" AS HK, PUBLIC."HocSinh" AS HS WHERE KQ."maHKNH" = HK."maHKNH" AND HK."tenHK" = $1 AND HK."tenNH" = $2 AND KQ."maHS" = HS."maHS" AND HS."maLop" = $3 AND KQ."maMH" = $4 ORDER BY KQ."maHS"',
    [info.semester, info.year, info.class, info.idSubject]
  );
  return rs;
};

exports.updateScoreStudent = async function (info) {
  const upDiemTk = (
    (Number(info.diem15) + Number(info.diem45) + Number(info.diemFinal)) /
    3
  ).toFixed(1);
  
  const rs = await db.any(
    'UPDATE public."KetQua" SET "diem15" = $1, "diem45" = $2 , "diemHK" = $3 , "DiemTKMON" = $4  WHERE "maKQ" = $5',
    [info.diem15, info.diem45, info.diemFinal, upDiemTk, info.idkq]
  );
  return rs;
};

exports.getDiemChuan = async function () {
  
  const rs = await db.any(
    'SELECT * FROM PUBLIC."QuiDinh" WHERE "maQD" = $1 ',
    ["qddiemchuan"]
  );
  return rs[0];
};

exports.getReport = async function (info, diemchuan) {
  
  const rs = await db.any(
    'SELECT HS."maLop",L."tenLop",count(HS."maLop") AS "SoHocSinhPass" FROM PUBLIC."KetQua" AS KQ, PUBLIC."HocSinh" AS HS, PUBLIC."HocKiNamHoc" AS HK, PUBLIC."Lop" AS L WHERE KQ."maHS" = HS."maHS" AND KQ."maMH" = $1 AND KQ."maHKNH" = HK."maHKNH" AND HK."tenHK" = $2 AND HK."tenNH" = $3 AND KQ."DiemTKMON" >= $4 AND L."maLop" = HS."maLop" GROUP BY HS."maLop",L."tenLop"',
    [info.subjects, info.semester, info.year, diemchuan]
  );
  return rs;
};

exports.getSoHocSinh = async function (cl) {
  
  const rs = await db.any(
    'SELECT COUNT(*) FROM PUBLIC."HocSinh" AS HS, PUBLIC."Lop" AS L WHERE HS."maLop" = L."maLop" AND L."tenLop" = $1 ',
    [cl]
  );
  return rs;
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
  
  const rs = await db.any(
    'SELECT "tenMH" FROM PUBLIC."MonHoc" WHERE "maMH" = $1 ',
    [mmh]
  );
  return rs;
};

exports.getReportTotal = async function (info, diemchuan) {
  
  const rs = await db.any(
    'SELECT HS."maLop",L."tenLop", AVG(KQ."DiemTKMON") FROM PUBLIC."KetQua" AS KQ, PUBLIC."HocSinh" AS HS, PUBLIC."HocKiNamHoc" AS HK, PUBLIC."Lop" AS L WHERE KQ."maHS" = HS."maHS" AND KQ."maHKNH" = HK."maHKNH" AND HK."tenHK" = $1 AND HK."tenNH" = $2 AND L."maLop" = HS."maLop" GROUP BY HS."maLop",L."tenLop",KQ."maHS" HAVING AVG(KQ."DiemTKMON") >= $3 ',
    [info.semester, info.year, diemchuan]
  );
  return rs;
};

exports.groupBy = function (list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};
