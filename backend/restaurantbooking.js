import { Router } from 'express';
const router = Router();

router.get('/restaurantbooking', (req, res) => {
    const query = 'SELECT * FROM arestaurantbooking';
    
    req.db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching bookings' });
        }
        res.json(results);
    });
});


router.post('/restaurantbooking', (req, res) => {
    const { no_of_persons, date, daypart, contact, name, seating_category } = req.body;
    if (!no_of_persons || !date || !daypart || !contact || !name || !seating_category) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const query = `
        INSERT INTO arestaurantbooking (no_of_persons, date, daypart, contact, name, seating_category) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    req.db.query(query, [Number(no_of_persons), date, daypart, contact, name, seating_category], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: 'Booking added successfully', id: result.insertId });
    });
});


router.delete('/restaurantbooking/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM arestaurantbooking WHERE id = ?';
    
    req.db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting booking' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json({ message: 'Booking deleted successfully' });
    });
});

export default router;
