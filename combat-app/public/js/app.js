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
      connected: false
    };
  },
  mounted() {
    this.initializeSocket();
    this.loadEncounters();
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
        }
      } catch (error) {
        console.error('Errore caricamento encounters:', error);
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
        }
      } catch (error) {
        console.error('Errore reset:', error);
      }
    },

    // ========== WebSocket Events ==========
    handleDamage({ id, amount }) {
      this.socket.emit('combat:damage', { id, amount });
    },

    handleHeal({ id, amount }) {
      this.socket.emit('combat:heal', { id, amount });
    },

    handleNextTurn() {
      this.socket.emit('combat:next-turn');
    },

    handlePrevTurn() {
      // Implementa prev turn via API
      fetch('/api/combat/prev-turn', { method: 'POST' })
        .catch(err => console.error('Errore prev turn:', err));
    },

    handleAddPC(pcData) {
      this.socket.emit('combat:add-pc', pcData);
    },

    handleUpdateCombatant({ id, changes }) {
      this.socket.emit('combat:update', { id, changes });
    },

    handleAddCondition({ id, condition }) {
      this.socket.emit('combat:add-condition', { id, condition });
    },

    handleSelectCombatant(id) {
      // Trova index del combattente e imposta come turno corrente
      const index = this.state.combatants.findIndex(c => c.id === id);
      if (index !== -1) {
        this.socket.emit('combat:update', {
          id: 'state',
          changes: { current_turn: index }
        });
      }
    }
  }
});

// Registra componenti
app.component('combatant-card', CombatantCard);
app.component('initiative-tracker', InitiativeTracker);
app.component('control-panel', ControlPanel);
app.component('combat-log', CombatLog);

// Mount app
app.mount('#app');

console.log('🎲 Combat Tracker App caricata!');
