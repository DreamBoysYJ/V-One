/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

// For BN connection
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
import {Wallets, Gateway} from "fabric-network";
import FabricCAServices from "fabric-ca-client";


// load the network configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ccpPath = path.resolve(__dirname, "../../VOne/server/ccp", "connection-org3.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

async function main() {
    try {


        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities["ca.org3.example.com"].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get("youngju307");
        if (userIdentity) {
            console.log(
                'An identity for the user "youngju307" already exists in the wallet'
            );
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get("org3admin");
        if (!adminIdentity) {
            console.log(
                'An identity for the admin user "org3admin" does not exist in the wallet'
            );
            console.log("Run the enrollAdmin.js application before retrying");
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet
            .getProviderRegistry()
            .getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, "org3admin");

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register(
            {
                affiliation: "org3.department1",
                enrollmentID: "youngju307",
                role: "client",
            },
            adminUser
        );
        const enrollment = await ca.enroll({
            enrollmentID: "youngju307",
            enrollmentSecret: secret,
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: "Org3MSP",
            type: "X.509",
        };
        await wallet.put("youngju307", x509Identity);
        console.log(
            'Successfully registered and enrolled admin user "youngju307" and imported it into the wallet'
        );
    } catch (error) {
        console.error(`Failed to register user "youngju307": ${error}`);
        process.exit(1);
    }
}

main();
