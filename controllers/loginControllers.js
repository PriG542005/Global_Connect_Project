const express = require('express');

const { validationResult } = require("express-validator")

const Otp = require('../models/Otp');
const { sendmail } = require('../helpers/mailer')
const Profile = require('../models/Profile');

const becrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginControllers = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({
                success: false,
                msg: "Validation Error",
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        const fetchUser = await Profile.findOne({ email });

        if (!fetchUser) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        const comparePassword = await becrypt.compare(password, fetchUser.password);
        if (!comparePassword) {
            return res.status(401).json({
                success: false,
                msg: "Invalid Credentials"
            });
        }

        return res.status(200).json({
            success: true,
            token: jwt.sign({ userId: fetchUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" }),
            msg: 'Login Successful',
            user: { // Return relevant user details
                _id: fetchUser._id,
                name: fetchUser.name,
                avatar: fetchUser.avatar,
                title: fetchUser.title || '', // Ensure title is a string, even if empty
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};


const userRegister = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({
                success: false,
                msg: "Validation Error",
                errors: errors.array()
            })
        }
        const { name, email, password, otp } = req.body;
        const isExists = await Profile.findOne({ email })
        if (isExists) {
            return res.status(409).json({
                success: false,
                msg: "Email Already Exists"
            })
        }
        const numOtp = Number(otp)
        const fetchOtp = await Otp.findOne({ email })
        if (!fetchOtp) {
            return res.status(404).json({
                success: false,
                msg: "Please Generate Otp First"
            })
        }

        if (fetchOtp.otp !== numOtp) {
            return res.status(403).json({
                success: false,
                msg: "invalid otp"
            })
        }
        const hashpassword = await becrypt.hash(password, 12)
        const user = new Profile({
            name,
            email,
            password: hashpassword,

        })
        const userData = await user.save();
       
        Otp.deleteMany({ email: email })
        return res.status(200).json({
            success: true,
            token: jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: "1h" }),
            msg: "User Register Successfully",
            user: { // Return relevant user details
                _id: userData._id,
                name: userData.name,
                avatar: userData.avatar,
                title: userData.title || '', 
                
            }
        })

    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }

}

const GenerateOtpForRegister = async (req, res) => {
    try {
        let { email } = req.body;
        email = email.toLowerCase()
        const isExists = await Profile.findOne({ email })
        if (isExists) {
            return res.status(409).json({
                success: false,
                msg: "Email Already Exists"
            })
        }
        const deleteFirstOtp = await Otp.deleteMany({ email: email })
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpData = new Otp({
            email,
            otp
        })
        await otpData.save();
        await sendmail(email, "verification", `Your OTP for registration is   ${otp}   . Please do not share it with anyone. Thank You.`);
        return res.status(200).json({
            success: true,
            msg: "OTP Sent Successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports = { loginControllers, userRegister, GenerateOtpForRegister };
