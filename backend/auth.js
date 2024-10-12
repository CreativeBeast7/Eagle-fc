const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); // For sending reset password email
const User = require('./models/User'); // Replace with your User model

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Route for updating profile
app.post('/update-profile', async (req, res) => {
    const { uname, email, psw } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            user.username = uname;
            if (psw) {
                user.password = await bcrypt.hash(psw, 10); // Hash the password
            }
            await user.save();
            res.send('Profile updated successfully!');
        } else {
            res.status(404).send('User not found!');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Route for forgot password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found!');
        }

        // Generate a reset token (you'll need to implement this)
        const resetToken = user.generateResetToken();

        // Send email (replace with your email config)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            to: email,
            subject: 'Password Reset',
            text: `To reset your password, click the following link: http://yourdomain.com/reset-password?token=${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        res.send('Reset link sent to your email!');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;
// backend/auth.js

// Route for creating an account
app.post('/create-account', async (req, res) => {
    const { uname, email, psw } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already in use!'); // Return message if email is already used
        }

        const hashedPassword = await bcrypt.hash(psw, 10); // Hash the password
        const newUser = new User({ username: uname, email, password: hashedPassword });
        await newUser.save();
        res.send('Account created successfully!'); // Feedback message
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
