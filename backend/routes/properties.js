const express = require('express');
const router = express.Router();
const pool = require('../db');

// must be registered before /:id 
router.get('/:id/openhouses', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || id.length > 20) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    const [property] = await pool.query(
      'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?',
      [id]
    );

    if (property.length === 0) {
      return res.status(404).json({ error: `Property ${id} not found` });
    }
    // verify property exists before open house query
    const [openhouses] = await pool.query(
      'SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime',
      [id]
    );

    res.json(openhouses);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// must be after /:id/openhouses
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || id.length > 20) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM rets_property WHERE L_ListingID = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Property ${id} not found` });
    }

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 20;
    const offset = req.query.offset !== undefined ? parseInt(req.query.offset) : 0;

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'limit must be between 1 and 100' });
    }
    if (offset < 0 || isNaN(offset)) {
      return res.status(400).json({ error: 'offset must be a non-negative number' });
    }

    // build where clause based on property filters
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

    // run count and data queries separately so we can return total alongside results
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