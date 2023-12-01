const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided" });

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;

    if (
      req.user._id.toString() === req.params.id.toString() ||
      req.user.isAdmin
    ) {
      next();
    } else {
      res.status(403).send({ message: "Forbidden!" });
    }
  } catch (error) {
    res.status(400).send({ message: "Invalid Token" });
  }
};
