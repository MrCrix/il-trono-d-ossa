# Combat Tracker - Roadmap Implementazione

## ✅ FASE 1: MVP - Web App Base (COMPLETATO)

### Backend
- [x] Setup progetto Node (package.json, dependencies)
- [x] Express server + Socket.IO setup
- [x] Parser markdown base (HP, CA, nome)
- [x] State manager con file locking
- [x] File watcher bidirezionale (CLI ↔ Web)
- [x] WebSocket handlers per eventi base
- [x] API REST endpoints base

### Frontend
- [x] Vue app con componenti minimal:
  - [x] CombatantCard (display HP, AC, azioni base)
  - [x] InitiativeTracker (lista iniziativa, next/prev turn)
  - [x] ControlPanel (selector encounter, add PC)
  - [x] CombatLog (log eventi con timestamp)
- [x] WebSocket real-time sync funzionante
- [x] Styling CSS completo
- [x] API endpoints base integrati

### Verifica MVP
- [x] Inizializzare encounter → UI aggiornata in real-time
- [x] Applicare damage da UI → cambio immediato
- [x] Next turn → indicatore si sposta
- [x] Add PC → appare in lista ordinata per iniziativa
- [x] CLI bridge → file watcher funzionante

---

## 🔄 FASE 2: UI Interattiva (IN CORSO)

### Editable Fields
- [ ] Click to edit HP su CombatantCard
- [ ] Click to edit AC su CombatantCard
- [ ] Click to edit Iniziativa su CombatantCard
- [ ] Validation inputs (solo numeri, range validi)
- [ ] Feedback visivo su save

### Quick Actions
- [ ] Input custom per damage (non solo prompt)
- [ ] Input custom per heal (non solo prompt)
- [ ] Buttons quick (-5, -10, -custom)
- [ ] Buttons quick heal (+5, +10, +custom)
- [ ] Toggle morto/vivo (skull icon)
- [ ] Visual feedback animazioni

### Initiative Tracker Advanced
- [ ] Drag-and-drop per riordinare iniziativa
- [ ] Library drag-and-drop (Sortable.js via CDN)
- [ ] Persistenza ordine custom
- [ ] Visual feedback durante drag

### Stat Block Modal (Base)
- [ ] Modal component
- [ ] Display HP, AC, iniziativa, speed
- [ ] Chiudi con X o click outside
- [ ] Animazione open/close

### Condition Manager (Base)
- [ ] Input condizione inline su card
- [ ] Rimozione condizione (click badge)
- [ ] Validation input non vuoto
- [ ] Badge colorati

### Verifica FASE 2
- [ ] Editare HP direttamente da card
- [ ] Drag combattente in lista iniziativa
- [ ] Aggiungere condizione "Spaventato"
- [ ] Toggle morto → card diventa grigia
- [ ] Aprire stat block modal

---

## 📋 FASE 3: Stat Blocks Completi

### Parser Esteso
- [ ] Parse abilities (STR, DEX, CON, INT, WIS, CHA)
- [ ] Parse speed
- [ ] Parse saving throws
- [ ] Parse skills
- [ ] Parse resistenze/immunità/vulnerabilità
- [ ] Parse senses, languages, CR
- [ ] Parse azioni (actions, bonus actions, reactions)
- [ ] Parse abilità speciali
- [ ] Parse tattiche DM
- [ ] Test parser su tutti gli encounter esistenti

### Schema JSON Esteso
- [ ] Campo `stat_block` con tutti i dati
- [ ] Campo `initiative_modifier`
- [ ] Migration script per JSON esistenti
- [ ] Backward compatibility con CLI

### StatBlockModal Completo
- [ ] Sezione Abilities con modifiers calcolati
- [ ] Sezione Skills e Saving Throws
- [ ] Sezione Resistenze/Immunità/Vulnerabilità
- [ ] Sezione Azioni (espandibili)
- [ ] Sezione Abilità Speciali con icone
- [ ] Sezione Tattiche DM (collapsable)
- [ ] Tabs per organizzare contenuto
- [ ] Print-friendly view

