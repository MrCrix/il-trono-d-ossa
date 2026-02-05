# 🎲 Campagna D&D

Spazio di lavoro per la creazione e gestione della campagna di Dungeons & Dragons.

## 📁 Struttura

```
dnd/
├── CAMPAIGN_RULES.md       # Regole e linee guida per Claude
├── TODO.md                 # Task e cose da fare
├── worldbuilding/          # Mondo di gioco
│   ├── locations/          # Luoghi e mappe
│   ├── factions/           # Organizzazioni e fazioni
│   └── lore/               # Storia e mitologia
├── characters/             # Personaggi
│   ├── npcs/               # NPC generici
│   ├── pcs/                # Schede dei giocatori
│   └── antagonists/        # Villain e antagonisti
├── sessions/               # Note per sessione
├── rules/                  # Regole custom
│   └── homebrew/           # Homebrew content
├── brainstorming/          # Idee e spunti
├── templates/              # Template riutilizzabili
└── scripts/                # Automazioni e script
```

## 🚀 Quick Start

### 1. Setup Iniziale

Attiva l'ambiente virtuale Python:
```bash
source venv/bin/activate
```

### 2. Creare Contenuti

Usa i template in `templates/` come punto di partenza:

```bash
# Copia un template
cp templates/template-npc.md characters/npcs/nuovo-npc.md

# Modifica il file con i tuoi contenuti
# Compila i metadati nel frontmatter YAML
```

#### Template Disponibili

- `template-npc.md` - Per NPC (importanza, stato, luogo, ruolo_narrativo, tipology)
- `template-pc.md` - Per PG (stato, luogo, livello, allineamento, nome_giocatore, classe)
- `template-sessione.md` - Per sessioni (data, decisione_chiave, conseguenze_aperte, livello_medio)
- `template-arco.md` - Per archi narrativi (luogo_principale, stato, capitolo, tipo)
- `template-location.md` - Per luoghi (tipo, regione, importanza, stato, pericolo, popolazione)

### 3. Pubblicare su Notion

```bash
# Test connessione
python scripts/notion_sync.py --test

# Carica un PNG
python scripts/notion_sync.py --push characters/npcs/nome-npc.md --db npcs

# Carica un PG
python scripts/notion_sync.py --push characters/pcs/nome-pc.md --db pcs

# Carica una sessione
python scripts/notion_sync.py --push sessions/sessione-01.md --db sessions

# Carica un arco narrativo
python scripts/notion_sync.py --push arcs/nome-arco.md --db arcs

# Carica un luogo
python scripts/notion_sync.py --push worldbuilding/locations/nome-luogo.md --db locations
```

## 🔗 Integrazioni

- **Notion**: ✅ Configurato con 5 database (PNG, PG, Sessioni, Archi Narrativi, Luoghi)
- **ChatGPT**: Importa conversazioni rilevanti

### Database Notion

- **PNG (DB)**: Personaggi non giocanti
- **PG (DB)**: Personaggi giocanti
- **Sessione (DB)**: Note di sessione
- **Archi Narrativi (DB)**: Archi narrativi della campagna
- **Luoghi (DB)**: Location e luoghi del mondo di gioco

## 📌 Link Utili

- Notion workspace: [URL]
- Risorse online: [URL]

---

**Inizia da**:
- `CAMPAIGN_RULES.md` (La Bibbia) - regole complete della campagna "Il Trono d'Ossa"
- `TODO.md` - organizza il lavoro per le prossime sessioni
