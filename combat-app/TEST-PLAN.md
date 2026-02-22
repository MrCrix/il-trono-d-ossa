# Combat Tracker - Piano di Test End-to-End

## Setup Test Environment

### 1. Preparazione
```bash
cd /Users/ctrapattoni/projects/personal/bone/dnd/combat-app
npm install
```

### 2. Avvio Server
```bash
npm start
# oppure
./start.sh
```

**Verifica**: Server attivo su http://localhost:3000

---

## Test Suite FASE 1 (MVP)

### TEST 1: Caricamento Iniziale

**Azioni**:
1. Apri browser: http://localhost:3000
2. Osserva UI

**Risultati Attesi**:
- ✅ Header "Combat Tracker - Il Trono d'Ossa" visibile
- ✅ Encounter name: "In attesa di iniziare..."
- ✅ Round counter: 0
- ✅ Dropdown encounter popolato
- ✅ Empty state: "Nessun combattimento attivo"
- ✅ No errori console

**Status**: [ ]

---

### TEST 2: Inizializzazione Encounter

**Azioni**:
1. Dropdown encounter → seleziona "processione-carri-vuoti"
2. Click "⚔️ Inizia Combattimento"
3. Attendi caricamento

**Risultati Attesi**:
- ✅ Encounter name cambia a "processione-carri-vuoti"
- ✅ Round counter: 1
- ✅ 9 combattenti caricati:
  - 6x Sciami di Corvi Spettrali (HP 24, CA 12)
  - 3x Servitori Vuoti (HP 33, CA 18)
- ✅ Initiative tracker mostra lista ordinata
- ✅ Primo combattente ha ▶ marker
- ✅ Combatant cards renderizzate in grid
- ✅ Combat log: "Combattimento iniziato"

**Status**: [ ]

---

### TEST 3: Aggiungere PG

**Azioni**:
1. Form "Aggiungi PG"
2. Nome: "Thorgrim"
3. Iniziativa: 18
4. HP: 45
5. CA: 17
6. Click "➕ Aggiungi"

**Risultati Attesi**:
- ✅ Thorgrim appare in initiative tracker
- ✅ Posizione corretta (iniziativa 18)
- ✅ Card Thorgrim renderizzata
- ✅ Badge tipo: "👤 PG" (non "💀 Nemico")
- ✅ HP: 45/45
- ✅ CA: 17
- ✅ Combat log: "PG aggiunto: Thorgrim"
- ✅ Form resettato (campi vuoti)

**Status**: [ ]

---

### TEST 4: Applicare Danno

**Azioni**:
1. Trova card "Sciami di Corvi Spettrali 1" (HP 24/24)
2. Click "⚔️ Danno"
3. Prompt: inserisci "10"
4. Conferma

**Risultati Attesi**:
- ✅ HP bar si aggiorna immediatamente
- ✅ HP text: 14/24
- ✅ HP bar color cambia (verde → giallo)
- ✅ Initiative tracker HP aggiornato: 14/24
- ✅ Combat log: "Sciami... subisce 10 danni (HP: 14)"
- ✅ No page refresh

**Status**: [ ]

---

### TEST 5: Applicare Danno Letale

**Azioni**:
1. Sciami di Corvi Spettrali 1 (HP 14/24)
2. Click "⚔️ Danno"
3. Prompt: inserisci "20"
4. Conferma

**Risultati Attesi**:
- ✅ HP: 0/24 (non negativo)
- ✅ HP bar completamente vuota
- ✅ HP bar color: rosso pulsante (animation)
- ✅ Combat log: "... subisce 20 danni (HP: 0)"

**Status**: [ ]

---

### TEST 6: Cura HP

**Azioni**:
1. Sciami di Corvi Spettrali 2 (HP 24/24)
2. Click "⚔️ Danno" → 15
3. HP diventa 9/24
4. Click "✨ Cura" → 8
5. Conferma

**Risultati Attesi**:
- ✅ HP: 17/24
- ✅ HP bar si riempie
- ✅ Color cambia (rosso → giallo)
- ✅ Combat log: "... recupera 8 HP (HP: 17)"

**Status**: [ ]

---

### TEST 7: Cura oltre Massimo

**Azioni**:
1. Thorgrim (HP 45/45)
2. Click "✨ Cura" → 10
3. Conferma

