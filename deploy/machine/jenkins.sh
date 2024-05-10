#Install dependencies
yarn

#Front-end builds
yarn build

#Virtual machine deployment
#Direct copy, if there is a permission problem with SCP, you need to add the ~/.ssh/id_rsa.pub content to the ~/.ssh/authorized_keys file of the target machine
#After the nginx configuration is modified, you need to run nginx -s reload on the target machine
TARGET="172.16.xxx.xxx"
scp -r build/* app@$TARGET:/home/app/nginx/html
ssh app@$TARGET "chmod 775 -R /home/app/nginx"

scp deploy/machine/nginx.conf app@$TARGET:/home/app/nginx/conf
ssh app@$TARGET "nginx -s reload" #Restarting ng is usually required after the ng configuration is changed
