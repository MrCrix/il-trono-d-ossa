const stateManager = require('../services/state-manager');

/**
 * Gestori eventi WebSocket per aggiornamenti real-time
 */
class WebSocketHandlers {
  constructor(io) {
    this.io = io;
  }

  /**
   * Setup handlers per una connessione socket
   */
  setupHandlers(socket) {
    console.log(`[WebSocket] Client connesso: ${socket.id}`);

    // Invia stato corrente al nuovo client
    socket.emit('combat:state-changed', stateManager.load());

    // Applica danno
    socket.on('combat:damage', async (data) => {
      try {
        const { id, amount } = data;
        const state = stateManager.load();
        const combatant = stateManager.findCombatant(state, id);

        if (!combatant) {
          socket.emit('error', { message: 'Combattente non trovato' });
          return;
        }

        // Applica danno
        combatant.hp_current = Math.max(0, combatant.hp_current - amount);

        // Log entry
        stateManager.addLogEntry(state, {
          type: 'damage',
          actor: 'DM',
          target: combatant.name,
          message: `${combatant.name} subisce ${amount} danni (HP: ${combatant.hp_current}/${combatant.hp_max})`
        });

        // Salva e broadcast
        await stateManager.save(state);
        this.io.emit('combat:state-changed', state);
        console.log(`[WebSocket] Danno applicato: ${combatant.name} -${amount} HP`);
      } catch (error) {
        console.error('[WebSocket] Errore combat:damage:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Cura HP
    socket.on('combat:heal', async (data) => {
      try {
        const { id, amount } = data;
        const state = stateManager.load();
        const combatant = stateManager.findCombatant(state, id);

        if (!combatant) {
          socket.emit('error', { message: 'Combattente non trovato' });
          return;
        }

        // Cura (non oltre max)
        combatant.hp_current = Math.min(combatant.hp_max, combatant.hp_current + amount);

        // Log entry
        stateManager.addLogEntry(state, {
          type: 'heal',
          actor: 'DM',
          target: combatant.name,
          message: `${combatant.name} recupera ${amount} HP (HP: ${combatant.hp_current}/${combatant.hp_max})`
        });

        // Salva e broadcast
        await stateManager.save(state);
        this.io.emit('combat:state-changed', state);
        console.log(`[WebSocket] Cura applicata: ${combatant.name} +${amount} HP`);
      } catch (error) {
        console.error('[WebSocket] Errore combat:heal:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Next turn
    socket.on('combat:next-turn', async () => {
      try {
        const state = stateManager.load();

        if (state.combatants.length === 0) {
          socket.emit('error', { message: 'Nessun combattente presente' });
          return;
        }

        // Controlla se ci sono combattenti vivi
        const hasAlive = state.combatants.some(c => !c.is_dead);
        if (!hasAlive) {
          socket.emit('error', { message: 'Tutti i combattenti sono morti' });
          return;
        }

        // Avanza al prossimo combattente vivo
        const total = state.combatants.length;
        let steps = 0;
        do {
          state.current_turn++;
          if (state.current_turn >= total) {
            state.current_turn = 0;
            state.round++;

            stateManager.addLogEntry(state, {
              type: 'turn',
              message: `Inizio round ${state.round}`
            });
          }
          steps++;
        } while (state.combatants[state.current_turn].is_dead && steps < total);

        const currentCombatant = state.combatants[state.current_turn];

        stateManager.addLogEntry(state, {
          type: 'turn',
          message: `Turno di: ${currentCombatant.name}`
        });

        // Salva e broadcast
        await stateManager.save(state);
        this.io.emit('combat:state-changed', state);
        console.log(`[WebSocket] Next turn: ${currentCombatant.name} (Round ${state.round})`);
      } catch (error) {
        console.error('[WebSocket] Errore combat:next-turn:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Aggiungi PG
    socket.on('combat:add-pc', async (data) => {
      try {
        const { name, initiative, hp, ac } = data;
        const state = stateManager.load();

        // Crea nuovo PG
        const newPC = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: name,
          type: 'player',
          hp_current: hp || 50,
          hp_max: hp || 50,
          temp_hp: 0,
          ac: ac || 15,
          initiative: initiative,
          initiative_modifier: 0,
          conditions: [],
          concentration: null,
          notes: '',
          is_dead: false,
          is_hidden: false,
          stat_block: null
        };

        state.combatants.push(newPC);

        // Riordina per iniziativa
        state.combatants.sort((a, b) => b.initiative - a.initiative);

        stateManager.addLogEntry(state, {
          type: 'system',
          message: `PG aggiunto: ${name} (Iniziativa: ${initiative})`
        });

        // Salva e broadcast
        await stateManager.save(state);
        this.io.emit('combat:state-changed', state);
        console.log(`[WebSocket] PG aggiunto: ${name}`);
      } catch (error) {
        console.error('[WebSocket] Errore combat:add-pc:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Aggiungi combattente generico (nemico/alleato)
    socket.on('combat:add-combatant', async (data) => {
      try {
        const { name, type, initiative, hp, ac } = data;
        const state = stateManager.load();

        const newCombatant = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: name,
          type: type || 'enemy',
          hp_current: hp || 10,
          hp_max: hp || 10,
          temp_hp: 0,
          ac: ac || 10,
          initiative: initiative,
          initiative_modifier: 0,
          conditions: [],
          concentration: null,
          notes: '',
          is_dead: false,
          is_hidden: false,
          stat_block: null
        };

        state.combatants.push(newCombatant);

        // Riordina per iniziativa
        state.combatants.sort((a, b) => b.initiative - a.initiative);

        const typeLabel = type === 'ally' ? 'Alleato' : 'Nemico';
        stateManager.addLogEntry(state, {
          type: 'system',
          message: `${typeLabel} aggiunto: ${name} (Init: ${initiative}, HP: ${hp}, CA: ${ac})`
        });

        await stateManager.save(state);
        this.io.emit('combat:state-changed', state);
        console.log(`[WebSocket] ${typeLabel} aggiunto: ${name}`);
      } catch (error) {
        console.error('[WebSocket] Errore combat:add-combatant:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Update combattente (per edit inline)
    socket.on('combat:update', async (data) => {
      try {
        const { id, changes } = data;
        const state = stateManager.load();
        const combatant = stateManager.findCombatant(state, id);

        if (!combatant) {
          socket.emit('error', { message: 'Combattente non trovato' });
          return;
        }

        // Applica modifiche
        Object.assign(combatant, changes);

        // Riordina se iniziativa cambiata
        if (changes.initiative !== undefined) {
          state.combatants.sort((a, b) => b.initiative - a.initiative);
        }

        // Salva e broadcast
        await stateManager.save(state);
        this.io.emit('combat:state-changed', state);
        console.log(`[WebSocket] Combattente aggiornato: ${combatant.name}`);
      } catch (error) {
        console.error('[WebSocket] Errore combat:update:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Aggiungi condizione
    socket.on('combat:add-condition', async (data) => {
      try {
        const { id, condition } = data;
        const state = stateManager.load();
        const combatant = stateManager.findCombatant(state, id);

        if (!combatant) {
          socket.emit('error', { message: 'Combattente non trovato' });
          return;
        }

        // Aggiungi condizione (FASE 1: semplice stringa, FASE 4: oggetto strutturato)
        if (!combatant.conditions.includes(condition)) {
          combatant.conditions.push(condition);

          stateManager.addLogEntry(state, {
            type: 'condition',
            actor: 'DM',
            target: combatant.name,
            message: `${combatant.name} subisce condizione: ${condition}`
          });
        }

        // Salva e broadcast
        await stateManager.save(state);
        this.io.emit('combat:state-changed', state);
        console.log(`[WebSocket] Condizione aggiunta: ${combatant.name} -> ${condition}`);
      } catch (error) {
        console.error('[WebSocket] Errore combat:add-condition:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Rimuovi condizione
    socket.on('combat:remove-condition', async (data) => {
      try {
        const { id, condition } = data;
        const state = stateManager.load();
        const combatant = stateManager.findCombatant(state, id);

        if (!combatant) {
          socket.emit('error', { message: 'Combattente non trovato' });
          return;
        }

        // Rimuovi condizione
        const index = combatant.conditions.indexOf(condition);
        if (index > -1) {
          combatant.conditions.splice(index, 1);

          stateManager.addLogEntry(state, {
            type: 'condition',
            actor: 'DM',
            target: combatant.name,
            message: `${combatant.name} rimuove condizione: ${condition}`
          });
        }

        // Salva e broadcast
        await stateManager.save(state);
        this.io.emit('combat:state-changed', state);
        console.log(`[WebSocket] Condizione rimossa: ${combatant.name} -> ${condition}`);
      } catch (error) {
        console.error('[WebSocket] Errore combat:remove-condition:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Riordina iniziativa (drag-and-drop)
    socket.on('combat:reorder-initiative', async (data) => {
      try {
        const { oldIndex, newIndex } = data;
        const state = stateManager.load();

        if (oldIndex < 0 || oldIndex >= state.combatants.length ||
            newIndex < 0 || newIndex >= state.combatants.length) {
          socket.emit('error', { message: 'Indici non validi' });
          return;
        }

        // Riordina array
        const [movedItem] = state.combatants.splice(oldIndex, 1);
        state.combatants.splice(newIndex, 0, movedItem);

        // Aggiusta current_turn se necessario
        if (state.current_turn === oldIndex) {
          state.current_turn = newIndex;
        } else if (oldIndex < state.current_turn && newIndex >= state.current_turn) {
          state.current_turn--;
        } else if (oldIndex > state.current_turn && newIndex <= state.current_turn) {
          state.current_turn++;
        }

        stateManager.addLogEntry(state, {
          type: 'system',
          message: `Ordine iniziativa modificato: ${movedItem.name} spostato`
        });

        // Salva e broadcast
        await stateManager.save(state);
        this.io.emit('combat:state-changed', state);
        console.log(`[WebSocket] Iniziativa riordinata: ${oldIndex} -> ${newIndex}`);
      } catch (error) {
        console.error('[WebSocket] Errore combat:reorder-initiative:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Disconnessione
    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnesso: ${socket.id}`);
    });
  }

  /**
   * Broadcast stato a tutti i client connessi
   */
  broadcastState(state) {
    this.io.emit('combat:state-changed', state);
  }
}

module.exports = WebSocketHandlers;
