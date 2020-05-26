const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", "Login failed, try again.");
      return res.render("login", {
        title: "Login",
        flashes: req.flash(),
        body: req.body,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      // generate a signed jwt web token with the contents of user object and return it in the response
      const token = jwt.sign(user.toJSON(), "your_jwt_secret");
      req.flash("success", `Nice, copy your token!`);
      return res.render("layout", {
        flashes: req.flash(),
        clipboardText: token,
      });
    });
  })(req, res);
};

exports.jwtAuth = passport.authenticate("jwt", { session: false });
