# NTThai-middle-examination-GSV

## Getting Started

```bash

# Enter into the directory
cd NTThai-middle-examination-GSV/

# Install the dependencies
yarn

# Set the environment variables:
cp .env.example .env

# Running the boilerplate:
yarn dev
```

## Configuration

Variables for the environment

| Option             | Description                         |
| ------------------ | ----------------------------------- |
| PORT               | Port the server will run on         |
| DB_DIALECT         | "mysql", "postgresql", among others |
| DB_HOST            | Database host                       |
| DB_USER            | Database username                   |
| DB_PASS            | Database password                   |
| DB_NAME            | Database name                       |

## Commands for sequelize

```bash
# Creates the database
yarn sequelize db:create

# Drops the database
yarn sequelize db:drop

# Load migrations
yarn sequelize db:migrate

# Create file migrations
yarn sequelize migration:generate --name **migration name**

# Migrate From
yarn sequelize db:migrate --from **migrate name**

# Undo migrations
yarn sequelize db:migrate:undo:all


# NTThai-middle-examination-GSV
