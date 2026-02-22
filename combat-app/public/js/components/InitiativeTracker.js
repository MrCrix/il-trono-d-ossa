// InitiativeTracker Component
const InitiativeTracker = {
  name: 'InitiativeTracker',
  template: `
    <div class="initiative-tracker">
      <div class="initiative-header">
        <h2>🎲 Ordine di Iniziativa</h2>
        <div class="initiative-controls">
          <button @click="$emit('prev-turn')">⬅️ Precedente</button>
          <button @click="$emit('next-turn')">Prossimo ➡️</button>
        </div>
      </div>
      <div class="initiative-list">
        <div
          v-for="(combatant, index) in combatants"
          :key="combatant.id"
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
            {{ combatant.hp_current }}/{{ combatant.hp_max }} HP
          </span>
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
  }
};
