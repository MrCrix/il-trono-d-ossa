# Session Note Skill

Aggiunge rapidamente note, eventi o decisioni alla sessione corrente senza dover aprire manualmente il file.

## Comportamento

Quando l'utente invoca `/session-note [testo]`, devi:

1. **Trovare la sessione corrente**: Identifica l'ultima sessione nella directory `sessions/` (il file più recente con pattern `*-sessione-*.md`)
2. **Analizzare il tipo di nota**: Basandoti sul testo fornito, determina se è:
   - Un evento principale (da aggiungere sotto "Eventi Principali")
   - Una decisione del gruppo (da aggiungere sotto "Decisioni Chiave")
   - Una conseguenza (da aggiungere sotto "Conseguenze > Aperte")
   - Una nota generica per il DM (da aggiungere sotto "Note DM")
3. **Aggiungere la nota**: Usa `Edit` per inserire il testo nella sezione appropriata
4. **Confermare**: Mostra brevemente dove è stata aggiunta la nota

## Utilizzo

```bash
/session-note I giocatori hanno deciso di aiutare Ralen Thorn a recuperare lo scrigno
/session-note Combattimento con banditi sulla strada - 5 nemici sconfitti
/session-note Alan ha trovato una lettera misteriosa su uno dei banditi
```

## Esempio Output

```
✅ Nota aggiunta a Decisioni Chiave:
"I giocatori hanno deciso di aiutare Ralen Thorn a recuperare lo scrigno"

File: sessions/2026-02-21-sessione-4.md
```

## Note Tecniche

- Se non c'è una sessione aperta, suggerisci di usare `/session-start`
- Usa euristiche semplici per classificare le note:
  - Parole chiave "deciso", "scelto" → Decisioni
  - Parole chiave "combattimento", "scontro", "battaglia" → Eventi con possibile richiamo a `/session-combat`
  - Parole chiave "conseguenza", "risultato" → Conseguenze
  - Default → Note DM
- NON chiamare agenti in questo comando - deve essere velocissimo per uso in sessione live
