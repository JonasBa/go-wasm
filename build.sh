#!/bin/bash
set -e
GOOS=js GOARCH=wasm go build -o main.wasm ./main.go