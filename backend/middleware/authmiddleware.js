import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  // it is for bearer kfnsioi so we need the token not the bearer part

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.ngo = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};