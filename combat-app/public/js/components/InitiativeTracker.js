// InitiativeTracker Component - FASE 2: Drag and Drop
const InitiativeTracker = {
  name: 'InitiativeTracker',
  template: `
    <div class="initiative-tracker">
      <div class="initiative-header">
        <h2>🎲 Ordine di Iniziativa</h2>
        <div class="initiative-controls">
          <button @click="$emit('prev-turn')">⬅️</button>
          <button @click="$emit('next-turn')">➡️</button>
        </div>
      </div>
      <div class="initiative-list" ref="initiativeList">
        <div
          v-for="(combatant, index) in combatants"
          :key="combatant.id"
          :data-id="combatant.id"
          :class="['initiative-item', { active: index === currentTurn }]"
          @click="$emit('select-combatant', combatant.id)"
        >
          <span class="initiative-marker">{{ index === currentTurn ? '▶' : '' }}</span>
          <span class="initiative-number">{{ combatant.initiative }}</span>
          <span class="initiative-name">
            {{ combatant.name }}
            {{ combatant.is_dead ? '💀' : '' }}
          </span>
          <span class="initiative-hp">
            {{ combatant.hp_current }}/{{ combatant.hp_max }}
          </span>
          <span class="drag-handle" title="Trascina per riordinare">⋮⋮</span>
        </div>
      </div>
    </div>
  `,
  props: {
    combatants: {
      type: Array,
      required: true
    },
    currentTurn: {
      type: Number,
      required: true
    },
    round: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.initSortable();
  },
  watch: {
    combatants() {
      // Reinit sortable quando cambiano i combattenti
      this.$nextTick(() => {
        this.initSortable();
      });
    }
  },
  methods: {
    initSortable() {
      if (this.sortableInstance) {
        this.sortableInstance.destroy();
      }

      const listEl = this.$refs.initiativeList;
      if (!listEl) return;

      this.sortableInstance = Sortable.create(listEl, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'initiative-item-ghost',
        chosenClass: 'initiative-item-chosen',
        dragClass: 'initiative-item-drag',
        onEnd: (evt) => {
          // Riordina array combattenti
          const oldIndex = evt.oldIndex;
          const newIndex = evt.newIndex;

          if (oldIndex !== newIndex) {
            this.$emit('reorder-initiative', { oldIndex, newIndex });
          }
        }
      });
    }
  },
  beforeUnmount() {
    if (this.sortableInstance) {
      this.sortableInstance.destroy();
    }
  }
};
