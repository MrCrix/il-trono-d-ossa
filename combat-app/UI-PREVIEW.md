# 🎨 Combat Tracker - UI Preview

## Interfaccia Utente (Anteprima ASCII)

### Header
```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║           ⚔️  COMBAT TRACKER - Il Trono d'Ossa                     ║
║                                                                    ║
║     processione-carri-vuoti              Round: 3                 ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

---

### Control Panel
```
╔═══════════════════════════════════════════════════════════════════╗
║  📚 Seleziona Encounter                  👤 Aggiungi PG           ║
║  ┌───────────────────────┐              ┌──────────────────────┐ ║
║  │ processione-carri-vuo…▼│              │ Nome: [Thorgrim    ]│ ║
║  └───────────────────────┘              │ Init: [18          ]│ ║
║  [⚔️ Inizia Combattimento]               │ HP:   [45          ]│ ║
║                                         │ CA:   [17          ]│ ║
║                                         └──────────────────────┘ ║
║                                         [➕ Aggiungi]             ║
║                                                                   ║
║  [🔄 Reset Combattimento]                                         ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

### Initiative Tracker
```
╔═══════════════════════════════════════════════════════════════════╗
║  🎲 Ordine di Iniziativa              [⬅️ Precedente] [Prossimo ➡️] ║
║  ─────────────────────────────────────────────────────────────── ║
║    ▶ 20  Sciami di Corvi Spettrali 4           24/24 HP         ║
║      19  Servitori Vuoti 1                      33/33 HP         ║
║      19  Servitori Vuoti 3                      33/33 HP         ║
║      18  Thorgrim                               45/45 HP         ║
║      17  Sciami di Corvi Spettrali 1            14/24 HP         ║
║      15  Sciami di Corvi Spettrali 3            24/24 HP         ║
║      13  Sciami di Corvi Spettrali 5            24/24 HP         ║
║      12  Sciami di Corvi Spettrali 2            17/24 HP         ║
║       4  Sciami di Corvi Spettrali 6            24/24 HP         ║
║       1  Servitori Vuoti 2                      33/33 HP         ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

### Combatant Cards (Grid Layout)

#### Card 1: Combattente Attivo
```
╔═══════════════════════════════════════╗
║ ⚡ TURNO CORRENTE                     ║
║ Sciami di Corvi Spettrali 4          ║
║ 💀 Nemico                             ║
║                      🛡️ CA 12  🎲 20  ║
║                                       ║
║ ❤️ HP                        24 / 24  ║
║ ┌───────────────────────────────────┐ ║
║ │████████████████████████████████░░│ ║ ← Verde (HP alto)
║ └───────────────────────────────────┘ ║
║                                       ║
║ [⚔️ Danno]  [✨ Cura]  [☠️ Uccidi]     ║
║                                       ║
║ Condizioni: (nessuna)                ║
║ [+ Condizione]                        ║
╚═══════════════════════════════════════╝
```

#### Card 2: Combattente Danneggiato
```
╔═══════════════════════════════════════╗
║ Sciami di Corvi Spettrali 1          ║
║ 💀 Nemico                             ║
║                      🛡️ CA 12  🎲 17  ║
║                                       ║
║ ❤️ HP                        14 / 24  ║
║ ┌───────────────────────────────────┐ ║
║ │████████████████░░░░░░░░░░░░░░░░░░│ ║ ← Giallo (HP medio)
║ └───────────────────────────────────┘ ║
║                                       ║
║ [⚔️ Danno]  [✨ Cura]  [☠️ Uccidi]     ║
║                                       ║
║ Condizioni: [Spaventato]             ║
║ [+ Condizione]                        ║
╚═══════════════════════════════════════╝
```

#### Card 3: Combattente Critico
```
╔═══════════════════════════════════════╗
║ Servitori Vuoti 2                    ║
║ 💀 Nemico                             ║
║                      🛡️ CA 18  🎲 1   ║
║                                       ║
║ ❤️ HP                         5 / 33  ║
║ ┌───────────────────────────────────┐ ║
║ │███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ║ ← Rosso pulsante (HP basso)
║ └───────────────────────────────────┘ ║
║                                       ║
║ [⚔️ Danno]  [✨ Cura]  [☠️ Uccidi]     ║
║                                       ║
║ Condizioni: [Avvelenato] [Prono]     ║
║ [+ Condizione]                        ║
╚═══════════════════════════════════════╝
```

#### Card 4: Personaggio Giocante
```
╔═══════════════════════════════════════╗
║ Thorgrim                              ║
║ 👤 PG                                 ║
║                      🛡️ CA 17  🎲 18  ║
║                                       ║
║ ❤️ HP                        45 / 45  ║
║ ┌───────────────────────────────────┐ ║
║ │████████████████████████████████░░│ ║ ← Verde (full HP)
║ └───────────────────────────────────┘ ║
║                                       ║
║ [⚔️ Danno]  [✨ Cura]  [☠️ Uccidi]     ║
║                                       ║
║ Condizioni: [Benedizione]            ║
║ [+ Condizione]                        ║
╚═══════════════════════════════════════╝
```

#### Card 5: Combattente Morto
```
╔═══════════════════════════════════════╗
║ Sciami di Corvi Spettrali 6   💀     ║
║ 💀 Nemico                      MORTO  ║
║                      🛡️ CA 12  🎲 4   ║
║                                       ║
║ ❤️ HP                         0 / 24  ║
║ ┌───────────────────────────────────┐ ║
║ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ║ ← Vuoto (0 HP)
║ └───────────────────────────────────┘ ║
║                                       ║
║ [⚔️ Danno]  [✨ Cura]  [💀 Morto]      ║
║                                       ║
║ Opacity: 50% (grigio)                ║
╚═══════════════════════════════════════╝
```

---

### Combat Log
```
╔═══════════════════════════════════════════════════════════════════╗
║ 📜 Combat Log                                                      ║
║ ───────────────────────────────────────────────────────────────── ║
║ │ [14:23] Turno di: Sciami di Corvi Spettrali 4                   ║
║ │ [14:23] Inizio round 3                                          ║
║ │ [14:22] Servitori Vuoti 2 subisce 28 danni (HP: 5/33)          ║ ← Rosso
║ │ [14:22] Turno di: Servitori Vuoti 2                             ║
║ │ [14:21] Sciami... subisce condizione: Spaventato                ║
║ │ [14:21] Thorgrim recupera 5 HP (HP: 45/45)                     ║ ← Verde
║ │ [14:20] Sciami di Corvi Spettrali 1 subisce 10 danni (HP: 14)  ║ ← Rosso
║ │ [14:19] Turno di: Sciami di Corvi Spettrali 1                   ║ ← Giallo
║ │ [14:19] Inizio round 2                                          ║ ← Giallo
║ │ [14:18] PG aggiunto: Thorgrim (Iniziativa: 18)                  ║ ← Grigio
║ │ [14:17] Combattimento iniziato: processione-carri-vuoti         ║ ← Grigio
║ ───────────────────────────────────────────────────────────────── ║
║ [Mostra Altri] [Esporta Log]                                      ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Color Scheme (Dark Theme)

