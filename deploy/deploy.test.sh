#Publish the test environment script locally

#Build a front-end
yarn build

echo "Start uploading..."
#Delete the original file
sshpass -p 123456 ssh app@xxx.xxx.xxx.xxx "rm -rf /home/app/nginx/html/*"
#Upload a new file
sshpass -p 123456 scp -r ./build/* app@xxx.xxx.xxx.xxx:/home/app/nginx/html
echo "Upload successful!"

#Copy the ng configuration
#sshpass -p 123456 scp ./deploy/nginx.test.conf app@xxx.xxx.xxx.xxx:/home/app/nginx/conf
#Restart ng for the configuration to take effect
#sshpass -p 123456 ssh app@xxx.xxx.xxx.xxx "nginx -s reload"
