function header(req) {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader === "undefined") {
    return false;
  } else if (!req.headers.authorization.includes("Bearer ")) {
    return false;
  } else if (req.headers.authorization.length < 35) {
    return false;
  } else {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    return req.token;
  }
}

module.exports = header;
