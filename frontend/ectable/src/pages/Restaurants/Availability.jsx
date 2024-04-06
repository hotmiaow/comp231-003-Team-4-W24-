import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Dialog,
  DialogContent,
  DialogActions
} from "@material-ui/core";

import {UseAuth} from "../../components/Auth/auth";
import { updateAvailability } from "./api-availability";

const Availability = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [availability, setAvailability] = useState('');
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const {restIDs} = UseAuth();
    
    const handleInputChange = (event) =>{
        const { name, value } = event.target;
        if(name === 'date')
        {
            setDate(value);
        }  
        else if (name === 'time')
        {
            setTime(value);
        }else if (name === 'availability')
        {
            setAvailability(value);
        }
    }
    const handleSubmit = async(event) =>{
        event.preventDefault();

        const info = {
            restID : restIDs,
            date: date,
            time: time,
            availability : availability
        }
        console.log(info)

        try{
            const response = await updateAvailability(info);

            if(response.data.success){
                console.log(`availability update success`);
            }else{
                console.log(`fail to update availability`);
            }
            console.log(response.data.message);
            setMessage(response.data.message);
        }catch(err){
            console.log(`error in update availability  ${err}`); 
        }
        
        setOpen(true);
    }

    const handleClose = () =>{
        setDate('');
        setTime('')
        setAvailability('')
        setMessage('')
        setOpen(false);
    }

    return (
        
    <div>
        <Typography variant="h4" gutterBottom>
            Restaurant Availability Management
        </Typography>
        <form onSubmit={handleSubmit} className="flex space-x-4">
            <div>
                <TextField
                label="date"
                type="date"
                name="date"
                value={date}
                onChange={handleInputChange}
                helperText="Please select specific date"
                InputLabelProps={{ shrink: true }}
                required
                />
            </div>
            <div>
                <TextField className="w-45"
                select
                label="time"
                name="time"
                value={time}
                onChange={handleInputChange}
                helperText="Please select specific time slot"
                required
                >
                {[
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                    "21:00",
                ].map((option) => (
                    <MenuItem key={option} value={option}>
                    {option}
                    </MenuItem>
                ))}
                </TextField>
            </div>
            <div>
                 <TextField
                label="availability"
                type="number"
                name="availability"
                value={availability}
                onChange={handleInputChange}
                helperText="Please select specific availability for specifc date and time."
                required
                />
            </div>
        <div className="pt-4">
            <Button type="submit" color="primary" variant="contained">
                Update
            </Button>
        </div>
           
        </form>
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
            {message}
            </DialogContent>
             <DialogActions>
                <Button onClick={handleClose}>OK</Button>
            </DialogActions>
        </Dialog>
    </div>
    )
    
}

export default Availability;