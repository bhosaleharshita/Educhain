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

async function main(uname) {
    try {
        // load the network configuration
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-uni.yaml', 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = connectionProfile.certificateAuthorities['ca.uni.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        //String str="../identity/user/sppu/wallet";
        //console.log(str)
        console.log(`----------------- Creating ID for: ${uname} -----------------`)
        console.log(uname)

        var wpath= '../identity/user/'+uname+'/wallet'

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), wpath);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const userExists = await wallet.get(uname);
        if (userExists) {
            console.log(`An identity for the client user ${uname} already exists in the wallet`);
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: 'user1pw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'uniMSP',
            type: 'X.509',
        };

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
