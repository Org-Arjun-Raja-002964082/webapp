#!/bin/bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get clean
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install nodejs -y
sudo chown ubuntu ./*
sudo apt-get install zip unzip
echo "=========================================== Pre shell commands ==========================================="
sleep 10
unzip webapp.zip
sudo rm -rf webapp.zip
echo "########## unzip done #############"
ls -lrta
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
pwd
echo "########## Installation done #############"
echo "########## Build done #############"