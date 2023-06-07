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

# How to use the application
1. visit your application with web browser, you will see a homepage with a textfield, "Join session" button and "Host new session button".
2. click "Host new session button".
3. select the language you want to speak in "Speech language" list.
4. select the subtitle language in "Subtitle language" list.
5. click "Start listening", and say something. Everything you speak will be translated to your "Subtitle language" and display on the screen.
6. to let anyone join the session. Give them session id on the top of the page.
7. the participant have to put the session id in the homepage's textfield. Then click "Join Session".
8. after that, the participants can select their desire subtitle language. Everything the speaker say will be translated and display on the participant's screen in their language.

# More about Plaeng

Plaeng is a realtime subtitle utitlity prototype that is developed with Next.js as a frontend and NestJS as a backend. This prototype utilizes Browser's web speech API to transcribe the speaker's speech. This means that the application works differently across devices and browsers. For further development, we should utilize an external speech-to-text service to transcribe. Plaeng also utilize Google Translator service via "translate-google" Yarn package. This service is used to translate the transcribed text. However, the problem is this service send the output asynchronously, which mean the translated speech may be unordered. Therefore, I designed and implemented a text recombiner algorithm inspired by internet TCP protocal to recombine the translation result in order.