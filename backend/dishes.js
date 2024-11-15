import { Router } from 'express';
const router = Router();



router.get('/getdishes', (req, res) => {
    const sql = 'SELECT * FROM dishes';

    // Check if req.db is available
    if (!req.db) {
        return res.status(500).json({ error: "Database connection not found" });
    }

    req.db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});
router.post('/postdishes', (req, res) => {
    const { item_category, type, name, description, price, quantity, available_in, restaurant_id } = req.body;

    const sql = 'INSERT INTO dishes (item_category, type, name, description, price, quantity, available_in, restaurant_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [item_category, type, name, description, price, quantity, available_in, restaurant_id];

    req.db.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Dish added successfully', id: result.insertId });
        }
    });
});


export default router;
