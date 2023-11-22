# Express.JS API Boilerplate

## Generate Sequelize Model Automagically

Use **sequelize-auto** to automagically generate models for Sequelize.

```
sequelize-auto -o "./<OUTPUT_DIRECTORY>" -d <DATABASE_NAME> -h <DATABASE_HOST> -u <DATABASE_USERNAME> -p <DATABASE_PORT> -x <DATABASE_PASSWORD> -e <DATABASE_DIALECT>
```

Example for PostgreSQL database :

```
sequelize-auto -o "./models" -d my_database -h 192.168.1.1 -u postgres -p 5432 -x MySuperHardPassw0rd -e postgres
```