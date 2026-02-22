// Combat Log Component - Collapsible
const CombatLog = {
  name: 'CombatLog',
  template: `
    <div class="combat-log" :class="{ collapsed: collapsed }">
      <!-- Header (clickable to toggle) -->
      <div class="log-header" @click="$emit('toggle-collapsed')">
        <span>{{ collapsed ? '▶' : '▼' }} 📜 Combat Log</span>

        <!-- Filters (only when expanded) -->
        <div v-if="!collapsed" class="log-filters" @click.stop>
          <label>
            <input type="checkbox" v-model="filters.damage" />
            Damage
          </label>
          <label>
            <input type="checkbox" v-model="filters.heal" />
            Heal
          </label>
          <label>
            <input type="checkbox" v-model="filters.condition" />
            Conditions
          </label>
          <label>
            <input type="checkbox" v-model="filters.turn" />
            Turns
          </label>
        </div>

        <!-- Clear Button -->
        <button v-if="!collapsed" @click.stop="$emit('clear')" class="btn-clear" title="Cancella log">
          🗑️ Clear
        </button>
      </div>

      <!-- Log Entries (only when expanded) -->
      <div v-if="!collapsed" class="log-entries">
        <div
          v-for="(entry, index) in filteredEntries"
          :key="index"
          :class="['log-entry', entry.type]">
          <span class="log-round">[R{{ entry.round || 0 }}]</span>
          <span class="log-message">{{ entry.message }}</span>
        </div>
        <div v-if="filteredEntries.length === 0" class="log-entry system">
          <span class="log-message">Nessun evento da mostrare (controlla i filtri)</span>
        </div>
      </div>
    </div>
  `,
  props: {
    entries: {
      type: Array,
      default: () => []
    },
    collapsed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      filters: {
        damage: true,
        heal: true,
        condition: true,
        turn: true
      }
    };
  },
  computed: {
    filteredEntries() {
      // Filtra entries in base ai checkbox
      let filtered = this.entries.filter(entry => {
        if (entry.type === 'damage' && !this.filters.damage) return false;
        if (entry.type === 'heal' && !this.filters.heal) return false;
        if (entry.type === 'condition' && !this.filters.condition) return false;
        if (entry.type === 'turn' && !this.filters.turn) return false;
        return true;
      });

      // Mostra ultimi 50 (più recenti in basso, stile chat)
      return filtered.slice(-50);
    }
  },
  watch: {
    // Auto-scroll to bottom when new entries added (if not collapsed)
    entries: {
      handler() {
        if (!this.collapsed) {
          this.$nextTick(() => {
            const container = this.$el.querySelector('.log-entries');
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          });
        }
      },
      deep: true
    }
  }
};
