# sequelize-models-validator

An npm package for validating models.

Special thanks to [Robert Stanislavovich](https://github.com/robert-stanislavovich).

## Installation

The package is connected via npm.

```bash
npm i sequelize-models-validator
```

Or yarn:

```bash
yarn add sequelize-models-validator
```

## Config

To get connection data, the [Config](https://www.npmjs.com/package/config) package is used.  
Available config options:

Separated (user):

```json
{
  "db": {
    "dialect": "postgres",
    "host": "example.com",
    "port": 5432,
    "user": "user",
    "password": "pass",
    "database": "dbname"
  }
}
```

Separated (username):

```json
{
  "db": {
    "dialect": "postgres",
    "host": "example.com",
    "port": 5432,
    "username": "user",
    "password": "pass",
    "database": "dbname"
  }
}
```

URI:

```json
{
  "db": {
    "uri": "postgres://user:pass@example.com:5432/dbname"
  }
}
```

.sqlite file (sqlite only)

```json
{
  "db": {
    "dialect": "sqlite",
    "storage": "path/to/database.sqlite"
  }
}
```

## Usage

After installation you can use the command to check models:

```bash
npx validate-models ./src/models
```

The path to the folder with models is passed as an argument. It is important that this path must be relative to the location where the script is run from.  
Also this command supports both js models and ts.

Examples of using:  
![image](https://user-images.githubusercontent.com/56697273/229765791-430bc153-bdd1-44dc-a375-de29dbd33a89.png)
![image](https://user-images.githubusercontent.com/56697273/229765854-7717de0f-1657-46aa-8c95-cf784a3fea8f.png)

## Check modules

The model goes through several checks, and each of them, if it finds an error, will display it in the console.  
All checks and possible messages will be listed below.

- Timestamps
  - `[WARN timestamps] Model '${name}' doesn't contain '${column}'.` - the model does not contain the specified column.
- Paranoid
  - `[ERROR paranoid] ${name}: paranoid is true, but timestamps not enabled.` - paranoid option requires timestamps.
  - `[WARN paranoid] Model '${name}' doesn't contain '${column}'.` - the model does not contain the specified column.
- Underscore
  - `[WARN underscore] Model '${name}' contains field '${column}'.` - the model contains a field containing `_`. This field does not have to be in the model itself. It may be that some other model, referring to this field by a foreign key, accesses it through snake_case.
- Columns  
  Checks if the fields in the model match the columns in the database.
  - `[ERROR column] Model '${name}' miss column '${column}'.` - this column is in the database, but not in the model.
  - `[ERROR column] Model '${name}' has excess column '${column}'.` - there is no such column in the database.
- ServiceTables  
  Checks if the table name matches the service table name (attributes, sequences, foreign_tables, etc).
  - `[ERROR service-tables] Table with name ${name} is service table in database.` - the specified name of the table is service.
- DataType
  - `[ERROR dataType] DataType of field ${model}/${column} is defined incorrectly. Database: ${type}. Model: ${type}. Correct type: ${type}` - column types in the _database_ and in the _model_ don't match. Try set _correct type_ in model.
