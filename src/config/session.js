const session = require('express-session')
module.exports = app =>{
    app.set('trust-proxy',1)
    app.use(session({
        secret: 'qwrtryt',
        resave: false, // dat lai session cookie cho moi req
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 900000,
            httpOnly: true,
        }
    }))
}