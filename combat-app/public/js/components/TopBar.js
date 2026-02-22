// Top Bar Component - Master Controls
const TopBar = {
  template: `
    <div class="top-bar">
      <!-- Left Section: Encounter Info -->
      <div class="left-section">
        <span class="encounter-badge">📜 {{ encounterName }}</span>
        <span v-if="combatActive" class="round-badge">⏱️ Round {{ round }}</span>
        <span v-if="combatActive && currentTurnName" class="turn-badge">
          Turno: {{ currentTurnName }}
        </span>
      </div>

      <!-- Center Section: Navigation -->
      <div v-if="combatActive" class="center-section">
        <button class="btn-prev" @click="$emit('prev-turn')" title="Turno precedente (P)">
          ← Prev
        </button>
        <button class="btn-next" @click="$emit('next-turn')" title="Prossimo turno (N)">
          Next →
        </button>
      </div>

      <!-- Right Section: Utilities -->
      <div class="right-section">
        <button
          v-if="combatActive"
          class="btn-undo"
          @click="$emit('undo')"
          :disabled="!canUndo"
          title="Annulla ultima azione (Ctrl+Z)">
          ⎌ Undo
        </button>
        <button
          v-if="hasCombatants"
          class="btn-new-encounter-topbar"
          @click="handleNewEncounter"
          title="Seleziona un nuovo encounter">
          🎲 Nuovo Encounter
        </button>
        <button
          v-if="hasCombatants"
          class="btn-reset"
          @click="handleReset"
          title="Reset combattimento">
          🔄 Reset
        </button>
      </div>
    </div>
  `,
  props: {
    encounterName: {
      type: String,
      default: 'In attesa di iniziare...'
    },
    round: {
      type: Number,
      default: 0
    },
    currentTurnName: {
      type: String,
      default: ''
    },
    canUndo: {
      type: Boolean,
      default: false
    },
    combatActive: {
      type: Boolean,
      default: false
    },
    hasCombatants: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleReset() {
      if (confirm('Vuoi resettare il combattimento? Tutti i dati verranno persi.')) {
        this.$emit('reset');
      }
    },
    handleNewEncounter() {
      if (confirm('Vuoi abbandonare il combattimento corrente e selezionare un nuovo encounter?')) {
        this.$emit('new-encounter');
      }
    }
  }
};
