#!/bin/bash

# Script per aggiungere alias combat alla shell

SHELL_RC=""

# Determina quale file rc usare
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
else
    echo "Shell non riconosciuta. Aggiungi manualmente l'alias:"
    echo ""
    echo "alias combat='$(pwd)/.claude/commands/combat-cmd.sh'"
    exit 1
fi

COMBAT_SCRIPT="$(pwd)/.claude/commands/combat-cmd.sh"
ALIAS_LINE="alias combat='$COMBAT_SCRIPT'"

# Verifica se l'alias esiste già
if grep -q "alias combat=" "$SHELL_RC" 2>/dev/null; then
    echo "✅ Alias 'combat' già presente in $SHELL_RC"
else
    echo "" >> "$SHELL_RC"
    echo "# Combat Tracker for D&D" >> "$SHELL_RC"
    echo "$ALIAS_LINE" >> "$SHELL_RC"
    echo "✅ Alias 'combat' aggiunto a $SHELL_RC"
    echo ""
    echo "Per attivarlo ora, esegui:"
    echo "  source $SHELL_RC"
fi
