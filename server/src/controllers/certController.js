import Certification from "../models/Certification.js";
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
const ccpPath = path.resolve(__dirname, "../../ccp", "connection-org1.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));


export const getInvoke = (req,res) => {
    return res.render("invoke", {pageTitle: "인증서 등록"});

};

export const postInvoke = async (req,res) => {
    const {user: {_id}} = req.session;
    const {pdf, thumb} = req.files;
    const {certificateName, expiredDate, certHash, userID, description} = req.body;

    try {
        const newCert = await Certification.create({
            title:certificateName,
            description,
            fileUrl: pdf[0].path,
            thumbUrl: thumb[0].path,
            owner: _id,
        });

        const user = await User.findById(_id);
        user.certifications.push(newCert._id);
        user.save();

        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(user.id);
            if (!identity) {
                console.log(
                    `An identity for the user ${user.id} does not exist in the wallet`
                );
                console.log("Run the registerUser.js application before retrying");
                const res_str = `An identity for the user ${user.id} does not exist in the wallet`;
                res.send(res_str);
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            // 1.gateway 접속
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: user.id,
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            // 2.mychannel 접속
            const network = await gateway.getNetwork("mychannel");
    
            // Get the contract from the network.
            // 3. cc 가져오기
            // 4. cc 호출
            // 말은 asset-transfer-basic인데 실제로는 basic이라는 이름으로 들어가있음.
            const contract = network.getContract("VOne");
    
            // Submit the specified transaction.
      
            await contract.submitTransaction(
                "AddCert",
                userID,
                certificateName,
                expiredDate,
                certHash, 
            );
            console.log("Transaction has been submitted");
            
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            //const res_str = "Transaction has been submitted";
            //res.send(res_str);
    
    
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }

        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(400).send("why why");
    }





};

export const getQuery = async (req,res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "certifications",
        populate: {
            path: "owner",
            model: "User",
        },
    });

    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(user.id);
        console.log(identity);
        // if (!identity) {
        //     console.log(
        //         `An identity for the user ${userId} does not exist in the wallet`
        //     );
        //     console.log("Run the registerUser.js application before retrying");
        //     const res_str = `{"result":"Failed","msg":"An identity for the user does not exist in the wallet"}`     
        //     res.json(JSON.parse(res_str));
        //     return;
        // }

        // Create a new gateway for connecting to our peer node.
        // 1.gateway 접속
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: user.id,
            discovery: { enabled: true, asLocalhost: true },
        });

        console.log(`gateway : ${gateway}`);

        // Get the network (channel) our contract is deployed to.
        // 2.mychannel 접속
        const network = await gateway.getNetwork("mychannel");

        console.log(`network : ${network}`);

        // Get the contract from the network.
        // 3. cc 가져오기
        // 4. cc 호출
        // 말은 asset-transfer-basic인데 실제로는 basic이라는 이름으로 들어가있음.
        const contract = network.getContract("VOne");

        console.log(`contract : ${contract}`);

        // Submit the specified transaction.
  
       const result = await contract.evaluateTransaction(
            "QueryCertByUserID",
            user.id,
        
        );

        const result_two = result.toString();


        if(result_two == null) {
            console.log(`result is null`)
            return;
        }

        console.log(`result : ${result_two}`);


        console.log("Transaction has been submitted");
        
        // Disconnect from the gateway.
        await gateway.disconnect();


        
    if(!user) {
        return res.status(404).render("404", {pageTitle: "사용자를 찾을 수 없습니다."});
    }
    return res.render("query", {
        pageTitle: user.name,
        user,
    });

    } catch (error) {
        console.error(`Catch error : Failed to submit transaction : ${error}`);
        const res_str = `Catch error : {"result":"Failed","msg":"An identity for the user does not exist in the wallet"}`     
        res.json(JSON.parse(res_str));
        
    }

};


export const getQueryDetail = async (req,res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "certifications",
        populate: {
            path: "owner",
            model: "User",
        },
    });






    const {certid} = req.params;

    const certification = await Certification.findById(certid).populate("owner");
    if(!certification){
        return res.render("404", {pageTitle: "증명서를 찾지 못했습니다."})
    }
    console.log(certification);
    return res.render("querydetail", {pageTitle: certification.title, certification});



}

export const getQueryTest = async (req,res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "certifications",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    

}

