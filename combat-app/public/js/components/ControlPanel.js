// ControlPanel Component
const ControlPanel = {
  name: 'ControlPanel',
  template: `
    <div class="control-panel">
      <div class="control-panel-grid">
        <!-- Encounter Selector -->
        <div class="encounter-selector">
          <h3>📚 Seleziona Encounter</h3>
          <div style="display: flex; margin-top: 0.5rem;">
            <select v-model="selectedEncounter">
              <option value="">-- Seleziona encounter --</option>
              <option
                v-for="encounter in encounters"
                :key="encounter"
                :value="encounter"
              >
                {{ encounter }}
              </option>
            </select>
            <button
              @click="initEncounter"
              :disabled="!selectedEncounter"
            >
              ⚔️ Inizia Combattimento
            </button>
          </div>
        </div>

        <!-- Add PC Form -->
        <div class="add-pc-section">
          <h3>👤 Aggiungi PG</h3>
          <div class="add-pc-form">
            <input
              v-model="newPC.name"
              placeholder="Nome"
              @keyup.enter="addPC"
            />
            <input
              v-model.number="newPC.initiative"
              type="number"
              placeholder="Iniziativa"
              @keyup.enter="addPC"
            />
            <input
              v-model.number="newPC.hp"
              type="number"
              placeholder="HP (default: 50)"
              @keyup.enter="addPC"
            />
            <input
              v-model.number="newPC.ac"
              type="number"
              placeholder="CA (default: 15)"
              @keyup.enter="addPC"
            />
            <button @click="addPC">➕ Aggiungi</button>
          </div>
        </div>
      </div>

      <!-- Reset -->
      <div class="reset-section" style="margin-top: 1rem;">
        <button
          v-if="combatActive"
          @click="confirmReset"
        >
          🔄 Reset Combattimento
        </button>
      </div>
    </div>
  `,
  props: {
    encounters: {
      type: Array,
      required: true
    },
    combatActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedEncounter: '',
      newPC: {
        name: '',
        initiative: null,
        hp: null,
        ac: null
      }
    };
  },
  methods: {
    initEncounter() {
      if (!this.selectedEncounter) {
        alert('Seleziona un encounter!');
        return;
      }
      this.$emit('init-encounter', this.selectedEncounter);
      this.selectedEncounter = '';
    },
    addPC() {
      if (!this.newPC.name || this.newPC.initiative === null) {
        alert('Nome e iniziativa sono obbligatori!');
        return;
      }

      this.$emit('add-pc', {
        name: this.newPC.name,
        initiative: this.newPC.initiative,
        hp: this.newPC.hp || 50,
        ac: this.newPC.ac || 15
      });

      // Reset form
      this.newPC = {
        name: '',
        initiative: null,
        hp: null,
        ac: null
      };
    },
    confirmReset() {
      if (confirm('⚠️ Sei sicuro di voler resettare il combattimento? Tutti i dati verranno persi.')) {
        this.$emit('reset');
      }
    }
  }
};
