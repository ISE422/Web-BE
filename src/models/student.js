const { getClient } = require("../config/postgres");

exports.getInfo = async function (username) {
  const client = await getClient();
  const rs = await client.query(
    'select hs.*, l."tenLop" from public."HocSinh" as hs, public."Lop" as l where hs."maHS" = $1 and hs."maLop" = l."maLop" ',
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

exports.updateDiemTKMON = async function () {
  const client = await getClient();
  const rs = await client.query('select * from public."KetQua"');
  // console.log(rs.rows);
  rs.rows.map(async (info) => {
    const diemtk = ((info.diem15 + info.diem45 + info.diemHK) / 3).toFixed(1);
    const rs = await client.query(
      'UPDATE public."KetQua" SET "DiemTKMON" = $1 WHERE "maKQ" = $2 ',
      [diemtk, info.maKQ]
    );
  });
};

// exports.getTopRankAllSemester1Year = async function (info) {
//   const client = await getClient();
//   const rs = await client.query(
//     'SELECT TK."maHS",TK."DiemTongKetHocKy1", HS."hoTen" FROM PUBLIC."TongKet" AS TK, PUBLIC."HocKiNamHoc" AS HK, PUBLIC."HocSinh" AS HS WHERE TK."NamHoc" = HK."tenNH" AND HS."maHS" = TK."maHS"  AND TK."NamHoc" = $1 AND HK."tenHK" = $2 ORDER BY TK."DiemTongKetHocKy1" DESC LIMIT $3',
//     [info.year, info.semester, info.limit]
//   );
//   return rs.rows;
// };

// exports.getTopRankAllSemester2Year = async function (info) {
//   const client = await getClient();
//   const rs = await client.query(
//     'SELECT TK."maHS",TK."DiemTongKetHocKy2", HS."hoTen" FROM PUBLIC."TongKet" AS TK, PUBLIC."HocKiNamHoc" AS HK, PUBLIC."HocSinh" AS HS WHERE TK."NamHoc" = HK."tenNH" AND HS."maHS" = TK."maHS"  AND TK."NamHoc" = $1 AND HK."tenHK" = $2 ORDER BY TK."DiemTongKetHocKy2" DESC LIMIT $3',
//     [info.year, info.semester, info.limit]
//   );
//   return rs.rows;
// };

// exports.getTopRankAllYear = async function (info) {
//   const client = await getClient();
//   const rs = await client.query(
//     'SELECT TK."maHS",TK."DiemTongKetNamHoc", HS."hoTen" FROM PUBLIC."TongKet" AS TK, PUBLIC."HocSinh" AS HS WHERE  HS."maHS" = TK."maHS"  AND TK."NamHoc" = $1 ORDER BY TK."DiemTongKetNamHoc" DESC LIMIT $2',
//     [info.year, info.limit]
//   );
//   return rs.rows;
// };

// exports.getTopRankSubSemesterYear = async function (info) {
//   const client = await getClient();
//   const rs = await client.query(
//     'SELECT KQ."maHS", HS."hoTen", KQ."DiemTKMON" FROM PUBLIC."KetQua" AS KQ, PUBLIC."HocSinh" AS HS, PUBLIC."HocKiNamHoc" AS HK WHERE KQ."maHS" = HS."maHS" AND KQ."maMH" = $1 AND KQ."maHKNH" = HK."maHKNH" and HK."tenHK" = $2 and HK."tenNH" = $3 ORDER BY "DiemTKMON" DESC LIMIT $4',
//     [info.subjects, info.semester, info.year, info.limit]
//   );
//   return rs.rows;
// };

exports.getTopRankSemesterYear = async function (info) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT hs."hoTen", kh."tenKhoi", kq.* FROM PUBLIC."HocSinh" AS hs, PUBLIC."Lop" AS l , PUBLIC."Khoi" AS kh, PUBLIC."KetQua" AS kq, PUBLIC."HocKiNamHoc" AS hk WHERE kh."maKhoi" = l."maKhoi" AND l."maLop" = hs."maLop" AND kh."maKhoi" = $1 AND kq."maHS" = hs."maHS" AND kq."maHKNH" = hk."maHKNH" AND hk."tenHK" = $2 AND hk."tenNH" = $3 ORDER BY "maHS" ',
    [info.grade, info.semester, info.year]
  );
  return rs.rows;
};

exports.getTopRankYear = async function (info) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT hs."hoTen", kh."tenKhoi", kq.* FROM PUBLIC."HocSinh" AS hs, PUBLIC."Lop" AS l , PUBLIC."Khoi" AS kh, PUBLIC."KetQua" AS kq, PUBLIC."HocKiNamHoc" AS hk WHERE kh."maKhoi" = l."maKhoi" AND l."maLop" = hs."maLop" AND kh."maKhoi" = $1 AND kq."maHS" = hs."maHS" AND kq."maHKNH" = hk."maHKNH" AND hk."tenNH" = $2 ORDER BY "maHS" ',
    [info.grade, info.year]
  );
  return rs.rows;
};

exports.getTopRankSubSemesterYear = async function (info) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT KQ."maHS", HS."hoTen", KQ."DiemTKMON", kh."tenKhoi" FROM PUBLIC."KetQua" AS KQ, PUBLIC."HocSinh" AS HS, PUBLIC."HocKiNamHoc" AS HK , PUBLIC."Lop" AS l, PUBLIC."Khoi" AS kh WHERE kh."maKhoi" = l."maKhoi" AND l."maLop" = hs."maLop" AND kh."maKhoi" = $5 AND KQ."maHS" = HS."maHS" AND KQ."maMH" = $1 AND KQ."maHKNH" = HK."maHKNH" and HK."tenHK" = $2 and HK."tenNH" = $3 ORDER BY "DiemTKMON" DESC LIMIT $4',
    [info.subjects, info.semester, info.year, info.limit, info.grade]
  );
  return rs.rows;
};

exports.getTopRankSubYear = async function (info) {
  const client = await getClient();
  const rs = await client.query(
    'SELECT hs."hoTen", kh."tenKhoi", kq.* FROM PUBLIC."HocSinh" AS hs, PUBLIC."Lop" AS l , PUBLIC."Khoi" AS kh, PUBLIC."KetQua" AS kq, PUBLIC."HocKiNamHoc" AS hk WHERE kh."maKhoi" = l."maKhoi" AND l."maLop" = hs."maLop" AND kh."maKhoi" = $1 AND kq."maHS" = hs."maHS" AND kq."maHKNH" = hk."maHKNH" AND hk."tenNH" = $2 AND kq."maMH" = $3 ORDER BY "maHS" ',
    [info.grade, info.year, info.subjects]
  );
  return rs.rows;
};
