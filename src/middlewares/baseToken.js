const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/secretKey");

const parseToken = (data) => {
  let token = jwt.sign({ data }, secretKey, { expiresIn: "7d" });

  return token;
};

const checkToken = (token) => {
  try {
    let checkT = jwt.verify(token, secretKey);

    if (checkT) {
      return { checkData: true, message: "" };
    } else {
      return { checkData: false, message: "Token không hợp lệ!" };
    }
  } catch (err) {
    return { checkData: false, message: err.message };
  }
};

const verifyToken = (req, res, next) => {
  const { token } = req.headers;
  const verifyToken = checkToken(token);

  if (verifyToken.checkData) {
    next();
  } else {
    res.status(401).send(verifyToken.message);
  }
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = { parseToken, checkToken, verifyToken, decodeToken };
