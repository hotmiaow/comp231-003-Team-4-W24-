const functions = require('firebase-functions');
const nodeemailer = require('nodemailer');
const Mailgen = require('mailgen');
// require("dotenv").config({ path: "./email.env" });
const emailInfo = functions.config().secret.email;
const email = emailInfo.address;
const pass = emailInfo.password;
const Mail = require('nodemailer/lib/mailer');

async function emailConfirm(req,res){

    const {date, time, restaurant, userEmail, people}= req.body;
    console.log("date : " + date);
    console.log("time : " + time);
    console.log("restaurant : " + restaurant);
    console.log("people : " + people);

    let transporter = nodeemailer.createTransport({
        service:'gmail',
        auth:{
        user: email, 
        pass: pass
        }
    });
    
    console.log(transporter)

    let mailGenerator = new Mailgen({
        theme : "default",
        product:{
            name:'ECTable',
            link:"http://localhost:5173"
        }
    });

    let emailContent = {
    
            
            body:{
                intro: 'Your reservation has been  confirmed!',
                table: {
                    data: [
                        {
                            item: 'Restaurant',
                            description: restaurant
                        },
                        {
                            item: 'Date',
                            description: date
                        },
                        {
                            item: 'Time',
                            description: time
                        },
                        {
                            item: 'People',
                            description: people
                        }
                    ]
                },
                outro:'Thank you for reservation.'  
            }
        }

    let mail = mailGenerator.generate(emailContent);

    let message = {
        
        from : email,
        to : userEmail,
        subject : 'Booking Confirmation',
        html : mail
        
    }

    transporter.sendMail(message).then(()=>{
        return res.status(201).json({
            message: "Confirmation Email sent."
        })
    }).catch(error =>{
        return res.status(500).json({error: error.message})
    })

}
async function emailUpdateConfirm(req,res){

    // const {names, date, time, restaurant, userEmail, people}= req.body;
    const {date, time, restaurant, userEmail, people}= req.body;
    console.log("date : " + date);
    console.log("time : " + time);
    console.log("restaurant : " + restaurant);
    console.log("people : " + people);

    let transporter = nodeemailer.createTransport({
        service:'gmail',
        auth:{
        user: email, 
        pass: pass
        }
    });
    
    console.log(transporter)

    let mailGenerator = new Mailgen({
        theme : "default",
        product:{
            name:'ECTable',
            link:"http://localhost:5173"
        }
    });

    let emailContent = {
    
            
            body:{

                // name: names,
                intro: 'Your reservation has been updated!',
                table: {
                    data: [
                        {
                            item: 'Restaurant',
                            description: restaurant
                        },
                        {
                            item: 'Date',
                            description: date
                        },
                        {
                            item: 'Time',
                            description: time
                        },
                        {
                            item: 'People',
                            description: people
                        }
                    ]
                },
                outro:'Thank you for reservation.'  
            }
        }

    let mail = mailGenerator.generate(emailContent);

    let message = {
        
        from : email,
        to : userEmail,
        subject : 'Booking Updated',
        html : mail
        
    }

    console.log(message)
    console.log("error??");
    transporter.sendMail(message).then(()=>{
        return res.status(201).json({
            message: "Booking Update Confirmation Email sent."
        })
    }).catch(error =>{
        return res.status(500).json({error: error.message})
    })

}

async function emailCancelConfirm(req,res){

    const {date, time, restaurant, userEmail, people}= req.body;
    console.log("date : " + date);
    console.log("time : " + time);
    console.log("restaurant : " + restaurant);
    console.log("people : " + people);

    let transporter = nodeemailer.createTransport({
        service:'gmail',
        auth:{
        user: email, 
        pass: pass
        }
    });
    
    console.log(transporter)

    let mailGenerator = new Mailgen({
        theme : "default",
        product:{
            name:'ECTable',
            link:"http://localhost:5173"
        }
    });

    let emailContent = {
    
            
            body:{

                intro: 'Your reservation has been cancelled!',
                table: {
                    data: [
                        {
                            item: 'Restaurant',
                            description: restaurant
                        },
                        {
                            item: 'Date',
                            description: date
                        },
                        {
                            item: 'Time',
                            description: time
                        },
                        {
                            item: 'People',
                            description: people
                        }
                    ]
                },
                outro:"Your reservation has been cancelled. We're looking forward to serving you in the near future and hope to see you soon!" 
            }
        }

    let mail = mailGenerator.generate(emailContent);

    let message = {
        
        from : email,
        to : userEmail,
        subject : 'Booking Cancelled',
        html : mail
        
    }


    transporter.sendMail(message).then(()=>{
        return res.status(201).json({
            message: "Booking Cancell Confirmation Email sent."
        })
    }).catch(error =>{
        return res.status(500).json({error: error.message})
    })

}

module.exports = {emailConfirm, emailUpdateConfirm, emailCancelConfirm};

    