import express, { json } from 'express';
import { createConnection } from 'mysql';
import RestaurantRoutes from './restaurant.js';
import RestaurantBooking from './restaurantbooking.js'
import RestaurantDining  from './restaurantdinning.js'
import Dishes from './dishes.js'
import cors from 'cors';


const app = express();
app.use(json());
app.use(cors());

// Database connection
const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'restaurantdb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

// Pass db connection to routes



app.use((req, res, next) => {
    req.db = db;
    next();
});


app.use('/restuarants',RestaurantRoutes)
app.use('/restaurantBooking',RestaurantBooking)
app.use('/restuarantDining',RestaurantDining)
app.use('/dishes',Dishes)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
