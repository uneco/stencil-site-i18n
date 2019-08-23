#!/bin/bash

(cd build/docs && firebase use default && firebase deploy --only hosting)
