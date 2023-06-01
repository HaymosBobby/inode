const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = ( req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Access denied. No token provided")
    
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    // console.log(decoded);
    if (req.user.id === req.params.id && req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Forbidden!");
    }
    next();
  } catch(ex) {
    res.status(400).send("Invalid Token");
  }
};