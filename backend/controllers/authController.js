// backend/controllers/authController.js
const User = require('../models/user');
// For password hashing, install bcrypt: npm install bcryptjs
const bcrypt = require('bcryptjs'); // Using bcryptjs for password hashing
const jwt = require('jsonwebtoken'); // For generating JSON Web Tokens

// You should put your JWT secret in an environment variable (e.g., in a .env file)
// For development, you can use a hardcoded string, but DO NOT do this in production.
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here'; // Replace with a strong, secret key

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    try {
        // 1. Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Generic message for security
        }

        // 2. Compare the provided password with the stored HASHED password
        // IMPORTANT: If you are NOT hashing passwords on registration yet, this step will fail.
        // You MUST hash passwords during user creation (e.g., in userController.createUser or User model hook).
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Generic message for security
        }

        // 3. If credentials are valid, generate a JWT token
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                // Include other non-sensitive user data you want in the token
            },
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    message: 'Login successful!',
                    user: { id: user.id, name: user.name, email: user.email }, // Send back user data
                    token, // Send the JWT token
                });
            }
        );

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};