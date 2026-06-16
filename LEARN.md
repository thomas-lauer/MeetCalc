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

### Anpassung nach Feedback

- Währungsauswahl entfernt und Euro als feste Währung gesetzt.
- Live-Ticker-Bereich entfernt.
- Bereich "Für das gleiche Geld" entfernt.
- Beschriftung zunächst von "Alle 2 Wochen" mit geschützten Leerzeichen versehen und anschließend auf "14 Tägig" geändert.
- Beim Entfernen des Live-Tickers blieb kurz ein rekursiver `render()`-Aufruf stehen. Vor dem Browsercheck entdeckt und durch die Ausgabe des Hinweistexts ersetzt.
- Ein Powershell-Bereichsaufruf mit `Select-Object -Index 410..440` war syntaktisch falsch. Korrekt verwendet wurde `Select-Object -Skip 410 -First 40`.
- Während des Browserchecks war der zuvor geladene Browser-Pluginpfad nicht mehr vorhanden, weil die lokale Browser-Pluginversion gewechselt hatte. Der aktuelle Pfad wurde ermittelt und der Browsercheck mit der neuen Version wiederholt.
- Beim Beenden des lokalen Testservers wurde zunächst eine `TimeWait`-Verbindung mit `OwningProcess` 0 erwischt. Der korrigierte Cleanup filterte anschließend auf `-State Listen` und beendete den tatsächlichen Python-Serverprozess.
- Overhead-Labels auf kurze Begriffe geändert: Keiner, Standard, Hoch und Voll. Die Faktoren stehen als Tooltips und `aria-label` an den jeweiligen Optionen.
- Sichtbare Hilfs- und Techniktexte reduziert: Parameter-Überschrift, Browser-/Euro-Hinweis, Footer-Techniktext, Ergebnis-Hinweistext und `(EUR)` im Gehaltslabel entfernt. `Arbeitsstunden/Woche` wurde zu `Wochenstunden`.
