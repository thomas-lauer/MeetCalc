# CLAUDE.md

## Projektziel

MeetCalc ist ein statischer Meeting-Kostenrechner für deutschsprachige B2B-Nutzer. Das Tool soll Meeting-Kosten schnell sichtbar machen und dabei professionell, ruhig und vertrauenswürdig wirken.

## Technische Vorgaben

- Nur HTML, CSS und JavaScript verwenden.
- Keine Frameworks, Bundler oder externen JavaScript-Abhängigkeiten.
- Die Anwendung muss direkt über `index.html` funktionieren.
- Alle Berechnungen laufen lokal im Browser.
- Keine Tracking-, Analytics- oder Remote-API-Funktionen einbauen.

## Funktionsumfang

Der Rechner soll mindestens diese Eingaben unterstützen:

- Teilnehmer
- Dauer in Minuten
- Durchschnittliches Jahresgehalt
- Währung
- Arbeitsstunden pro Woche
- Arbeitswochen pro Jahr
- Meeting-Häufigkeit
- Overhead-Faktor

Ausgaben:

- Kosten dieses Meetings
- Kosten pro Minute
- Personenstunden
- Durchschnittlicher Stundensatz
- Jahreskosten
- Personenstunden pro Jahr
- Live-Ticker für laufende Kosten

## Designrichtung

Die Oberfläche orientiert sich an `https://www.lauer.io`:

- sachliche deutsche Sprache
- Inter/systemnahe Sans-Serif-Typografie
- Farben rund um Dunkelblau, Hellblau, Teal und sparsame Orange-Akzente
- klare Karten mit maximal 8px Radius
- kompakte, scanbare B2B-Oberfläche
- keine Marketing-Landingpage vor dem Tool; der Rechner ist die erste Hauptansicht

## Qualitätsregeln

- Änderungen klein und nachvollziehbar halten.
- Berechnungen nicht durch UI-Text verstecken; Formeln in README dokumentieren.
- Neue Fehler oder auffällige Einschränkungen in `LEARN.md` dokumentieren.
- Vor größeren Änderungen die bestehende Rechnerlogik prüfen.
- Responsive Verhalten für Mobilgeräte erhalten.

## Manuelle Testfälle

Beispiel:

- Teilnehmer: 5
- Dauer: 60 Minuten
- Jahresgehalt: 55.000 EUR
- Arbeitsstunden/Woche: 40
- Arbeitswochen/Jahr: 47
- Overhead: 1,3x

Erwartung:

- Arbeitsstunden/Jahr: 1.880
- Durchschnittlicher Stundensatz: ca. 38,03 EUR
- Meeting-Kosten: ca. 190,16 EUR
- Wöchentliche Jahreskosten bei 47 Wiederholungen: ca. 8.937 EUR
