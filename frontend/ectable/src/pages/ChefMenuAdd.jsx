import React, { useState } from 'react';
import axios from 'axios';

const ChefMenuAdd = () => {
  const [menu, setMenu] = useState({
    name: '',
    description: '',
    price: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu({
      ...menu,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    if (!menu.name || !menu.description || !menu.price) {
      alert('Please enter all fields.');
      return;
    }
  
    alert(`Menu Name: ${menu.name}\nMenu Description: ${menu.description}\nMenu Price: ${menu.price}`);

    try {
      const response = await axios.post('/api/menu/add', menu);
      console.log(response.data);
      alert('Menu added successfully!');
      setMenu({
        name: '',
        description: '',
        price: '',
      });
    } catch (error) {
      console.error('Error adding menu:', error);
      alert('Failed to add menu. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Add Menu</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Menu Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={menu.name}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter menu name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Menu Description</label>
          <textarea
            id="description"
            name="description"
            value={menu.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter menu description"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Menu Price</label>
          <input
            type="number" 
            id="price"
            name="price"
            value={menu.price}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter menu price"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Add Menu</button>
      </form>
    </div>
  );
};

export default ChefMenuAdd;
