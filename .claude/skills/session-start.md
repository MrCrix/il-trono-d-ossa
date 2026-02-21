# Session Start Skill

Inizia una nuova sessione di gioco creando un file strutturato con tutti i metadati necessari.

## Comportamento

Quando l'utente invoca `/session-start`, devi:

1. **Determinare il numero di sessione**: Controlla la directory `sessions/` per trovare l'ultima sessione registrata e incrementa il numero
2. **Raccogliere informazioni**: Chiedi all'utente (usando AskUserQuestion):
   - Capitolo della campagna (es: "Preludio", "Atto I")
   - Luogo principale della sessione
   - Giorno in-game (formato: "DD Nome-mese AAAA CV")
   - Titolo della sessione (opzionale)
3. **Creare il file sessione**: Usa il template in `templates/template-sessione.md` e crea un nuovo file `sessions/YYYY-MM-DD-sessione-N.md` con:
   - Frontmatter con metadata (data, sessione, capitolo, giorno_in_game, luogo)
   - Sezioni vuote pronte per essere compilate durante il gioco
4. **Confermare**: Informa l'utente che la sessione è pronta e suggerisci di usare `/session-note` per aggiungere note durante il gioco

## Esempio Output

```
✅ Sessione 4 creata: sessions/2026-02-21-sessione-4.md

Capitolo: Preludio
Luogo: Yhaunn
Giorno in-game: 17 Eleint 1494 CV

Usa `/session-note` per aggiungere eventi durante il gioco.
```

## Note Tecniche

- Usa `Read` per leggere il template
- Usa `Glob` pattern `sessions/*-sessione-*.md` per trovare l'ultima sessione
- Usa `Write` per creare il nuovo file
- NON chiamare agenti in questo comando - è un'operazione rapida di setup
