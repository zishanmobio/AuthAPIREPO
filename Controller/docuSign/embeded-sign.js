/**
 * @file
 * Example 001: Use embedded signing
 * @author DocuSign
 */
const fs = require('fs');
const axios = require('axios').default;
const { sendEnvelopeForEmbeddedSigning,getEnvelope,getDocuments} = require('../../UtilityFunction/embeded-sign');
// const {getDocuments,getEnvelope } = require('../../UtilityFunction/getDocument');
const validator = require('validator');
const signerClientId = 1000; // The id of the signer within this application.
const dsReturnUrl = process.env.appUrl;
const dsPingUrl = process.env.appUrl + '/'; // Url that will be pinged by the DocuSign signing via Ajax
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    Bucket: process.env.S3_BUCKET
});
s3.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

/**
 * Create the envelope, the embedded signing, and then redirect to the DocuSign signing
 * @param {object} req Request obj
 * @param {object} res Response obj
 */
exports.embededSignOnApp = async (req, res) => {
    
    // Step 2. Call the worker method
    const { body } = req;
    
    if (req.file) {

        console.log(req.file);    



        return res.status(200).json({ msg: 'no file uploaded' }) 
    } 
    
    const envelopeArgs = {
        signerEmail: validator.escape(body.signerEmail),
        signerName: validator.escape(body.signerName),
        signerClientId: signerClientId,
        dsReturnUrl: req.body.redirectUrl,
        dsPingUrl: dsPingUrl,
        docFile: req.file.buffer,
        docName: req.file.originalname,
        docType: req.file.originalname.split('.')[1]
    };
    const args = {
        accessToken: process.env.accessToken,
        basePath: process.env.basePath,
        accountId: process.env.accountId,
        envelopeArgs: envelopeArgs
    };
    let results = null;

    try {
        results = await sendEnvelopeForEmbeddedSigning(args);
         
        res.status(200).json({redirect_url:results.redirectUrl});
    }
    catch (error) {
        console.log(error);
        const errorBody = error && error.response && error.response.body;
        // we can pull the DocuSign error code and message from the response body
        const errorCode = errorBody && errorBody.errorCode;
        const errorMessage = errorBody && errorBody.message;
        // In production, may want to provide customized error messages and
        // remediation advice to the user.
        res.status(400).json({errorCode:errorCode,errorMessage:errorMessage})
    }
    
}

exports.getUpdateEnvelope =async (req,res) => {
     
    console.log(req.body);
    let {data } = req.body; 
     
    let results = null;
    const args = {
        accessToken:process.env.accessToken,
        basePath: process.env.basePath,
        accountId: process.env.accountId,
        envelopeId: data.envelopeId
     }
    
    try {
        console.log(args);
        let envelope = await getEnvelope(args); 
        let newargs = {
              ...args,
            envelopeDocuments:envelope.envelopeDocuments  
        }
        results = await getDocuments(newargs);    
        let fileName = process.env.accountId + '_' + req.body.envelopeId + '_' + 'combined' + '.pdf';
        fs.writeFileSync(fileName, Buffer.from(results.fileBytes, 'binary'));
          
        let data=fs.readFileSync(fileName);
         
                let prams = {
                    Bucket: process.env.S3_BUCKET,
                    Key: results.docName ,
                    Body: Buffer.from(data,'binary'),
                    ContentType:results.mimetype ,
                    ACL: 'public-read'
                }
          let s3data = await s3.upload(prams).promise(); 
          if(s3data.Location) {
            fs.unlinkSync(fileName);    
          }
          console.log(s3data);
          res.status(200).json({ msg: 'file uploaded to succesfully.' });    

    } catch (error) {
        const errorBody = error && error.response && error.response.body;
        // we can pull the DocuSign error code and message from the response body
         const errorCode = errorBody && errorBody.errorCode
         const errorMessage = errorBody && errorBody.message;
        // In production, may want to provide customized error messages and
        // remediation advice to the user.
        res.status(400).json({errorCode:errorCode,errorMessage:errorMessage});
    }
     
}


const refreshToken= async()=> {
   
    let res = await axios({
        method: 'POST',
        headers: {
            'Authorization': `Basic `+'NWU5YTdjMGQtOTQyZi00MGYwLTgxYjAtYjc4ZmEwMThhMjVhOjczODQyYzVlLWViZmQtNGEzYi1hNjUxLTg0MzJkN2EyZjgwYw=='
        },
        data: {
            "grant_type": "refresh_token",
            "refresh_token": process.env.refreshToken
        },
        url: 'https://account-d.docusign.com/oauth/token'
    });
    return res;
}

exports.RefreshToken = async (req, res) => {
    
    let response=await refreshToken();   
    console.log(response.data);
    return res.status(201).json({ msg: 'refresh token. '})    

}





