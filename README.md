# Первая семестровая работа. Сайт Туров

Простой сайт для показа туров по странам с админкой


# Как запустить?

## 1. У вас должен быть установлен docker, postgres и .net9.0

Клонируем или скачиваем репозиторий

## 2. Запуск
### 2.1 Если Вы захотите запускать через docker, файл настройки будет:
```
{
  "PublicDirectoryPath": "connection",
  "Domain": "+",
  "Port": "8080",
  "ConnectionString": "Host=postgres;Port=5432;Database=oris;Username=developer;Password=developer"
}
```
```Host=postgres``` потому что сервис в docker-compose для базы данных называется postgres.
```Database=oris;Username=developer;Password=developer``` потому что в сервисе в docker-compose для базы данных, указывается переменные окружения.
Если хотите изменить ConnectionString, Вы должны подставить те значения из строки подключения, в docker-compose, а именно в environment

### 2.3 Переходим в терминале в папку docker
```
cd docker
```

### 2.4 Запускаем контейнеры:
```
docker-compose up -d
```

### 2.5 Если Вы хотите запустить локально
```
{
  "PublicDirectoryPath": "connection",
  "Domain": "localhost",
  "Port": "8080",
  "ConnectionString": "Host=ваш_хост;Port=ваш_порт;Database=ваша_базаданных;Username=ваш_пользователь;Password=ваш_пароль"
}
```
