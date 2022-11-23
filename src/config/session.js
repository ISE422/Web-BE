const session = require('express-session')
module.exports = app =>{
    app.set('trust-proxy',1)
    app.use(session({
        secret: 'qwrtryt',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    }))
}