## Pre-reqirements
- Docker： for supporting mysql [Download Link](https://www.docker.com/)
- Sequel Ace： for mysql visualisation [Download Link](https://apps.apple.com/cn/app/sequel-ace/id1518036000?mt=12)
- Apifox： for API designing and testing.  [Download Link](https://apifox.com/)


## install depandencies
`npm install`

## run the system:
`npm run start`

## mysql database configuration
1. Download and login to Docker Desktop
2. Download mysql and run `docker-compose up -d` (Must be in root dir of the project)
3. open Sequel Ace, password: `131313313131abc`, click "connect" to establish connection
![alt text](image.png)

4. create database `second_hand_car_development` 
![alt text](image-1.png)

5. table initialisation: `npx sequelize-cli db:migrate` (Must be in root dir)
