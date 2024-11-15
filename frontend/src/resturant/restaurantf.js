import React, { useState } from 'react';
import axios from 'axios';
import './Restaurantf.css'; // Import CSS file for styling

function Restaurantf() {
    const [restaurants, setRestaurants] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newRestaurant, setNewRestaurant] = useState({
        name: '',
        address: '',
        contact: ''
    });

    // Fetch all restaurants
    const fetchRestaurants = async () => {
        try {
            const response = await axios.get('/getAllRestaurants');
            setRestaurants(response.data);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    // Handle form submit to add a new restaurant
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/addRestaurant', newRestaurant);
            alert('Restaurant added successfully');
            setNewRestaurant({ name: '', address: '', contact: '' }); // Reset form
            fetchRestaurants(); // Refresh restaurant list
        } catch (error) {
            console.error("Error adding restaurant:", error);
        }
    };

    return (
        <div className="restaurant-management">
            <h1>Restaurant Management</h1>
            
            <div className="action-buttons">
                <button className="action-button" onClick={fetchRestaurants}>Show All Restaurants</button>
                <button className="action-button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add New Restaurant'}
                </button>
            </div>

            {/* Conditionally render form for adding new restaurant */}
            {showForm && (
                <form className="restaurant-form" onSubmit={handleSubmit}>
                    <h2>Add a New Restaurant</h2>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={newRestaurant.name}
                            onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            value={newRestaurant.address}
                            onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Contact:
                        <input
                            type="text"
                            value={newRestaurant.contact}
                            onChange={(e) => setNewRestaurant({ ...newRestaurant, contact: e.target.value })}
                            required
                        />
                    </label>
                    <button type="submit" className="submit-button">Add Restaurant</button>
                </form>
            )}

            {/* Display list of restaurants in a table */}
            <h2>Restaurant List</h2>
            {restaurants.length > 0 ? (
                <table className="restaurant-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((restaurant) => (
                            <tr key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.address}</td>
                                <td>{restaurant.contact}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No restaurants available. Click "Show All Restaurants" to load.</p>
            )}
        </div>
    );
}

export default Restaurantf;
