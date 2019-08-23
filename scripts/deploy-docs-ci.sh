#!/bin/bash

(cd build/docs && firebase use default && firebase deploy --token "${FIREBASE_TOKEN}" --only hosting)
