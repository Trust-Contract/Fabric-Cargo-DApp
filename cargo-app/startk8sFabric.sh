
#!/bin/bash
# test code
# orderer
sudo iptables -t nat -A PREROUTING -p tcp --dport 7050 -j DNAT --to-destination 127.0.0.1:7050

# peer
sudo iptables -t nat -A PREROUTING -p tcp --dport 7050 -j DNAT --to-destination 127.0.0.1:7051

# eventhub
sudo iptables -t nat -A PREROUTING -p tcp --dport 7050 -j DNAT --to-destination 127.0.0.1:7053

# ca
sudo iptables -t nat -A PREROUTING -p tcp --dport 7050 -j DNAT --to-destination 127.0.0.1:7054

peer chaincode install -n cargo-app -v 1.0 -p github.com/hyperledger/fabric/peer/channel-artifacts/chaincode/cargo-app2

peer chaincode instantiate -o orderer0.orgorderer1:7050 -C mychannel -n cargo-app -v 1.0 -c  '{"Args": [""]}' -P "OR ('Org1MSP.member', 'Org2MSP.member')"

