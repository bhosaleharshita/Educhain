# Running the test network #

You can use the `./network.sh` script to stand up a simple Fabric test network. The test network has three peer organizations with one peer each and a single node raft ordering service.

## To set up the network:

## Step 1 Setting Up The Network
 ./network.sh up createChannel -ca -s couchdb
        -Output: 1 orderer container,3 CA container(one for each org),3 Peer Container(1 for each org),3 couchdb container(one for each peer)
              
      Note: Delete the peerOrganization and ordererOrganization folders from  Orgaization Directory, Delete the uni,mhrd,thirdparty,orderer folders from fabric ca directory and delete the contents of channel artifacts directory.


## Step 2: Packaging,Installing,Approving and commiting the chaincode on the network
- Cd to Application/orgnization directory
- Open command prompts from each org folder
(1 prompt from mhrd,1 from uni and 1 from thirdparty )

	//Repeat the below steps on each cmd

- source mhrd.sh/uni.sh/thirdparty.sh (according to the prompt you are using)

*PACKAGING CHAINCODE*
	
- peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0

*CHAINCODE INSTALLATION*
- peer lifecycle chaincode install cp.tar.gz

- peer lifecycle chaincode queryinstalled
(this will return a package id export it into a variable for further use)

- export PACKAGE_ID=(cp_0:ffda93e26b183e231b7e9d5051e1ee7ca47fbf24f00a8376ec54120b1a2a335c) --add the package id returned by previou query

*APPROVE CHAINCODE FOR ORG*
- peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name papercontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA

After successfully performing above steps for each peer,perform the below step on any one of the prompts

*COMMITING THE CHAINCODE DEFINATION*
- peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_uni_CA} --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_mhrd_CA} --peerAddresses localhost:11051 --tlsRootCertFiles ${PEER0_thirdparty_CA} --channelID mychannel --name papercontract -v 0 --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent

OUTPUT: Chaincode Containers up and running for all 3 peers



## Step 3 Setting Up the Node SDK

- CD to \Educhain\Application\organization\mhrd || uni ||thirdparty\application
-Open the respective prompts(One for each peer,total 3 prompts)

- run: npm install (do this on all 3 prompts,may take some time | required only during first time setup)

	*Optional step to check working of backend*
- run: node [script_name.js] (will run the specified script)



## Step 4 Set up UI needs

- CD to \Educhain\Application\organization\mhrd || uni ||thirdparty\application

- run followings (do this on all 3 prompts )

- npm install ejs
- npm install express --save
- npm install cors
- npm install express-session
(above steps need to be performed only once)

	Start UI 
- run node index.js








        


