

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const CommercialPaper = require('../../mhrd/contract/lib/paper.js');


// Main program function
async function main (uname) {

    console.log(uname)
    var wpath= '../identity/user/'+uname+'/wallet'

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet(wpath);


    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = uname;

       // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-thirdparty.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }

        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);


        }

        catch (error) {
        console.error(`identity named ${uname} does not exists ${error}`);
        //console.log(error.stack);
        //console.log(error);
        throw new Error(error);
        //process.exit(-1);
    }   


        //finally {
        // Disconnect from the gateway
        //console.log('Disconnect from Fabric gateway.');
        //gateway.disconnect();

    //}
}

/*
main().then(() => {

    console.log('Login program complete.');

}).catch((e) => {

    console.log('login program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});

*/


module.exports.execute = main;