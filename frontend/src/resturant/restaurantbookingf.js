import React, { useState } from 'react';
import axios from 'axios';
import './RestaurantBooking.css';

function RestaurantBooking() {
    const [bookings, setBookings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newBooking, setNewBooking] = useState({
        no_of_persons: '',
        date: '',
        daypart: 'AM',
        contact: '',
        name: '',
        seating_category: 'Sofa Type', // Default to 'Sofa Type'
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchBookings = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.get('http://localhost:3000/restaurantBooking/restaurantbooking');
            setBookings(response.data);
        } catch (error) {
            setMessage('Error fetching bookings');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await axios.post('http://localhost:3000/restaurantBooking/restaurantbooking', newBooking);
            setMessage('Booking added successfully');
            setNewBooking({ no_of_persons: '', date: '', daypart: 'AM', contact: '', name: '', seating_category: 'Sofa Type' });
            fetchBookings();
        } catch (error) {
            setMessage('Error adding booking');
            console.error(error);
        } finally {
            setLoading(false);
            setShowForm(false);
        }
    };

    const handleDeleteBooking = async (id) => {
        setLoading(true);
        setMessage('');
        try {
            await axios.delete(`http://localhost:3000/restaurantBooking/restaurantbooking/${id}`);
            setMessage('Booking deleted successfully');
            fetchBookings();
        } catch (error) {
            setMessage('Error deleting booking');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="restaurant-booking">
            <h1>Restaurant Bookings</h1>

            <div className="actions">
                <button className="action-button" onClick={fetchBookings}>Show All Bookings</button>
                <button className="action-button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add New Booking'}
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {message && <p className="message">{message}</p>}

            {showForm && (
                <form onSubmit={handleAddBooking} className="booking-form">
                    <h2>Add a New Booking</h2>
                    <label>
                        No of Persons:
                        <input
                            type="number"
                            value={newBooking.no_of_persons}
                            onChange={(e) => setNewBooking({ ...newBooking, no_of_persons: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Date:
                        <input
                            type="date"
                            value={newBooking.date}
                            onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                            min={today}
                            required
                        />
                    </label>
                    <label>
                        Daypart:
                        <select
                            value={newBooking.daypart}
                            onChange={(e) => setNewBooking({ ...newBooking, daypart: e.target.value })}
                            required
                        >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </label>
                    <label>
                        Contact:
                        <input
                            type="text"
                            value={newBooking.contact}
                            onChange={(e) => setNewBooking({ ...newBooking, contact: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={newBooking.name}
                            onChange={(e) => setNewBooking({ ...newBooking, name: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Seating Category:
                        <select
                            value={newBooking.seating_category}
                            onChange={(e) => setNewBooking({ ...newBooking, seating_category: e.target.value })}
                            required
                        >
                            <option value="Sofa Type">Sofa Type</option>
                            <option value="Table Type">Table Type</option>
                        </select>
                    </label>
                    <button type="submit" className="submit-button">Add Booking</button>
                </form>
            )}

            <h2>Booking List</h2>
            {bookings.length > 0 ? (
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Daypart</th>
                            <th>Contact</th>
                            <th>No of Persons</th>
                            <th>Seating Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.name}</td>
                                <td>{booking.date.split('T')[0]}</td>
                                <td>{booking.daypart}</td>
                                <td>{booking.contact}</td>
                                <td>{booking.no_of_persons}</td>
                                <td>{booking.seating_category}</td>
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteBooking(booking.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No bookings available. Click "Show All Bookings" to load.</p>
            )}
        </div>
    );
}

export default RestaurantBooking;