export const postQuery = async (req,res) => {
    console.log("진짜 되니?");
    console.log(id);
    res.send("shit");

    // const {id} = req.params;
    // console.log(id);
    // const user = await User.findById(id).populate({
    //     path: "certifications",
    //     populate: {
    //         path: "owner",
    //         model: "User",
    //     },
    // });

    


    // try {
    //     // Create a new file system based wallet for managing identities.
    //     const walletPath = path.join(process.cwd(), "wallet");
    //     const wallet = await Wallets.newFileSystemWallet(walletPath);
    //     console.log(`Wallet path: ${walletPath}`);

    //     // Check to see if we've already enrolled the user.
    //     const identity = await wallet.get(user.id);
    //     console.log(identity);
    //     // if (!identity) {
    //     //     console.log(
    //     //         `An identity for the user ${userId} does not exist in the wallet`
    //     //     );
    //     //     console.log("Run the registerUser.js application before retrying");
    //     //     const res_str = `{"result":"Failed","msg":"An identity for the user does not exist in the wallet"}`     
    //     //     res.json(JSON.parse(res_str));
    //     //     return;
    //     // }

    //     // Create a new gateway for connecting to our peer node.
    //     // 1.gateway 접속
    //     const gateway = new Gateway();
    //     await gateway.connect(ccp, {
    //         wallet,
    //         identity: user.id,
    //         discovery: { enabled: true, asLocalhost: true },
    //     });

    //     console.log(`gateway : ${gateway}`);

    //     // Get the network (channel) our contract is deployed to.
    //     // 2.mychannel 접속
    //     const network = await gateway.getNetwork("mychannel");

    //     console.log(`network : ${network}`);

    //     // Get the contract from the network.
    //     // 3. cc 가져오기
    //     // 4. cc 호출
    //     // 말은 asset-transfer-basic인데 실제로는 basic이라는 이름으로 들어가있음.
    //     const contract = network.getContract("VOne");

    //     console.log(`contract : ${contract}`);

    //     // Submit the specified transaction.
  
    //    const result = await contract.evaluateTransaction(
    //         "QueryCert",
    //         certHash,
        
    //     );


    //     console.log(`result : ${result}`);


    //     console.log("Transaction has been submitted");
        
    //     // Disconnect from the gateway.
    //     await gateway.disconnect();

    //     console.log(result);
        
    // if(!user) {
    //     return res.status(404).render("404", {pageTitle: "사용자를 찾을 수 없습니다."});
    // }
    // return res.render("querydetail", {
    //     pageTitle: user.name,
    //     user,
    //     result
    // });

    // } catch (error) {
    //     console.error(`Catch error : Failed to submit transaction : ${error}`);
    //     const res_str = `Catch error : {"result":"Failed","msg":"An identity for the user does not exist in the wallet"}`     
    //     res.json(JSON.parse(res_str));
        
    // }






};

export const getQuerySearch = (req,res) => {

    return res.render("querySearch", {pageTitle: "인증서 조회"});
}

export const postQuerySearch = async (req,res) => {

    const {id} = req.params;
    console.log(id);
    const user = await User.findById(id).populate({
        path: "certifications",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    const {certHash} =  req.body;

        try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(user.id);
        console.log(identity);
        // if (!identity) {
        //     console.log(
        //         `An identity for the user ${userId} does not exist in the wallet`
        //     );
        //     console.log("Run the registerUser.js application before retrying");
        //     const res_str = `{"result":"Failed","msg":"An identity for the user does not exist in the wallet"}`     
        //     res.json(JSON.parse(res_str));
        //     return;
        // }

        // Create a new gateway for connecting to our peer node.
        // 1.gateway 접속
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: user.id,
            discovery: { enabled: true, asLocalhost: true },
        });

        console.log(`gateway : ${gateway}`);

        // Get the network (channel) our contract is deployed to.
        // 2.mychannel 접속
        const network = await gateway.getNetwork("mychannel");

        console.log(`network : ${network}`);

        // Get the contract from the network.
        // 3. cc 가져오기
        // 4. cc 호출
        // 말은 asset-transfer-basic인데 실제로는 basic이라는 이름으로 들어가있음.
        const contract = network.getContract("VOne");

        console.log(`contract : ${contract}`);

        // Submit the specified transaction.
  
       const result = await contract.evaluateTransaction(
            "QueryCert",
            certHash,
        
        );


        console.log(`result : ${result}`);


        console.log("Transaction has been submitted");
        
        // const res_str = `{"result":"success","msg":${result}}`;  
        // const result_mod = JSON.parse(res_str);
        // console.log(`result_mod: ${result_mod}`);
        // const result_mod_two = JSON.stringify(result_mod.msg);
        // console.log(`result_mod_two: ${result_mod_two}`);
        // const result_mod_three = JSON.parse(result_mod_two);
        // console.log(`Please : ${result_mod_three}`);
        // console.log(`Please : ${result_mod_three.orgid}`);
        // Disconnect from the gateway.
        await gateway.disconnect();


        const complete = true;

        
    if(!user) {
        return res.status(404).render("404", {pageTitle: "사용자를 찾을 수 없습니다."});
    }
    return res.render("querySearch", {
        pageTitle: user.name,
        complete,
        
        
    });

    } catch (error) {
        console.error(`Catch error : Failed to submit transaction : ${error}`);
        const res_str = `Catch error : {"result":"Failed","msg":"An identity for the user does not exist in the wallet"}`     
        res.json(JSON.parse(res_str));
        
    }








};