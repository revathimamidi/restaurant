import { Router } from 'express';
const router = Router();

router.get('/dinning-capacity', (req, res) => {
    const query = `
        SELECT DISTINCT table_capacity, type 
        FROM dinning
        ORDER BY type, table_capacity
    `;
    
    req.db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching capacities' });
        }
        const capacities = results.reduce((acc, row) => {
            const { type, table_capacity } = row;
            if (!acc[type]) {
                acc[type] = [];
            }
            if (!acc[type].includes(table_capacity)) {
                acc[type].push(table_capacity);
            }
            return acc;
        }, {});

        res.json(capacities);
    });
});


export default  router;
