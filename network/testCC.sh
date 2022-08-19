#!/bin/bash

C_YELLOW='\033[1;33m'
C_BLUE='\033[0;34m'
C_RESET='\033[0m'

# subinfoln echos in blue color
function infoln() {
  echo -e "${C_YELLOW}${1}${C_RESET}"
}

function subinfoln() {
  echo -e "${C_BLUE}${1}${C_RESET}"
}

# add PATH to ensure we are picking up the correct binaries
export PATH=${HOME}/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/config

# Chaincode config variable

CC_NAME="VOne"
CC_SRC_PATH="./../contract"
CC_RUNTIME_LANGUAGE="golang"
CC_VERSION="1"
CHANNEL_NAME="mychannel"
PEER_CONN_PARMS="--peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/userorg.example.com/peers/peer0.userorg.example.com/tls/ca.crt"

## Install chaincode on peer0.org1
infoln "Testing chaincode on peer0.org1..."

ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051



## TEST1 : Invoking the chaincode
infoln "TEST1 : Invoking the chaincode"
set -x
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS -c '{"function":"AddCert","Args":["test1user", "test1cert", "test1date", "test1hash"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 3

## TEST2 : Invoking the chaincode and deleting
infoln "TEST2 : Invoking the chaincode and deleting"
set -x
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS -c '{"function":"AddCert","Args":["test2user", "test2cert", "test2date", "test2hash"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 3

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS -c '{"function":"DeleteCert","Args":["test2hash"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 3


## TEST3 : Invoking the chaincode wiht userorg
infoln "TEST3 : Invoking the chaincode with userorg"
set -x

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="UserOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/userorg.example.com/peers/peer0.userorg.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/userorg.example.com/users/Admin@userorg.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS -c '{"function":"AddCert","Args":["test3user", "test3cert", "test3date", "test3hash"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 3

## TEST4 : Query the chaincode
infoln "TEST4 : Query the chaincode"
set -x
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function":"QueryCert","Args":["test3hash"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt