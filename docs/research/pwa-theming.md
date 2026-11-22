# PWA-Theming: installierte App an das MD3-Design angleichen

Recherche vom 2026-11-22. Es wurde kein App-Code geändert. Browser-Support-Angaben stammen aus den MDN `browser-compat-data` (Stand `main`, abgerufen am 2026-11-22), wenn nicht anders vermerkt.

## Kurzfazit

Die "klassische blaue" Farbe ist `theme_color: "#004BAC"` in `apps/web/public/site.webmanifest:17`. Das ist die **Seed-Farbe** aus dem Material Theme Builder (`material-theme.json` → `seed`), keine Farbrolle des Schemas. Die App selbst nutzt `primary` `#465D91`, und die Top App Bar ist `surface`. Außerdem fehlt in `index.html` jedes `<meta name="theme-color">`. Konkrete Empfehlungen, nach Priorität:

1. **`theme_color` auf MD3 `surface` setzen** (`apps/web/public/site.webmanifest:17`): `"#FAF8FF"` (light `surface`). Dann geht die Statusleiste (Android) bzw. die Titelleiste (Desktop) nahtlos in die `TopAppBar` über, die im Ruhezustand `bg-surface` ist (`apps/web/src/components/ui/top-app-bar.tsx:35`). Das entspricht der MD3-/Android-Vorgabe: Container der Top App Bar = `colorSurface`, beim Scrollen `colorSurfaceContainer`, und bei Edge-to-Edge zeigt die Statusleiste die Farbe der App Bar ([material-components-android TopAppBar.md](https://github.com/material-components/material-components-android/blob/master/docs/components/TopAppBar.md)).
2. **`background_color` auf `"#FAF8FF"`** (light `surface`/`background`) statt `#EEEDF4` (das ist `surfaceContainer`, `site.webmanifest:18`). Der Body der App ist `bg-surface` (`apps/web/index.html:28`), also sieht der Splash-Screen dann wie die erste gerenderte Seite aus.
3. **`<meta name="theme-color">` mit Light/Dark-Varianten in `apps/web/index.html`** ergänzen. Das Manifest kennt keine Dark-Mode-Farben (siehe unten), die Meta-Tags schon, und sie überschreiben das Manifest:
   ```html
   <meta name="theme-color" content="#FAF8FF" media="(prefers-color-scheme: light)" />
   <meta name="theme-color" content="#121318" media="(prefers-color-scheme: dark)" />
   <meta name="color-scheme" content="light dark" />
   ```
   Dark-Werte: `surface` `#121318`, `surfaceContainer` `#1E1F25` (`material-theme.json` → `schemes.dark`).
4. **Namen vereinheitlichen.** Das Manifest heißt `"Finances"` (`site.webmanifest:2-3`), der Dokumenttitel aber `"Ausgabentracker"` / `"Expense Tracker"` (`apps/web/messages/de.json:3`, `en.json:3`, gesetzt in `apps/web/src/routes/__root.tsx:25`). In `index.html` fehlen `<title>` und `apple-mobile-web-app-title`. iOS nimmt für das Home-Screen-Icon standardmäßig den `<title>` (laut Apples archivierter Doku, siehe unten). Bitte einen Namen festlegen (siehe offene Fragen) und ihn in `name`, `short_name` (≤ 12 Zeichen), einem statischen `<title>` und `<meta name="apple-mobile-web-app-title">` verwenden.
5. **Manifest vervollständigen:** `id: "/"`, `start_url: "/"`, `scope: "/"`, `lang: "de"`, `dir: "ltr"`. Ohne `id` dient `start_url` als Identität, und eine spätere Änderung an `start_url` kann die installierte App "verwaisen".
6. **Icons überarbeiten:** Die aktuellen Icons zeigen ein türkises Dollarzeichen auf transparentem Kreis (`apps/web/public/android-chrome-512x512.png`), während die App in EUR rechnet und MD3-Blau nutzt. Für Android sollte es ein eigenes `purpose: "maskable"`-Icon geben (vollflächig, Motiv im 40-%-Radius-Kreis), sonst setzt Android das `any`-Icon auf einen weißen Hintergrund. Optional `purpose: "monochrome"` für Themed Icons (Wirkung in Chrome nicht bestätigt, schadet aber nicht). Das `apple-touch-icon.png` sollte nicht transparent sein.
7. **Optional: `theme-color` zur Laufzeit synchronisieren**, damit die Statusleiste beim Scrollen wie die `TopAppBar` auf `surface-container` wechselt (`#EEEDF4` / `#1E1F25`). Das HTML-Spec verlangt, dass Browser auf Änderungen an `content`/`media` reagieren.
8. **Optional: `screenshots` und `description`** für das "Richer Install UI" in Chrome.

Ein Asset-Generator (`@vite-pwa/assets-generator`, oder `pwaAssets` in `vite-plugin-pwa`) kann die Icon-Varianten aus einem SVG erzeugen, siehe unten.

## Entscheidungen (2026-11-22)

Die offenen Fragen unten sind geklärt; Umsetzung in [#482](https://github.com/jgoedde/Finances/issues/482):

1. Name überall "Finances" (`name`, `short_name`, `<title>`, `apple-mobile-web-app-title`, Messages `app_name`/`page_title`).
2. Name nicht lokalisiert. Manifest-Basis Englisch (`lang: "en"`), `description_localized.de` für Deutsch.
3. `theme_color`/`background_color` = `surface` (`#FAF8FF`); Meta `theme-color` light `#FAF8FF`, dark `#121318`.
4. Laufzeit-Sync mit der `TopAppBar` beim Scrollen (`surface` ↔ `surfaceContainer`), als zweiter Schritt.
5. Kein In-App-Theme-Schalter.
6. Heller Splash im Dark Mode akzeptiert.
7. Kein neues Motiv; nur ein `maskable`-Icon und ein deckendes `apple-touch-icon` aus dem bestehenden Motiv.
8. Kein `status-bar-style`, keine iOS-Startbilder (kein iPhone zum Testen).
9. `.webmanifest` mit `Cache-Control: no-cache`.
10. `screenshots` aus `docs/screenshots` (verkleinert als WebP, nicht precacht): 4× `narrow`, 1× `wide`.

## Ist-Zustand

### Manifest

- `apps/web/vite.config.ts:42-60`: `VitePWA({ registerType: "prompt", manifest: false, ... })`. Kommentar Zeile 44: `// Manifest is shipped separately.` `vite-plugin-pwa` erzeugt also kein Manifest und injiziert keine Icons oder `theme-color`. `includeAssets` (Zeile 45-49) nennt nur Favicons und `apple-touch-icon.png`; die Android-Icons und das Manifest werden über `globPatterns` (Zeile 51-53, `png`, `json`) precached. Die Endung `.webmanifest` fehlt in `globPatterns` (für das Manifest selbst irrelevant, weil der Browser es ohnehin vom Netz lädt; nur zur Info).
- Tatsächliches Manifest: `apps/web/public/site.webmanifest` (verlinkt in `apps/web/index.html:26`):
  - `name: "Finances"` (Zeile 2), `short_name: "Finances"` (Zeile 3)
  - `description: "Behalte deine persönlichen Finanzen im Blick."` (Zeile 4, nur Deutsch)
  - `icons` (Zeile 5-16): `android-chrome-192x192.png`, `android-chrome-512x512.png`, ohne `purpose` (also `any`)
  - `theme_color: "#004BAC"` (Zeile 17) = `seed` bzw. `coreColors.primary` in `material-theme.json`, **keine** Schema-Rolle
  - `background_color: "#EEEDF4"` (Zeile 18) = light `surfaceContainer`
  - `display: "standalone"` (Zeile 19)
  - **Fehlt:** `id`, `start_url`, `scope`, `lang`, `dir`, `orientation`, `categories`, `screenshots`, `shortcuts`, `display_override`, `launch_handler`
- Ausgeliefert vom API-Server mit `Cache-Control: public, max-age=86400` (`apps/api/src/http/static.ts:9-10`). Änderungen am Manifest erreichen Clients also bis zu einen Tag später.
- Das Manifest stammt laut Git-Historie unverändert aus `b49c431` (2025-05-19, "add favicon and web app manifest"); es sieht wie die Ausgabe eines Favicon-Generators aus und wurde nie an das spätere MD3-Theme angepasst.

### `index.html`

- `apps/web/index.html:2`: `<html lang="de">` (statisch, unabhängig von der gewählten Sprache)
- Zeile 5-8: Viewport ohne `viewport-fit=cover` (relevant nur, falls man auf iOS `black-translucent` nutzen will)
- Zeile 9-13: `apple-touch-icon` 180×180; Zeile 14-25: Favicons 32/16
- **Fehlt:** `<title>` (wird erst zur Laufzeit von `HeadContent` gesetzt, `apps/web/src/routes/__root.tsx:23-25, 83-84`), `<meta name="theme-color">`, `<meta name="color-scheme">`, `<meta name="description">`, `apple-mobile-web-app-title`, `apple-mobile-web-app-status-bar-style`, `apple-touch-startup-image`
- Zeile 28: `<body class="bg-surface text-on-surface">`

### Icons (`apps/web/public/`)

| Datei | Größe | Befund |
|---|---|---|
| `android-chrome-192x192.png` | 192×192 RGBA | türkiser Kreis (`rgb(21,183,171)`) mit weißem `$`, Ecken transparent |
| `android-chrome-512x512.png` | 512×512 RGBA | dito |
| `apple-touch-icon.png` | 180×180 RGBA | dito, **transparente Ecken** |
| `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico` | | dito |

Keine maskable-, keine monochrome-Variante, kein SVG-Quellbild. Farbe und Motiv (Dollar statt Euro) passen nicht zum MD3-Schema (Primary `#465D91`).

### MD3-Farben

- `apps/web/public/material-theme.json`: `seed: "#004BAC"`; relevante Rollen:

| Rolle | light | dark |
|---|---|---|
| `surface` / `background` | `#FAF8FF` | `#121318` |
| `surfaceContainerLow` | `#F4F3FA` | `#1A1B20` |
| `surfaceContainer` | `#EEEDF4` | `#1E1F25` |
| `surfaceContainerHigh` | `#E8E7EF` | `#282A2F` |
| `primary` | `#465D91` | `#AFC6FF` |
| `primaryContainer` | `#D9E2FF` | `#2D4578` |
| `onSurface` | `#1A1B20` | `#E2E2E9` |

- `apps/web/src/globals.css:21, 38, 40, 55` (light `primary`, `background`, `surface`, `surface-container` in `:root`) und `:66-101` (`.dark`-Block mit denselben Rollen: `:84` background, `:86` surface, `:99` surface-container). Werte identisch mit `material-theme.json` (lowercase).
- `apps/web/src/globals.css:12`: `@custom-variant dark (&:where(.dark, .dark *));`

### Hell/Dunkel-Umschaltung

- `apps/web/src/components/theme-provider.tsx:8-17`: `useColorScheme()` aus `@mantine/hooks` (= `matchMedia("(prefers-color-scheme: dark)")`) setzt `light`/`dark` als Klasse auf `<html>`. **Es gibt keine In-App-Einstellung für das Theme**; das Theme folgt immer dem System. Eingebunden in `apps/web/src/main.tsx:64`.
- Die Klasse wird erst nach dem ersten React-Render gesetzt (in `useEffect`), d. h. vor dem JS-Start gibt es keinen Dark-Mode (betrifft nur den kurzen Moment zwischen Splash und App).
- Kein Code liest oder schreibt `meta[name="theme-color"]` (grep über `apps/web/src`, keine Treffer).
- `TopAppBar` wechselt beim Scrollen von `bg-surface` zu `bg-surface-container` (`apps/web/src/components/ui/top-app-bar.tsx:27-35`).

### Sprache

- `apps/web/src/i18n.ts:13-30`: Sprache aus `localStorage` (`finances-locale`) oder Browser-Sprache (`de*` → Deutsch, sonst Englisch), pro Gerät. Das Manifest ist statisch und einsprachig (Deutsch, `site.webmanifest:4`).

### Woher kommt "Web-App"?

Im Repo gibt es den String nicht (`git log -S'Web-App'`, grep in `messages/`, `index.html`). Vermutungen, **nicht verifiziert**:
- iOS: Beim "Zum Home-Bildschirm" schlägt Safari einen Namen vor (laut Apples alter Doku den `<title>`, siehe unten); `index.html` hat statisch keinen `<title>`. Ob iOS 26 den Manifest-`name` bevorzugt, konnte ich in keiner Primärquelle finden.
- Android/Desktop: Ein vor längerer Zeit installierter WebAPK behält Name/Icon, bis Chrome ein Update anwendet; Namens- und Icon-Änderungen gelten seit Chrome 144 als sicherheitsrelevant und brauchen eine Bestätigung durch den Nutzer (siehe unten).
- Empfehlung: Auf dem betroffenen Gerät prüfen, wo genau "Web-App" erscheint (Home-Screen-Beschriftung, Task-Switcher, Installationsdialog), und ggf. neu installieren.

## Erkenntnisse nach Thema

### `name`, `short_name`, `description`, `id`, `categories`

- `name` ist der volle Name; `short_name` wird genutzt, wo der Platz nicht reicht, z. B. unter dem Icon. Welche Stelle welchen Wert nimmt, überlässt die Spec der Implementierung. ([W3C Manifest](https://w3c.github.io/manifest/))
- web.dev: `name` erscheint mit dem Icon auf Home-Screen, Launcher, Dock oder Menü; `short_name` unter 12 Zeichen halten. ([web.dev Learn PWA: Web app manifest](https://web.dev/learn/pwa/web-app-manifest))
- `id` identifiziert die App (URL, same-origin mit `start_url`); fehlt sie, gilt `start_url` als Fallback, und eine geänderte `start_url` kann dazu führen, dass die installierte App nicht wiedererkannt wird. ([W3C Manifest](https://w3c.github.io/manifest/), [web.dev](https://web.dev/learn/pwa/web-app-manifest))
- iOS 16.4+ unterstützt `id`; Nutzer können den Namen beim Hinzufügen ändern; iOS kombiniert Name und Manifest-ID zur Identität. ([WebKit-Blog: Web Push for Web Apps on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/))
- `description` und `screenshots` speisen das "Richer Install UI" (Chrome Android ab 94, Desktop ab 108); ohne Screenshot für den jeweiligen `form_factor` gibt es den alten Dialog. ([Chrome Blog: Richer PWA installation](https://developer.chrome.com/blog/richer-pwa-installation))
- Support (BCD, geprüft 2026-11-22): `name`/`short_name` Chrome 39, Safari 17 (macOS) / iOS 11.3, Firefox nein; `id` Chrome 96, Safari 17 / iOS 16.4; `description` nur Chrome 88+.
- `categories`: Konnte ich in den BCD nicht finden (`manifests/webapp/categories.json` existiert nicht); laut Spec nur ein Hinweis für Stores. Nicht weiter verifiziert, geringe Priorität.

### Lokalisierter Name

- Manifest `lang` setzt die Sprache der lokalisierbaren Texte, `dir` deren Richtung. ([W3C Manifest](https://w3c.github.io/manifest/))
- Neu: `*_localized`-Member (`name_localized`, `short_name_localized`, `description_localized`, `icons_localized`, auch in `shortcuts`). Werte sind Strings oder `{ value, lang, dir }`; Schlüssel sind BCP-47-Tags; ohne Treffer gilt der Basiswert. ([Chrome Blog: Manifest localization](https://developer.chrome.com/blog/manifest-localization), [W3C Manifest](https://w3c.github.io/manifest/), [MDN *_localized](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/*_localized))
- Support (BCD `manifests/webapp/localized_members.json`, geprüft 2026-11-22): **Chrome 148 Desktop**; Chrome Android **nein**; Safari/iOS nein; Firefox nein. Auf dem Handy bringt es heute also nichts, schadet aber nicht (Fallback auf `name`).
- Wichtig: Die Sprache wird nach der **Browser-Sprache** gewählt, nicht nach der In-App-Einstellung `finances-locale`. ([Chrome Blog](https://developer.chrome.com/blog/manifest-localization))
- Beispiel:
  ```json
  "lang": "de",
  "name": "Ausgabentracker",
  "name_localized": { "en": "Expense Tracker" }
  ```

### `theme_color` und `<meta name="theme-color">`

- `theme_color` ist die Standardfarbe der App-UI; Browser können sie für Toolbar, Adressleiste, Statusleiste und Task-Switcher verwenden, vor allem in `standalone`. Farbe muss deckend sein. ([MDN theme_color](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color))
- web.dev: Theme-Farbe = Titelleiste auf Desktop, Statusleiste auf Mobilgeräten. ([web.dev Learn PWA: App design](https://web.dev/learn/pwa/app-design))
- **Vorrang:** Die Spec erlaubt dem Browser, `theme_color` auf Seiten im Scope per `<meta name="theme-color">` zu überschreiben; das Meta-Tag gewinnt also. ([W3C Manifest](https://w3c.github.io/manifest/), [MDN theme_color](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color))
- **`media`-Attribut:** Erlaubt für `theme-color` (z. B. `(prefers-color-scheme: dark)`); Elemente mit nicht passendem `media` werden übersprungen; der `media`-Wert muss unter den `theme-color`-Metas eindeutig sein. ([WHATWG HTML §meta theme-color](https://html.spec.whatwg.org/multipage/semantics.html#meta-theme-color), [MDN meta theme-color](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color))
- **Dynamische Updates:** Der Browser muss die Theme-Farbe neu bestimmen, wenn ein `theme-color`-Meta eingefügt/entfernt wird, sich `name`/`content`/`media` ändert oder sich das Ergebnis der Media Query ändert. ([WHATWG HTML](https://html.spec.whatwg.org/multipage/semantics.html#meta-theme-color)) Damit ist eine Synchronisierung per JS (z. B. beim Scrollen) spec-konform. Ob jeder Browser im installierten Modus die Statusleiste live nachzieht, habe ich nicht in einer Primärquelle belegt gefunden; bitte auf Gerät testen.
- Support (BCD, geprüft 2026-11-22):
  - Meta `theme-color`: Chrome Android 92 (voll; davor in nativem Dark Mode nur für installierte PWAs), Chrome Desktop 73 **nur für installierte PWAs**, Safari/iOS 15 (**ab Safari 26 nur noch für installierte Web-Apps**), Samsung Internet 6.2, Firefox nein. Ein eigenes `media`-Subfeature führen die BCD nicht.
  - Manifest `theme_color`: Chrome 46, Safari 17 (macOS), iOS 15, Firefox nein.
- **Dark Mode im Manifest:** Der Vorschlag `user_preferences` (`color_scheme_dark`, später `color_scheme: { dark: … }`, dann media-query-basiert) lief als Origin Trial in Chrome Desktop (M99-M104, v2 M109-M114) und wurde **nicht ausgeliefert**; Google ließ ihn "mangels Interesse" auslaufen. ([WICG Explainer](https://github.com/WICG/manifest-incubations/blob/gh-pages/user-preferences-explainer.md), [TAG Review #696](https://github.com/w3ctag/design-reviews/issues/696), [blink-dev: Intent to Experiment v2](https://groups.google.com/a/chromium.org/g/blink-dev/c/1uKxZUFUQsU)) Stand 2026-11-22: keine Dark-Mode-Farben im Manifest; der Weg ist `<meta name="theme-color" media=…>`.
- Der Explainer nennt selbst als offene Frage, wie Apps mit eigener In-App-Theme-Einstellung das mitteilen sollen. ([WICG Explainer](https://github.com/WICG/manifest-incubations/blob/gh-pages/user-preferences-explainer.md)) Für diese App aktuell egal, weil sie dem System folgt (`theme-provider.tsx:9`); falls später ein In-App-Schalter kommt, müssen die Meta-Tags per JS ersetzt werden (ein Tag ohne `media` mit der aktiven Farbe).

### Welche MD3-Rolle für `theme_color` / `background_color`?

- MD3 auf Android: Top-App-Bar-Container `?attr/colorSurface`, beim Scrollen (`liftOnScroll`) `?attr/colorSurfaceContainer`. Bei Edge-to-Edge ist die Statusleiste transparent und zeigt die App-Bar-Farbe; bei tonalen Flächen soll der Statusleisten-Vordergrund `colorSurface` sein. ([material-components-android TopAppBar.md](https://github.com/material-components/material-components-android/blob/master/docs/components/TopAppBar.md)) Die m3.material.io-Seite (Top app bar specs) ließ sich nicht maschinell lesen (JS-gerendert); die Aussage stützt sich auf die offizielle MDC-Android-Doku.
- Die `TopAppBar` hier macht genau das (`top-app-bar.tsx:35`). Also: `theme_color` = `surface` (`#FAF8FF` / dark `#121318`), beim Scrollen optional `surfaceContainer` (`#EEEDF4` / `#1E1F25`).
- `background_color` ist nur die Ladefarbe, bevor das Stylesheet verfügbar ist, und darf danach nicht mehr verwendet werden. ([W3C Manifest](https://w3c.github.io/manifest/)) Da der Body `bg-surface` ist: `background_color` = `surface` `#FAF8FF`. Weil das Manifest keine Dark-Variante kennt, sehen Dark-Mode-Nutzer beim Start kurz einen hellen Splash; das ist aktuell nicht lösbar (siehe `user_preferences` oben). Alternative: eine neutrale Mitte wählen (offene Frage).
- `primary`/Seed als `theme_color` wäre MD2-Stil (farbige App Bar) und passt nicht zur MD3-Baseline mit Surface-App-Bar.

### Splash-Screen

- **Android/Chrome:** Splash wird automatisch aus Manifest-Werten erzeugt. MDN: `name`, `background_color`, `icons` ([MDN Manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)); web.dev nennt `theme_color`, `background_color` und Icon ([web.dev](https://web.dev/learn/pwa/web-app-manifest)). Die Quellen widersprechen sich leicht beim Namen; in der Praxis wird `name` unter dem Icon angezeigt (nur durch Sekundärquellen belegt). Ein 512er-Icon ist empfohlen. Chrome Desktop zeigt keinen Splash (nur Sekundärquelle).
- BCD: `background_color` nur Chrome 46+, **Safari/iOS nein**.
- **iOS:** `apple-touch-startup-image` existiert; ohne zeigt iOS einen Screenshot des letzten Starts. ([Apple Safari Web Content Guide, archiviert, Stand 2016](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)) Für jede Geräteauflösung braucht man ein eigenes Bild mit Media Query; das ist aufwendig. Aktuelle Apple-Doku dazu nicht gefunden: **nicht verifiziert**, ob das in iOS 26 noch gilt. Empfehlung: weglassen, solange es nicht stört.

### iOS-spezifisch

- iOS 26: Jede zum Home-Bildschirm hinzugefügte Seite öffnet standardmäßig als Web-App; "es gibt keine Anforderungen an die Installierbarkeit" mehr; Manifest-Werte (z. B. Icons) werden weiter genutzt; der Name ist im Dialog editierbar. ([WebKit: Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/))
- `apple-touch-icon` hat Vorrang vor den Manifest-Icons. ([WebKit-Blog 13878](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)); BCD: Manifest-Icons nur, wenn kein `apple-touch-icon` da ist und `purpose` `any` ist.
- `apple-mobile-web-app-title`: Titel des Home-Screen-Icons, sonst `<title>`. ([Apple, archiviert 2016](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)) Ob iOS 17+/26 stattdessen den Manifest-`name` vorschlägt, ist in Primärquellen nicht belegt. Weil `index.html` statisch keinen `<title>` hat, empfiehlt sich `apple-mobile-web-app-title` als sicherer Weg.
- `apple-mobile-web-app-status-bar-style`: `default` (normal, Inhalt unter der Leiste), `black`, `black-translucent` (Inhalt unter der Leiste, braucht dann `viewport-fit=cover` und `env(safe-area-inset-top)`). Wirkt nur mit `apple-mobile-web-app-capable`. ([Apple Safari HTML Reference, archiviert](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)) Wie sich `theme-color` und `status-bar-style` in iOS 26 gegenseitig beeinflussen, ist **nicht verifiziert**. Empfehlung: Tag weglassen (= `default`) und `theme-color` wirken lassen, auf einem iPhone testen.
- Transparente `apple-touch-icon`s: Apples alte Doku sagt dazu nichts; web.dev rät allgemein zu nicht-transparenten Icons, da Systeme Transparenz mit einer unkontrollierbaren Farbe füllen. ([web.dev](https://web.dev/learn/pwa/web-app-manifest)) Das `apple-touch-icon.png` sollte daher vollflächig sein (z. B. `primaryContainer` `#D9E2FF` oder `surface` als Hintergrund).

### Icons

- `purpose`: `any` (Standard), `maskable` (Safe Zone, außen wird ggf. abgeschnitten), `monochrome` (nur Alphakanal, mit Volltonfarbe gefüllt). ([MDN icons](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons))
- Maskable: Safe Zone = Kreis mit 40 % der Breite als Radius; `any`-Icons werden auf Android auf weißen Hintergrund gesetzt; **getrennte** Einträge statt `"any maskable"`. Prüfen mit Chrome DevTools (Application → Manifest) oder maskable.app. ([web.dev: Maskable icons](https://web.dev/articles/maskable-icon), [vite-plugin-pwa: Minimal requirements](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html))
- Größen: mindestens 512; zusätzlich 192 (Pflicht laut vite-plugin-pwa), optional 384/1024; maskable ≥ 512. ([web.dev](https://web.dev/learn/pwa/web-app-manifest))
- Monochrome / Android Themed Icons: Laut Manifest-Editor Matt Giuca (2023) genau dafür gedacht, aber für Haupt-App-Icons von keinem Browser umgesetzt (nur Shortcut-Icons auf Android). ([w3c/manifest Diskussion, Mai 2023](https://lists.w3.org/Archives/Public/public-webapps-github/2023May/0827.html)) Aktuelle Chrome-Unterstützung für Themed Icons: **nicht verifiziert** (nur widersprüchliche Sekundärquellen). Unbekannte/ungenutzte Purposes werden ignoriert, also unschädlich.
- Icon-Updates bei installierten Apps: Seit Chrome 144 werden die meisten Manifest-Änderungen sofort übernommen; **Name und Icon** gelten als sicherheitsrelevant und erscheinen als "App-Update prüfen" im Menü (Icon-Änderungen < 10 % Pixelunterschied automatisch). ([Chrome Blog: A better way to update your web apps](https://developer.chrome.com/blog/improvements-to-web-app-updates)) Für einen neuen Namen/ein neues Icon also ggf. Nutzerbestätigung oder Neuinstallation einplanen. Hinzu kommt der eintägige HTTP-Cache auf dem Manifest (`apps/api/src/http/static.ts:9-10`).
- `shortcuts` (z. B. "Neue Ausgabe"): Chrome Android 84, Chrome Desktop 96, Safari macOS 17.4, iOS nein (BCD, geprüft 2026-11-22).
- `screenshots` mit `form_factor` (`narrow`/`wide`) für das Richer Install UI, siehe oben. Die genauen `form_factor`-Werte nennt der Chrome-Artikel nicht; die BCD-Datei für `screenshots` existiert nicht, daher Support **nicht verifiziert**.

### `display`, `display_override`, `orientation`, `launch_handler`

- `display: "standalone"` ist korrekt und wird überall unterstützt (Chrome 39, iOS 11.3, Safari 17). `fullscreen`/`minimal-ui` nur Chrome. (BCD, geprüft 2026-11-22)
- `display_override` (Chrome 89): `window-controls-overlay` (Chrome Desktop 105) lässt die App in die Titelleiste zeichnen; `tabbed` (126). Für diese mobile-first App ist WCO nur sinnvoll, wenn die `TopAppBar` die Titelleisten-Fläche (CSS `env(titlebar-area-*)`) berücksichtigt; geringe Priorität. Mit `theme_color` = `surface` sieht die normale Titelleiste auf Desktop schon wie eine MD3-App-Bar aus.
- `orientation` (nur Chrome): z. B. `"portrait"` würde Tablets/Desktop einschränken; die App hat ein Medium-Window-Layout (`apps/web/src/hooks/use-is-medium-window.ts`), daher **nicht** setzen.
- `launch_handler: { "client_mode": "navigate-existing" }` (Chrome 110) verhindert mehrere Fenster bei Desktop-Starts; optional.

### vite-plugin-pwa

- Mit `manifest: false` liefert man das Manifest selbst aus `public/`; `$schema` im Manifest gibt IDE-Autocomplete. ([vite-plugin-pwa: Minimal requirements](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html)) Alternativ kann das Plugin das Manifest generieren (`manifest: { ... }`), dann wird es als `manifest.webmanifest` erzeugt und verlinkt (Umstieg würde den Dateinamen ändern; Chrome rät, Name und Ort des Manifests nicht zu ändern: [web.dev: Manifest updates](https://web.dev/articles/manifest-updates)). Empfehlung: beim statischen `site.webmanifest` bleiben.
- Das Plugin empfiehlt ein `theme-color`-Meta, das zum Manifest-`theme_color` passt. ([Minimal requirements](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html))
- `@vite-pwa/assets-generator` erzeugt aus einem (am besten SVG-)Bild Favicons, 64/192/512 `any`, 512 `maskable`, 180 Apple-Icon; Preset `minimal-2023`, Hintergrundfarben konfigurierbar. Apple-Splash-Screens erwähnt die Seite nicht. ([Assets Generator](https://vite-pwa-org.netlify.app/assets-generator/))
- `pwaAssets` (experimentell, ab v0.19): generiert Assets beim Build, injiziert Head-Links und `theme-color` aus dem Manifest. Ob das mit `manifest: false` funktioniert, sagt die Doku nicht. ([Integrations](https://vite-pwa-org.netlify.app/assets-generator/integrations.html)) Installiert ist `vite-plugin-pwa` 2.0.0 (`apps/web/package.json:86`). Einfachster Weg: den Generator einmalig per CLI laufen lassen und die PNGs committen, statt `pwaAssets` einzubinden. Er injiziert außerdem nur **ein** `theme-color` ohne `media`, die Light/Dark-Tags müssen ohnehin von Hand in `index.html`.

### Vorschlag für das Manifest (Zielbild)

Namen sind Platzhalter, bis die offene Frage geklärt ist.

```json
{
    "$schema": "https://json.schemastore.org/web-manifest-combined.json",
    "id": "/",
    "start_url": "/",
    "scope": "/",
    "lang": "de",
    "dir": "ltr",
    "name": "Ausgabentracker",
    "short_name": "Ausgaben",
    "name_localized": { "en": "Expense Tracker" },
    "short_name_localized": { "en": "Expenses" },
    "description": "Behalte deine persönlichen Finanzen im Blick.",
    "description_localized": { "en": "Keep track of your personal finances." },
    "icons": [
        { "src": "/pwa-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
        { "src": "/pwa-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
        { "src": "/maskable-icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
        { "src": "/monochrome-icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "monochrome" }
    ],
    "theme_color": "#FAF8FF",
    "background_color": "#FAF8FF",
    "display": "standalone"
}
```

Die `en`-Beschreibung ist ein Übersetzungsvorschlag. Ob der `$schema`-URL die `*_localized`-Member schon kennt, ist nicht geprüft.

`index.html` (Ergänzungen im `<head>`):

```html
<title>Ausgabentracker</title>
<meta name="description" content="Behalte deine persönlichen Finanzen im Blick." />
<meta name="color-scheme" content="light dark" />
<meta name="theme-color" content="#FAF8FF" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#121318" media="(prefers-color-scheme: dark)" />
<meta name="apple-mobile-web-app-title" content="Ausgaben" />
```

Optionaler Laufzeit-Sync (Skizze, nicht implementiert): In `ThemeProvider` bzw. `TopAppBar` beide `theme-color`-Metas durch eins ohne `media` ersetzen, dessen `content` `getComputedStyle(document.documentElement).getPropertyValue("--md-sys-color-surface")` bzw. `-surface-container` (gescrollt) ist.

## Offene Fragen / Entscheidungen für den Nutzer

1. **Welcher Name?** "Finances" (Manifest, Repo-Name) oder "Ausgabentracker"/"Expense Tracker" (UI-Titel)? Und welcher `short_name` (≤ 12 Zeichen; "Ausgabentracker" hat 15)?
2. **Namen lokalisieren?** `name_localized` wirkt heute nur in Chrome/Edge 148+ **Desktop**, nicht auf Android/iOS, und richtet sich nach der Browser-Sprache, nicht nach der In-App-Sprache. Alternative: einen sprachneutralen Namen wählen.
3. **`theme_color`: `surface` oder `surfaceContainer`?** `surface` passt zur ungescrollten App Bar (Empfehlung); `surfaceContainer` (`#EEEDF4`/`#1E1F25`) passt zur gescrollten App Bar und zur Navigation Bar, falls diese `surface-container` nutzt (nicht geprüft). Oder `primary` (`#465D91`) für eine sichtbare Markenfarbe, was aber vom MD3-Baseline-Look abweicht.
4. **Dynamischer `theme-color`-Sync** beim Scrollen und ggf. pro Route (Sheets, Dialoge mit Scrim)? Mehr Aufwand, aber "nahtlos" wie native MD3-Apps. Auf Android und iOS testen.
5. **In-App-Theme-Schalter?** Aktuell folgt das Theme nur dem System. Falls ein Schalter kommt, müssen die `theme-color`-Metas per JS gesetzt werden; der Splash bleibt systemabhängig hell (`background_color` hat keine Dark-Variante).
6. **Dark-Mode-Splash:** Heller Splash (`#FAF8FF`) blitzt im Dark Mode kurz auf. Akzeptieren, oder eine mittlere Farbe wählen (wirkt in beiden Modi weniger passend)?
7. **Neues Icon:** Motiv (Euro statt Dollar? Wallet? Material Symbol?) und Farben aus dem Schema, z. B. `primary` `#465D91` auf `primaryContainer` `#D9E2FF`. Am besten als SVG-Quelle, damit `@vite-pwa/assets-generator` alle Varianten erzeugen kann.
8. **iOS-Startbilder und `status-bar-style`:** Auf einem echten iPhone mit iOS 26 testen, ob `theme-color` die Statusleiste färbt; erst dann über `apple-mobile-web-app-status-bar-style`/`apple-touch-startup-image` entscheiden.
9. **Manifest-Cache:** `max-age=86400` auf `.webmanifest` (`apps/api/src/http/static.ts:9`) verzögert Änderungen um bis zu einen Tag; ggf. für `.webmanifest` auf `no-cache` gehen.

### Nicht aus Primärquellen verifiziert

- Woher die Bezeichnung "Web-App" auf dem Gerät des Nutzers stammt.
- Ob iOS 26 den Manifest-`name` oder den `<title>` als Home-Screen-Namen vorschlägt; Verhalten von `theme-color` vs. `apple-mobile-web-app-status-bar-style` in iOS 26; ob `apple-touch-startup-image` noch nötig ist.
- Ob Chrome Android `monochrome`-Icons für Themed Icons nutzt.
- Ob installierte PWAs Laufzeitänderungen an `theme-color` sofort in der Statusleiste zeigen (Spec verlangt es, Browser-Verhalten nicht belegt).
- Dass Android den `name` auf dem Splash-Screen zeigt (MDN ja, web.dev nennt stattdessen `theme_color`).
- m3.material.io-Seiten waren nicht maschinell lesbar; MD3-Farbrollen stammen aus der offiziellen material-components-android-Doku.
- Browser-Support für `screenshots`, `categories`, `lang`, `dir` (keine BCD-Dateien vorhanden).
