#!/bin/bash

(cd build/translator && firebase use default && firebase deploy --only hosting)
