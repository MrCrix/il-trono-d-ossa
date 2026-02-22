#!/bin/bash

# Combat Tracker - Quick Start Script

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo "⚔️  ========================================"
echo "   COMBAT TRACKER - Avvio"
echo "   ========================================"
echo ""

# Check se node_modules esiste
if [ ! -d "node_modules" ]; then
    echo "📦 Installazione dipendenze..."
    npm install
    echo ""
fi

# Avvia server
echo "🚀 Avvio server..."
echo ""

npm start
