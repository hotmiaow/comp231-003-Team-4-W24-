const functions = require('firebase-functions')
const express = require('express');
const accesstoken = functions.config().secret.token.access;
const jwt = require('jsonwebtoken');


function authToken(req,res,next){
    const token = req.cookies['accessToken'];
    console.log(token)
    if(!token) return res.sendStatus(401);

    jwt.verify(token, accesstoken, (err, email) =>{
        if(err) return res.sendStatus(403);
        req.id = email.id;
        next();
    })
}

module.exports = authToken;