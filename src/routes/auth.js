const express = require('express');
const router  = express.Router();

const passport = require('passport');

router.get('/logout', function(req, res){
  req.logout();
  return res.redirect("/auth/login");
});


//DASHBOARD
/* POST login. */
router.get('/login', function(req, res){
  if(req.isAuthenticated()) {
    return res.redirect("/user/");
  }
  return res.render("admin/login");
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
        return res.render("admin/login", {error: "Error en el servidor. Intente Nuevamente"});
    }
    if(!user) {
      console.log('no user');
      return res.render("admin/login", {error: "Email o Contraseña invalida"});
    }
    req.logIn(user, {session: true}, (err) => {
      if (err) {
        console.log('error2', err);
        return res.render("admin/login", {error: "Error en el servidor. Intente Nuevamente"});
      }
      return res.redirect("/user/");
    });
  })(req, res, next);
});

module.exports = router;