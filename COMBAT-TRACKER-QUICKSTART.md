# 🎲 Combat Tracker - Quick Start

## Avvio Rapido (3 Passi)

### 1. Setup (Prima Volta Soltanto)
```bash
cd combat-app
npm install
```

### 2. Avvia Server
```bash
./start.sh
# oppure
npm start
```

### 3. Apri Browser
Vai su: **http://localhost:3000**

---

## Utilizzo Base

### Iniziare un Combattimento
1. Dropdown "Seleziona Encounter"
2. Scegli encounter (es: "processione-carri-vuoti")
3. Click "⚔️ Inizia Combattimento"

### Aggiungere Personaggi
1. Form "Aggiungi PG"
2. Inserisci: Nome, Iniziativa, HP, CA
3. Click "➕ Aggiungi"

### Durante il Combattimento
- **Danno**: Click "⚔️ Danno" sulla card → inserisci valore
- **Cura**: Click "✨ Cura" sulla card → inserisci valore
- **Next Turn**: Click "Prossimo ➡️" in alto
- **Condizioni**: Click "+ Condizione" → digita nome

---

## Compatibilità CLI

Il tracker funziona insieme ai comandi bash esistenti:

### Esempio: Danno da Terminale
```bash
combat damage "Sciami di Corvi Spettrali 1" 10
```
→ Il browser si aggiorna automaticamente! ⚡

### Esempio: Next Turn da Browser
1. Click "Prossimo ➡️" nel browser
2. Terminal: `combat status` mostra turno aggiornato

---

## Features Principali

✅ Real-time sync tra browser e CLI
✅ Initiative tracker automatico
✅ HP bar color-coded (verde/giallo/rosso)
✅ Combat log con timestamp
✅ Gestione condizioni
✅ Multi-tab support (più browser sincronizzati)
✅ Dark theme UI

---

## Troubleshooting

**Server non parte?**
```bash
# Verifica porta 3000 libera
lsof -i :3000
# Uccidi processo se occupato
kill -9 [PID]
```

**Encounter non si carica?**
- Verifica file `encounters/nome-encounter.md` esista
- Check formato header: `### N × Nome (CR X)`

**WebSocket non connette?**
- Refresh browser (F5)
- Riavvia server
- Check console browser per errori

---

## Documentazione Completa

- **README**: `combat-app/README.md`
- **Roadmap**: `combat-app/ROADMAP.md`
- **Test Plan**: `combat-app/TEST-PLAN.md`

---

## Next Steps

Questa è la **FASE 1 (MVP)**. Prossime features:
- FASE 2: Click to edit HP/AC, drag-and-drop
- FASE 3: Stat blocks completi
- FASE 4: Condizioni avanzate con durata
- FASE 5: Death saves, keyboard shortcuts, themes

---

**Buon combattimento! ⚔️**
