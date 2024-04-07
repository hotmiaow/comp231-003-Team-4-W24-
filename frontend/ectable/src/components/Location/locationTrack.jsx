import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [locations, setLocations] = useState('');

    return (
        <LocationContext.Provider value={{ locations, setLocations }}>
            {children}
        </LocationContext.Provider>
    );
};

LocationProvider.propTypes = {
  children: PropTypes.node.isRequired
};