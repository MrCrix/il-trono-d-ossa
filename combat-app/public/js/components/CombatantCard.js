// CombatantCard Component
const CombatantCard = {
  name: 'CombatantCard',
  template: `
    <div :class="['combatant-card', { active: isActive, dead: combatant.is_dead }]">
      <!-- Header -->
      <div class="card-header">
        <div class="card-title">
          <div class="card-name">{{ combatant.name }}</div>
          <div :class="['card-type', combatant.type]">
            {{ combatant.type === 'player' ? '👤 PG' : '💀 Nemico' }}
          </div>
        </div>
        <div class="card-stats">
          <div class="stat-badge">🛡️ CA {{ combatant.ac }}</div>
          <div class="stat-badge">🎲 Init {{ combatant.initiative }}</div>
        </div>
      </div>

      <!-- HP Bar -->
      <div class="card-hp">
        <div class="hp-text">
          <span>❤️ HP</span>
          <span><strong>{{ combatant.hp_current }}</strong> / {{ combatant.hp_max }}</span>
        </div>
        <div class="hp-bar-container">
          <div
            class="hp-bar"
            :class="hpColorClass"
            :style="{ width: hpPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card-actions">
        <button class="btn-damage" @click="openDamageDialog">
          ⚔️ Danno
        </button>
        <button class="btn-heal" @click="openHealDialog">
          ✨ Cura
        </button>
        <button class="btn-dead" @click="toggleDead">
          {{ combatant.is_dead ? '💀 Morto' : '☠️ Uccidi' }}
        </button>
      </div>

      <!-- Conditions -->
      <div class="card-conditions" v-if="combatant.conditions.length > 0 || showConditionInput">
        <div class="conditions-list">
          <span
            v-for="(condition, index) in combatant.conditions"
            :key="index"
            class="condition-badge"
          >
            {{ condition }}
          </span>
          <button
            v-if="!showConditionInput"
            class="add-condition-btn"
            @click="showConditionInput = true"
          >
            + Condizione
          </button>
          <input
            v-if="showConditionInput"
            v-model="newCondition"
            @keyup.enter="addCondition"
            @blur="cancelCondition"
            placeholder="Nome condizione..."
            class="add-condition-input"
            ref="conditionInput"
            style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text);"
          />
        </div>
      </div>
      <div v-else class="card-conditions">
        <button
          class="add-condition-btn"
          @click="showConditionInput = true"
        >
          + Condizione
        </button>
      </div>
    </div>
  `,
  props: {
    combatant: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showConditionInput: false,
      newCondition: ''
    };
  },
  computed: {
    hpPercentage() {
      return Math.max(0, (this.combatant.hp_current / this.combatant.hp_max) * 100);
    },
    hpColorClass() {
      const percent = this.hpPercentage;
      if (percent > 60) return 'high';
      if (percent > 30) return 'mid';
      return 'low';
    }
  },
  methods: {
    openDamageDialog() {
      const amount = prompt(`Danno a ${this.combatant.name}:`, '5');
      if (amount && !isNaN(amount)) {
        this.$emit('damage', {
          id: this.combatant.id,
          amount: parseInt(amount)
        });
      }
    },
    openHealDialog() {
      const amount = prompt(`Cura HP a ${this.combatant.name}:`, '5');
      if (amount && !isNaN(amount)) {
        this.$emit('heal', {
          id: this.combatant.id,
          amount: parseInt(amount)
        });
      }
    },
    toggleDead() {
      this.$emit('update', {
        id: this.combatant.id,
        changes: { is_dead: !this.combatant.is_dead }
      });
    },
    addCondition() {
      if (this.newCondition.trim()) {
        this.$emit('add-condition', {
          id: this.combatant.id,
          condition: this.newCondition.trim()
        });
        this.newCondition = '';
        this.showConditionInput = false;
      }
    },
    cancelCondition() {
      setTimeout(() => {
        this.showConditionInput = false;
        this.newCondition = '';
      }, 200);
    }
  },
  watch: {
    showConditionInput(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.conditionInput?.focus();
        });
      }
    }
  }
};
