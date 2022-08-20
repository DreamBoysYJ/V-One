import User from "../models/User.js";


// For BN connection
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
import {Wallets, Gateway} from "fabric-network";
import FabricCAServices from "fabric-ca-client";


// load the network configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ccpPath = path.resolve(__dirname, "../../ccp", "connection-org3.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

export const getJoin = (req,res) => {
    res.render("join", {pageTitle: "회원가입"});
};


export const postJoin = async (req, res) => {
    const {id, name} = req.body;
    console.log(id, name);

    try {
        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities["ca.org3.example.com"].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(id);
        if (userIdentity) {
            console.log(
                `An identity for the user '${id}' already exists in the wallet`
            );
            const res_str = `An identity for the user ${id} already exists in the wallet`;
        res.send(res_str);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get("org3admin");
        if (!adminIdentity) {
            console.log(
                'An identity for the admin user "org3admin" does not exist in the wallet'
            );
            console.log("Run the enrollAdmin.js application before retrying");
            const res_str = 'An identity for the admin user "admin" does not exist in the wallet';
        res.send(res_str);
            return;
        }

        console.log(`adminIdentity : ${adminIdentity}`);

        // build a user object for authenticating with the CA
        const provider = wallet
            .getProviderRegistry()
            .getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, "org3admin");

        console.log(`adminUser : ${adminUser}`);

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register(
            {
                affiliation: "org3.department1",
                enrollmentID: id,
                role: "client",
            },
            adminUser
        );

        console.log(`secret : ${secret}`);
        
        const enrollment = await ca.enroll({
            enrollmentID: id,
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
        await wallet.put(id, x509Identity);
        console.log(
            `Successfully registered and enrolled admin user "${id}" and imported it into the wallet`
        );
        try {await User.create({
            id,
            name,
    
        });
    res.redirect("/login");
    } catch(error){
        return res.status(400).render("join", {
            pageTitle: "회원가입",
            errorMessage: error._message,
        });
    }
    



    } catch (error) {
        console.error(`Failed to register user "${id}": ${error}`);
        const res_str =  `Failed to register user "${id}": ${error}`;
        res.send(res_str);
    }





};


export const getLogin = (req,res) => {
    res.render("login", {pageTitle: "로그인"})
};

export const postLogin = async (req,res) => {
    const {id} = req.body;
    const pageTitle = "로그인";
    const user = await User.findOne({id});
    if (!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "아이디가 존재하지 않습니다.",
        });
    } 
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");

};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
    
};