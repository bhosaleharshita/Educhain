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
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const CommercialPaper = require('../contract/lib/paper.js');

// Main program function
<<<<<<< HEAD
async function main(prn, clg, examno) {

    // A wallet stores a collection of identities for use
    var wpath= '../identity/user/'+prn+'/wallet'
    const wallet = await Wallets.newFileSystemWallet(wpath);
=======
async function main() {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/71926074H/wallet');
>>>>>>> f4deef7be873462d848876881e90a01857195cde

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
<<<<<<< HEAD
        const userName = prn;
=======
        const userName = '71926074H';
>>>>>>> f4deef7be873462d848876881e90a01857195cde

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-mhrd.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
       console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract');

        // issue commercial paper
        console.log('Submit Exam Registration transaction.');

<<<<<<< HEAD
         var today = new Date().toISOString().slice(0, 10)

        const issueResponse = await contract.submitTransaction('issue', prn, '9010', today,  clg, examno);
=======
        const issueResponse = await contract.submitTransaction('issue', '71926074H', '9010', '2020-05-31', 'scoe', '40001');
>>>>>>> f4deef7be873462d848876881e90a01857195cde

        // process response
        console.log('Process Registration transaction response.'+issueResponse);

        let paper = CommercialPaper.fromBuffer(issueResponse);

        console.log(`${paper.student_id} your Registration is successfull with Unique_Reg_No: ${paper.certNumber} for exam no: ${paper.examno}`);
        console.log('Transaction complete.');

<<<<<<< HEAD
    }  catch (error) {
        console.error(`Certificate No. ${certiNo} : already Registered ${error}`);
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
=======
    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Registration program complete.');

}).catch((e) => {

    console.log('Registration program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
>>>>>>> f4deef7be873462d848876881e90a01857195cde
