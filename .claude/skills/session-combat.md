# Session Combat Skill

Crea e gestisce tracker di combattimento durante gli scontri, mantenendo traccia di iniziativa, HP, condizioni e turni.

## Comportamento

Quando l'utente invoca `/session-combat [azione]`, supporta queste azioni:

### `/session-combat start [nome-scontro]`

Inizia un nuovo tracker di combattimento:

1. **Creare il file tracker**: Genera `sessions/giorno-N-combattimento-tracker.md` con struttura:
   ```markdown
   # Tracker Combattimento - [Nome Scontro]

   **Data:** YYYY-MM-DD
   **Sessione:** N
   **Luogo:** [da sessione corrente]

   ## Ordine di Iniziativa

   | Iniziativa | Nome | HP | HP Max | CA | Condizioni | Note |
   |------------|------|-----|--------|-----|------------|------|
   | | | | | | | |

   ## Turno Corrente: 1

   ### Turno 1

   ## Mappa / Posizioni

   ```

2. **Chiedere partecipanti**: Usa AskUserQuestion per raccogliere:
   - Nomi dei PG partecipanti (con link ai loro file)
   - Nemici (nome e numero)
   - Iniziativa di ciascuno (opzionale, può essere aggiunta dopo)

3. **Popolare la tabella**: Ordina per iniziativa e crea le righe

### `/session-combat update [modifiche]`

Aggiorna il tracker corrente:

```bash
/session-combat update Daron: -12 HP, prono
/session-combat update Goblin-2: morto
/session-combat update Turno 3
```

1. **Parsare il comando**: Identifica il tipo di update (HP, condizioni, turno)
2. **Modificare il tracker**: Usa `Edit` per aggiornare la tabella o le note
3. **Confermare**: Mostra brevemente cosa è cambiato

### `/session-combat end`

Finalizza il combattimento:

1. **Leggere il tracker**: Analizza l'esito dello scontro
2. **Calcolare XP**: Basandoti sui nemici sconfitti (opzionale, chiedi conferma)
3. **Aggiungere alla sessione**: Usa `/session-note` automaticamente per registrare l'evento
4. **Archiviare il tracker**: Conferma che il tracker è completo

## Esempio Output

```
⚔️ Tracker combattimento creato!

File: sessions/giorno-5-combattimento-tracker.md

Ordine iniziativa:
1. Finnegan (18)
2. Bandito Capo (16)
3. Daron (14)
4. Banditi x3 (12)
5. Alan (10)
6. Polgara (8)

Usa `/session-combat update` per aggiornare durante lo scontro.
```

## Note Tecniche

- Se esiste già un tracker aperto per la sessione corrente, chiedi se continuare quello o crearne uno nuovo
- Supporta formato flessibile per gli update (parsing intelligente)
- Integra con i file PG in `characters/pcs/` per recuperare CA e HP max automaticamente quando possibile
- NON chiamare agenti - deve essere velocissimo per uso in sessione live
- Alla fine del combattimento, considera se chiamare consequence-weaver se lo scontro ha avuto esiti significativi (chiedere all'utente)
