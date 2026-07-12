const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'limit must be between 1 and 100' });
    }
    if (offset < 0 || isNaN(offset)) {
      return res.status(400).json({ error: 'offset must be a non-negative number' });
    }

    const conditions = [];
    const values = [];

    if (req.query.city) {
      conditions.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))');
      values.push(req.query.city);
    }
    if (req.query.zipcode) {
      conditions.push('L_Zip = ?');
      values.push(req.query.zipcode);
    }
    if (req.query.minPrice) {
      if (isNaN(req.query.minPrice)) return res.status(400).json({ error: 'minPrice must be a number' });
      conditions.push('L_SystemPrice >= ?');
      values.push(Number(req.query.minPrice));
    }
    if (req.query.maxPrice) {
      if (isNaN(req.query.maxPrice)) return res.status(400).json({ error: 'maxPrice must be a number' });
      conditions.push('L_SystemPrice <= ?');
      values.push(Number(req.query.maxPrice));
    }
    if (req.query.beds) {
      if (isNaN(req.query.beds)) return res.status(400).json({ error: 'beds must be a number' });
      conditions.push('L_Keyword2 >= ?');
      values.push(Number(req.query.beds));
    }
    if (req.query.baths) {
      if (isNaN(req.query.baths)) return res.status(400).json({ error: 'baths must be a number' });
      conditions.push('LM_Dec_3 >= ?');
      values.push(Number(req.query.baths));
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const countQuery = `SELECT COUNT(*) as total FROM rets_property ${where}`;
    const dataQuery = `SELECT L_ListingID, L_Address, L_City, L_State, L_Zip, L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3, L_Photos FROM rets_property ${where} LIMIT ? OFFSET ?`;

    const [countResult] = await pool.query(countQuery, values);
    const [results] = await pool.query(dataQuery, [...values, limit, offset]);

    res.json({
      total: countResult[0].total,
      limit,
      offset,
      results
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;