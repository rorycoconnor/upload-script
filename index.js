//Use the Box Node.js SDK
var BoxSDK = require('box-node-sdk');

//Box application config found at box.dev
var sdkConfig = {
  boxAppSettings: {
    clientID: '[CLIENT_ID]',
    clientSecret: '[CLIENT_SECRET]'
  },
    enterpriseID: '[ENTERPRISE_ID]'};

//Initialize the connection to Box. We will use the "client" to make API calls
const sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
const client = sdk.getAnonymousClient();

const parentFolderID = "[PARENT FOLDER]"
let folderID;

const getCurrentWorkingFolderID = async () => {
  try {

    //Check for First of Month to Create new subfolder
    const date = new Date();
    const current_day = date.getDate();
    //If it is the first day of the month, create a new folder

    if (current_day === 1) {
        let newFolder = await client.folders.create(parentFolderID, '[NEW FOLDER NAMING CONVENTION')
        return newFolder.id
    } else {
        //If not the first day of the month, get all child folders of the parent and find most recently created
        console.log(current_day)
        const folder = await client.folders.getItems('99401839936', {fields: 'created_at, name, id'})
        
        const folders = folder.entries;

        //Sort all child folders by created date
        const sortedFolders = await folders.sort((a,b) => (b.created_at > a.created_at)? 1: -1)

        //return most recently created folder ID
        return sortedFolders[0].id
    }
 
  } catch (e) {
    console.log(e)
    return e
  }
}

const accessServerFolderStructureAndUpload = async (folder) => {
    // WRITE LOGIC TO LOOP THROUGH LIST OF FILES ON SERVER
    // FOR EACH FILE, UPLOAD TO BOX USING FUNCTION BELOW

    var fs = require('fs');
    var stream = fs.createReadStream('/path/to/My File.pdf');
    var folderID = '0'
    client.files.uploadFile(folder, 'My File.pdf', stream)    

}


const main = async () => {
    folderID = await getCurrentWorkingFolderID()
    await accessServerFolderStructureAndUpload(folderID)

}

main()