require('dotenv').config();

const auth = require('../firebaseConfig/Config');
const { google } = require('googleapis'); 
const SCOPES = [process.env.scope];
const request = require('request');

const axios= require('axios').default;

    
exports.pushNotifcation =async (req, res) => {
      
    try{
        
        let title = req.body.title;
        let body = req.body.body;
        let token = "private-key"; 
    
      let access_token=await getAccessToken()
            request({
                method: 'POST',
                headers: {
                "Content-Type": "application/json; charset=utf-8",   
                "Authorization":`Bearer ${access_token}` 
                },
                url: process.env.url,
                body: JSON.stringify({
                    "message": {
                       "token":token, 
                       "notification": {
                            "body": body,
                            "title":title 
                        } 
                    }  
                })
            }, (error,response,body) => {
                  
                console.log(body); 
                res.end(body);
            })
 
         
        
      } catch (err) {
           
           res.status(400).json({ err: 'something error in push notifcations' });
        
        }
        
    }



// Utility Func
// Generate Access Token that  passes through Headers inside authorization

function getAccessToken () {

     return new Promise(function (resolve, reject) {
        const key = require("../firebaseConfig/service_account.json");
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        
        jwtClient.authorize(function (err, tokens) {
            if(err){
                reject(err);
                return; 
            }
            resolve(tokens.access_token);
        });
    });
}
