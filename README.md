## Running the test network

You can use the `./network.sh` script to stand up a simple Fabric test network. The test network has three peer organizations with one peer each and a single node raft ordering service.

## To set up the network:

Step 1: ./network.sh up createChannel -ca -s couchdb
        If not working run it in 2 steps-
        1. ./network.sh up -ca -s couchdb
        2. ./network.sh createChannel
        -Output: 1 orderer container,3 CA container(one for each org),3 Peer Container(1 for each org),3 couchdb container(one for each peer)
              
      Note: Delete the peerOrganization and ordererOrganization folders from  Orgaization Directory, Delete the uni,mhrd,thirdparty,orderer folders from fabric ca directory and         delete the contents of channel artifacts directory.

        


