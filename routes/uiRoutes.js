const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/registrations/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../resources/html/register.html'));
});

router.get('/registrations/view', (req, res) => {
  res.sendFile(path.join(__dirname, '../resources/html/view.html'));
});

module.exports = router;
