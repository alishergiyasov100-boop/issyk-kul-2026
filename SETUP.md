# Setup Cloudflare R2 — с телефона

Делается один раз, минут на 10.

## 1. Аккаунт Cloudflare

Открой **dash.cloudflare.com** → Sign Up (можно через Google). Карты НЕ просит.

## 2. R2 bucket

В левом меню → **R2 Object Storage** → Get Started.

⚠️ Может попросить «enable R2» с галочкой «agree to terms». Подтверди. Карта не нужна для free tier (10 ГБ).

Жми **Create bucket**:
- Name: `issyk-kul-2026`
- Location: оставь Auto
- → **Create bucket**

## 3. Worker

В левом меню → **Workers & Pages** → **Create application** → **Create Worker**.

- Name: `issyk-kul` (или любое)
- → **Deploy** (с дефолтным «Hello World»)

Сразу после деплоя → **Edit code**.

Удали весь дефолтный код. Открой `worker.js` в этом репо:
https://github.com/alishergiyasov100-boop/issyk-kul-2026/blob/main/worker.js

Жми **Raw** → выдели всё → копируй → вставь в редактор Worker'а → **Save and Deploy**.

## 4. Привязать R2 к Worker

Worker → **Settings** → **Bindings** → **Add** → **R2 bucket binding**:
- Variable name: `BUCKET`
- R2 bucket: `issyk-kul-2026`
- → **Save**

## 5. Secret

Worker → **Settings** → **Variables and Secrets** → **Add**:
- Type: **Secret**
- Variable name: `SECRET`
- Value: придумай длинную случайную строку, например `kul2026_xK8mP3qR7nL5vN9hT2wA`
- → **Save**

## 6. CORS на bucket (опционально, если ругается)

R2 → твой bucket → **Settings** → **CORS Policy**:
```json
[{ "AllowedOrigins": ["https://alishergiyasov100-boop.github.io"],
   "AllowedMethods": ["GET","POST","DELETE","OPTIONS"],
   "AllowedHeaders": ["*"] }]
```
Чаще всего CORS Worker'а достаточно, этот шаг можно пропустить.

## 7. Финал

В шапке Worker'а скопируй URL (типа `https://issyk-kul.<your-subdomain>.workers.dev`).

Открой альбом → https://alishergiyasov100-boop.github.io/issyk-kul-2026/

- **Worker URL:** твой URL Worker'а
- **Secret:** та строка из шага 5

→ Подключить. Готово.

---

## Лимиты free tier R2

- **10 ГБ хранилища** навсегда бесплатно
- **1 млн Class A операций / месяц** (PUT, DELETE)
- **10 млн Class B операций / месяц** (GET)
- **Нулевой egress** (платить за трафик не надо — это и есть фишка R2)

Для альбома поездки — выжечь не реально.

## Если что-то сломалось

- **CORS error в консоли:** проверь что в Worker `access-control-allow-origin: *` (он есть). Иногда помогает добавить CORS Policy на bucket (шаг 6).
- **401 unauthorized:** Secret в Worker не совпадает с тем что ввёл в альбом.
- **«Failed to fetch»:** Worker URL без `https://` или с лишним слешем — перепроверь.
- **Картинки белые:** открой DevTools → Network — посмотри URL и status, скинь скрин.
