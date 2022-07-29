require('dotenv').config();
const path = require('path');
const demoDocsPath = path.resolve(__dirname, '../demo_documents');
const doc2File = 'World_Wide_Corp_fields.pdf';
const doc3File = 'World_Wide_Corp_lorem.pdf';
const validator = require('validator');
const {sendEnvelope } = require('../../UtilityFunction/e-signature');

exports.RequestSignByEmail = async (req, res) => {
    
    const { body } = req; 
    // console.log(body) 
    const envelopeArgs = {
        signerEmail: validator.escape(body.signerEmail),
        signerName: validator.escape(body.signerName),
        ccEmail: validator.escape(body.ccEmail),
        ccName: validator.escape(body.ccName),
        status: "sent",
        doc2File:path.resolve(demoDocsPath,doc2File), 
        doc3File:path.resolve(demoDocsPath,doc3File)
    };
     
    // return res.status(200).json({ msg: 'file uploaded successfully.' })
    
    const args = {
        accessToken: process.env.accessToken,
        basePath: process.env.basePath,
        accountId: process.env.accountId,
        envelopeArgs: envelopeArgs
    };
    
    let results = null;

    try {
        results = await sendEnvelope(args);
    }
    catch (error) {
        const errorBody = error && error.response && error.response.body;
        // we can pull the DocuSign error code and message from the response body
        const errorCode = errorBody && errorBody.errorCode;
        const errorMessage = errorBody && errorBody.message;
        // In production, may want to provide customized error messages and
        // remediation advice to the user.
        res.status(400).json({err: error,code:errorCode,msg:errorMessage});
    }
    // console.log(results);
    if (results) {
        res.status(200).json({
           msg:`The envelope has been created and sent! Envelope ID :${results.envelopeId}` 
        })    
        
    } 

}