### Palette Colori
```
Background:       #1a1a1a (nero scuro)
Background Light: #2a2a2a (grigio scuro)
Border:           #444    (grigio medio)
Text:             #e0e0e0 (bianco-grigio)
Text Dim:         #999    (grigio chiaro)

Primary:    #e63946 (rosso)    → Azioni critiche, turno corrente
Success:    #06d6a0 (verde)    → Cura, HP alto, conferme
Warning:    #f77f00 (arancione) → HP medio, alert
Danger:     #dc2f02 (rosso scuro) → Danno, HP basso

Enemy:      #8b0000 (rosso scuro) → Badge nemici
Player:     #1e90ff (blu)         → Badge PG

HP Colors:
  High (>60%):  #06d6a0 (verde)
  Mid (30-60%): #f77f00 (arancione)
  Low (<30%):   #dc2f02 (rosso) + pulse animation
```

---

## Responsive Layout

### Desktop (> 768px)
```
┌──────────────────────────────────────────────────────────┐
│                      HEADER                              │
├──────────────────────────────────────────────────────────┤
│                   CONTROL PANEL                          │
├──────────────────────────────────────────────────────────┤
│                 INITIATIVE TRACKER                       │
├──────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │ Card 1 │ │ Card 2 │ │ Card 3 │ │ Card 4 │           │
│  └────────┘ └────────┘ └────────┘ └────────┘           │
│  ┌────────┐ ┌────────┐ ┌────────┐                      │
│  │ Card 5 │ │ Card 6 │ │ Card 7 │                      │
│  └────────┘ └────────┘ └────────┘                      │
├──────────────────────────────────────────────────────────┤
│                     COMBAT LOG                           │
└──────────────────────────────────────────────────────────┘
```

