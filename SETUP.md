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
- **Хранилище фото:** **GitHub Releases** твоего репо. Каждое фото — это binary asset в `media`-релизе. **НЕ загромождает git history** — releases это отдельная сущность.
- **Метаданные** (категории, список фото): `_state.json` в репо (текстовый файл ~5 КБ, ничего страшного).
- **Авторизация:** PAT хранится только в localStorage **твоего** браузера. На сервере ничего.

## Лимиты GitHub Releases (бесплатно)

- **Размер asset:** до 2 ГБ за штуку
- **Количество asset'ов:** unlimited
- **Хранилище:** unlimited для public репо
- **Bandwidth (раздача):** unlimited через GitHub CDN
- **API rate limit:** 5000 req/час с токеном

Для альбома поездки — на всю жизнь хватит.

## Если что-то сломалось

- **«Заполни оба поля»** — оба поля обязательны.
- **«upload 401»** — токен невалиден или прав не хватает. Перепроверь шаг 1.
- **«create release 422»** — релиз с тегом `media` уже есть. Норм, упадёт только при первом запуске; перезагрузи страницу.
- **Картинки не показываются** — открой URL вида `https://github.com/alishergiyasov100-boop/issyk-kul-2026/releases/tag/media` и проверь что там лежат assets.
