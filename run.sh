#!/bin/bash

echo "Choose an option:"
echo "1. npm run dev"
echo "2. npm run deploy"
echo -n "Enter your choice [1-2]: "
read choice

case $choice in
  1)
    npm run dev
    ;;
  2)
    npm run deploy
    ;;
  *)
    echo "Invalid choice."
    ;;
esac
