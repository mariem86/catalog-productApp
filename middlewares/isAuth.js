const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config({ path: "./config/.env" });

    const getToken = (user) => {
      return jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        process.env.secretOrKey,
        {
          expiresIn: '48h',
        }
      );
    };


//isAuth
const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ msg: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1]; // extrait le token après 'Bearer'
    const decoded = await jwt.verify(token, process.env.secretOrKey);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).send({ msg: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send({ msg: "Unauthorized" });
  }
};

  
//isAdmin
const isAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user && req.user.isAdmin) {
      return next();
    }
    return res.status(401).send({ message: 'Admin Token is not valid.' });
  };
  
  module.exports= { getToken, isAuth, isAdmin };
