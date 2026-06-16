# MeetCalc

MeetCalc ist ein statischer Meeting-Kostenrechner in purem HTML, CSS und JavaScript. Er zeigt, was ein einzelnes oder wiederkehrendes Meeting kostet, inklusive Overhead-Faktor und Live-Kostenticker.

## Funktionen

- Berechnung nach Teilnehmerzahl, Dauer, Durchschnittsgehalt und Arbeitszeitmodell
- Währung fest auf Euro
- Meeting-Häufigkeit: einmalig, täglich, wöchentlich, 14 Tägig, monatlich
- Overhead-Faktor: 1,0x, 1,3x, 1,5x oder 2,0x
- Ergebniswerte für Meeting-Kosten, Kosten pro Minute, Personenstunden, Jahreskosten und Jahresstunden
- Keine externen Skripte, keine Anmeldung, keine Serverübertragung

## Nutzung

Die Anwendung ist statisch und benötigt keinen Build-Schritt.

```powershell
Start-Process .\index.html
```

Alternativ kann der Ordner mit einem beliebigen statischen Webserver ausgeliefert werden.

## Berechnungslogik

Der durchschnittliche Stundensatz wird aus dem Jahresgehalt abgeleitet:

```text
Stundensatz = Jahresgehalt / (Arbeitsstunden pro Woche * Arbeitswochen pro Jahr) * Overhead
```

Die Meeting-Kosten werden so berechnet:

```text
Meeting-Kosten = Teilnehmer * Stundensatz * Dauer in Stunden
```

Für wiederkehrende Meetings wird der Wert mit der Häufigkeit pro Jahr multipliziert:

- Einmalig: 1
- Täglich: Arbeitswochen pro Jahr * 5
- Wöchentlich: Arbeitswochen pro Jahr
- 14 Tägig: Arbeitswochen pro Jahr / 2
- Monatlich: 12

## Projektstruktur

```text
.
├── index.html
├── styles.css
├── script.js
├── README.md
├── CLAUDE.md
└── LEARN.md
```

## Design

Die visuelle Richtung orientiert sich an lauer.io: klare B2B-Typografie, Blau-/Teal-Akzente, kompakte Karten, sachliche deutsche Texte und eine statische, datensparsame Umsetzung.

## Datenschutz

MeetCalc läuft vollständig lokal im Browser. Eingaben wie Gehalt, Teilnehmerzahl und Meetingdauer werden nicht an einen Server gesendet.
