import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import BookingPage from './resturant/bookingPage';
import DinningCapacity from './resturant/restaurantdinningf';
import Dishes from './resturant/restaurantdishesf';
import './App.css';

function App() {
    const [restaurantData, setRestaurantData] = useState(null);
    const [diningType, setDiningType] = useState('');
    const [showMainPage, setShowMainPage] = useState(true);

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get('http://localhost:3000/restuarants/getAllRestaurants');
            setRestaurantData(response.data);
            setDiningType('Dining');
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleBackClick = () => {
        setShowMainPage(true);
    };

    return (
        <Router>
            <div className="app-container">
                {showMainPage ? (
                    <>
                        <h1>Welcome to Our Restaurant</h1>
                        <div className="button-container">
                            <Link to="/dining" className="button" onClick={() => setShowMainPage(false)}>
                                Dining
                            </Link>
                            <Link to="/takeaway" className="button" onClick={() => setShowMainPage(false)}>
                                Takeaway
                            </Link>
                        </div>
                    </>
                ) : null}

                <Routes>
                    <Route
                        path="/"
                        element={
                            restaurantData ? (
                                <BookingPage restaurantData={restaurantData} diningType={diningType} />
                            ) : (
                                <p>Loading...</p>
                            )
                        }
                    />
                    <Route
                        path="/dining"
                        element={<PageWithBackButton component={<DinningCapacity />} onBack={handleBackClick} />}
                    />
                    <Route
                        path="/takeaway"
                        element={<PageWithBackButton component={<Dishes />} onBack={handleBackClick} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

function PageWithBackButton({ component, onBack }) {
    const navigate = useNavigate();

    const handleBack = () => {
        onBack();
        navigate('/');
    };

    return (
        <div>
            <button onClick={handleBack} className="back-button">Back</button>
            {component}
        </div>
    );
}

export default App;
