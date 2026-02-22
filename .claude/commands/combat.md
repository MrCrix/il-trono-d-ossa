# Combat Tracker Command

Gestisce il tracking di un combattimento D&D 5e con UI separata nel browser.

## Utilizzo

**Inizializzare un combattimento:**
```bash
/combat [nome-encounter]
```

**Comandi durante il combattimento:**
```bash
.claude/commands/combat-cmd.sh <comando> [parametri]
```

O più semplicemente (se aggiungi alias):
```bash
combat <comando> [parametri]
```

## Alias suggerito

Aggiungi al tuo `~/.zshrc` o `~/.bashrc`:
```bash
alias combat='~/.claude/commands/combat-cmd.sh'
```

Poi ricarica: `source ~/.zshrc`

## Cosa fa

1. **Inizializzazione**: Legge l'encounter dal folder `encounters/`, estrae automaticamente tutti i nemici con HP e CA
2. **Parser intelligente**: Riconosce pattern come "6 × Sciami di Corvi (CR 1/4)" e crea N copie numerate
3. **Iniziativa automatica**: Tira 1d20 per l'iniziativa di ogni mostro all'avvio del combattimento
4. **UI Browser**: Apre automaticamente l'HTML tracker nel browser con:
   - **Tracker iniziativa visuale**: Mostra l'ordine di turno con evidenziazione del combattente attivo
   - **Card compatte**: Design ridotto per visualizzare più combattenti contemporaneamente
5. **Sincronizzazione**: Ogni comando aggiorna il JSON che l'HTML legge automaticamente (ogni 2 secondi)
6. **Persistenza**: Lo stato rimane salvato tra le sessioni

## Comandi disponibili

### Gestione Combattenti
- `combat addpc <nome> <iniziativa> [hp] [ca]` - Aggiungi un PG al combattimento (hp default: 50, ca default: 15)

### Gestione HP
- `combat hp <nome> <valore>` - Imposta HP direttamente
- `combat damage <nome> <danno>` - Applica danno (sottrae da HP)
- `combat heal <nome> <cura>` - Cura HP (non supera il massimo)

### Iniziativa e Turni
- `combat init <nome> <valore>` - Imposta/modifica iniziativa manualmente
- `combat next` - Passa al prossimo turno (auto-incrementa round)
- `combat status` - Mostra stato completo ordinato per iniziativa

### Condizioni e Note
- `combat condition <nome> <condizione>` - Aggiungi condizione (es: Spaventato)
- `combat remove <nome> <condizione>` - Rimuovi condizione
- `combat note <nome> <testo>` - Aggiungi nota personale

### Controllo
- `combat end` - Termina combattimento (chiede conferma)

## Esempi

```bash
# Inizia encounter (i mostri hanno già iniziativa automatica)
/combat processione-carri-vuoti

# Aggiungi PG al combattimento
combat addpc Thorgrim 20 65 18
combat addpc Elara 16 48 15
combat addpc "Kael il Veloce" 22 42 14

# Durante il combattimento
combat damage "Sciame" 8
combat condition "Servitore Vuoto 1" Prono
combat heal Thorgrim 15
combat next

# Mostra stato
combat status
```

## Ricerca Fuzzy

I nomi dei combattenti supportano ricerca parziale case-insensitive:
- `combat damage sciame 8` troverà "Sciame di Corvi Spettrali 1"
- `combat damage serv 5` troverà "Servitore Vuoto 1"

## Template Prompt per Claude

Quando l'utente invoca `/combat`:

1. **Senza parametri**: Esegui `.claude/commands/combat-init.sh` per mostrare lista encounter
2. **Con nome encounter**: Esegui `.claude/commands/combat-init.sh <nome>` per inizializzare
3. **Durante il gioco**: Quando l'utente chiede di fare azioni, usa `.claude/commands/combat-cmd.sh <comando>`

Esempio conversazione:
```
User: /combat processione-carri-vuoti
Assistant: [esegue combat-init.sh] Combattimento iniziato!
          [mostra lista nemici estratti]

User: tutti i corvi hanno iniziativa 15
Assistant: [esegue combat-cmd.sh init "Sciame..." 15 per ognuno]

User: il primo sciame subisce 8 danni
Assistant: [esegue combat-cmd.sh damage "Sciame di Corvi Spettrali 1" 8]
```

## Struttura File

- `.claude/commands/combat-init.sh` - Script di inizializzazione
- `.claude/commands/combat-cmd.sh` - Script comandi interattivi
- `combat-state.json` - Stato corrente (auto-generato)
- `combat-tracker.html` - UI nel browser (statico)

## Formato combat-state.json

```json
{
  "encounter": "processione-carri-vuoti",
  "round": 1,
  "current_turn": 0,
  "combatants": [
    {
      "name": "Sciame di Corvi Spettrali 1",
      "type": "enemy",
      "hp_current": 24,
      "hp_max": 24,
      "ac": 12,
      "initiative": 15,
      "conditions": ["Spaventato"],
      "notes": "Concentrato su Torvin"
    }
  ],
  "log": [
    "Round 1: Sciame di Corvi Spettrali 1 subisce 8 danni (HP: 16)"
  ]
}
```

## Parser Encounter

Il parser cerca automaticamente pattern nel markdown:
- `### N × Nome (CR X)` - Header nemico
- `**PF**: XX` - Hit Points
- `**CA**: XX` - Armor Class

Crea automaticamente N copie numerate del nemico (es: "Nome 1", "Nome 2", ...)

## Note Tecniche

- **Auto-refresh**: L'HTML rilegge il JSON ogni 2 secondi
- **Nessun server**: Tutto locale con file system
- **Git-friendly**: Il JSON è in gitignore (stato volatil), HTML e script sono versionati
- **Cross-platform**: Bash puro + jq (dovrebbe già essere installato)
