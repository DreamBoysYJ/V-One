#!/bin/bash

set -e

# Clean out any old identities in the wallets
rm -rf wallet/*

# launch network; create channel and join peer to channel

pushd ../network

./startnetwork.sh

sleep 5

./createchannel.sh

sleep 5

./setAnchorPeerUpdate.sh

sleep 5

./deployCC.sh

popd