#!/bin/bash

# Combat Tracker - Interactive Commands
# Gestisce i comandi durante il combattimento

STATE_FILE="combat-state.json"

# Colori
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Verifica che esista lo stato
check_state() {
    if [ ! -f "$STATE_FILE" ]; then
        echo -e "${RED}❌ Nessun combattimento attivo${NC}"
        echo -e "${YELLOW}Usa '/combat <encounter>' per iniziare${NC}"
        exit 1
    fi
}

# Trova l'indice di un combattente per nome (case-insensitive, fuzzy)
find_combatant_index() {
    local search_name="$1"
    local index=$(jq -r --arg name "$search_name" '
        .combatants | to_entries |
        map(select(.value.name | ascii_downcase | contains($name | ascii_downcase))) |
        first | .key // "NOT_FOUND"
    ' "$STATE_FILE")

    echo "$index"
}

# Ottieni nome completo del combattente
get_combatant_name() {
    local index="$1"
    jq -r ".combatants[$index].name" "$STATE_FILE"
}

# Comando: damage
cmd_damage() {
    check_state
    local target="$1"
    local damage="$2"

    if [ -z "$target" ] || [ -z "$damage" ]; then
        echo -e "${RED}Uso: damage <nome> <valore>${NC}"
        exit 1
    fi

    local index=$(find_combatant_index "$target")
    if [ "$index" = "NOT_FOUND" ]; then
        echo -e "${RED}❌ Combattente '$target' non trovato${NC}"
        exit 1
    fi

    local name=$(get_combatant_name "$index")
    local round=$(jq -r '.round' "$STATE_FILE")

    # Aggiorna HP e log
    jq --arg idx "$index" --arg dmg "$damage" --arg name "$name" --arg round "$round" '
        .combatants[$idx | tonumber].hp_current = ([.combatants[$idx | tonumber].hp_current - ($dmg | tonumber), 0] | max) |
        .log += ["Round \($round): \($name) subisce \($dmg) danni (HP: \(.combatants[$idx | tonumber].hp_current))"]
    ' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    local new_hp=$(jq -r ".combatants[$index].hp_current" "$STATE_FILE")

    if [ "$new_hp" -le 0 ]; then
        echo -e "${RED}💀 $name subisce $damage danni ed è abbattuto! (HP: 0)${NC}"
    else
        echo -e "${YELLOW}⚔️  $name subisce $damage danni (HP: $new_hp)${NC}"
    fi
}

# Comando: heal
cmd_heal() {
    check_state
    local target="$1"
    local healing="$2"

    if [ -z "$target" ] || [ -z "$healing" ]; then
        echo -e "${RED}Uso: heal <nome> <valore>${NC}"
        exit 1
    fi

    local index=$(find_combatant_index "$target")
    if [ "$index" = "NOT_FOUND" ]; then
        echo -e "${RED}❌ Combattente '$target' non trovato${NC}"
        exit 1
    fi

    local name=$(get_combatant_name "$index")
    local round=$(jq -r '.round' "$STATE_FILE")

    # Aggiorna HP e log (non oltre il massimo)
    jq --arg idx "$index" --arg heal "$healing" --arg name "$name" --arg round "$round" '
        .combatants[$idx | tonumber].hp_current = ([.combatants[$idx | tonumber].hp_current + ($heal | tonumber), .combatants[$idx | tonumber].hp_max] | min) |
        .log += ["Round \($round): \($name) viene curato di \($heal) HP (HP: \(.combatants[$idx | tonumber].hp_current))"]
    ' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    local new_hp=$(jq -r ".combatants[$index].hp_current" "$STATE_FILE")
    echo -e "${GREEN}✨ $name recupera $healing HP (HP: $new_hp)${NC}"
}

# Comando: init
cmd_init() {
    check_state
    local target="$1"
    local initiative="$2"

    if [ -z "$target" ] || [ -z "$initiative" ]; then
        echo -e "${RED}Uso: init <nome> <valore>${NC}"
        exit 1
    fi

    local index=$(find_combatant_index "$target")
    if [ "$index" = "NOT_FOUND" ]; then
        echo -e "${RED}❌ Combattente '$target' non trovato${NC}"
        exit 1
    fi

    local name=$(get_combatant_name "$index")

    # Aggiorna iniziativa
    jq --arg idx "$index" --arg init "$initiative" '
        .combatants[$idx | tonumber].initiative = ($init | tonumber)
    ' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    echo -e "${CYAN}🎲 $name: Iniziativa = $initiative${NC}"
}

# Comando: condition
cmd_condition() {
    check_state
    local target="$1"
    shift
    local condition="$*"

    if [ -z "$target" ] || [ -z "$condition" ]; then
        echo -e "${RED}Uso: condition <nome> <condizione>${NC}"
        exit 1
    fi

    local index=$(find_combatant_index "$target")
    if [ "$index" = "NOT_FOUND" ]; then
        echo -e "${RED}❌ Combattente '$target' non trovato${NC}"
        exit 1
    fi

    local name=$(get_combatant_name "$index")
    local round=$(jq -r '.round' "$STATE_FILE")

    # Aggiungi condizione
    jq --arg idx "$index" --arg cond "$condition" --arg name "$name" --arg round "$round" '
        .combatants[$idx | tonumber].conditions += [$cond] |
        .log += ["Round \($round): \($name) subisce condizione: \($cond)"]
    ' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    echo -e "${YELLOW}⚠️  $name: +$condition${NC}"
}

# Comando: remove
cmd_remove() {
    check_state
    local target="$1"
    shift
    local condition="$*"

    if [ -z "$target" ] || [ -z "$condition" ]; then
        echo -e "${RED}Uso: remove <nome> <condizione>${NC}"
        exit 1
    fi

    local index=$(find_combatant_index "$target")
    if [ "$index" = "NOT_FOUND" ]; then
        echo -e "${RED}❌ Combattente '$target' non trovato${NC}"
        exit 1
    fi

    local name=$(get_combatant_name "$index")
    local round=$(jq -r '.round' "$STATE_FILE")

    # Rimuovi condizione
    jq --arg idx "$index" --arg cond "$condition" --arg name "$name" --arg round "$round" '
        .combatants[$idx | tonumber].conditions = (.combatants[$idx | tonumber].conditions | map(select(. != $cond))) |
        .log += ["Round \($round): \($name) rimuove condizione: \($cond)"]
    ' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    echo -e "${GREEN}✓ $name: -$condition${NC}"
}

# Comando: next
cmd_next() {
    check_state

    local total=$(jq '.combatants | length' "$STATE_FILE")
    local current=$(jq '.current_turn' "$STATE_FILE")
    local round=$(jq '.round' "$STATE_FILE")

    # Incrementa turno
    current=$((current + 1))

    # Se siamo alla fine, nuovo round
    if [ $current -ge $total ]; then
        current=0
        round=$((round + 1))
        jq --arg round "$round" '.round = ($round | tonumber) | .current_turn = 0' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
        echo -e "${CYAN}🔄 Nuovo round: $round${NC}"
    else
        jq --arg turn "$current" '.current_turn = ($turn | tonumber)' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    fi

    # Mostra chi è il turno corrente
    local current_name=$(jq -r ".combatants[$current].name" "$STATE_FILE")
    local current_hp=$(jq -r ".combatants[$current].hp_current" "$STATE_FILE")

    if [ "$current_hp" -le 0 ]; then
        echo -e "${RED}💀 Turno di: $current_name (ABBATTUTO)${NC}"
    else
        echo -e "${GREEN}➡️  Turno di: $current_name${NC}"
    fi
}

# Comando: note
cmd_note() {
    check_state
    local target="$1"
    shift
    local note="$*"

    if [ -z "$target" ] || [ -z "$note" ]; then
        echo -e "${RED}Uso: note <nome> <testo>${NC}"
        exit 1
    fi

    local index=$(find_combatant_index "$target")
    if [ "$index" = "NOT_FOUND" ]; then
        echo -e "${RED}❌ Combattente '$target' non trovato${NC}"
        exit 1
    fi

    local name=$(get_combatant_name "$index")

    jq --arg idx "$index" --arg note "$note" '
        .combatants[$idx | tonumber].notes = $note
    ' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    echo -e "${CYAN}📝 Nota aggiunta a $name${NC}"
}

# Comando: status
cmd_status() {
    check_state

    local encounter=$(jq -r '.encounter' "$STATE_FILE")
    local round=$(jq -r '.round' "$STATE_FILE")
    local current_turn=$(jq -r '.current_turn' "$STATE_FILE")

    echo -e "${CYAN}⚔️  STATO COMBATTIMENTO ⚔️${NC}"
    echo -e "${YELLOW}Encounter:${NC} $encounter"
    echo -e "${YELLOW}Round:${NC} $round\n"

    # Ottieni combattenti ordinati per iniziativa
    local combatants=$(jq -r '.combatants | sort_by(-.initiative) | to_entries[] | "\(.key)|\(.value.name)|\(.value.initiative)|\(.value.hp_current)|\(.value.hp_max)|\(.value.conditions | join(", "))"' "$STATE_FILE")

    echo -e "${GREEN}Iniziativa | Nome                    | HP       | Condizioni${NC}"
    echo "--------------------------------------------------------"

    local idx=0
    while IFS='|' read -r orig_idx name init hp_cur hp_max conditions; do
        local marker="  "
        if [ $idx -eq $current_turn ]; then
            marker="${GREEN}▶${NC} "
        fi

        local hp_display="$hp_cur/$hp_max"
        local cond_display="${conditions:-—}"

        if [ "$hp_cur" -le 0 ]; then
            echo -e "${marker}${RED}${init:--}${NC}        | ${RED}${name}${NC} | ${RED}💀 MORTO${NC} | $cond_display"
        else
            echo -e "${marker}${init:--}        | ${name} | ${hp_display} | $cond_display"
        fi

        ((idx++))
    done <<< "$combatants"
}

# Comando: hp (set diretto)
cmd_hp() {
    check_state
    local target="$1"
    local new_hp="$2"

    if [ -z "$target" ] || [ -z "$new_hp" ]; then
        echo -e "${RED}Uso: hp <nome> <valore>${NC}"
        exit 1
    fi

    local index=$(find_combatant_index "$target")
    if [ "$index" = "NOT_FOUND" ]; then
        echo -e "${RED}❌ Combattente '$target' non trovato${NC}"
        exit 1
    fi

    local name=$(get_combatant_name "$index")

    jq --arg idx "$index" --arg hp "$new_hp" '
        .combatants[$idx | tonumber].hp_current = ($hp | tonumber) |
        .combatants[$idx | tonumber].hp_max = ($hp | tonumber)
    ' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    echo -e "${CYAN}❤️  $name: HP impostati a $new_hp${NC}"
}

# Comando: addpc
cmd_addpc() {
    check_state
    local name="$1"
    local initiative="$2"
    local hp="${3:-50}"
    local ac="${4:-15}"

    if [ -z "$name" ] || [ -z "$initiative" ]; then
        echo -e "${RED}Uso: addpc <nome> <iniziativa> [hp] [ca]${NC}"
        echo -e "${YELLOW}Esempio: addpc Thorgrim 18 45 17${NC}"
        exit 1
    fi

    # Aggiungi PG al JSON
    jq --arg name "$name" --arg init "$initiative" --arg hp "$hp" --arg ac "$ac" '
        .combatants += [{
            "name": $name,
            "type": "player",
            "hp_current": ($hp | tonumber),
            "hp_max": ($hp | tonumber),
            "ac": ($ac | tonumber),
            "initiative": ($init | tonumber),
            "conditions": [],
            "notes": ""
        }] |
        .log += ["Aggiunto PG: \($name) (Iniziativa: \($init))"]
    ' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    echo -e "${GREEN}✅ PG aggiunto: $name (Iniziativa: $initiative, HP: $hp, CA: $ac)${NC}"
}

# Comando: end
cmd_end() {
    check_state

    echo -e "${YELLOW}⚠️  Terminare il combattimento? (y/n)${NC}"
    read -r confirm

    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        # Reset allo stato iniziale
        cat > "$STATE_FILE" << 'EOF'
{
  "encounter": "In attesa di iniziare...",
  "round": 0,
  "current_turn": 0,
  "combatants": [],
  "log": []
}
EOF
        echo -e "${GREEN}✅ Combattimento terminato${NC}"
    else
        echo -e "${CYAN}Combattimento ancora attivo${NC}"
    fi
}

# Main
CMD="$1"
shift

case "$CMD" in
    damage)
        cmd_damage "$@"
        ;;
    heal)
        cmd_heal "$@"
        ;;
    init)
        cmd_init "$@"
        ;;
    addpc)
        cmd_addpc "$@"
        ;;
    condition)
        cmd_condition "$@"
        ;;
    remove)
        cmd_remove "$@"
        ;;
    next)
        cmd_next "$@"
        ;;
    note)
        cmd_note "$@"
        ;;
    status)
        cmd_status "$@"
        ;;
    hp)
        cmd_hp "$@"
        ;;
    end)
        cmd_end "$@"
        ;;
    *)
        echo -e "${CYAN}Comandi disponibili:${NC}"
        echo -e "  ${GREEN}addpc <nome> <init> [hp] [ca]${NC} - Aggiungi PG"
        echo -e "  ${GREEN}damage <nome> <valore>${NC}        - Applica danno"
        echo -e "  ${GREEN}heal <nome> <valore>${NC}          - Cura HP"
        echo -e "  ${GREEN}hp <nome> <valore>${NC}            - Imposta HP direttamente"
        echo -e "  ${GREEN}init <nome> <valore>${NC}          - Imposta iniziativa"
        echo -e "  ${GREEN}condition <nome> <testo>${NC}      - Aggiungi condizione"
        echo -e "  ${GREEN}remove <nome> <condizione>${NC}    - Rimuovi condizione"
        echo -e "  ${GREEN}note <nome> <testo>${NC}           - Aggiungi nota"
        echo -e "  ${GREEN}next${NC}                          - Prossimo turno"
        echo -e "  ${GREEN}status${NC}                        - Mostra stato completo"
        echo -e "  ${GREEN}end${NC}                           - Termina combattimento"
        ;;
esac
