import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types';

const AuthContext = createContext();
export const UseAuth = () => useContext(AuthContext);

const fetchUserType = async (userID) => {
  try {
    const response = await fetch(`http://localhost:5500/User/${userID}`);
    if (!response.ok) throw new Error("Network response was not OK");
    const data = await response.json();
    console.log('data');
    console.log(data);
    return data.type; // Assuming the API returns a JSON object with a 'type' field
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null; // Handle error appropriately or return null
  }
};

const fetchRestId = async(query) =>{
    
    const api = `http://localhost:5500/restaurants/chef`;

    try{
      const response = await axios.post(api, query,{

        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }

      });
        console.log(response);

        console.log(response.data._id)
        console.log('data');
        console.log(response.data);
        Cookies.set("restID", response.data._id,{ expires: 1 / 12 } );
        console.log(`Cookie - Rest id : ${Cookies.get("restID")}`)
        return response.data._id;
      
    }catch(err){
      console.log(`error occur in fetch restaurant id- ${err}`)
    }
}

// const fetchRestIdByChefID = async (userID) =>{
//   try {
    
//     console.log(userID);
//     const sID = userID.toString();
//     console.log(sID)
//     const response = await axios.post(`http://localhost:5500/restaurants/chef`, {chefId : sID} , {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     });
//     console.log(response);
//     // if (!response.ok) throw new Error("Network response was not OK");
//     console.log(response.data._id)
//     console.log('data');
//     console.log(response.data);
//     Cookies.set("restID", response._id,{ expires: 1 / 12 } );
//     return response.data._id; // Assuming the API returns a JSON object with a 'type' field
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     // return null; // Handle error appropriately or return null
//   }
// }

// const fetchRestIdByAdminID = async (userID) =>{
//   try {
    
//     console.log(userID);
//     const sID = userID.toString();
//     console.log(sID)
//     const response = await axios.post(`http://localhost:5500/restaurants/chef`, {adminId : sID} , {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     });
//     console.log(response);
//     // if (!response.ok) throw new Error("Network response was not OK");
//     console.log(response.data._id)
//     console.log('data');
//     console.log(response.data);
//     Cookies.set("restID", response._id,{ expires: 1 / 12 } );
//     return response.data._id; // Assuming the API returns a JSON object with a 'type' field
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     // return null; // Handle error appropriately or return null
//   }
// }

export const AuthProvider = ({children}) =>{
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [restIDs, setRestIDs] = useState('');
  const [userIDs, setUserIDs] = useState('');
    
  // useEffect(() => {
  //   const checkLoginStatus = () => {
      
  //     const userId = Cookies.get('userId');
  //     setIsLoggedIn(!!userId);
  //     // Optionally, fetch user type if userId exists
  //   };

  //   checkLoginStatus();
  // }, []);

   useEffect(() => {
    const fetchData = async () =>{
      if(isLoggedIn){
        const userID = Cookies.get("userId");
        console.log(`user ID : ${userID}`)
        setUserIDs(userID);

        if(userID){
        try {
            const userType = await fetchUserType(userID);
            setUserType(userType);

            if (userType === "chef") {
              console.log(userType)
              console.log(userID)
              const query = {chefId : userID};
              const restID = await fetchRestId(query);
              Cookies.set("restID", restID, { expires: 1 / 12 });
              setRestIDs(restID);
            } else if (userType === "Admin") {
              console.log(userType)
              console.log(userID)
              const query = {adminId : userID};
              const restID = await fetchRestId(query);
              Cookies.set("restID", restID, { expires: 1 / 12 });
              setRestIDs(restID);

            }
          } catch (error) {
            console.error('Error fetching additional user data:', error);
          }
      }
      }
      
    }
    
   
  //   console.log(`type : ${type}`);
  //   setIsLoggedIn(true);
  //   async function fetchData() {
  //   if (userID) {
  //     try {
        
  //       const type = await fetchUserType(userID);
  //       console.log(type);
  //       setUserType(type);
  //       console.log('before fetch rest id');
  //       const restID = await fetchRestId(userID); // if you need to wait for this to complete
  //       console.log(restID)
        
  //     } catch (error) {
  //       console.error('Error in fetching data:', error);
  //     }
  //   } else {
  //     console.log('user type error');
  //   }
  // }

  fetchData();
}, [isLoggedIn]);

  // useEffect(() => {
  //   const userID = Cookies.get("userId"); // Use the correct cookie name here
  //   if (userID) {
  //     setIsLoggedIn(true);
  //     fetchUserType(userID).then((type) => {
  //       setUserType(type);
  //     });
  //   } else {
  //     setIsLoggedIn(false);
  //     setUserType("");
  //   }
  // }, []);

    const authLogin = async (email, password, url) => {

    try {
      const response = await axios.post("http://localhost:5500/diner/login", {
        email: email,
        password: password,
      });

      console.log(response);

      
        console.log(response.data.message);
        console.log(response.data.id);
        console.log(response.data.accessToken);
        console.log(response.data.refreshToken);
        // console.log(response.data.restId);
        // console.log(response.data.restName);

        
        // const cookieExpire = new Date(new Date().getMinutes() + 60);
        // console.log(cookieExpire);

        Cookies.set("accessToken", response.data.accessToken, {
          expires: 1 / 12,
          path: "/",
        });
        Cookies.set("refreshToken", response.data.refreshToken, {
          expires: 1 / 12,
          path: "/",
        });
        Cookies.set("userId", response.data.id, { expires: 1 / 12 });
        // const userId =  Cookies.get("userId");
        Cookies.set("userEmail", response.data.email,{ expires: 1 / 12 } )
        console.log(Cookies.get());

        console.log("Access Token", Cookies.get("accessToken"));
        console.log("Refresh Token", Cookies.get("refreshToken"));
        console.log("User Id", Cookies.get("userId"));
        console.log("userEmail", Cookies.get("userEmail"));
        // console.log("restId", Cookies.get("restID"));

        // navigate(`/diner/${data.id}`)
        console.log(url);
        setIsLoggedIn(true);
        console.log(`Login success`);
        return response.data;
      

        // const type = await fetchUserType(userId);
        // console.log(type)
        // if(type) {
        //   setUserType(type)
        //   if(type === "chef"){
        //     const id = await fetchRestIdByChefID(userId);
        //     console.log(id);
        //     Cookies.set("restID", id, { expires: 1 / 12 });
        //     console.log(`Cookies : restID - ${Cookies.get("restID")}`)
        //   }
        //   else if(type==="Admin"){

            
          
          
        //   }
        
        //   return url;
        // }
        // else console.log('Error getting user type');
  } catch (e) {
      
      if(e.response && e.response.status === 401){
         console.log("Login failed. Please try again.");
      }
      else{
      console.error("Error occured", e);
      console.log(`login failed`)
      
      }
    setIsLoggedIn(false)
    
  }};

  const authLogout = () => {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("userId", { path: "/" });
    Cookies.remove("userEmail",{ path: "/" } );
    Cookies.remove("restID", { path: "/" });
    setIsLoggedIn(false)
    setUserType('');
    setRestIDs('');
    setUserIDs('');
    
  };
    return (
      <AuthContext.Provider value={{ isLoggedIn, userType, userIDs,restIDs, authLogin, authLogout }}>
        {children}
      </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};