**Risultati Attesi**:
- ✅ HP rimane 45/45 (non supera max)
- ✅ Combat log: "... recupera 10 HP (HP: 45)"

**Status**: [ ]

---

### TEST 8: Next Turn

**Azioni**:
1. Osserva current turn (combattente con ▶)
2. Click "Prossimo ➡️"
3. Osserva cambio

**Risultati Attesi**:
- ✅ ▶ marker si sposta al prossimo
- ✅ Card precedente perde classe "active"
- ✅ Card corrente ottiene classe "active" (border rosso, shadow)
- ✅ Combat log: "Turno di: [nome]"

**Status**: [ ]

---

### TEST 9: Next Turn → Nuovo Round

**Azioni**:
1. Click "Prossimo ➡️" ripetutamente
2. Arriva all'ultimo combattente
3. Click ancora "Prossimo ➡️"

**Risultati Attesi**:
- ✅ Round counter incrementa (1 → 2)
- ✅ ▶ marker torna al primo combattente
- ✅ Combat log: "Inizio round 2"
- ✅ Combat log: "Turno di: [primo combattente]"

**Status**: [ ]

---

### TEST 10: Previous Turn

**Azioni**:
1. Round 2, turno 3
2. Click "⬅️ Precedente"

**Risultati Attesi**:
- ✅ ▶ marker torna indietro di 1
- ✅ Current turn decrementa

**Status**: [ ]

---

### TEST 11: Aggiungere Condizione

**Azioni**:
1. Card "Servitori Vuoti 1"
2. Click "+ Condizione"
3. Input appare
4. Digita "Spaventato"
5. Premi Enter

**Risultati Attesi**:
- ✅ Badge "Spaventato" appare sulla card
- ✅ Badge color: giallo/arancione
- ✅ Input scompare
- ✅ Combat log: "... subisce condizione: Spaventato"

**Status**: [ ]

---

### TEST 12: Toggle Morto

**Azioni**:
1. Card "Sciami di Corvi Spettrali 3"
2. Click "☠️ Uccidi"

**Risultati Attesi**:
- ✅ Button text cambia: "💀 Morto"
- ✅ Card opacity ridotta (50%)
- ✅ Classe "dead" aggiunta
- ✅ Initiative tracker mostra 💀 icon

**Azioni** (toggle back):
3. Click "💀 Morto"

**Risultati Attesi**:
- ✅ Button text: "☠️ Uccidi"
- ✅ Card opacity normale
- ✅ 💀 icon rimosso

**Status**: [ ]

---

### TEST 13: Combat Log Display

**Azioni**:
1. Esegui 5-6 azioni varie (damage, heal, next turn)
2. Scrolla combat log

**Risultati Attesi**:
- ✅ Entries mostrate in ordine reverse (più recenti in alto)
- ✅ Timestamp formato [HH:MM]
- ✅ Color coding:
  - Rosso: damage
  - Verde: heal
  - Giallo: turn
  - Grigio: system
- ✅ Border left colorato per tipo
- ✅ Scrollbar funzionante

**Status**: [ ]

---

### TEST 14: Reset Combattimento

**Azioni**:
1. Click "🔄 Reset Combattimento"
2. Conferma dialog

**Risultati Attesi**:
- ✅ Encounter name: "In attesa di iniziare..."
- ✅ Round: 0
- ✅ Combattenti array vuoto
- ✅ Empty state visibile
- ✅ Combat log vuoto

**Status**: [ ]

---

### TEST 15: WebSocket Real-Time (Browser 1)

**Setup**: Apri 2 tab browser

**Azioni** (Tab 1):
1. Inizializza encounter
2. Applica damage a combattente

**Osserva** (Tab 2):

**Risultati Attesi**:
- ✅ Tab 2 si aggiorna automaticamente (no refresh)
- ✅ Combattenti visibili in entrambe
- ✅ HP sincronizzato
- ✅ Combat log sincronizzato
- ✅ Latenza < 200ms

**Status**: [ ]

---

### TEST 16: CLI ↔ Web Sync (Compatibilità)

**Setup**: Browser aperto + Terminal aperto

**Azioni** (Terminal):
```bash
cd /Users/ctrapattoni/projects/personal/bone/dnd
./.claude/commands/combat-cmd.sh damage "Sciami di Corvi Spettrali 4" 8
```

**Osserva** (Browser):

