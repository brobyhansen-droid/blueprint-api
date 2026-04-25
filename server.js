const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'Blueprint API running' });
});

app.post('/generate', async (req, res) => {
  try {
    console.log('Received request');
    const response = await axios({
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      data: req.body,
      timeout: 120000
    });
    console.log('Success');
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/contact', async (req, res) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://services.leadconnectorhq.com/contacts/',
      headers: {
        'Authorization': 'Bearer pit-dbc62072-49d2-4175-a81e-65a46328c7b1',
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      data: req.body,
      timeout: 15000
    });
    console.log('Contact created');
    res.json(response.data);
  } catch (error) {
    console.error('Contact error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
