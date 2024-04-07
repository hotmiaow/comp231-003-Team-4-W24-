import axios from "axios";

export const updateAvailability = async (info) =>{
    console.log(info);
    
    try{
        const path = `https://us-central1-ectable-7april.cloudfunctions.net/ectable/api/Restaurants/${info.restID}/availability`;
        console.log(path);

        const response = await axios.post(path, info, {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            }
        });
        console.log(response);
        return  response; 
    }catch(err){
        console.log(`availability api error occur : ${err}`)
    }
}