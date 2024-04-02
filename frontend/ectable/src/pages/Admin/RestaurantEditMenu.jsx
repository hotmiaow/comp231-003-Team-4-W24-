import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchMenuItem, saveMenuItems } from './api-Restaurant';
import { TextField, Button, Box } from '@material-ui/core';

const EditMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const credentials = {
      t: 'Bearer ' + Cookies.get("accessToken"),
    };

    fetchMenuItem(restaurantId, credentials, signal)
      .then(data => {
        if(data && !data.error) {
          setMenuItems(data);
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error("Error fetching menu items:", error);
        }
      });

    return () => controller.abort();
  }, [restaurantId]);

  const handleSave = () => {
    const credentials = {
      t: 'Bearer ' + Cookies.get("accessToken"),
    };

    saveMenuItems(restaurantId, menuItems, credentials)
      .then(() => navigate('/MyRestaurants'))
      .catch(error => console.error('Error saving menu items:', error));
  };

  const handleAddItem = () => {
    setMenuItems([...menuItems, { name: '', price: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index][field] = value;
    setMenuItems(newMenuItems);
  };

  const handleRemoveItem = (index) => {
    const newMenuItems = [...menuItems];
    newMenuItems.splice(index, 1);
    setMenuItems(newMenuItems);
  };

  //const EditMenu = ({ menuItems, handleItemChange, handleRemoveItem, handleAddItem, handleSave }) => {
  //const history = useHistory();

  return (
    <Box m={4} p={3} className="edit-menu-container" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
      {menuItems.map((item, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <TextField
            label="Name"
            value={item.name}
            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
            style={{ marginRight: '10px' }} // Add spacing between the fields
          />
          <TextField
            label="Price"
            type="number"
            value={item.price}
            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
            style={{ marginRight: '10px' }} // Add spacing between the fields
          />
          <Button onClick={() => handleRemoveItem(index)} color="secondary">
            Remove
          </Button>
        </Box>
      ))}
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button onClick={handleAddItem} color="primary">
          new item
        </Button>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleSave} color="primary" style={{ marginRight: '10px' }}>
          Save
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/MyRestaurants')}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditMenu;
