require('dotenv').config()
const cronJob = require('node-cron');
const axios = require('axios').default;
const localstorage = require('node-localstorage').LocalStorage;
const Localstorage = new localstorage('./scratch');

module.exports = cronJob.schedule("*/2 * * * *", async () => {
    
    if(!Localstorage.getItem('refreshToken')) {
        Localstorage.setItem('refreshToken', process.env.refreshToken);
        Localstorage.setItem('accessToken', process.env.accessToken);
    }
    let response =await axios({
        method: 'POST',
        headers: {
            'Authorization': `Basic `+'NWU5YTdjMGQtOTQyZi00MGYwLTgxYjAtYjc4ZmEwMThhMjVhOjczODQyYzVlLWViZmQtNGEzYi1hNjUxLTg0MzJkN2EyZjgwYw=='
        },
        data: {
            "grant_type": "refresh_token",
            "refresh_token": Localstorage.getItem('refreshToken')
        },
        url: 'https://account-d.docusign.com/oauth/token'
    });
    Localstorage.setItem('refreshToken', response.data.refresh_token);
    Localstorage.setItem('accessToken', response.data.access_token);
    console.log(response.data)
    
});

