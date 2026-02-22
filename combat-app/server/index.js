const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const chokidar = require('chokidar');

const parser = require('./services/parser');
const stateManager = require('./services/state-manager');
const WebSocketHandlers = require('./websocket/handlers');

// Inizializza Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Setup WebSocket handlers
const wsHandlers = new WebSocketHandlers(io);
io.on('connection', (socket) => {
  wsHandlers.setupHandlers(socket);
});

// File watcher per sincronizzazione bidirezionale CLI <-> Web App
const stateFilePath = path.join(__dirname, '../..', 'combat-state.json');
const watcher = chokidar.watch(stateFilePath, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 100
  }
});

watcher.on('change', (filePath) => {
  console.log('[File Watcher] combat-state.json modificato, broadcasting update...');
  try {
    const newState = stateManager.load();
    wsHandlers.broadcastState(newState);
  } catch (error) {
    console.error('[File Watcher] Errore broadcasting state:', error);
  }
});

// ==================== API REST ENDPOINTS ====================

/**
 * GET /api/encounters - Lista encounter disponibili
 */
app.get('/api/encounters', (req, res) => {
  try {
    const encounters = parser.listEncounters();
    res.json({ success: true, encounters });
  } catch (error) {
    console.error('[API] Errore /api/encounters:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/combat/init/:name - Inizializza encounter
 */
app.post('/api/combat/init/:name', async (req, res) => {
  try {
    const encounterName = req.params.name;
    console.log(`[API] Inizializzazione encounter: ${encounterName}`);

    // Parse encounter
    const encounterData = parser.parseEncounter(encounterName);

    // Inizializza stato
    const state = await stateManager.initCombat(encounterData);

    // Broadcast a tutti i client
    wsHandlers.broadcastState(state);

    res.json({ success: true, state });
  } catch (error) {
    console.error('[API] Errore /api/combat/init:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/combat/state - Stato corrente
 */
app.get('/api/combat/state', (req, res) => {
  try {
    const state = stateManager.load();
    res.json({ success: true, state });
  } catch (error) {
    console.error('[API] Errore /api/combat/state:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/combat/reset - Reset combattimento
 */
app.post('/api/combat/reset', async (req, res) => {
  try {
    await stateManager.reset();
    const state = stateManager.load();
    wsHandlers.broadcastState(state);
    res.json({ success: true, state });
  } catch (error) {
    console.error('[API] Errore /api/combat/reset:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/combatant - Aggiungi combattente
 */
app.post('/api/combatant', async (req, res) => {
  try {
    const { name, type, hp, ac, initiative } = req.body;

    const state = stateManager.load();

    const newCombatant = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: type || 'player',
      hp_current: hp,
      hp_max: hp,
      temp_hp: 0,
      ac,
      initiative,
      initiative_modifier: 0,
      conditions: [],
      concentration: null,
      notes: '',
      is_dead: false,
      is_hidden: false,
      stat_block: null
    };

    state.combatants.push(newCombatant);
    state.combatants.sort((a, b) => b.initiative - a.initiative);

    stateManager.addLogEntry(state, {
      type: 'system',
      message: `Combattente aggiunto: ${name}`
    });

    await stateManager.save(state);
    wsHandlers.broadcastState(state);

    res.json({ success: true, combatant: newCombatant });
  } catch (error) {
    console.error('[API] Errore /api/combatant POST:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/combatant/:id - Modifica combattente
 */
app.patch('/api/combatant/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body;

    const state = stateManager.load();
    const combatant = stateManager.findCombatant(state, id);

    if (!combatant) {
      return res.status(404).json({ success: false, error: 'Combattente non trovato' });
    }

    Object.assign(combatant, changes);

    // Riordina se iniziativa cambiata
    if (changes.initiative !== undefined) {
      state.combatants.sort((a, b) => b.initiative - a.initiative);
    }

    await stateManager.save(state);
    wsHandlers.broadcastState(state);

    res.json({ success: true, combatant });
  } catch (error) {
    console.error('[API] Errore /api/combatant PATCH:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/combatant/:id - Rimuovi combattente
 */
app.delete('/api/combatant/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const state = stateManager.load();

    const index = stateManager.findCombatantIndex(state, id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Combattente non trovato' });
    }

    const removed = state.combatants.splice(index, 1)[0];

    stateManager.addLogEntry(state, {
      type: 'system',
      message: `Combattente rimosso: ${removed.name}`
    });

    await stateManager.save(state);
    wsHandlers.broadcastState(state);

    res.json({ success: true, removed });
  } catch (error) {
    console.error('[API] Errore /api/combatant DELETE:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/combat/damage - Applica danno
 */
app.post('/api/combat/damage', async (req, res) => {
  try {
    const { id, amount } = req.body;
    const state = stateManager.load();
    const combatant = stateManager.findCombatant(state, id);

    if (!combatant) {
      return res.status(404).json({ success: false, error: 'Combattente non trovato' });
    }

    combatant.hp_current = Math.max(0, combatant.hp_current - amount);

    stateManager.addLogEntry(state, {
      type: 'damage',
      actor: 'DM',
      target: combatant.name,
      message: `${combatant.name} subisce ${amount} danni (HP: ${combatant.hp_current}/${combatant.hp_max})`
    });

    await stateManager.save(state);
    wsHandlers.broadcastState(state);

    res.json({ success: true, combatant });
  } catch (error) {
    console.error('[API] Errore /api/combat/damage:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/combat/heal - Cura HP
 */
app.post('/api/combat/heal', async (req, res) => {
  try {
    const { id, amount } = req.body;
    const state = stateManager.load();
    const combatant = stateManager.findCombatant(state, id);

    if (!combatant) {
      return res.status(404).json({ success: false, error: 'Combattente non trovato' });
    }

    combatant.hp_current = Math.min(combatant.hp_max, combatant.hp_current + amount);

    stateManager.addLogEntry(state, {
      type: 'heal',
      actor: 'DM',
      target: combatant.name,
      message: `${combatant.name} recupera ${amount} HP (HP: ${combatant.hp_current}/${combatant.hp_max})`
    });

    await stateManager.save(state);
    wsHandlers.broadcastState(state);

    res.json({ success: true, combatant });
  } catch (error) {
    console.error('[API] Errore /api/combat/heal:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/combat/next-turn - Prossimo turno
 */
app.post('/api/combat/next-turn', async (req, res) => {
  try {
    const state = stateManager.load();

    if (state.combatants.length === 0) {
      return res.status(400).json({ success: false, error: 'Nessun combattente presente' });
    }

    state.current_turn++;

    if (state.current_turn >= state.combatants.length) {
      state.current_turn = 0;
      state.round++;

      stateManager.addLogEntry(state, {
        type: 'turn',
        message: `Inizio round ${state.round}`
      });
    }

    const currentCombatant = state.combatants[state.current_turn];

    stateManager.addLogEntry(state, {
      type: 'turn',
      message: `Turno di: ${currentCombatant.name}`
    });

    await stateManager.save(state);
    wsHandlers.broadcastState(state);

    res.json({ success: true, state });
  } catch (error) {
    console.error('[API] Errore /api/combat/next-turn:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/combat/prev-turn - Turno precedente
 */
app.post('/api/combat/prev-turn', async (req, res) => {
  try {
    const state = stateManager.load();

    if (state.combatants.length === 0) {
      return res.status(400).json({ success: false, error: 'Nessun combattente presente' });
    }

    state.current_turn--;

    if (state.current_turn < 0) {
      state.current_turn = state.combatants.length - 1;
      state.round = Math.max(1, state.round - 1);
    }

    await stateManager.save(state);
    wsHandlers.broadcastState(state);

    res.json({ success: true, state });
  } catch (error) {
    console.error('[API] Errore /api/combat/prev-turn:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3000;

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('⚔️  ========================================');
  console.log('   COMBAT TRACKER - Il Trono d\'Ossa');
  console.log('   ========================================');
  console.log('');
  console.log(`   🌐 Server: http://localhost:${PORT}`);
  console.log(`   📁 Encounters: ${path.join(__dirname, '../..', 'encounters')}`);
  console.log(`   💾 State file: ${stateFilePath}`);
  console.log('');
  console.log('   ✅ WebSocket attivo');
  console.log('   ✅ File watcher attivo');
  console.log('   ✅ CLI bridge disponibile');
  console.log('');
  console.log('   Apri il browser su: http://localhost:3000');
  console.log('');
  console.log('========================================');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Server] Shutdown graceful...');
  watcher.close();
  server.close(() => {
    console.log('[Server] Server chiuso');
    process.exit(0);
  });
});
