
#!/bin/bash
# test code

peer chaincode install -n cargo-app -v 1.0 -p github.com/hyperledger/fabric/peer/channel-artifacts/chaincode/cargo-app2

peer chaincode instantiate -o orderer0.orgorderer1:7050 -C mychannel -n cargo-app -v 1.0 -c  '{"Args": [""]}' -P "OR ('Org1MSP.member', 'Org2MSP.member')"

