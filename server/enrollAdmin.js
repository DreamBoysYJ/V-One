// For BN connection
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
import {Wallets} from "fabric-network";
import FabricCAServices from "fabric-ca-client";


// load the network configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

async function main () {
    try {   
        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
        const ca = new FabricCAServices(caURL);
    
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
    

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get("org1admin");
        if (identity) {
            console.log(
                'An identity for the admin user "org3admin" already exists in the wallet'
            );
            return;

        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({
            enrollmentID: "admin",
            enrollmentSecret: "adminpw",
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: "Org1MSP",
            type: "X.509",
        };
        await wallet.put("org1admin", x509Identity);
        console.log(
            'Successfully enrolled admin user "org1admin" and imported it into the wallet'
        );


    }catch (error) {
        console.error(`Failed to enroll admin user "org1admin": ${error}`);
        process.exit(1);
    }

}

main();