apt update && apt upgrade -y
apt install git ffmpeg imagemagick curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install v18.19.0
nvm alias default v18.19.0
nvm use default
npm install -g pm2