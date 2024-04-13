import axios from "axios";
const emailCreateConfirm = async (email) => {
  try {
    let response = await axios.post(`https://ectable.onrender.com/api/emailConfirm`, email, {
      
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    console.log(response.data)
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const emailUpdateConfirm = async (email) => {
  try {
    let response = await axios.post(`https://ectable.onrender.com/api/emailUpdate`, email, {
      
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log(`Response : ${response}`);
    console.log(response.data)
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const emailCancelConfirm = async (email) => {
  try {
    let response = await axios.post(`https://ectable.onrender.com/api/emailCancel`, email, {
      
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    console.log(response.data)
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export {emailCreateConfirm, emailUpdateConfirm, emailCancelConfirm};