Stai iniziando una nuova sessione di D&D per la campagna "Il Trono d'Ossa".

**Procedura:**

1. Determina il numero della prossima sessione controllando i file in `sessions/` (cerca l'ultima `sessione-N.md` e incrementa N)

2. Chiedi all'utente usando AskUserQuestion:
   - Capitolo della campagna (es: "Preludio", "Atto I - La Chiamata")
   - Luogo principale dove si svolgerà la sessione
   - Giorno in-game (formato: "DD Nome-mese AAAA CV", es: "17 Eleint 1494 CV")
   - Titolo della sessione (opzionale, può essere lasciato vuoto)

3. Leggi il template in `templates/template-sessione.md`

4. Crea un nuovo file `sessions/YYYY-MM-DD-sessione-N.md` sostituendo:
   - La data nel frontmatter con la data di oggi
   - Il numero di sessione
   - Il capitolo
   - Il giorno in-game
   - Il luogo
   - Il titolo (se fornito)

5. Conferma all'utente mostrando:
   ```
   ✅ Sessione N creata: sessions/YYYY-MM-DD-sessione-N.md

   Capitolo: [capitolo]
   Luogo: [luogo]
   Giorno in-game: [giorno]

   Usa /session-note per aggiungere eventi durante il gioco.
   ```

**Importante:** NON chiamare agenti. Questa è un'operazione veloce di setup.
