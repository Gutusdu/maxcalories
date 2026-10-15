# MAX Calories — PWA-Prototyp

Eine mobile-first Web-App für Kalorien, Makros, Lebensmittelvorräte, Körperprofil, Supplements und Trainingspläne.

## Enthalten
- Tagesübersicht für Kalorien, Protein, Kohlenhydrate und Fett
- Manuelles Erfassen von Mahlzeiten
- Fotoaufnahme eines Nährwertetiketts plus experimentelle OCR (Tesseract.js wird bei Bedarf über CDN geladen)
- Vorratsliste
- Rezeptvorschläge anhand von Vorräten und eingetragenen Vorlieben (regelbasierte Demo, noch kein echtes KI-Modell)
- Körperprofil, Zielwerte und Gewichtsverlauf
- Trainingsplan und Supplementliste
- JSON-Datenexport
- PWA-Manifest und Service Worker

## Lokal testen
Einfach `index.html` im Browser öffnen. Für Installation als PWA und Service Worker muss die App über HTTPS oder localhost laufen.

## Auf GitHub Pages veröffentlichen
1. Repository auf GitHub öffnen.
2. Dateien aus diesem Ordner in das Repository hochladen (nicht nur den ZIP-Ordner als Datei).
3. Unter **Settings → Pages** bei **Build and deployment** `Deploy from a branch` auswählen.
4. Branch `main` und Ordner `/ (root` auswählen und speichern.
5. Nach dem Deployment die angezeigte Pages-URL auf dem iPhone in Safari öffnen.
6. Teilen → **Zum Home-Bildschirm**.

## Wichtige Grenzen des Prototyps
- Daten werden nur im Browser auf dem jeweiligen Gerät gespeichert; es gibt kein Login und keine Synchronisierung.
- OCR ist experimentell. Bitte Nährwerte vor dem Übernehmen mit dem Etikett vergleichen.
- Rezeptvorschläge sind regelbasiert und Beispielwerte sind Näherungen.
- Noch keine echte KI-API, Barcode-/Produktdatenbank, Cloud-Backup oder HealthKit-Integration.
- Keine medizinische Beratung. Tagesziele sollten sinnvoll und individuell gewählt werden.


## Kostenlose Produktdatenbank
Der Barcode-Lookup fragt die öffentliche Open-Food-Facts-API ab. Internetzugriff erforderlich; Produkte können fehlen oder unvollständige/falsche Daten enthalten. Vor dem Tracken Nährwerte mit der Verpackung abgleichen. Der Live-Kamera-Barcode-Scan funktioniert nur in Browsern mit `BarcodeDetector` und HTTPS; ansonsten Barcode manuell eingeben.
