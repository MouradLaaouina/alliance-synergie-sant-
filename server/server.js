const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet()); // Protection against common web vulnerabilities
app.use(cors()); // Enable CORS for the frontend

// Rate Limiting: Limit requests from the same IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Trop de tentatives. Veuillez réessayer plus tard."
    }
});
app.use('/api/', limiter);

app.use(express.json());

// Main Route - Receive Contact Form
app.post('/api/contact', async (req, res) => {
    const { name, company, email, phone, interest, otherInterest, message } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO contacts (name, company, email, phone, interest, otherInterest, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, company, email, phone, interest, otherInterest, message]
        );

        res.status(201).json({
            success: true,
            message: 'Message enregistré avec succès',
            id: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de l\'insertion SQL:', error);
        res.status(500).json({
            success: false,
            message: 'Une erreur est survenue lors de l\'enregistrement.'
        });
    }
});

// Test health check
app.get('/health', (req, res) => {
    res.send('Server is running and healthy');
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
