# Setup — GitHub Releases storage

Одна штука: токен. 1 минута.

## 1. Создай PAT

Открой: **https://github.com/settings/personal-access-tokens/new**

- **Token name:** `issyk-kul-album`
- **Expiration:** No expiration (или хоть на год)
- **Resource owner:** твой аккаунт (alishergiyasov100-boop)
- **Repository access:** **Only select repositories** → `issyk-kul-2026`
- **Permissions** → раскрой **Repository permissions**:
  - **Contents:** `Read and write`
  - **Metadata:** `Read-only` (выставится автоматом)
- Жми **Generate token** → скопируй (`github_pat_...`)

⚠️ Токен показывается ОДИН РАЗ. Сохрани куда-нибудь, если планируешь использовать на другом устройстве.

## 2. Открой альбом

**https://alishergiyasov100-boop.github.io/issyk-kul-2026/**

- **Owner / Repo:** `alishergiyasov100-boop/issyk-kul-2026`
- **GitHub PAT:** вставь токен
- → **Подключить**

Готово. Можешь грузить фото.

---

## Что под капотом

- **Хостинг страницы:** GitHub Pages (бесплатно, навсегда)
- **Хранилище фото:** папка `media/` в репо. Каждое фото = коммит через GitHub Contents API. (Releases пробовали — `uploads.github.com` режет CORS, без серверного посредника не работает.)
- **Метаданные** (категории, список фото): `_state.json` в репо.
- **Авторизация:** PAT хранится только в localStorage **твоего** браузера. На сервере ничего.

## Лимиты GitHub (бесплатно)

- **Размер файла:** до 100 МБ через Contents API (это про фото с телефона ≪ 100 МБ — норм)
- **Soft-лимит репо:** ~5 ГБ (потом warning, но работает)
- **Bandwidth:** unlimited через raw.githubusercontent.com (это и есть CDN)
- **API rate limit:** 5000 req/час с токеном

Каждое фото = один коммит. 100 фото ≈ 500 МБ репо. Для альбома поездки норм.

## Если что-то сломалось

- **«Заполни оба поля»** — оба поля обязательны.
- **«upload 401»** — токен невалиден или прав не хватает. Перепроверь шаг 1.
- **«create release 422»** — релиз с тегом `media` уже есть. Норм, упадёт только при первом запуске; перезагрузи страницу.
- **Картинки не показываются** — открой URL вида `https://github.com/alishergiyasov100-boop/issyk-kul-2026/releases/tag/media` и проверь что там лежат assets.