### Tablet (768px - 480px)
```
┌────────────────────────────────┐
│           HEADER               │
├────────────────────────────────┤
│       CONTROL PANEL            │
├────────────────────────────────┤
│     INITIATIVE TRACKER         │
├────────────────────────────────┤
│  ┌────────┐ ┌────────┐        │
│  │ Card 1 │ │ Card 2 │        │
│  └────────┘ └────────┘        │
│  ┌────────┐ ┌────────┐        │
│  │ Card 3 │ │ Card 4 │        │
│  └────────┘ └────────┘        │
├────────────────────────────────┤
│         COMBAT LOG             │
└────────────────────────────────┘
```

### Mobile (< 480px)
```
┌──────────────┐
│   HEADER     │
├──────────────┤
│   CONTROL    │
│    PANEL     │
├──────────────┤
│  INITIATIVE  │
│   TRACKER    │
├──────────────┤
│ ┌──────────┐ │
│ │  Card 1  │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │  Card 2  │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │  Card 3  │ │
│ └──────────┘ │
├──────────────┤
│  COMBAT LOG  │
└──────────────┘
```

---

## Animazioni

### HP Bar Transition
```
Before:  │████████████████████████│ 100%
         ↓
After:   │████████████░░░░░░░░░░░░│ 50%

Duration: 0.3s
Easing: ease-out
```

### Pulse Animation (HP Critico)
```
Frame 1:  │███░░░░░░░░░░░│ (opacity: 1.0)
Frame 2:  │███░░░░░░░░░░░│ (opacity: 0.6)
Frame 3:  │███░░░░░░░░░░░│ (opacity: 1.0)

Duration: 1s infinite
```

### Turn Indicator
```
Not Active:      Sciami di Corvi...
Active:     ▶    Sciami di Corvi...  [Border: RED, Shadow: glow]
```

---

## Interazioni Utente

### Hover States
```
Button Normal:   [⚔️ Danno]
Button Hover:    [⚔️ Danno]  (opacity: 0.8, cursor: pointer)
Button Active:   [⚔️ Danno]  (scale: 0.95)
```

### Click Feedback
```
1. User click "⚔️ Danno"
2. Prompt dialog appare
3. User inserisce "10"
4. HP bar shrinks (animation 300ms)
5. Combat log entry appare
6. WebSocket broadcast a tutti i client
```

### Drag Visual (FASE 2)
```
Normal:     ┌────────────────────┐
            │ Combattente        │
            └────────────────────┘

Dragging:   ┌────────────────────┐
            │ Combattente        │ ← Semi-transparent
            └────────────────────┘
                    ↓ shadow
```

---

## Empty State
```
┌────────────────────────────────────────┐
│                                        │
│             🎲                         │
│                                        │
│     Nessun combattimento attivo       │
│                                        │
│   Seleziona un encounter per iniziare │
│                                        │
└────────────────────────────────────────┘
```

---

## Loading State (Future)
```
┌────────────────────────────────────────┐
│                                        │
│             ⚔️                         │
│                                        │
│     Caricamento encounter...          │
│                                        │
│          [▓▓▓▓░░░░░░]                 │
│                                        │
└────────────────────────────────────────┘
```

---

## Error State (Future)
```
┌────────────────────────────────────────┐
│                                        │
│             ❌                         │
│                                        │
│     Errore caricamento encounter      │
│                                        │
│     File non trovato                  │
│                                        │
│     [Riprova]  [Scegli Altro]         │
│                                        │
└────────────────────────────────────────┘
```

---

## WebSocket Connection Status

### Connected
```
🟢 Connesso (in alto a destra, piccolo)
```

### Disconnected
```
🔴 Disconnesso - Riconnessione in corso...
```

### Reconnecting
```
🟡 Riconnessione (tentativo 2/5)...
```

---

## Accessibility Features (FASE 5)

- Contrast ratio: 7:1 (WCAG AAA)
- Font size: 16px base
- Touch targets: min 44x44px
- Keyboard navigation: Tab support
- Screen reader: ARIA labels
- Focus indicators: visible outline

---

**UI Design by**: Claude Code + Modern Web Standards
**Theme**: Dark (future: Light mode toggle)
**Framework**: Vue.js 3 + Vanilla CSS
**Status**: ✅ FASE 1 Complete, FASE 2 UI enhancements planned
