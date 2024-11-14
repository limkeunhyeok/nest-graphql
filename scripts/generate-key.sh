#!/bin/bash

REPLICA_KEY_NAME="mongodb.key"
REPLICA_KEY_PATH="."

echo "TEST $REPLICA_KEY_PATH/$REPLICA_KEY_NAME"

echo "Generating a replica key..."
openssl rand -base64 756 > $REPLICA_KEY_PATH/$REPLICA_KEY_NAME

echo "Setting permissions: Owner read-only access"
chmod 400 $REPLICA_KEY_PATH/$REPLICA_KEY_NAME

echo "Keys generated successfully!"
