# sequelize-models-validator

Пакет npm для проверки, правильно ли составлены модели.

## Установка

Подключается пакет через npm.

```bash
npm i sequelize-models-validator
```

## Использование

После установки станет доступна команда:

```bash
npx validate-models ./src/models
```

В качестве аргумента передаётся путь к папке с моделями. Важно, что этот путь должен быть относительным для места, откуда запускается скрипт.  
Также эта команда поддерживает как js модели, так и ts.  
  
Примеры использования:  
![image](https://user-images.githubusercontent.com/56697273/229765791-430bc153-bdd1-44dc-a375-de29dbd33a89.png)
![image](https://user-images.githubusercontent.com/56697273/229765854-7717de0f-1657-46aa-8c95-cf784a3fea8f.png)

## Модули проверок

Модель проходит несколько проверок, и каждая из них, если найдёт ошибку, выведет её в консоль.  
Ниже будут перечислены все проверки и возможные сообщения.

+ Timestamps  
  Проверяет модель, если `timestamps: true`.  
  В такой модели должны быть поля `createdAt` и `updatedAt`. Также если `underscore: false`, то будет искать `created_at` и `updated_at`.
  + `[WARN timestamps] Model '${name}' doesn't contain '${column}'.` - модель не содержит указанный столбец.
+ Paranoid  
  Проверяет модель, если `paranoid: true`.  
  В такой модели должно быть поле `deletedAt` или `deleted_at`, если `underscored: false`.
  + `[ERROR paranoid] ${name}: paranoid is true, but timestamps not enabled.` - для работы paranoid требуется включить timestamps.
  + `[WARN paranoid] Model '${name}' doesn't contain '${column}'.` - модель не содержит указанный столбец.
+ Underscore  
  Проверяет модель, если `underscore: true`.  
  В такой модели все поля должны быть в camelCase. Это не влияет на бд, только на модель.
  + `[WARN underscore] Model '${name}' contains field '${column}'.` - модель содержит поле, содержащее `_`. Это поле не обязательно будет в самой модели. Может быть такое, что какая-то другая модель, ссылаясь на это поле по внешнему ключу, обращается к нему через snake_case.
+ Columns  
  Проверяет, совпадают ли поля в модели со столбцами в бд.
  + `[ERROR column] Model '${name}' miss column '${column}'.` - данный столбец есть в бд, но отсутствует в модели.
  + `[ERROR column] Model '${name}' has excess column '${column}'.` - такого столбца нет в бд.
