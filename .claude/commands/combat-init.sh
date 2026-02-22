#!/bin/bash

# Combat Tracker - Initialization Script
# Inizializza un combattimento da un file encounter

ENCOUNTERS_DIR="encounters"
STATE_FILE="combat-state.json"
TRACKER_HTML="combat-tracker.html"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funzione per mostrare la lista degli encounter
list_encounters() {
    echo -e "${CYAN}📚 Encounter disponibili:${NC}\n"

    if [ ! -d "$ENCOUNTERS_DIR" ]; then
        echo -e "${RED}❌ Cartella encounters/ non trovata${NC}"
        exit 1
    fi

    local count=1
    for file in "$ENCOUNTERS_DIR"/*.md; do
        if [ -f "$file" ]; then
            local basename=$(basename "$file" .md)
            echo -e "${GREEN}${count}.${NC} ${basename}"
            ((count++))
        fi
    done

    if [ $count -eq 1 ]; then
        echo -e "${YELLOW}Nessun encounter trovato in $ENCOUNTERS_DIR/${NC}"
        exit 0
    fi
}

# Funzione per estrarre nemici da un file encounter
parse_encounter() {
    local encounter_file="$1"
    local encounter_name=$(basename "$encounter_file" .md)

    echo -e "${CYAN}🎲 Parsing encounter: ${encounter_name}${NC}\n"

    # Inizializza JSON
    cat > "$STATE_FILE" << 'JSONSTART'
{
  "encounter": "ENCOUNTER_NAME_PLACEHOLDER",
  "round": 1,
  "current_turn": 0,
  "combatants": [
JSONSTART

    # Sostituisci placeholder
    sed -i '' "s/ENCOUNTER_NAME_PLACEHOLDER/$encounter_name/" "$STATE_FILE"

    # Array temporaneo per i combattenti
    local combatants_json=""
    local first=true

    # Parsing del file markdown
    while IFS= read -r line; do
        # Cerca pattern: ### N × Nome oppure ### N x Nome
        if echo "$line" | grep -q "^###.*[×x].*CR"; then
            # Estrai numero
            local count=$(echo "$line" | sed -n 's/^###[[:space:]]*\([0-9]*\)[[:space:]]*[×x].*/\1/p')
            # Estrai nome (tra × e la parentesi)
            local name=$(echo "$line" | sed -n 's/^###[[:space:]]*[0-9]*[[:space:]]*[×x][[:space:]]*\([^(]*\).*/\1/p' | xargs)

            if [ -n "$count" ] && [ -n "$name" ]; then
                echo -e "${YELLOW}Trovato:${NC} ${count}x ${name}"

                # Cerca HP e CA nelle prossime righe
                local hp=""
                local ac=""
                local lines_read=0

                while IFS= read -r detail_line && [ $lines_read -lt 20 ]; do
                    ((lines_read++))

                    # Stop se incontriamo un nuovo header
                    if echo "$detail_line" | grep -q "^##"; then
                        break
                    fi

                    # Cerca HP (con o senza trattino iniziale)
                    if echo "$detail_line" | grep -q "PF\*\*:"; then
                        hp=$(echo "$detail_line" | grep -o '[0-9]\+' | head -1)
                    fi

                    # Cerca CA (con o senza trattino iniziale)
                    if echo "$detail_line" | grep -q "CA\*\*:"; then
                        ac=$(echo "$detail_line" | grep -o '[0-9]\+' | head -1)
                    fi

                    # Esci se abbiamo trovato entrambi
                    if [ -n "$hp" ] && [ -n "$ac" ]; then
                        break
                    fi
                done

                # Default se non trovati
                [ -z "$hp" ] && hp="1"
                [ -z "$ac" ] && ac="10"

                # Aggiungi N copie del nemico al JSON
                for ((i=1; i<=count; i++)); do
                    local creature_name="$name $i"

                    # Tira iniziativa per il mostro (1d20)
                    local initiative=$((RANDOM % 20 + 1))

                    if [ "$first" = false ]; then
                        echo "," >> "$STATE_FILE"
                    fi
                    first=false

                    cat >> "$STATE_FILE" << JSONENTRY
    {
      "name": "$creature_name",
      "type": "enemy",
      "hp_current": $hp,
      "hp_max": $hp,
      "ac": $ac,
      "initiative": $initiative,
      "conditions": [],
      "notes": ""
    }
JSONENTRY
                done
            fi
        fi
    done < "$encounter_file"

    # Chiudi JSON
    cat >> "$STATE_FILE" << 'JSONEND'

  ],
  "log": [
    "Combattimento iniziato"
  ]
}
JSONEND

    echo -e "\n${GREEN}✅ Encounter inizializzato!${NC}"
}

# Funzione per aprire il tracker
open_tracker() {
    if [ -f "$TRACKER_HTML" ]; then
        echo -e "${CYAN}🌐 Apertura combat tracker nel browser...${NC}"
        open "$TRACKER_HTML"
        sleep 1
        echo -e "${GREEN}✅ Tracker aperto!${NC}\n"
    else
        echo -e "${RED}❌ File $TRACKER_HTML non trovato${NC}"
        exit 1
    fi
}

# Main
main() {
    local encounter_name="$1"

    echo -e "${BLUE}⚔️  COMBAT TRACKER - Il Trono d'Ossa ⚔️${NC}\n"

    if [ -z "$encounter_name" ]; then
        list_encounters
        echo -e "\n${CYAN}Uso: /combat <nome-encounter>${NC}"
        exit 0
    fi

    # Trova il file encounter
    local encounter_file="$ENCOUNTERS_DIR/${encounter_name}.md"

    if [ ! -f "$encounter_file" ]; then
        echo -e "${RED}❌ Encounter '${encounter_name}' non trovato${NC}"
        echo -e "${YELLOW}Usa '/combat' senza argomenti per vedere la lista${NC}"
        exit 1
    fi

    # Parse e inizializza
    parse_encounter "$encounter_file"

    # Apri tracker
    open_tracker

    echo -e "${YELLOW}🎲 Iniziativa dei mostri tirata automaticamente!${NC}"
    echo -e ""
    echo -e "${CYAN}⚠️  PROSSIMO PASSO - Aggiungi i PG:${NC}"
    echo -e "   ${GREEN}combat addpc <nome> <iniziativa> [hp] [ca]${NC}"
    echo -e "   ${YELLOW}Esempio: combat addpc Thorgrim 18 45 17${NC}"
    echo -e ""
    echo -e "${CYAN}💡 Altri comandi disponibili:${NC}"
    echo -e "   ${GREEN}combat damage <nome> <valore>${NC}   - Applica danno"
    echo -e "   ${GREEN}combat heal <nome> <valore>${NC}     - Cura HP"
    echo -e "   ${GREEN}combat condition <nome> <testo>${NC} - Aggiungi condizione"
    echo -e "   ${GREEN}combat next${NC}                     - Prossimo turno"
    echo -e "   ${GREEN}combat status${NC}                   - Mostra stato completo"
    echo -e ""
}

main "$@"
