#!/bin/bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get clean
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
sudo chown ubuntu ./*
sudo apt-get install zip unzip
echo "=========================================== Pre shell commands ==========================================="
sleep 10
unzip webapp.zip
sudo rm -rf webapp.zip
echo "########## unzip done #############"
ls -lrta
pwd

sudo curl -o /root/amazon-cloudwatch-agent.deb https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E /root/amazon-cloudwatch-agent.deb


sudo cp /home/ubuntu/cloudwatch-config-template.json /opt/cloudwatch-config-template.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config-template.json -s

sudo mkdir -p /home/ubuntu/logs
sudo touch /home/ubuntu/logs/csye6225.log
sudo chmod 775 /home/ubuntu/logs/csye6225.log


echo "########## Installation done #############"
echo "########## Build done #############"