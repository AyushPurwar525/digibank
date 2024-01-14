// api/getData.js
const data = require('../src/app/db.json'); // Adjust the path accordingly

module.exports = (req, res) => {
  res.status(200).json(data);
};
