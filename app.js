const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { google } = require('googleapis');

const routes = require('./routes');
const config = require('./config');
require('dotenv').config();

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use('/api', routes);
app.get('/emails', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1',
    });
    
    const rows = response.data.values;
    const emails = rows.slice(1).map(row => ({
      id: row[0],
      email: row[1],
      isActive: row[2],
    })).filter(ad => ad.isActive === 'TRUE');
    
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
