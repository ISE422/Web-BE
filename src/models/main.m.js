const {pgp,db } = require("../config/postgres")

module.exports={
    getUserByUserName: (username)=>{
        if(username=="admin1"){
            return {username: 'admin1', password: '123'}
        }else{
            return null
        }
    }    
};      