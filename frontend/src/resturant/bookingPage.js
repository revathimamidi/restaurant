import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingPage.css'; // Import CSS file for styling

function BookingPage({ restaurantData, diningType }) {
    const [diningOptions, setDiningOptions] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [bookingDetails, setBookingDetails] = useState({
        date: '',
        people: 1,
    });

    useEffect(() => {
        fetchDiningCapacity();
    }, []);

    const fetchDiningCapacity = async () => {
        try {
            const response = await axios.get('http://localhost:3000/restuarantDining/dinning-capacity');
            setDiningOptions(response.data);
        } catch (error) {
            console.error("Error fetching dining capacities:", error);
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/restaurantBooking/restaurantbooking', {
                ...bookingDetails,
                restaurant_id: selectedRestaurant.id,
            });
            alert('Booking successful!');
            setBookingDetails({ date: '', people: 1 });
            setShowForm(false);
        } catch (error) {
            console.error("Error booking dining:", error);
            alert('Booking failed. Please try again.');
        }
    };

    return (
        <div className="booking-page">
            {/* <h2>Book a Table for {diningType}</h2> */}

            <ul className="restaurant-list">
                {restaurantData.map((restaurant) => (
                    <li key={restaurant.id} className="restaurant-card">
                        <h1>{restaurant.name}</h1>
                        <p>Address: {restaurant.address}</p>
                        <p>Contact: {restaurant.contact}</p>
                        {diningOptions && diningOptions[restaurant.type] && (
                            <div className="dining-options">
                                <h4>Available Dining Options</h4>
                                <ul>
                                    {diningOptions[restaurant.type].map((capacity, index) => (
                                        <li key={index}>Table Capacity: {capacity}</li>
                                    ))}
                                </ul>
                                <button
                                    className="booking-button"
                                    onClick={() => {
                                        setSelectedRestaurant(restaurant);
                                        setShowForm(true);
                                    }}
                                >
                                    Book Dining at {restaurant.name}
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {showForm && (
                <form onSubmit={handleBookingSubmit} className="booking-form">
                    <h3>Book a Dining Table at {selectedRestaurant.name}</h3>
                    <label>
                        Booking Date:
                        <input
                            type="date"
                            value={bookingDetails.date}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Number of People:
                        <input
                            type="number"
                            min="1"
                            value={bookingDetails.people}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, people: e.target.value })}
                            required
                        />
                    </label>
                    <div className="form-buttons">
                        <button type="submit" className="submit-button">Submit Booking</button>
                        <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default BookingPage;
