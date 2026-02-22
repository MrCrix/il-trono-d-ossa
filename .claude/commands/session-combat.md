Gestisci tracker di combattimento per gli scontri durante la sessione D&D.

**Comandi disponibili:**

## `/session-combat start [nome-scontro]`

Crea un nuovo tracker di combattimento:

1. Identifica la sessione corrente (ultimo file in `sessions/*-sessione-*.md`)

2. Crea il file `sessions/combattimento-[nome-scontro].md` con questa struttura:
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

3. Usa AskUserQuestion per raccogliere:
   - Nomi dei PG partecipanti
   - Nemici (nome e numero)
   - Iniziativa di ciascuno (opzionale)

4. Popola la tabella ordinata per iniziativa

5. Conferma con un breve riepilogo dell'ordine

## `/session-combat update [modifiche]`

Aggiorna il tracker corrente:

1. Trova l'ultimo file `sessions/combattimento-*.md`

2. Parsa il comando per capire il tipo di update:
   - `[Nome]: -X HP` → Aggiorna HP nella tabella
   - `[Nome]: [condizione]` → Aggiungi condizione (prono, avvelenato, etc.)
   - `[Nome]: morto` → Segna come morto
   - `Turno X` → Incrementa il turno corrente

3. Usa Edit per modificare il tracker

4. Conferma brevemente cosa è cambiato

## `/session-combat end`

Finalizza il combattimento:

1. Leggi il tracker corrente

2. Aggiungi automaticamente una nota alla sessione con `/session-note` descrivendo l'esito dello scontro

3. Chiedi se vuoi calcolare XP (basandoti sui nemici)

4. Se lo scontro ha avuto conseguenze significative, suggerisci di chiamare consequence-weaver

**Importante:** Deve essere velocissimo per uso live - nessun agent durante start/update, solo edit diretti.

**Esempi:**
- /session-combat start Imboscata dei Banditi
- /session-combat update Daron: -12 HP, prono
- /session-combat update Goblin-2: morto
- /session-combat update Turno 3
- /session-combat end
