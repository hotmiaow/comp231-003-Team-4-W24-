const mongoose = require('mongoose');

const availability = new mongoose.Schema({
    restaurantId : {type:String, required:true},
    availability : {type:Number, required:true},
    date : {type:String, required:true},
    time : {type:String, required:true}
})

export default  mongoose.model("Availability",availability);