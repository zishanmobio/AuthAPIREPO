const route = require('express').Router();
const NotifyController = require('../Controller/notification');
const SignController = require('../Controller/docuSign/docuSign');
const EmbeddedController = require('../Controller/docuSign/embeded-sign');
const { upload,uplaodSingle } = require('../Middleware/upload');
route.post('/send-notification/', NotifyController.pushNotifcation);

route.post('/e-signature',SignController.RequestSignByEmail);

route.post('/embeded-sign',
    uplaodSingle().single('file'),
    EmbeddedController.embededSignOnApp);
    
route.post('/update-event', EmbeddedController.RefreshToken);
route.post('/getDocument', EmbeddedController.getUpdateEnvelope);



module.exports = route;