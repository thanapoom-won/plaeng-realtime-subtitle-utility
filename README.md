# Plaeng: realtime subtitle utility prototype
Plaeng is a realtime subtitle utility prototype that run on a web browser. Note that this protype utilize browser's web-speech API and Google Translate API. If you have any question, please feel free to contact me at thanapoom.won@gmail.com.

# How to install and run Plaeng
There are 3 versions of Plaeng that you can install and run, the Development, the production and the Docker production.

## Development version

Development is the version that is used to develop this utility. The auto rebuild feature is enabled in frontend and backend, so you do not have to rebuild it manually when making changes. 

### Prerequisites
Before you can install and run the development version, you need: 

1. Node.js version 16.13.1 or higher
2. Yarn package manager

### Backend installation
1. Open your terminal and navigate to `./backend`
2. run `yarn`
3. run `yarn start:dev`

### Fronted installation
1. Create a file named `.env` with this content:
```NEXT_PUBLIC_API_URL=ws://localhost:8080```
2. Open your new terminal and navigate to `./frontend`
3. run `yarn`
4. run `yarn dev`

Now visit `localhost:3000` on your browser, you will see the application running.

## Production version

Production is the version that is optimized for deployment. The utility has a better performance in this version. You can use it to deploy on the production environment.

### Prerequisites
Before you can install and run the production version, you need: 

1. Node.js version 16.13.1 or higher
2. Yarn package manager

### Backend installation
1. open your terminal and navigate to `./backend`
2. run `yarn`
3. run `yarn build`
4. run `yarn start:prod`

### Fronted installation
1. create a file named `.env` with this content:
```NEXT_PUBLIC_API_URL=ws://<your-ip-address-or-domain-name>:8080```
2. open your new terminal and navigate to `./frontend`
3. run `yarn`
4. run `yarn build`
5. run `yarn start`

Now visit `localhost:3000` or `<your-ip-address-or-domain-name>:3000` on your browser, you will see the application running.

## Docker production version

Docker production is a version that this utility is dockerized.Furthermore, there is Nginx web server with reverse proxy set up in this version . This is the best version for production deployment.

### Prerequisites
Before you can install and run the docker production version, you need:
1. Docker Runtime
2. Docker compose
3. Domain name

### Installation
1. go to `./nginx/conf` then change `plaeng.online` and `www.plaeng.online` in this file to your registered domain name.
2. go to root directory of this repo, then run `docker-compose up -d --build` to start services.

Now you should see the application running on your domain name. 

### SSL certificate

To obtain the ssl certificate to enable HTTPS

1. go to root directory of this repo.
2. run `docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d <your-domain-name>`