#!/bin/bash
curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
sudo yum install -y git
cd /home/ec2-user
git clone https://github.com/praveenawstasks/hbfl.git
cd hbfl
npm i
npm run start

# The above commands base64 encoded for entering into UserData
# IyEvYmluL2Jhc2gNCmN1cmwgLS1zaWxlbnQgLS1sb2NhdGlvbiBodHRwczovL3JwbS5ub2Rlc291cmNlLmNvbS9zZXR1cF8xNi54IHwgc3VkbyBiYXNoIC0NCnN1ZG8geXVtIGluc3RhbGwgLXkgbm9kZWpzDQpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdA0KY2QgL2hvbWUvZWMyLXVzZXINCmdpdCBjbG9uZSBodHRwczovL2dpdGh1Yi5jb20vcHJhdmVlbmF3c3Rhc2tzL2hiZmwuZ2l0DQpjZCBoYmZsDQpzdWRvIG5wbSBpDQpucG0gcnVuIHN0YXJ0DQoNCg==