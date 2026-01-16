# OIKIO AI Operator Terminal

Retro-henkinen, selainpohjainen tekstiseikkailu, joka auttaa Oikion henkilöstöä
oivaltamaan ja kehittämään omaa tekoälyn käyttötapaa arjessa.

Tämä ei ole testi tai arviointi.
Tämä on ohjattu itsereflektio ja kokeilupeli.

---

## 🎯 Tarkoitus

OIKIO AI Operator Terminal on pelillistetty oppimiskokemus, jonka tavoitteena on:

- auttaa tunnistamaan oma nykyinen tapa käyttää tekoälyä
- esitellä toimivampia käytäntöjä (“Oikio-minimi”)
- rohkaista kokeilemaan yhtä pientä muutosta omassa työssä

Kokemus perustuu kuuteen pelikenttään, jotka käsittelevät mm.:
- toistettavaa työskentelyä
- kontekstin antamista
- hallusinoinnin välttämistä
- dialogista promptaamista
- kielimallien valintaa
- projektimaista työskentelyä

---

## 🕹️ Formaatti

- Retro terminal -käyttöliittymä
- Klikattavat valinnat + vapaaehtoiset komentotekstit
- Ei backendia
- Ei kirjautumista
- Ei henkilötietoja

Kaikki sisältö ladataan JSON-tiedostosta.

---

## 📁 Projektirakenne

/assets
└── survey.json # Pelikenttien sisältö
/src
├── components # Terminal UI -komponentit
├── views # Boot, Hub, Field, Summary
├── terminal # Komentojen parseri ja reititys
├── state # localStorage-logiikka
└── styles # Terminal- ja pixel-tyylit

yaml
Kopioi koodi

---

## ▶️ Käynnistys paikallisesti

```bash
npm install
npm run dev

Avaa selaimessa:
http://localhost:5173

## 🏗️ Build

```npm run build```

Tuotettu build on staattinen ja soveltuu esim.:

GitHub Pages
Netlify
Vercel

## ✏️ Sisällön muokkaaminen*

Kaikki pelikenttien sisältö sijaitsee tiedostossa:


```/assets/survey.json```

Voit:
- muokata tekstejä
- lisätä kenttiä
- muuttaa kokeilulupauksia

Ilman koodimuutoksia.

## 💾 Tallennus & vienti*

Käyttäjän valinnat tallennetaan selaimen localStorageen

Loppuruudussa käyttäjä voi:

ladata valintansa JSON-tiedostona (export)

nollata etenemisen (reset)

Tietoja ei lähetetä minnekään.

## 🧠 Filosofia

Tekoälyn hyödyntäminen ei ole yksittäinen taito,
vaan tapa työskennellä.

Tämä projekti on osa Oikion jatkuvaa tapaa kehittää
tekoälyyn liittyvää ajattelua ja käytäntöjä.

## 📄 Lisenssi

Sisäinen käyttö / Oikio.
---
