#!/bin/bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get clean
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install nodejs -y
sudo chown ubuntu ./*
sudo apt install postgresql postgresql-contrib -y
sudo -u postgres createuser myuser
sudo -u postgres createdb webapp_db
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'admin';"
sudo apt-get install zip unzip
echo "=========================================== testing changes ==========================================="
sleep 10
# ls -lrta
whoami
unzip webapp.zip
sudo rm -rf webapp.zip
echo "########## unzip done #############"
sudo chown ubuntu:ubuntu webapp-main 
ls -lrta
cd webapp-main
sudo npm install
pwd
sudo touch .env
sudo cp .env_local .env
echo "########## Installation done #############"
sudo npm run build
echo "########## Build done #############"
sudo npm run test
echo "##########  test done #############"
# sudo npm run dev
echo "########## change permission for start script #############"
sudo chmod 777 /home/ubuntu/node_start.sh
sleep 10
sudo mv /home/ubuntu/webapp.service /etc/systemd/system/webapp.service
sudo systemctl enable webapp.service
sudo systemctl status webapp.service
# sudo systemctl start webapp.service
echo "############### THE END ##############"
# cd ../../