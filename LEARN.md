# LEARN.md

## 2026-06-16

### Projektstart

- Der Arbeitsordner war leer und noch kein Git-Repository.
- `gh` war lokal verfügbar.
- Die Referenzseite DailyBuddy lieferte die gewünschte Rechnerlogik mit Teilnehmern, Dauer, Jahresgehalt, Währung, Arbeitszeit, Meeting-Häufigkeit, Overhead und Live-Ticker.
- Das Design von lauer.io verwendet eine ruhige B2B-Optik mit Dunkelblau, Hellblau, Teal, Orange-Akzenten, Inter-Schrift und kompakten Karten.

### Entscheidungen

- Keine externen Abhängigkeiten eingebaut, damit die Anwendung direkt als statische Datei läuft.
- Inter wird nicht extern geladen; die CSS-Font-Stack nutzt Inter, falls lokal vorhanden, und fällt sonst auf Systemschriften zurück.
- Meeting-Häufigkeit `täglich` wird als 5 Arbeitstage pro Arbeitswoche interpretiert.

### Fehler und Lösungen

- Beim Commit meldete Git unter Windows, dass LF-Zeilenenden beim nächsten Git-Touch ggf. in CRLF umgewandelt werden. Das ist kein Laufzeitfehler der Anwendung. Für dieses statische Projekt wurde keine `.gitattributes` ergänzt, weil die Warnung die Funktion nicht beeinträchtigt.
