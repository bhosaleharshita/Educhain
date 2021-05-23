/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to buy commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const CommercialPaper = require('../../mhrd/contract/lib/paper.js');


// Main program function
async function main (prn, certiNo, clg, marks) {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/scoe/wallet');


    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'scoe';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-uni.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }

        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        //console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

        // buy commercial paper
        console.log('Submit Approve transaction.');

        //ed (i.e. traded)  // transaction input - not written to asset
     
        var today = new Date().toISOString().slice(0, 10)
        //console.log(today);

    //async buy(ctx, student, certNumber, collegename, newOwner(University), marks, approveDateTime)
        const buyResponse = await contract.submitTransaction('buy', prn, certiNo, clg, 'sppu', marks, today);

        // process response
        console.log('Process approve transaction response.');

        let paper = CommercialPaper.fromBuffer(buyResponse);

        console.log(`${paper.student_id} Exam Form No.: ${paper.certNumber} Approved by scoe`);
        console.log('Transaction complete.');

    } catch (error) {
        console.error(`Certificate No. ${certiNo} : already approve ${error}`);
        console.log(error.stack);
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

    console.log('Approve program complete.'); 

}).catch((e) => {

    console.log('Approve program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});

*/


module.exports.execute = main;

