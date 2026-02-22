# Combat Tracker - Il Trono d'Ossa

Combat tracker interattivo per D&D 5e con supporto real-time e compatibilità CLI.

## Features (FASE 1 - MVP)

✅ **Web App Interattiva**
- Interfaccia Vue.js 3 (via CDN, no build)
- Aggiornamenti real-time via WebSocket
- UI responsive e intuitiva

✅ **Gestione Combattimento**
- Inizializza encounter da file markdown
- Tracker iniziativa con ordine automatico
- Applica danno/cura con aggiornamento istantaneo
- Next/Previous turn
- Aggiungi PG durante il combattimento

✅ **Compatibilità CLI**
- File watcher bidirezionale
- Comandi CLI modificano JSON → web app si aggiorna
- Azioni web app → JSON modificato correttamente

✅ **Combat Log**
- Log strutturato eventi
- Timestamp automatico
- Filtri per tipo evento

## Setup

### 1. Installazione Dipendenze

```bash
cd combat-app
npm install
```

### 2. Avvio Server

```bash
npm start
```

Il server sarà disponibile su: **http://localhost:3000**

### 3. Sviluppo (con auto-reload)

```bash
npm run dev
```

## Utilizzo

### Inizializzare Encounter

1. Apri il browser su `http://localhost:3000`
2. Seleziona un encounter dal dropdown
3. Click su "⚔️ Inizia Combattimento"
4. I nemici vengono caricati automaticamente con iniziativa random

### Aggiungere PG

1. Compila il form "Aggiungi PG":
   - Nome (obbligatorio)
   - Iniziativa (obbligatorio)
   - HP (default: 50)
   - CA (default: 15)
2. Click su "➕ Aggiungi"

### Gestione Turni

- **Prossimo Turno**: Click su "Prossimo ➡️" o usa Initiative Tracker
- **Turno Precedente**: Click su "⬅️ Precedente"
- **Seleziona Turno**: Click su un combattente nell'Initiative Tracker

### Applicare Danno/Cura

**Opzione 1: Quick Buttons**
- Click su "⚔️ Danno" sulla card combattente
- Inserisci valore nel prompt
- Conferma

**Opzione 2: Via WebSocket** (per automazione futura)
```javascript
socket.emit('combat:damage', { id: 'combatant-id', amount: 10 });
```

### Condizioni

1. Click su "+ Condizione" sulla card
2. Digita nome condizione
3. Premi Enter

### Reset Combattimento

Click su "🔄 Reset Combattimento" e conferma.

## Compatibilità CLI

Il sistema mantiene compatibilità totale con i comandi bash esistenti:

### Esempio: Danno da CLI

```bash
# Terminal
cd /path/to/dnd
./.claude/commands/combat-cmd.sh damage "Sciami di Corvi Spettrali 1" 8

# Browser: web app si aggiorna automaticamente in real-time
```

### Esempio: Next Turn da Web App

1. Click "Prossimo ➡️" nel browser
2. Terminal: `combat status` mostra round aggiornato

### File Watcher

Il file `combat-state.json` è monitorato automaticamente:
- Modifiche CLI → broadcast WebSocket a tutti i client
- Modifiche web app → salvate su file JSON
- Lock file previene race conditions

## Architettura

```
combat-app/
├── server/
│   ├── index.js              # Express + Socket.IO server
│   ├── services/
│   │   ├── parser.js         # Parse encounter markdown
│   │   ├── state-manager.js  # CRUD JSON con file locking
│   │   └── cli-bridge.js     # Bridge comandi bash (FASE 6)
│   └── websocket/
│       └── handlers.js       # WebSocket event handlers
│
└── public/
    ├── index.html            # Vue app root
    ├── css/styles.css        # Styling
    └── js/
        ├── app.js            # Vue root component
        └── components/
            ├── CombatantCard.js
            ├── InitiativeTracker.js
            ├── ControlPanel.js
            └── CombatLog.js
```

## WebSocket Events

### Client → Server

- `combat:damage` - Applica danno
- `combat:heal` - Cura HP
- `combat:next-turn` - Prossimo turno
- `combat:add-pc` - Aggiungi PG
- `combat:update` - Update combattente
- `combat:add-condition` - Aggiungi condizione

### Server → Client

- `combat:state-changed` - Full state broadcast
- `error` - Errore operazione

## REST API Endpoints

```
GET    /api/encounters              - Lista encounter disponibili
POST   /api/combat/init/:name       - Inizializza encounter
GET    /api/combat/state            - Stato corrente
POST   /api/combat/reset            - Reset

POST   /api/combatant               - Aggiungi combattente
PATCH  /api/combatant/:id           - Modifica combattente
DELETE /api/combatant/:id           - Rimuovi

POST   /api/combat/damage           - Applica danno
POST   /api/combat/heal             - Cura HP
POST   /api/combat/next-turn        - Prossimo turno
POST   /api/combat/prev-turn        - Turno precedente
```

## Prossime Fasi

### FASE 2: UI Interattiva (in sviluppo)
- [ ] Editable fields (click to edit HP, AC, iniziativa)
- [ ] Drag-and-drop riordino iniziativa
- [ ] Modal Stat Block (base)
- [ ] Toggle morto/vivo

### FASE 3: Stat Blocks Completi
- [ ] Parser esteso per abilities, actions, resistenze
- [ ] Modal con stat block completo
- [ ] Abilità speciali e tattiche DM

### FASE 4: Condizioni Avanzate
- [ ] Durata condizioni (N rounds, concentrazione)
- [ ] Auto-decrement su cambio turno
- [ ] 15 condizioni D&D 5e standard

### FASE 5: Polish
- [ ] Temp HP support
- [ ] Death saves tracker
- [ ] Keyboard shortcuts
- [ ] Dark/light theme

### FASE 6: CLI Bridge Completo
- [ ] Invoke bash scripts da API
- [ ] Test integrazione completa

## Troubleshooting

### WebSocket non si connette
- Verifica che il server sia attivo su porta 3000
- Check console browser per errori
- Riavvia server: `npm start`

### Encounter non si carica
- Verifica che il file `.md` esista in `encounters/`
- Check formato header: `### N × Nome (CR X)`
- Check campi `**PF**:` e `**CA**:` nel markdown

### File lock errors
- Chiudi tutti i processi che accedono a `combat-state.json`
- Elimina file `.lock` se presente
- Riavvia server

## Licenza

MIT - Campaign "Il Trono d'Ossa"
