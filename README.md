# Express-Boilerplate

Express NodeJs BoilerPlate.

## Installation

For dev -
```bash
npm install
```

For production -
```bash
npm ci --prod
```

## Usage

For dev -
```bash
npm run dev
```
For production -
```bash
node server.js
```

## ENV
```bash
PORT=8000 //default
CLUSTER=FALSE //default
ENV=prod
CUSTOMER_CODE=internal
ENV_CODE=pd
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DBNAME=boilerplate
```

## Docker Deployment
To run the application in production mode:
```bash
docker-compose build
docker-compose up
docker-compose down
```

To run the application in development mode:
```bash
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml down
```

To run the application in test mode:
```bash
docker-compose -f docker-compose.test.yml build
docker-compose -f docker-compose.test.yml up
docker-compose -f docker-compose.test.yml down
```

## Nomenclature rules
- Folder names will be **lowerCamel**
- File names will be **k-e-b-a-b**
- Variables, Functions will be **lowerCamel**
- Class names will be **PascalCase**

## Dependencies
- Mongo

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


[*Install pre-commit*](https://www.npmjs.com/package/pre-commit)
```bash
 npm install --save-dev pre-commit
```

## License
[MIT](https://choosealicense.com/licenses/mit/)