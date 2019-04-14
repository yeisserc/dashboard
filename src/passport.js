const passport    = require('passport');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const bcrypt = require('bcrypt');
const authenticationMiddleware = require('./authMiddleware');

const LocalStrategy = require('passport-local').Strategy;
console.log('por aqui paso');
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, cb) {
        console.log('entro aca');
        Admin.findOne({email}, async function (err, user) {
            console.log('user', user);
            if (err) { return cb(err); }
            
            if (!user) {
                return cb(null, false, {message: 'Incorrect email or password.'});
            } else {
                const match = await bcrypt.compare(password, user.password);

                if(!match) {
                    return cb(null, false, {message: 'Incorrect email or password.'});
                }
            }

            return cb(null, user);
        });
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user._id)
})

passport.deserializeUser(function (id, cb) {
    return Admin.findById(id)
    .then(user => {
        return cb(null, user);
    })
    .catch(err => {
        return cb(err);
    });
});

passport.authenticationMiddleware = authenticationMiddleware;