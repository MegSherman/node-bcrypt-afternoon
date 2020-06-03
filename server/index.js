require ('dotenv').config ()
const express = require ('express'),
    session = require ('express-session'),
    massive = require ('massive'),
    app = express (),
    { SESSION_SECRET, CONNECTION_STRING } = process.env,
    authCtrl = './controllers/authController',
    treasureCtrl = './controllers/treasureController',
    auth = require ('./middleware/authMiddleware')
    SERVER_PORT = 4000

app.use (express.json())

massive ({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then (db => {
    app.set ('db', db)
    console.log ('db connected')
}).catch (
    console.log ('problems with db')
)

app.use (
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
)

app.post ('/auth/register', authCtrl.register)
app.post ('/auth/login', authCtrl.login)
app.get ('/auth/logout', authCtrl.logout)

app.get ('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get ('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)

app.listen (SERVER_PORT, () => console.log (`Opening treasure on port ${SERVER_PORT}`))