# Размещение на Render и Aiven

`deploy/render/Dockerfile` запускает nginx, Next.js standalone и Express в одном контейнере. Страницы доступны на `/`, REST API — на `/api/`, Socket.io — на `/socket.io/`. SSR обращается к Express внутри контейнера. Cookie остаётся HttpOnly, SameSite=Lax и Secure при HTTPS.

MySQL размещается в Aiven: бесплатный Render не предоставляет постоянный диск для базы. Обычный локальный `compose.yaml` остаётся прежним.

## Бесплатные планы

Render: Web Service → **Free**, без платёжного метода. Если аккаунт требует карту для проверки, остановитесь — этот вариант не соответствует условию размещения без карты.
Aiven: MySQL → **Free**, а не пробный платный план. Для демонстрационных данных достаточно 1 ГБ.

Render усыпляет сервис после 15 минут без обращений; первое открытие после простоя может занять около минуты. Aiven может останавливать неактивную бесплатную базу. При превышении лимитов без карты сервис может быть приостановлен; SLA отсутствует.
Условия: [Render](https://render.com/docs/free), [Aiven MySQL](https://aiven.io/docs/products/mysql/concepts/mysql-free-tier).

## Подготовить MySQL

1. Создайте MySQL Free в Aiven. Сохраните Host, Port, User и Password, скачайте CA certificate.
2. Подключитесь через MySQL Workbench (Standard TCP/IP). На вкладке SSL выберите **Require and Verify Identity**, CA File — скачанный сертификат.
3. Только в новой пустой облачной базе выполните `database/schema.sql`, затем `database/seed.sql`. Они создают `orders_products` и демонстрационные записи. Повторно запускать seed после удаления приходов не нужно.
4. Проверьте шесть таблиц, четыре прихода и пять товаров. Демо-пользователь создаётся при запуске приложения.

Секреты не добавляются в Git. API использует CA-сертификат и проверяет сертификат сервера, без `rejectUnauthorized: false`.

## Создать Web Service

Отправьте ветку с конфигурацией в GitHub. В Render выберите **New → Web Service**, подключите репозиторий:

| Поле | Значение |
| --- | --- |
| Branch | `feature/render-deploy` или `main` после merge |
| Language | Docker |
| Root Directory | Пусто |
| Dockerfile Path | `deploy/render/Dockerfile` |
| Docker Build Context | `.` |
| Docker Command | Пусто, используется CMD образа |
| Instance Type | Free |
| Health Check Path | `/api/health/db` |

Переменные окружения:

| Имя | Значение |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` | Параметры из Aiven |
| `DB_NAME` | `orders_products` |
| `DB_SSL_CA_PATH` | `/etc/secrets/aiven-ca.pem` |
| `JWT_SECRET` | Новый случайный секрет, минимум 32 символа |
| `DEMO_EMAIL` | `demo@example.com` |
| `DEMO_PASSWORD` | Пароль демо-аккаунта, 8–128 символов |
| `COOKIE_SECURE` | `true` |

Сгенерировать JWT_SECRET локально: `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
В **Secret Files** добавьте `aiven-ca.pem` с содержимым CA-сертификата Aiven.

`PORT` и `RENDER_EXTERNAL_URL` предоставляет Render. `CLIENT_ORIGIN` берётся из `RENDER_EXTERNAL_URL`; для своего домена задайте `CLIENT_ORIGIN=https://домен` без завершающего слеша.
`NEXT_PUBLIC_API_URL=/api` уже задан при сборке; внутренний `API_URL` задаёт стартовый скрипт. Не копируйте локальный `.env` целиком: его адреса, пароли и `COOKIE_SECURE=false` для облака не подходят.

После создания дождитесь Live. Инструкции Render: [Docker](https://render.com/docs/docker), [секретные файлы](https://render.com/docs/configure-environment-variables#secret-files).

## Проверка после публикации

- `/api/health/db` возвращает HTTP 200 и `database: connected`.
- Работают вход, оба списка, фильтр, переводы, карта и диаграмма.
- Две вкладки увеличивают счётчик, закрытие одной уменьшает его.
- После обновления сохраняется сессия, исходный HTML содержит данные (SSR).
- Удаление тестового прихода сохраняется после перезапуска.
- Запросы браузера идут на публичный домен, без localhost:4000.

При старте выполняется только идемпотентная настройка авторизации, каталог не восстанавливается. При завершении одного серверного процесса останавливается весь контейнер с ошибкой. В этом режиме Express доверяет двум прокси (Render → nginx → Express), а внутренние серверы слушают только loopback.

## Локальная проверка общего образа

Команды из корня проекта; нужен свободный порт 10000. Рабочая база на 3307 не используется.

```bash
docker build -f deploy/render/Dockerfile -t orders-products-render:local .
docker compose -f deploy/render/compose.test.yaml up -d --wait
node --test tests/render.smoke.test.mjs
docker stats --no-stream orders-render-check-app-1
```

Откройте http://localhost:10000. Вход: `demo@example.com` / `DemoPass123!`.
Тестовый контейнер ограничен 512 МБ памяти. Это функциональная проверка, не гарантия производительности на CPU бесплатного Render.

Завершить проверку:

```bash
docker compose -f deploy/render/compose.test.yaml down
```

Тестовый том сохраняется; рабочие контейнеры и данные не затрагиваются.
Публичный деплой и TLS-подключение к Aiven проверяются отдельно после создания аккаунтов и задания секретов.
