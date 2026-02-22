// Initiative Timeline Component - Center Panel
const InitiativeTimeline = {
  template: `
    <div class="center-panel initiative-timeline">
      <!-- Timeline Header -->
      <div class="timeline-header">
        <h2>⚔️ Initiative Order</h2>
        <span class="turn-indicator">
          Turno di: <strong>{{ currentCombatant ? currentCombatant.name : '-' }}</strong>
        </span>
      </div>

      <!-- Timeline List -->
      <div class="timeline-list" ref="timeline">
        <div
          v-for="(c, index) in combatants"
          :key="c.id"
          :class="[
            'timeline-item',
            {
              active: index === currentTurn,
              selected: c.id === selectedId,
              dead: c.is_dead,
              player: c.type === 'player',
              enemy: c.type === 'enemy'
            }
          ]"
          @click="$emit('select-combatant', c.id)"
          @mouseenter="$emit('hover-combatant', c.id)"
          @mouseleave="$emit('hover-combatant', null)">

          <!-- Left: Marker + Initiative -->
          <div class="timeline-left">
            <span v-if="index === currentTurn" class="turn-marker">▶</span>
            <span class="initiative-num">{{ c.initiative }}</span>
          </div>

          <!-- Center: Name + HP Bar -->
          <div class="timeline-center">
            <div class="timeline-name">
              {{ c.name }}
              <span v-if="c.conditions && c.conditions.length > 0" class="condition-count">
                ⚠️ {{ c.conditions.length }}
              </span>
            </div>
            <div class="timeline-hp-bar">
              <div
                class="hp-fill"
                :style="{
                  width: getHPPercentage(c) + '%',
                  background: getHPColor(c)
                }">
              </div>
            </div>
          </div>

          <!-- Right: Quick Actions (visible on hover or active) -->
          <div
            v-show="index === currentTurn || c.id === hoveredId"
            class="timeline-actions"
            @click.stop>
            <button @click="quickDamage(c.id, 5)" class="btn-quick" title="-5 HP">-5</button>
            <button @click="quickDamage(c.id, 10)" class="btn-quick" title="-10 HP">-10</button>
            <button @click="quickHeal(c.id, 5)" class="btn-quick" title="+5 HP">+5</button>
            <button @click="quickHeal(c.id, 10)" class="btn-quick" title="+10 HP">+10</button>
          </div>

          <!-- Drag Handle -->
          <div v-if="!c.is_dead" class="drag-handle">⋮⋮</div>
        </div>
      </div>
    </div>
  `,
  props: {
    combatants: {
      type: Array,
      default: () => []
    },
    currentTurn: {
      type: Number,
      default: 0
    },
    hoveredId: {
      type: String,
      default: null
    },
    selectedId: {
      type: String,
      default: null
    }
  },
  computed: {
    currentCombatant() {
      if (this.combatants.length === 0) return null;
      return this.combatants[this.currentTurn];
    }
  },
  mounted() {
    // Initialize Sortable for drag-and-drop
    this.initSortable();
  },
  methods: {
    getHPPercentage(combatant) {
      if (!combatant.hp_max || combatant.hp_max === 0) return 0;
      const percentage = (combatant.hp_current / combatant.hp_max) * 100;
      return Math.max(0, Math.min(100, percentage));
    },

    getHPColor(combatant) {
      const percentage = this.getHPPercentage(combatant);
      if (percentage > 60) return 'var(--color-hp-high)';
      if (percentage > 30) return 'var(--color-hp-mid)';
      return 'var(--color-hp-low)';
    },

    quickDamage(id, amount) {
      this.$emit('quick-damage', { id, amount });
    },

    quickHeal(id, amount) {
      this.$emit('quick-heal', { id, amount });
    },

    initSortable() {
      if (!this.$refs.timeline) return;

      Sortable.create(this.$refs.timeline, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'initiative-item-ghost',
        chosenClass: 'initiative-item-chosen',
        dragClass: 'initiative-item-drag',
        onEnd: (evt) => {
          if (evt.oldIndex !== evt.newIndex) {
            this.$emit('reorder-initiative', {
              oldIndex: evt.oldIndex,
              newIndex: evt.newIndex
            });
          }
        }
      });
    }
  }
};
