# OIKIO AI Operator Terminal

Retro-henkinen, selainpohjainen tekstiseikkailu, joka auttaa Oikion henkilöstöä
oivaltamaan ja kehittämään omaa tekoälyn käyttötapaa arjessa.

**Tämä ei ole testi tai arviointi.**
Tämä on ohjattu itsereflektio ja kokeilupeli.

---

## 🎯 Tarkoitus

OIKIO AI Operator Terminal on pelillistetty oppimiskokemus, jonka tavoitteena on:

* auttaa tunnistamaan oma nykyinen tapa käyttää tekoälyä
* esitellä toimivampia käytäntöjä (“Oikio-minimi”)
* rohkaista kokeilemaan yhtä pientä muutosta omassa työssä

Kokemus perustuu kuuteen pelikenttään, jotka käsittelevät mm.:

* toistettavaa työskentelyä
* kontekstin antamista
* hallusinoinnin välttämistä
* dialogista promptaamista
* kielimallien valintaa
* projektimaista työskentelyä

---

## 🕹️ Formaatti

* Retro terminal -käyttöliittymä
* Klikattavat valinnat + vapaaehtoiset komentotekstit
* Ei backendia
* Ei kirjautumista
* Ei henkilötietoja

Kaikki sisältö ladataan JSON-tiedostosta.

---

## 📁 Projektirakenne

```text
/assets
├── survey.json        # Pelikenttien sisältö
└── ui-texts.json      # UI-tekstit (suomi + boot EN)

/public/assets         # Staattisesti tarjoiltavat JSON-tiedostot

/src
├── components         # Terminal UI -komponentit
│   ├── TerminalShell.tsx
│   ├── TerminalHistory.tsx
│   └── CommandInput.tsx
├── views              # Näkymät
│   ├── BootView.tsx
│   ├── HubView.tsx
│   ├── FieldView.tsx
│   ├── SummaryView.tsx
│   ├── HelpView.tsx
│   └── ResetView.tsx
├── terminal           # Komentojen parseri ja reititys
│   └── commandRouter.ts
├── state              # localStorage-logiikka
│   ├── storage.ts
│   └── exportData.ts
├── data               # JSON-loaderit
│   ├── loadSurvey.ts
│   └── loadUiTexts.ts
├── types              # TypeScript-tyypit
│   └── index.ts
└── styles             # Terminal-tyylit
    └── terminal.css
```

---

## ▶️ Käynnistys paikallisesti

```bash
npm install
npm run dev
```

Avaa selaimessa:
[http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build

```bash
npm run build
```

Tuotettu build on staattinen ja soveltuu esim.:

* GitHub Pages
* Netlify
* Vercel

---

## ✏️ Sisällön muokkaaminen

Pelikenttien sisältö ja käyttöliittymätekstit sijaitsevat erillisistä JSON-tiedostoissa:

```text
/assets/survey.json      # Pelikenttien sisältö (kysymykset, vaihtoehdot, tulkinnat)
/assets/ui-texts.json    # UI-tekstit (otsikot, painikkeet, ohjeet)
```

### survey.json

Sisältää:
* Pelikenttien otsikot, teemat ja tilannekuvaukset
* A–D vaihtoehdot per kenttä
* Tulkinnat (A_B ja C_D ryhmille)
* Suositukset (Oikio-minimi)
* Kokeilulupausvaihtoehdot

### ui-texts.json

Sisältää:
* Boot-näkymän tekstit (englanti)
* Komento-ohjeet (suomi)
* Hub-näkymän tekstit
* Kentän ja lupauksen otsikot
* Yhteenveto- ja nollausviestit

Voit muokata tekstejä, lisätä kenttiä ja muuttaa kokeilulupauksia ilman koodimuutoksia.

---

## 💾 Tallennus & vienti

Käyttäjän valinnat tallennetaan selaimen `localStorageen`.

Loppuruudussa käyttäjä voi:

* ladata valintansa JSON-tiedostona (export)
* nollata etenemisen (reset)

Tietoja ei lähetetä minnekään.

---

## 🧠 Filosofia

Tekoälyn hyödyntäminen ei ole yksittäinen taito,
vaan tapa työskennellä.

Tämä projekti on osa Oikion jatkuvaa tapaa kehittää
tekoälyyn liittyvää ajattelua ja käytäntöjä.

---

## 📄 Lisenssi

Sisäinen käyttö / Oikio.
