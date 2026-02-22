// Left Column Component - Mode Switching (Setup vs Roster)
const LeftColumn = {
  template: `
    <div class="left-column" :class="'mode-' + mode">
      <!-- SETUP MODE (pre-combattimento) -->
      <div v-if="mode === 'setup'" class="mode-setup">
        <h3>⚙️ Setup Combattimento</h3>

        <!-- Encounter Selector -->
        <div class="encounter-selector">
          <label style="display: block; margin-bottom: 0.3rem;">Encounter:</label>
          <select
            v-model="selectedEncounter"
            style="display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; background: #2a2a2a; color: #e0e0e0; border: 1px solid #444; border-radius: 4px; font-size: 0.9rem;">
            <option value="">-- Seleziona --</option>
            <option v-for="enc in encountersArray" :key="enc" :value="enc">
              {{ enc }}
            </option>
          </select>
          <button
            @click="initEncounter"
            :disabled="!selectedEncounter"
            style="display: block; width: 100%; padding: 0.6rem; background: #06d6a0; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 0.9rem;">
            🎲 Inizia
          </button>
        </div>

        <!-- Party Characters -->
        <div class="party-section">
          <h3>👥 Aggiungi PG ({{ availablePartyCharacters.length }})</h3>
          <div class="party-characters-list">
            <div v-for="pc in availablePartyCharacters" :key="pc.name" class="pc-quick-add">
              <div class="pc-info">
                <span class="pc-name">{{ pc.name }}</span>
                <span class="pc-details">HP: {{ pc.hp }} | CA: {{ pc.ac }}</span>
              </div>
              <div class="pc-actions">
                <input
                  v-model.number="pc.initiative"
                  type="number"
                  placeholder="Init"
                  class="pc-input-init"
                  @keyup.enter="addPC(pc)" />
                <button
                  @click="addPC(pc)"
                  :disabled="!pc.initiative"
                  class="pc-add-btn">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ROSTER MODE (durante combattimento) -->
      <div v-else-if="mode === 'roster'" class="mode-roster">
        <h3>📋 Roster ({{ combatants.length }})</h3>

        <!-- Filters -->
        <div class="roster-filters">
          <button
            @click="$emit('set-filter', 'all')"
            :class="{ active: filterType === 'all' }">
            Tutti
          </button>
          <button
            @click="$emit('set-filter', 'player')"
            :class="{ active: filterType === 'player' }">
            👤 PG
          </button>
          <button
            @click="$emit('set-filter', 'enemy')"
            :class="{ active: filterType === 'enemy' }">
            💀 Nemici
          </button>
        </div>

        <!-- Roster List -->
        <div class="roster-list">
          <div
            v-for="c in filteredCombatants"
            :key="c.id"
            class="roster-item"
            :class="{
              dead: c.is_dead,
              selected: c.id === selectedCombatantId
            }"
            @click="$emit('select-combatant', c.id)">
            <span class="roster-name">{{ c.name }}</span>
            <span class="roster-hp">{{ c.hp_current }}/{{ c.hp_max }}</span>
            <span v-if="c.is_dead" class="roster-dead">💀</span>
          </div>
        </div>

        <!-- Stats Summary -->
        <div class="roster-stats">
          <div class="stat">👤 PG: {{ alivePlayerCount }}/{{ totalPlayerCount }}</div>
          <div class="stat">💀 Nemici: {{ aliveEnemyCount }}/{{ totalEnemyCount }}</div>
        </div>

        <!-- Party Characters (aggiungi PG al combattimento attivo) -->
        <div v-if="availablePartyCharacters.length > 0" class="party-section">
          <h3>👥 Aggiungi PG ({{ availablePartyCharacters.length }})</h3>
          <div class="party-characters-list">
            <div v-for="pc in availablePartyCharacters" :key="pc.name" class="pc-quick-add">
              <div class="pc-info">
                <span class="pc-name">{{ pc.name }}</span>
                <span class="pc-details">HP: {{ pc.hp }} | CA: {{ pc.ac }}</span>
              </div>
              <div class="pc-actions">
                <input
                  v-model.number="pc.initiative"
                  type="number"
                  placeholder="Init"
                  class="pc-input-init"
                  @keyup.enter="addPC(pc)" />
                <button
                  @click="addPC(pc)"
                  :disabled="!pc.initiative"
                  class="pc-add-btn">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Combatant Button -->
        <button
          class="btn-add-combatant"
          @click="showAddModal = true">
          + Aggiungi Combattente
        </button>

        <!-- Nuovo Encounter Button -->
        <button
          class="btn-new-encounter"
          @click="handleNewEncounter"
          title="Torna alla selezione encounter">
          🎲 Nuovo Encounter
        </button>
      </div>

      <!-- Modal Aggiungi Combattente -->
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-content add-combatant-modal">
          <div class="modal-header">
            <h2>Aggiungi Combattente</h2>
            <button class="modal-close" @click="showAddModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <!-- Tipo -->
            <div class="form-group">
              <label>Tipo</label>
              <div class="type-selector">
                <button
                  :class="{ active: newCombatant.type === 'enemy' }"
                  @click="newCombatant.type = 'enemy'">
                  💀 Nemico
                </button>
                <button
                  :class="{ active: newCombatant.type === 'ally' }"
                  @click="newCombatant.type = 'ally'">
                  🛡️ Alleato
                </button>
              </div>
            </div>
            <!-- Nome -->
            <div class="form-group">
              <label>Nome</label>
              <input v-model="newCombatant.name" type="text" placeholder="es. Goblin Arciere" />
            </div>
            <!-- Quantità -->
            <div class="form-group">
              <label>Quantità</label>
              <input v-model.number="newCombatant.count" type="number" min="1" max="20" />
            </div>
            <!-- Stats Row -->
            <div class="form-row">
              <div class="form-group">
                <label>HP</label>
                <input v-model.number="newCombatant.hp" type="number" min="1" placeholder="HP" />
              </div>
              <div class="form-group">
                <label>CA</label>
                <input v-model.number="newCombatant.ac" type="number" min="1" placeholder="CA" />
              </div>
              <div class="form-group">
                <label>Iniziativa</label>
                <input v-model.number="newCombatant.initiative" type="number" placeholder="Init" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-modal-close" @click="showAddModal = false">Annulla</button>
            <button
              class="btn-modal-confirm"
              :disabled="!newCombatant.name || !newCombatant.hp"
              @click="submitAddCombatant">
              Aggiungi
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    mode: {
      type: String,
      default: 'setup' // 'setup' or 'roster'
    },
    encounters: {
      type: Array,
      default: () => []
    },
    partyCharacters: {
      type: Array,
      default: () => []
    },
    combatants: {
      type: Array,
      default: () => []
    },
    selectedCombatantId: {
      type: String,
      default: null
    },
    filterType: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      selectedEncounter: '',
      showAddModal: false,
      newCombatant: {
        type: 'enemy',
        name: '',
        count: 1,
        hp: null,
        ac: 10,
        initiative: null
      }
    };
  },
  mounted() {
    console.log('[LeftColumn] Mounted, mode:', this.mode);
    console.log('[LeftColumn] Encounters:', this.encounters);
    console.log('[LeftColumn] Encounters.length:', this.encounters.length);
    console.log('[LeftColumn] Encounters array:', Array.from(this.encounters));
    console.log('[LeftColumn] Party characters:', this.partyCharacters.length);
  },
  watch: {
    encounters(newVal) {
      console.log('[LeftColumn] Encounters updated:', newVal);
      console.log('[LeftColumn] Encounters.length:', newVal.length);
      console.log('[LeftColumn] Encounters array:', Array.from(newVal));
    },
    partyCharacters(newVal) {
      console.log('[LeftColumn] Party characters updated:', newVal.length);
    }
  },
  computed: {
    encountersArray() {
      // Converti Proxy in array normale per Vue
      return Array.isArray(this.encounters) ? this.encounters : Array.from(this.encounters || []);
    },
    partyCharactersArray() {
      // Converti Proxy in array normale per Vue
      return Array.isArray(this.partyCharacters) ? this.partyCharacters : Array.from(this.partyCharacters || []);
    },
    availablePartyCharacters() {
      // Filtra i PG già presenti nei combatants
      const addedNames = new Set(this.combatants.filter(c => c.type === 'player').map(c => c.name));
      return this.partyCharactersArray.filter(pc => !addedNames.has(pc.name));
    },
    filteredCombatants() {
      if (this.filterType === 'all') return this.combatants;
      return this.combatants.filter(c => c.type === this.filterType);
    },
    alivePlayerCount() {
      return this.combatants.filter(c => c.type === 'player' && !c.is_dead).length;
    },
    totalPlayerCount() {
      return this.combatants.filter(c => c.type === 'player').length;
    },
    aliveEnemyCount() {
      return this.combatants.filter(c => c.type === 'enemy' && !c.is_dead).length;
    },
    totalEnemyCount() {
      return this.combatants.filter(c => c.type === 'enemy').length;
    }
  },
  methods: {
    initEncounter() {
      console.log('[LeftColumn] initEncounter chiamato, selectedEncounter:', this.selectedEncounter);
      if (!this.selectedEncounter) {
        console.warn('[LeftColumn] Nessun encounter selezionato');
        return;
      }
      console.log('[LeftColumn] Emitting init-encounter event:', this.selectedEncounter);
      this.$emit('init-encounter', this.selectedEncounter);
      this.selectedEncounter = '';
    },
    handleNewEncounter() {
      if (this.combatants.length > 0) {
        if (!confirm('Vuoi abbandonare il combattimento corrente e selezionare un nuovo encounter?')) {
          return;
        }
      }
      this.$emit('new-encounter');
    },
    submitAddCombatant() {
      const c = this.newCombatant;
      if (!c.name || !c.hp) return;

      for (let i = 1; i <= c.count; i++) {
        const name = c.count > 1 ? `${c.name} ${i}` : c.name;
        this.$emit('add-combatant', {
          name,
          type: c.type,
          hp: c.hp,
          ac: c.ac || 10,
          initiative: c.initiative || (Math.floor(Math.random() * 20) + 1)
        });
      }

      // Reset form
      this.newCombatant = {
        type: 'enemy',
        name: '',
        count: 1,
        hp: null,
        ac: 10,
        initiative: null
      };
      this.showAddModal = false;
    },
    addPC(pc) {
      if (!pc.initiative) return;

      this.$emit('add-pc', {
        name: pc.name,
        initiative: pc.initiative,
        hp: pc.currentHp || pc.hp,
        ac: pc.currentAc || pc.ac
      });

      // Reset input
      pc.initiative = null;
    }
  }
};
