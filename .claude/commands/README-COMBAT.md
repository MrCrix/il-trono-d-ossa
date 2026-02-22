# 🎲 Combat Tracker - Guida Rapida

Sistema di tracciamento combattimento per D&D 5e con UI web in tempo reale.

## 🚀 Setup Iniziale

1. **Aggiungi alias (opzionale ma consigliato)**:
   ```bash
   ./.claude/commands/setup-combat-alias.sh
   source ~/.zshrc  # o ~/.bashrc
   ```

2. **Verifica installazione**:
   ```bash
   combat status
   ```

## 📖 Uso Base

### Iniziare un Combattimento

```bash
/combat processione-carri-vuoti
```

Questo:
- Legge l'encounter da `encounters/processione-carri-vuoti.md`
- Estrae automaticamente tutti i nemici
- **Tira 1d20 per l'iniziativa di ogni mostro**
- Apre il tracker nel browser
- Inizializza il file `combat-state.json`

### Vedere Encounter Disponibili

```bash
/combat
```

## 🎮 Comandi Durante il Combattimento

### Aggiungere PG (Personaggi Giocanti)

```bash
combat addpc Thorgrim 20 65 18       # Nome, Iniziativa, HP, CA
combat addpc Elara 16 48 15
combat addpc "Kael il Veloce" 22     # HP e CA opzionali (default: 50, 15)
```

### Gestione HP

```bash
combat hp sciame 24          # Imposta HP direttamente
combat damage sciame 8       # Applica 8 danni
combat heal torvin 15        # Cura 15 HP
```

### Iniziativa e Turni

```bash
combat init sciame 18        # Modifica iniziativa manualmente
combat next                  # Prossimo turno (auto-incrementa round)
```

### Condizioni

```bash
combat condition sciame Spaventato
combat condition servo Prono
combat remove sciame Spaventato
```

### Note e Status

```bash
combat note sciame "Concentrato su Torvin"
combat status                # Mostra tabella completa ordinata per init
```

### Terminare

```bash
combat end                   # Chiede conferma e resetta
```

## 🔍 Ricerca Fuzzy

I comandi supportano ricerca parziale case-insensitive:

```bash
combat damage sci 8          # ✅ Trova "Sciami di Corvi Spettrali 1"
combat damage SCIAME 5       # ✅ Case-insensitive
combat damage "Serv" 10      # ✅ Trova "Servitore Vuoto 1"
```

Il sistema trova automaticamente il **primo match** che contiene la stringa.

## 🌐 UI Browser

L'HTML si auto-aggiorna ogni **2 secondi** leggendo `combat-state.json`.

### Caratteristiche UI:

- **Tracker Iniziativa**: Lista ordinata con evidenziazione del turno corrente
- **Card Compatte**: Design ridotto per visualizzare più combattenti
- **Turno corrente**: Evidenziato con bordo oro e indicatore ▶
- **Barre HP**: Verde → Giallo → Rosso lampeggiante
- **Colori per tipo**:
  - Rosso = Nemici
  - Ciano = Alleati
  - Verde acqua = Giocatori
- **Creature morte**: Grigie e trasparenti con riga barrata
- **Log eventi**: Ultimi 20 in ordine cronologico inverso
- **Ordinamento automatico**: Per iniziativa (discendente)

### Multi-monitor

Puoi tenere il browser aperto su un monitor separato mentre giochi!

## 📝 Workflow Tipico

```bash
# 1. Inizia combattimento (iniziativa mostri già tirata!)
/combat processione-carri-vuoti

# 2. Aggiungi i PG con le loro iniziative
combat addpc Thorgrim 20 65 18
combat addpc Elara 16 48 15
combat addpc Kael 22 42 14

# 3. Verifica ordine di iniziativa
combat status

# 4. Gioca il combattimento
combat next                          # Prossimo turno
combat damage sciame1 8              # Torvin colpisce
combat condition sciame1 Spaventato

combat next                          # Prossimo turno
combat damage torvin 5               # Sciame attacca Torvin

combat next                          # Prossimo turno
combat heal torvin 10                # Cura se stesso

# 5. Status check quando serve
combat status

# 6. Fine combattimento
combat end
```

## 🛠️ Troubleshooting

### HP/CA Non Estratti Correttamente

Il parser cerca pattern `**PF**: XX` e `**CA**: XX` nel markdown.
Se non li trova, usa default (HP=1, CA=10).

**Soluzione**: Imposta manualmente
```bash
combat hp nome 24
```

### Browser Non Si Apre

Su macOS, lo script usa `open combat-tracker.html`.
Su Linux, potresti dover usare `xdg-open`.

**Soluzione manuale**:
```bash
open combat-tracker.html  # macOS
xdg-open combat-tracker.html  # Linux
```

### Alias Non Funziona

Verifica che lo hai caricato:
```bash
source ~/.zshrc
```

Oppure usa il path completo:
```bash
./.claude/commands/combat-cmd.sh status
```

### JSON Corrotto

Se il file `combat-state.json` si corrompe:
```bash
rm combat-state.json
/combat nome-encounter  # Re-inizializza
```

## 📂 File Generati

- `combat-state.json` - Stato corrente (volatil, git-ignored)
- `combat-tracker.html` - UI statica (versionata)

## 🎯 Parser Automatico

Il parser cerca pattern nel markdown:

```markdown
### 6 × Sciami di Corvi Spettrali (CR 1/4)

- **PF**: 24 ciascuno
- **CA**: 12
```

Genera automaticamente:
- "Sciami di Corvi Spettrali 1" (HP: 24, CA: 12)
- "Sciami di Corvi Spettrali 2" (HP: 24, CA: 12)
- ...
- "Sciami di Corvi Spettrali 6" (HP: 24, CA: 12)

## 🎨 Personalizzazione

### Aggiungere Giocatori

**Metodo Raccomandato** (usa il comando):
```bash
combat addpc Torvin 18 32 18
```

**Metodo Alternativo** (modifica JSON manualmente):
```json
{
  "name": "Torvin",
  "type": "player",
  "hp_current": 32,
  "hp_max": 32,
  "ac": 18,
  "initiative": 18,
  "conditions": [],
  "notes": ""
}
```

L'UI lo mostrerà con bordo verde acqua.

### Modificare Colori UI

Edita `combat-tracker.html` nella sezione `<style>`.

## 💡 Tips

1. **Nomi brevi**: Usa abbreviazioni per i comandi
   ```bash
   combat damage sci1 8  # invece di "Sciami di Corvi Spettrali 1"
   ```

2. **Iniziativa mostri**: Già tirata automaticamente all'avvio!

3. **Aggiungi PG rapidamente**: Prepara un file con i comandi
   ```bash
   combat addpc Thorgrim 20 65 18
   combat addpc Elara 16 48 15
   combat addpc Kael 22 42 14
   ```

4. **Log dettagliato**: Ogni azione viene loggata automaticamente

5. **Persistenza**: Lo stato rimane salvato tra le sessioni

---

**Creato per**: Il Trono d'Ossa Campaign
**Autore**: Combat Tracker System v1.0
