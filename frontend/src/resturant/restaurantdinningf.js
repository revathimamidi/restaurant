import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dishes from './restaurantdishesf';
import RestaurantBooking from './restaurantbookingf';
import './DinningCapacity.css'; // Import CSS file for styling

function DinningCapacity() {
    const [capacities, setCapacities] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState('SO');
    
    const fetchCapacityByType = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:3000/restuarantDining/dinning-capacity');
            const data = response.data;

            const filteredData = data[type] || [];
            setCapacities({ [type]: filteredData });
        } catch (err) {
            console.error("Error fetching capacities:", err);
            setError("Unable to fetch capacities.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCapacityByType();
    }, [type]);

    return (
        <div className="dinning-capacity">
            <h1>Dining Capacity by Type</h1>

            <div className="capacity-buttons">
                <button className="capacity-button" onClick={() => setType('SO')}>Sofa Capacities</button>
                <button className="capacity-button" onClick={() => setType('TA')}>Table Capacities</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {capacities ? (
                <div className="capacity-table-container">
                    {Object.entries(capacities).map(([type, capacityList]) => (
                        <table key={type} className="capacity-table">
                            <thead>
                                <tr>
                                    <th>{type === 'SO' ? 'Sofa' : type === 'TA' ? 'Table' : 'All'} Capacities</th>
                                </tr>
                            </thead>
                            <tbody>
                                {capacityList.length > 0 ? (
                                    capacityList.map((capacity, index) => (
                                        <tr key={index}>
                                            <td>Capacity: {capacity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>No data available for this type.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ))}
                </div>
            ) : (
                <p>Select a type to view capacities.</p>
            )}

            <RestaurantBooking />
        </div>
    );
}

export default DinningCapacity;
