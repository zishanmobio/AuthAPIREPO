/**
 * @file
 * Example 006: List an envelope's documents
 * @author DocuSign
 */

const docusign = require("docusign-esign");

/**
 * This function does the work of listing the envelope's documents
 * @param {object} args object
 */

module.exports.getDocuments = async (args) => {
  // Data for this method
  // args.basePath
  // args.accessToken
  // args.accountId
  // args.envelopeId

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);
   
  // Step 1. EnvelopeDocuments::list.
  // Exceptions will be caught by the calling function
   let results = await envelopesApi.getDocument(
     args.accountId,
     args.envelopeId,
     'combined',
     null
    );
    
    let docItem = args.envelopeDocuments.find(
      (item) => item.documentId === '3'
    )
    // console.log(docItem);
    docName = docItem.name
    let mimetype = "application/pdf";
    return { mimetype: mimetype, docName: docName, fileBytes: results }; 

};


/**
 * This function does the work of getting the envelope information
 * @param {object} args
 */

module.exports.getEnvelope = async (args) => {
  // Data for this method
  // args.basePath
  // args.accessToken
  // args.accountId
  // args.envelopeId

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
    results = null;

  // Step 1. Call Envelopes::get
  // Exceptions will be caught by the calling function
  results = await envelopesApi.listDocuments(
    args.accountId,
    args.envelopeId,
    null
  );
  return results;
};



