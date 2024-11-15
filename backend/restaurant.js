import { Router } from 'express';
const router = Router();


router.get('/getAllRestaurants', (req, res) => {
    req.db.query('SELECT * FROM arestaurant', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// POST method: Add a new restaurant
router.post('/addRestaurant', (req, res) => {
    const { name, address, contact } = req.body;
    const query = 'INSERT INTO arestaurant (name, address, contact) VALUES (?, ?, ?)';
    req.db.query(query, [name, address, contact], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Restaurant added successfully', id: results.insertId });
        }
    });
});

export default router
