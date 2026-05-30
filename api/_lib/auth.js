import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

export function verifyAdmin(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return false;
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return false;
  }
}
