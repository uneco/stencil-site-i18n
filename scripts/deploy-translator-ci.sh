#!/bin/bash

(cd build/translator && firebase use default && firebase deploy --token "${FIREBASE_TOKEN}" --only hosting)