**Risultati Attesi**:
- ✅ HP Sciami 4 si aggiorna in browser
- ✅ Combat log mostra entry damage
- ✅ No page refresh
- ✅ Aggiornamento entro 1-2 secondi

**Azioni** (Browser):
1. Click "Prossimo ➡️"

**Verifica** (Terminal):
```bash
./.claude/commands/combat-cmd.sh status
```

**Risultati Attesi**:
- ✅ Status CLI mostra turno aggiornato
- ✅ JSON file modificato correttamente
- ✅ No conflitti/corruzione

**Status**: [ ]

---

### TEST 17: Multiple Rapid Actions (Stress Test)

**Azioni**:
1. Click "Prossimo ➡️" 10 volte rapidamente
2. Applica damage a 5 combattenti consecutivamente
3. Aggiungi 3 PG rapidamente

**Risultati Attesi**:
- ✅ UI rimane responsive
- ✅ Tutte le azioni registrate
- ✅ No duplicate entries in log
- ✅ No errori console
- ✅ JSON file non corrotto

**Status**: [ ]

---

### TEST 18: Invalid Input Handling

**Azioni**:
1. Damage prompt → inserisci "abc"
2. Heal prompt → inserisci "-5"
3. Add PC → lascia nome vuoto
4. Add PC → lascia iniziativa vuota

**Risultati Attesi**:
- ✅ Input non numerici ignorati
- ✅ Alert/validation message mostrato
- ✅ No crash
- ✅ State non modificato

**Status**: [ ]

---

### TEST 19: Page Refresh (State Persistence)

**Azioni**:
1. Inizializza encounter
2. Applica alcune azioni
3. Refresh browser (F5 o Cmd+R)

**Risultati Attesi**:
- ✅ Stato ripristinato da JSON
- ✅ Combattenti corretti
- ✅ Round/turn corretti
- ✅ HP valori corretti
- ✅ Combat log completo

**Status**: [ ]

---

### TEST 20: Encounter Selector Validation

**Azioni**:
1. Dropdown encounter → lascia "-- Seleziona --"
2. Click "⚔️ Inizia"

**Risultati Attesi**:
- ✅ Button disabilitato o alert mostrato
- ✅ No encounter inizializzato
- ✅ No errore console

**Status**: [ ]

---

## Test Suite Browser Compatibility

### Chrome
- [ ] Tutti i test passano
- [ ] WebSocket stabile
- [ ] No memory leaks (DevTools)

### Firefox
- [ ] Tutti i test passano
- [ ] WebSocket stabile
- [ ] No errori console

### Safari
- [ ] Tutti i test passano
- [ ] WebSocket stabile
- [ ] No warning WebSocket

---

## Performance Tests

### Load Time
- [ ] Page load < 2s (first load)
- [ ] Page load < 500ms (cached)

### WebSocket Latency
- [ ] Message roundtrip < 100ms (local)
- [ ] Broadcast delay < 50ms

### File Operations
- [ ] JSON save < 50ms
- [ ] JSON load < 20ms
- [ ] No file locking issues

---

## Regression Tests (Post-Update)

Dopo ogni modifica al codice, ri-eseguire:

1. **Core Functionality**
   - [ ] TEST 2: Inizializzazione
   - [ ] TEST 4: Danno
   - [ ] TEST 8: Next Turn
   - [ ] TEST 16: CLI Sync

2. **Data Integrity**
   - [ ] TEST 17: Stress Test
   - [ ] TEST 19: Persistence

3. **Error Handling**
   - [ ] TEST 18: Invalid Input

---

## Bug Report Template

**Test ID**: [numero test]
**Browser**: [Chrome/Firefox/Safari]
**OS**: [macOS/Windows/Linux]

**Steps to Reproduce**:
1. ...
2. ...

**Expected**: ...
**Actual**: ...

**Console Errors**: [screenshot o paste]

**Screenshots**: [se applicabile]

---

## Test Completion Checklist

### FASE 1 MVP
- [ ] Tutti i 20 test passano
- [ ] Browser compatibility verificata
- [ ] Performance tests OK
- [ ] CLI sync funzionante
- [ ] No known critical bugs

### Sign-Off
- **Tester**: _____________
- **Date**: _____________
- **Status**: ✅ PASSED / ❌ FAILED
- **Notes**: _____________

---

**Versione Piano**: 1.0
**Ultimo Update**: 2026-02-21
