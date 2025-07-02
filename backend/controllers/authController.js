// backend/controllers/authController.js
const { User } = require('../models');
// For password hashing, install bcrypt: npm install bcryptjs
const bcrypt = require('bcryptjs'); // Using bcryptjs for password hashing
const jwt = require('jsonwebtoken'); // For generating JSON Web Tokens

// You should put your JWT secret in an environment variable (e.g., in a .env file)
// For development, you can use a hardcoded string, but DO NOT do this in production.
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here'; // Replace with a strong, secret key

exports.loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    // Basic validation
    if (!identifier || !password) {
        return res.status(400).json({ message: 'Please enter your username/email and password.' });
    }

    try {
        // 1. Find the user by email or username (name)
        const user = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [
                    { email: identifier },
                    { name: identifier }
                ]
            }
        });

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
                avatar: user.avatar,
                bio: user.bio,
                // Include other non-sensitive user data you want in the token
            },
        };

        // Generate the token synchronously and let the try/catch handle any errors.
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Send the successful response
        res.status(200).json({
            message: 'Login successful!',
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio }, // Send back user data
            token, // Send the JWT token
        });
    } catch (error) {
        // Now, any error from jwt.sign will be caught here correctly.
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};