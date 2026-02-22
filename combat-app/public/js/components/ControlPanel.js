// ControlPanel Component
const ControlPanel = {
  name: 'ControlPanel',
  template: `
    <div class="control-panel">
      <div class="control-panel-grid">
        <!-- Encounter Selector -->
        <div class="encounter-selector">
          <h3>📚 Seleziona Encounter</h3>
          <div style="display: flex; margin-top: 0.5rem; gap: 0.5rem;">
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
              ⚔️ Inizia
            </button>
          </div>
        </div>

        <!-- Party Characters List -->
        <div class="party-characters-section">
          <h3>👥 Aggiungi PG al Combattimento</h3>
          <div class="party-characters-list">
            <div
              v-for="pc in partyCharacters"
              :key="pc.id"
              class="pc-quick-add"
            >
              <div class="pc-info">
                <span class="pc-name">{{ pc.name }}</span>
                <span class="pc-details">{{ pc.class }} Lv{{ pc.level }}</span>
              </div>
              <div class="pc-stats">
                <input
                  v-model.number="pc.currentHp"
                  type="number"
                  :placeholder="'HP: ' + pc.hp_default"
                  class="pc-input-small"
                  title="HP (vuoto = default)"
                />
                <input
                  v-model.number="pc.currentAc"
                  type="number"
                  :placeholder="'CA: ' + pc.ac_default"
                  class="pc-input-small"
                  title="CA (vuoto = default)"
                />
                <input
                  v-model.number="pc.initiative"
                  type="number"
                  placeholder="Init"
                  class="pc-input-init"
                  @keyup.enter="addPCQuick(pc)"
                  title="Iniziativa (obbligatorio)"
                  required
                />
                <button
                  @click="addPCQuick(pc)"
                  :disabled="!pc.initiative"
                  class="pc-add-btn"
                  title="Aggiungi al combattimento"
                >
                  ➕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reset -->
      <div class="reset-section" v-if="combatActive">
        <button @click="confirmReset">
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
    },
    partyCharacters: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedEncounter: ''
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
    addPCQuick(pc) {
      if (!pc.initiative) {
        alert('Iniziativa obbligatoria!');
        return;
      }

      const pcData = {
        name: pc.name,
        initiative: pc.initiative,
        hp: pc.currentHp || pc.hp_default,
        ac: pc.currentAc || pc.ac_default
      };

      this.$emit('add-pc', pcData);

      // Reset solo iniziativa (HP e CA mantengono i valori custom se inseriti)
      pc.initiative = null;
    },
    confirmReset() {
      if (confirm('⚠️ Sei sicuro di voler resettare il combattimento? Tutti i dati verranno persi.')) {
        this.$emit('reset');
      }
    }
  }
};