### Verifica FASE 3
- [ ] Aprire stat block "Sciame di Corvi Spettrali"
- [ ] Vedere abilities complete con modifiers
- [ ] Vedere resistenze necrotico, immunità poison
- [ ] Vedere azioni "Becchi Spettrali"
- [ ] Vedere abilità speciale "Forma Spettrale"
- [ ] Verificare JSON contiene `stat_block` completo

---

## 🎯 FASE 4: Condizioni Avanzate

### Condizioni Strutturate
- [ ] Oggetto condizione: { name, duration, source, added_round }
- [ ] Durata: instant, N rounds, concentrazione, manuale
- [ ] Source tracking (chi ha inflitto)
- [ ] Timestamp aggiunta

### UI Condizioni
- [ ] Dropdown con 15 condizioni D&D 5e standard:
  - [ ] Blinded, Charmed, Deafened, Frightened
  - [ ] Grappled, Incapacitated, Invisible
  - [ ] Paralyzed, Petrified, Poisoned
  - [ ] Prone, Restrained, Stunned
  - [ ] Unconscious, Exhausted (1-6)
- [ ] Input durata con presets
- [ ] Input source (optional)
- [ ] Badge colorati per categoria
- [ ] Tooltip con effetti condizione

### Auto-Tracking
- [ ] Auto-decrement durata su cambio turno
- [ ] Notifica condizione scaduta
- [ ] Rimozione automatica durata = 0
- [ ] Concentrazione tracking
- [ ] Prompt "perdere concentrazione?" su damage
- [ ] Visual indicator concentrazione attiva

### Verifica FASE 4
- [ ] Aggiungere "Spaventato (1 round)"
- [ ] Next turn → verifica auto-rimozione
- [ ] Aggiungere "Concentrazione su Benedizione"
- [ ] Applicare damage → prompt perdita concentrazione
- [ ] Verificare badge colorati correttamente

---

## ✨ FASE 5: Polish e Features Extra

### Temp HP
- [ ] Campo temp_hp in schema
- [ ] Display separato da HP correnti
- [ ] Damage consuma prima temp HP
- [ ] Visual indicator temp HP

### Death Saves (PG)
- [ ] UI tracker 3 success / 3 failure
- [ ] Checkbox interattivi
- [ ] Auto-show quando PG a 0 HP
- [ ] Reset su stabilizzazione/cura

### Combat Log Avanzato
- [ ] Filtri per tipo evento (checkbox)
- [ ] Search/filter log entries
- [ ] Export log come .txt
- [ ] Clear log button
- [ ] Pagination (show more)

### Export/Import
- [ ] Button export JSON
- [ ] Button import JSON
- [ ] Validation JSON importato
- [ ] Backup automatico timestamp

### Keyboard Shortcuts
- [ ] N = Next turn
- [ ] P = Previous turn
- [ ] D = Focus damage input
- [ ] H = Focus heal input
- [ ] R = Reset (con confirm)
- [ ] Modal shortcuts info (?)

### Responsive Mobile
- [ ] Grid adattivo per mobile
- [ ] Touch-friendly buttons (min 44px)
- [ ] Swipe gestures (next/prev turn)
- [ ] Mobile menu collapsable

### Theming
- [ ] Dark/light theme toggle
- [ ] Salva preferenza localStorage
- [ ] CSS variables per colori
- [ ] Smooth transition themes

### Sound Effects (Optional)
- [ ] On damage (sword slash)
- [ ] On death (death sound)
- [ ] On turn change (bell)
- [ ] On heal (magic sparkle)
- [ ] Volume control
- [ ] Mute button

### Verifica FASE 5
- [ ] Testare su mobile/tablet
- [ ] Usare keyboard shortcut "N" per next turn
- [ ] Export JSON → reset → import → verificare stato
- [ ] Toggle theme light/dark
- [ ] Aggiungere temp HP → applicare damage

---

## 🔗 FASE 6: CLI Bridge Completo

### CLI Integration
- [ ] cli-bridge.js invoke bash scripts
- [ ] Retry logic per comandi falliti
- [ ] Error handling robusto
- [ ] Logging chiamate CLI

