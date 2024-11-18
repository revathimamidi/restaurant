import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dishes.css';

function Dishes() {
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newDish, setNewDish] = useState({
        item_category: '',
        type: '',
        name: '',
        description: '',
        price: '',
        quantity: '',
        available_in: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (dishes.length > 0) {
            // Extract unique categories and types from dishes
            const allCategories = [...new Set(dishes.map(dish => dish.item_category))];
            const allTypes = [...new Set(dishes.map(dish => dish.type))];
            setCategories(allCategories);
            setTypes(allTypes);
        }
    }, [dishes]);

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

    const handleAddDish = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await axios.post('http://localhost:3000/dishes', newDish);
            setMessage('Dish added successfully');
            setNewDish({
                item_category: '',
                type: '',
                name: '',
                description: '',
                price: '',
                quantity: '',
                available_in: '',
                image_url: ''
            });
            fetchDishes();
        } catch (error) {
            setMessage('Error adding dish');
            console.error(error);
        } finally {
            setLoading(false);
            setShowForm(false);
        }
    };

    const filteredDishes = dishes.filter(dish => dish.item_category === selectedCategory);

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

            <div className="dishes-layout">
                {/* Sidebar Menu */}
                <div className="dishes-menu">
                    <h3>Categories</h3>
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`menu-item ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="dishes-content">
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
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Type:
                                <select
                                    value={newDish.type}
                                    onChange={(e) => setNewDish({ ...newDish, type: e.target.value })}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {types.map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
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

                    <h2>{selectedCategory ? `${selectedCategory} Dishes` : 'Select a Category'}</h2>
                    <div className="dish-cards">
    {filteredDishes.length > 0 ? (
        filteredDishes.map((dish) => (
            <div className="dish-card" key={dish.id}>
                <div className="dish-image-container">
                    <img src={dish.image_url} alt={dish.name} className="dish-image" />
                    <div className="dish-veg-icon">
                        {dish.type === 'Veg' ? '🟢' : '🔴'}
                    </div>
                </div>
                <div className="dish-info">
                    <h3 className="dish-name">{dish.name}</h3>
                    <p className="dish-price">₹{dish.price}</p>
                    <p className="dish-description">{dish.description}</p>
                </div>
            </div>
        ))
    ) : (
        <p>No dishes available in this category.</p>
    )}
</div>

                </div>
            </div>
        </div>
    );
}

export default Dishes;
