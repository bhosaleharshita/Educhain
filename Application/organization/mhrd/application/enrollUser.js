/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

<<<<<<< HEAD
async function main(uname) {
=======
async function main() {
>>>>>>> f4deef7be873462d848876881e90a01857195cde
    try {
        // load the network configuration
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-mhrd.yaml', 'utf8'));
        console.log("Loaded connection Profile");

        // Create a new CA client for interacting with the CA.
        const caInfo = connectionProfile.certificateAuthorities['ca.mhrd.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

<<<<<<< HEAD
        console.log(`----------------- Creating ID for: ${uname} -----------------`)
        console.log(uname)

        var wpath= '../identity/user/'+uname+'/wallet'

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), wpath);
=======
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '../identity/user/71926074H/wallet');
>>>>>>> f4deef7be873462d848876881e90a01857195cde
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
<<<<<<< HEAD
        const userExists = await wallet.get(uname);
        if (userExists) {
            console.log(`An identity for the client user ${uname} already exists in the wallet`);
=======
        const userExists = await wallet.get('71926074H');
        if (userExists) {
            console.log('An identity for the Student "user1" already exists in the wallet');
>>>>>>> f4deef7be873462d848876881e90a01857195cde
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: 'user1pw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'mhrdMSP',
            type: 'X.509',
        };
<<<<<<< HEAD
        await wallet.put(uname, x509Identity);
        console.log(`Successfully enrolled client user ${uname} and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to enroll client user ${uname}: ${error}`);
        throw new Error(error);
    }
}

//main();

/*
main('SKN').then(() => {
    console.log('SKN account created');
}); 
*/

module.exports.execute = main;
=======
        await wallet.put('71926074H', x509Identity);
        console.log('Successfully enrolled Student "71926074H" and  wallet created');

    } catch (error) {
        console.error(`Failed to enroll Student "71926074H": ${error}`);
        process.exit(1);
    }
}

main();
>>>>>>> f4deef7be873462d848876881e90a01857195cde
