const {getClient} = require('../config/postgres')

module.exports={
    getLastId: async(tablename, nameField)=>{
        var client = await getClient()
        var rs = await client.query
        (`select * from public."${tablename}"`)
        if(!rs){
            return 0
        }else{
            return (rs.rows[rs.rows.length-1])[nameField]
        }
    },

    findByName: async(tablename, nameField, value)=>{
        var client = await getClient()
        var rs = await client.query
        (`select * from public."${tablename}" where "${nameField}" like '${value}'`)
        return rs.rows
    },

    insertClass: async(data)=>{
        var client = await getClient()
        var rs = await client.query
        (`insert into public."Lop" 
        ("maLop", "maKhoi", "tenLop", "maGVCN") values
        ('${data.maLop}','${data.maKhoi}','${data.tenLop}','${data.maGVCN}')`)
        return rs
    }
}