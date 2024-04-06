import axios from "axios";

const createMenu = async (menu) => {
  try {
    console.log(menu);
    let response = await axios.post(`http://localhost:5500/Menu/register`, menu, {
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
    let response = await axios.get(`http://localhost:5500/Menu/Restaurant/${restId}`, {
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
    let response = await axios.get(`http://localhost:5500/Restaurant/${restId}`, {
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
    
    const path = `http://localhost:5500/Menu/${menu.restaurantId}/update`;
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
  
    axios.delete(`http://localhost:5500/Menu/delete`,{
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