import axios from "axios";

const createMenu = async (menu) => {
  try {
    console.log(menu);
    let response = await axios.post(`https://ectable.onrender.com/api/Menu/register`, menu, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

const readMenu = async (restId) => {
  try {
    let response = await axios.get(`https://ectable.onrender.com/api/Menu/Restaurant/${restId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const readRestId = async (restId) => {
  try {
    let response = await axios.get(`https://ectable.onrender.com/api/Restaurant/${restId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const updateMenu = async (menu) => {
  try {
    console.log(menu);
    console.log(menu.restaurantId);
    
    const path = `https://ectable.onrender.com/api/Menu/${menu.restaurantId}/update`;
    console.log(path)
    
    let response = await axios.put(path, menu, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};
const removeMenu = async (menu) => {
  
    axios.delete(`https://ectable.onrender.com/api/Menu/delete`,{
      data:menu,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(()=>{
      console.log("deleted by frontend")
    }).catch((err)=>{
      console.error(err)
    })
};

export {createMenu, readMenu, readRestId, updateMenu, removeMenu};