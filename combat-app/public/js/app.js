// Main Vue App
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      socket: null,
      state: {
        encounter: 'In attesa di iniziare...',
        encounter_file: null,
        round: 0,
        current_turn: 0,
        combatants: [],
        log: []
      },
      encounters: [],
      partyCharacters: [],
      connected: false,
      showStatBlockModal: false,

      // New: 4-panel architecture state
      selectedCombatantId: null,
      hoveredCombatantId: null,
      rosterFilterType: 'all', // 'all', 'player', 'enemy'
      logCollapsed: false,
      undoStack: [],
      canUndo: false,
      forceSetupMode: false,
      isFirstStateReceived: true
    };
  },
  computed: {
    // Computed: selected combatant object
    selectedCombatant() {
      if (!this.selectedCombatantId) return null;
      return this.state.combatants.find(c => c.id === this.selectedCombatantId);
    },

    // Computed: left column mode (setup vs roster)
    leftColumnMode() {
      if (this.forceSetupMode) return 'setup';
      return this.state.combatants.length > 0 ? 'roster' : 'setup';
    },

    // Computed: current turn combatant name
    currentTurnName() {
      if (this.state.combatants.length === 0) return '';
      const currentCombatant = this.state.combatants[this.state.current_turn];
      return currentCombatant ? currentCombatant.name : '';
    }
  },
  mounted() {
    console.log('[App] Vue app mounted!');
    this.initializeSocket();
    this.loadEncounters();
    this.loadPartyCharacters();
  },
  methods: {
    // ========== WebSocket Setup ==========
    initializeSocket() {
      this.socket = io();

      this.socket.on('connect', () => {
        console.log('[WebSocket] Connesso al server');
        this.connected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('[WebSocket] Disconnesso dal server');
        this.connected = false;
      });

      this.socket.on('combat:state-changed', (newState) => {
        console.log('[WebSocket] Stato aggiornato:', newState);

        // Gestione stato stale: al primo caricamento, se c'è un combattimento
        // precedente, mostra un avviso all'utente
        if (this.isFirstStateReceived && newState.combatants.length > 0) {
          this.isFirstStateReceived = false;
          console.log('[App] Stato stale rilevato: combattimento precedente trovato');
          // Dopo un breve delay per permettere il render iniziale
          setTimeout(() => {
            const continua = confirm(
              `Trovato un combattimento precedente: "${newState.encounter}" (Round ${newState.round}, ${newState.combatants.length} combattenti).\n\n` +
              'Vuoi continuare questo combattimento?\n\n' +
              'OK = Continua\nAnnulla = Resetta e scegli nuovo encounter'
            );
            if (!continua) {
              this.handleNewEncounter();
            }
          }, 300);
        } else {
          this.isFirstStateReceived = false;
        }

        // Se il turno è cambiato, auto-seleziona il combattente corrente
        if (newState.current_turn !== this.state.current_turn && newState.combatants.length > 0) {
          const currentCombatant = newState.combatants[newState.current_turn];
          if (currentCombatant) {
            this.selectedCombatantId = currentCombatant.id;
          }
        }

        // Se lo stato è stato resettato (0 combattenti), disattiva forceSetupMode
        if (newState.combatants.length === 0) {
          this.forceSetupMode = false;
        }

        this.state = newState;
      });

      this.socket.on('error', (error) => {
        console.error('[WebSocket] Errore:', error);
        alert(`Errore: ${error.message}`);
      });
    },

    // ========== API Calls ==========
    async loadEncounters() {
      try {
        const response = await fetch('/api/encounters');
        const data = await response.json();
        if (data.success) {
          this.encounters = data.encounters;
          console.log('[App] Encounters caricati:', this.encounters);
        }
      } catch (error) {
        console.error('Errore caricamento encounters:', error);
      }
    },

    async loadPartyCharacters() {
      try {
        const response = await fetch('/api/party-characters');
        const data = await response.json();
        if (data.success) {
          // Aggiungi campi reattivi per input e alias per compatibilità
          this.partyCharacters = data.characters.map(pc => ({
            ...pc,
            hp: pc.hp_default,
            ac: pc.ac_default,
            initiative: null,
            currentHp: null,
            currentAc: null
          }));
          console.log('[App] Party characters caricati:', this.partyCharacters.length);
        }
      } catch (error) {
        console.error('Errore caricamento party characters:', error);
      }
    },

    async handleInitEncounter(encounterName) {
      try {
        const response = await fetch(`/api/combat/init/${encounterName}`, {
          method: 'POST'
        });
        const data = await response.json();
        if (data.success) {
          console.log('Encounter inizializzato:', data.state);
          this.forceSetupMode = false;
        } else {
          alert(`Errore inizializzazione: ${data.error}`);
        }
      } catch (error) {
        console.error('Errore inizializzazione encounter:', error);
        alert('Errore inizializzazione encounter');
      }
    },

    async handleReset() {
      try {
        const response = await fetch('/api/combat/reset', {
          method: 'POST'
        });
        const data = await response.json();
        if (data.success) {
          console.log('Combattimento resettato');
          // Forza UI in setup mode e resetta stato locale
          this.forceSetupMode = false;
          this.selectedCombatantId = null;
          this.undoStack = [];
          this.canUndo = false;
        }
      } catch (error) {
        console.error('Errore reset:', error);
      }
    },

    async handleNewEncounter() {
      try {
        const response = await fetch('/api/combat/reset', {
          method: 'POST'
        });
        const data = await response.json();
        if (data.success) {
          console.log('Combattimento resettato per nuovo encounter');
          this.forceSetupMode = false;
          this.selectedCombatantId = null;
          this.undoStack = [];
          this.canUndo = false;
        }
      } catch (error) {
        console.error('Errore reset per nuovo encounter:', error);
      }
    },

    // ========== WebSocket Events (without undo - for non-critical actions) ==========

    handlePrevTurn() {
      // Implementa prev turn via API
      fetch('/api/combat/prev-turn', { method: 'POST' })
        .catch(err => console.error('Errore prev turn:', err));
    },

    handleAddPC(pcData) {
      this.socket.emit('combat:add-pc', pcData);
    },

    handleAddCombatant(data) {
      this.socket.emit('combat:add-combatant', data);
    },

    handleAddCondition({ id, condition }) {
      this.pushUndo(`Aggiungi condizione: ${condition}`);
      this.socket.emit('combat:add-condition', { id, condition });
    },

    handleRemoveCondition({ id, condition }) {
      this.pushUndo(`Rimuovi condizione: ${condition}`);
      this.socket.emit('combat:remove-condition', { id, condition });
    },

    handleReorderInitiative({ oldIndex, newIndex }) {
      // Riordina localmente per feedback immediato
      const combatants = [...this.state.combatants];
      const [movedItem] = combatants.splice(oldIndex, 1);
      combatants.splice(newIndex, 0, movedItem);

      // Aggiorna lo stato locale
      this.state.combatants = combatants;

      // Invia al server per persistenza
      this.socket.emit('combat:reorder-initiative', { oldIndex, newIndex });
    },

    openStatBlockModal(combatant) {
      this.showStatBlockModal = true;
    },

    closeStatBlockModal() {
      this.showStatBlockModal = false;
    },

    // ========== New: 4-Panel Architecture Methods ==========

    handleSelectCombatantById(id) {
      this.selectedCombatantId = id;
    },

    deselectCombatant() {
      this.selectedCombatantId = null;
    },

    handleToggleDead({ id }) {
      const combatant = this.state.combatants.find(c => c.id === id);
      if (!combatant) return;

      this.socket.emit('combat:update', {
        id,
        changes: { is_dead: !combatant.is_dead }
      });
    },

    handleClearLog() {
      if (confirm('Vuoi cancellare il log di combattimento?')) {
        this.state.log = [];
        this.socket.emit('combat:clear-log');
      }
    },

    handleUndo() {
      if (this.undoStack.length === 0) return;

      const snapshot = this.undoStack.pop();
      this.state = snapshot.state;

      // Broadcast restored state
      this.socket.emit('combat:restore-state', snapshot.state);

      this.canUndo = this.undoStack.length > 0;

      console.log(`[Undo] Ripristinato: ${snapshot.action}`);
    },

    pushUndo(action) {
      // Save current state snapshot before making changes
      this.undoStack.push({
        timestamp: Date.now(),
        action: action,
        state: JSON.parse(JSON.stringify(this.state)) // deep clone
      });

      // Limit stack size to 10
      if (this.undoStack.length > 10) {
        this.undoStack.shift();
      }

      this.canUndo = true;
    },

    // Override existing handlers to include undo
    handleDamage({ id, amount }) {
      this.pushUndo(`Danno -${amount}`);
      this.socket.emit('combat:damage', { id, amount });
    },

    handleHeal({ id, amount }) {
      this.pushUndo(`Cura +${amount}`);
      this.socket.emit('combat:heal', { id, amount });
    },

    handleNextTurn() {
      this.pushUndo('Next Turn');
      this.socket.emit('combat:next-turn');
    },

    handleUpdateCombatant({ id, changes }) {
      this.pushUndo(`Update ${Object.keys(changes).join(', ')}`);
      this.socket.emit('combat:update', { id, changes });
    }
  }
});

// Registra componenti (new 4-panel architecture)
app.component('top-bar', TopBar);
app.component('left-column', LeftColumn);
app.component('initiative-timeline', InitiativeTimeline);
app.component('combatant-details', CombatantDetails);
app.component('combat-log', CombatLog);
app.component('stat-block-modal', StatBlockModal);

// Mount app
app.mount('#app');

console.log('🎲 Combat Tracker App caricata!');