### API → CLI
- [ ] POST /api/combat/damage → bash damage
- [ ] POST /api/combat/heal → bash heal
- [ ] POST /api/combat/next-turn → bash next
- [ ] POST /api/combat/condition → bash condition

### CLI → Web Sync
- [ ] File watcher detecta cambio JSON
- [ ] Parse diff stato (ottimizzazione)
- [ ] Broadcast solo delta modifiche
- [ ] Throttling broadcasts (max 10/sec)

### Testing Integrazione
- [ ] Test: CLI damage → web update
- [ ] Test: Web damage → CLI status correct
- [ ] Test: CLI next → web turn indicator
- [ ] Test: Concurrent access (CLI + web simultaneo)
- [ ] Test: Race condition scenarios

### Documentazione
- [ ] README workflow ibrido
- [ ] Esempi CLI + web usage
- [ ] Troubleshooting guide
- [ ] Video demo (optional)

### Verifica FASE 6
- [ ] Terminal: `combat damage sciame 8`
- [ ] Browser: HP si aggiorna real-time
- [ ] Browser: click "Next Turn"
- [ ] Terminal: `combat status` mostra round updated
- [ ] Test 10+ azioni rapide consecutive
- [ ] Test crash recovery

---

## 🚀 FASE 7: Deploy e Produzione (Future)

### Ottimizzazioni
- [ ] WebSocket reconnection logic
- [ ] State caching client-side
- [ ] Lazy loading componenti
- [ ] Code splitting
- [ ] Minification assets

### Security
- [ ] Rate limiting API
- [ ] Input sanitization
- [ ] XSS protection
- [ ] CSRF tokens (se auth futuro)

### Monitoring
- [ ] Error tracking (Sentry?)
- [ ] Performance metrics
- [ ] Usage analytics
- [ ] Health check endpoint

### Backup & Recovery
- [ ] Auto-backup history (50 files max)
- [ ] Backup rotation timestamp
- [ ] Recovery UI
- [ ] Export campagna completa

---

## 🎮 FASE 8: Estensioni Future (Wishlist)

### Multi-Encounter
- [ ] Gestire più combattimenti simultanei
- [ ] Tabs per combattimenti diversi
- [ ] Switch rapido tra encounters

### Multi-User
- [ ] DM + Players connessione separata
- [ ] Permessi differenziati
- [ ] JWT authentication
- [ ] Player view (solo HP proprio, no nemici)

### Cloud Sync (Optional)
- [ ] Firebase/Supabase integration
- [ ] Sync cross-device
- [ ] Campaign sharing

### Mobile App (PWA)
- [ ] Progressive Web App
- [ ] Install on device
- [ ] Offline mode
- [ ] Push notifications

### AI Assistant (Future)
- [ ] Suggerimenti tattici
- [ ] Auto-balance encounters
- [ ] Generate encounters on-the-fly

### Integration Esterna
- [ ] Import da D&D Beyond
- [ ] Import da Roll20
- [ ] Export to Foundry VTT

---

## 📊 Metriche Successo

### Performance
- [ ] Load time < 2s
- [ ] WebSocket latency < 100ms
- [ ] File save < 50ms
- [ ] No memory leaks

### UX
- [ ] < 3 click per azione comune
- [ ] Feedback visivo immediate
- [ ] Zero data loss
- [ ] Mobile-friendly

### Compatibilità
- [ ] CLI + web sync perfetto
- [ ] Backward compatible JSON
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] Cross-platform (Mac, Windows, Linux)

---

## 🐛 Known Issues / Tech Debt

### Da Risolvere
- [ ] [FASE 1] WebSocket reconnect non automatico
- [ ] [FASE 1] File lock cleanup su crash
- [ ] [FASE 1] No validation input numeri
- [ ] [FASE 1] Prompt dialog non user-friendly
- [ ] [FASE 1] No undo/redo

### Ottimizzazioni Future
- [ ] Parser markdown usa regex inefficiente
- [ ] Broadcast full state invece di delta
- [ ] No pagination combattenti (problemi con >50)
- [ ] CSS non ottimizzato per production

---

**Ultimo Aggiornamento**: 2026-02-21
**Status**: FASE 1 COMPLETATA ✅ | FASE 2 PROSSIMA
