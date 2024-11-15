import React, { useState } from 'react';
import axios from 'axios';
import './Dishes.css';

function Dishes() {
    const [dishes, setDishes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newDish, setNewDish] = useState({
        item_category: 'Rice', 
        type: 'Veg', 
        name: '',
        description: '',
        price: '',
        quantity: '',
        available_in: '',
        // restaurant_id: '',
        image_url: ''  // New field for image URL
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchDishes = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.get('http://localhost:3000/dishes/getdishes');
            setDishes(response.data);
        } catch (error) {
            setMessage('Error fetching dishes');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const groupDishes = (dishes) => {
        const grouped = { V: {}, N: {} };
        dishes.forEach(dish => {
            const { type, item_category } = dish;
            if (!grouped[type][item_category]) {
                grouped[type][item_category] = [];
            }
            grouped[type][item_category].push(dish);
        });
        return grouped;
    };

    const handleAddDish = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await axios.post('http://localhost:3000/dishes', newDish);
            setMessage('Dish added successfully');
            setNewDish({ item_category: 'Rice', type: 'Veg', name: '', description: '', price: '', quantity: '', available_in: '', restaurant_id: '', image_url: '' });
            fetchDishes();
        } catch (error) {
            setMessage('Error adding dish');
            console.error(error);
        } finally {
            setLoading(false);
            setShowForm(false);
        }
    };

    const groupedDishes = groupDishes(dishes);

    return (
        <div className="dishes-container">
            <h1>Restaurant Dishes</h1>

            <div className="action-buttons">
                <button className="action-button" onClick={fetchDishes}>Show All Dishes</button>
                <button className="action-button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add New Dish'}
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {message && <p>{message}</p>}

            {showForm && (
                <form className="dish-form" onSubmit={handleAddDish}>
                    <h2>Add a New Dish</h2>
                    <label>
                        Category:
                        <select
                            value={newDish.item_category}
                            onChange={(e) => setNewDish({ ...newDish, item_category: e.target.value })}
                            required
                        >
                            <option value="Rice">Rice</option>
                            <option value="Biryani">Biryani</option>
                            <option value="Curry">Curry</option>
                            <option value="Starter">Starter</option>
                        </select>
                    </label>
                    <label>
                        Type:
                        <select
                            value={newDish.type}
                            onChange={(e) => setNewDish({ ...newDish, type: e.target.value })}
                            required
                        >
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                        </select>
                    </label>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={newDish.name}
                            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <input
                            type="text"
                            value={newDish.description}
                            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            value={newDish.price}
                            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Quantity:
                        <select
                            value={newDish.quantity}
                            onChange={(e) => setNewDish({ ...newDish, quantity: e.target.value })}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Piece">Piece</option>
                            <option value="Volume">Volume</option>
                        </select>
                    </label>
                    <label>
                        Available In:
                        <select
                            value={newDish.available_in}
                            onChange={(e) => setNewDish({ ...newDish, available_in: e.target.value })}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Piece">Piece</option>
                            <option value="Half">Half</option>
                            <option value="Full">Full</option>
                        </select>
                    </label>
                    <label>
                        Image URL:
                        <input
                            type="text"
                            value={newDish.image_url}
                            onChange={(e) => setNewDish({ ...newDish, image_url: e.target.value })}
                            required
                        />
                    </label>
                    <button type="submit" className="submit-button">Add Dish</button>
                </form>
            )}

            <h2>Dishes List</h2>
            {dishes.length > 0 ? (
                <div className="dishes-list">
                    {['V', 'N'].map(type => (
                        <div key={type} className="dishes-category">
                            <h3>{type === 'V' ? 'Veg Dishes' : 'Non-Veg Dishes'}</h3>
                            {Object.keys(groupedDishes[type] || {}).map(category => (
                                <div key={category} className="dish-category">
                                    <h4>{category}</h4>
                                    <div className="dish-cards">
                                        {groupedDishes[type][category].map(dish => (
                                            <div className="dish-card" key={dish.id}>
                                                <img src={dish.image_url} alt={dish.name} className="dish-image" />
                                                <h5>{dish.name}</h5>
                                                <p>Description: {dish.description}</p>
                                                <p>Price: ${dish.price}</p>
                                                <p>Quantity: {dish.quantity}</p>
                                                <p>Available In: {dish.available_in}</p>
                                                <p>Restaurant ID: {dish.restaurant_id}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No dishes available. Click "Show All Dishes" to load.</p>
            )}
        </div>
    );
}

export default Dishes;
