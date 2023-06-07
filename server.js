const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const blogRoutes = require('./app/routes/blogRoutes');
const userRoutes = require('./app/routes/userRoutes');
const bookRoutes = require('./app/routes/bookRoutes');

const app = express();

dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
