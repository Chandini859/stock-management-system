const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const Admin = require('./models/admin');
const SalesPerson = require('./models/salesperson');

passport.use('admin-jwt', new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'admin-secret-key'
}, async (jwtPayload, done) => {
  try {
    const admin = await Admin.findById(jwtPayload._id);
    if (admin) {
      return done(null, admin);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

passport.use('salesperson-jwt', new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'salesperson-secret-key'
}, async (jwtPayload, done) => {
  try {
    const salesperson = await SalesPerson.findById(jwtPayload._id);
    if (salesperson) {
      return done(null, salesperson);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;
