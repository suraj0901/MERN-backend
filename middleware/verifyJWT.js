import { verify } from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const authHEader = req.headers.authorization || req.headers.Authorization;
  if (!authHEader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHEader.split(" ")[1];

  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};
