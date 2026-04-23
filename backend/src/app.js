const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/fields');
const updateRoutes = require('./routes/updates');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/fields/:id/updates', updateRoutes);

app.get('/', (req, res) => res.json({ message: 'SmartSeason API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;