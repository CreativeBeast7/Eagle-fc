// Example of a simple client-side validation function
document.addEventListener("DOMContentLoaded", function() {
    const updateProfileForm = document.querySelector('.profile-container form');
    const forgotPasswordForm = document.querySelector('.forgot-password-container form');

    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', function(e) {
            // Add client-side validation logic if needed
            const password = updateProfileForm.querySelector('input[name="psw"]');
            if (password.value && password.value.length < 6) {
                e.preventDefault();
                alert("Password must be at least 6 characters long.");
            }
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            // Add client-side validation logic if needed
            const email = forgotPasswordForm.querySelector('input[name="email"]');
            if (!email.value.includes('@')) {
                e.preventDefault();
                alert("Please enter a valid email address.");
            }
        });
    }
});
// backend/auth.js

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // For sending reset password email
const User = require('./models/User'); // Replace with your User model

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Route for forgot password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found!'); // Return a message if user not found
        }

        // Generate a reset token (you'll need to implement this)
        const resetToken = user.generateResetToken(); // Implement this function

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
        res.send('Reset link sent to your email!'); // Feedback message
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
