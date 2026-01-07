const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// CORS Configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, mobile apps, etc.)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
        ];

        // Add production frontend URL from environment variable
        if (process.env.FRONTEND_URL) {
            allowedOrigins.push(process.env.FRONTEND_URL);
            // Also add without trailing slash if present
            allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
        }

        // In dev allow all; in prod restrict
        const isDev = (process.env.NODE_ENV || 'development') !== 'production';
        if (isDev) return callback(null, true);

        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security + logging
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "blob:", "http:", "https:"],
        },
    },
}));
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Root
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Khadamati API Server',
        version: '1.0.0',
        endpoints: {
            api: '/api/v1',
            health: '/api/v1/health',
        },
    });
});

// API routes
app.use('/api/v1', routes);

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`,
    });
});

// Error handler
app.use(errorMiddleware);

module.exports = app;
