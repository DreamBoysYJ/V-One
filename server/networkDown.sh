#!/bin/bash

# Exit on first error
set -ex

# Bring the test network down
pushd ../network
./networkdown.sh
popd

# Clean out any old identities in the wallets
rm -rf wallet/*