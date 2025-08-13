const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');

const verifyJsonTokenUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Profile.findById(decoded.userId).lean(); // Use lean() for better performance
        if (!user) {
            return res.status(404).json({ msg: "Profile not found" });
        }
        req.user = {
            userId: user._id,
            name: user.name,
            avatar: user.avatar,
            title: user.title
        };
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = { verifyJsonTokenUser };
