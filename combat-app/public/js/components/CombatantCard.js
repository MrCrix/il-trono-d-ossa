// CombatantCard Component - FASE 2: Interactive
const CombatantCard = {
  name: 'CombatantCard',
  template: `
    <div :class="['combatant-card', { active: isActive, dead: combatant.is_dead }]">
      <!-- Header -->
      <div class="card-header">
        <div class="card-title">
          <div class="card-name" @click="openStatBlock" :title="'Click per stat block'" style="cursor: pointer;">
            {{ combatant.name }} 📋
          </div>
          <div :class="['card-type', combatant.type]">
            {{ combatant.type === 'player' ? '👤 PG' : '💀 Nemico' }}
          </div>
        </div>
        <div class="card-stats">
          <div class="stat-badge" @dblclick="editAC" :title="'Doppio click per modificare'">
            🛡️ CA {{ combatant.ac }}
          </div>
          <div class="stat-badge" @dblclick="editInitiative" :title="'Doppio click per modificare'">
            🎲 {{ combatant.initiative }}
          </div>
        </div>
      </div>

      <!-- HP Bar -->
      <div class="card-hp">
        <div class="hp-text">
          <span>❤️ HP</span>
          <span @dblclick="editHP" :title="'Doppio click per modificare'" style="cursor: pointer;">
            <strong>{{ combatant.hp_current }}</strong> / {{ combatant.hp_max }}
          </span>
        </div>
        <div class="hp-bar-container">
          <div
            class="hp-bar"
            :class="hpColorClass"
            :style="{ width: hpPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Actions - Inline Inputs -->
      <div class="card-actions">
        <div class="action-group">
          <button class="btn-damage" @click="toggleDamageInput" :class="{ active: showDamageInput }">
            ⚔️ Danno
          </button>
          <div v-if="showDamageInput" class="inline-input-container">
            <button class="quick-btn" @click="applyDamage(5)">-5</button>
            <button class="quick-btn" @click="applyDamage(10)">-10</button>
            <input
              ref="damageInput"
              v-model.number="damageAmount"
              type="number"
              placeholder="Custom"
              class="inline-input"
              @keyup.enter="applyCustomDamage"
              @keyup.esc="showDamageInput = false"
            />
            <button class="apply-btn" @click="applyCustomDamage" :disabled="!damageAmount">
              ✓
            </button>
          </div>
        </div>

        <div class="action-group">
          <button class="btn-heal" @click="toggleHealInput" :class="{ active: showHealInput }">
            ✨ Cura
          </button>
          <div v-if="showHealInput" class="inline-input-container">
            <button class="quick-btn" @click="applyHeal(5)">+5</button>
            <button class="quick-btn" @click="applyHeal(10)">+10</button>
            <input
              ref="healInput"
              v-model.number="healAmount"
              type="number"
              placeholder="Custom"
              class="inline-input"
              @keyup.enter="applyCustomHeal"
              @keyup.esc="showHealInput = false"
            />
            <button class="apply-btn" @click="applyCustomHeal" :disabled="!healAmount">
              ✓
            </button>
          </div>
        </div>

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
            @click="removeCondition(condition)"
            :title="'Click per rimuovere'"
          >
            {{ condition }} ✕
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
            style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text); font-size: 0.7rem;"
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
      showDamageInput: false,
      showHealInput: false,
      showConditionInput: false,
      damageAmount: null,
      healAmount: null,
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
    toggleDamageInput() {
      this.showDamageInput = !this.showDamageInput;
      this.showHealInput = false;
      if (this.showDamageInput) {
        this.$nextTick(() => {
          this.$refs.damageInput?.focus();
        });
      }
    },
    toggleHealInput() {
      this.showHealInput = !this.showHealInput;
      this.showDamageInput = false;
      if (this.showHealInput) {
        this.$nextTick(() => {
          this.$refs.healInput?.focus();
        });
      }
    },
    applyDamage(amount) {
      this.$emit('damage', {
        id: this.combatant.id,
        amount: amount
      });
      this.showDamageInput = false;
    },
    applyCustomDamage() {
      if (this.damageAmount && this.damageAmount > 0) {
        this.applyDamage(this.damageAmount);
        this.damageAmount = null;
      }
    },
    applyHeal(amount) {
      this.$emit('heal', {
        id: this.combatant.id,
        amount: amount
      });
      this.showHealInput = false;
    },
    applyCustomHeal() {
      if (this.healAmount && this.healAmount > 0) {
        this.applyHeal(this.healAmount);
        this.healAmount = null;
      }
    },
    toggleDead() {
      this.$emit('update', {
        id: this.combatant.id,
        changes: { is_dead: !this.combatant.is_dead }
      });
    },
    editHP() {
      const newHP = prompt(`HP corrente per ${this.combatant.name}:`, this.combatant.hp_current);
      if (newHP !== null && !isNaN(newHP)) {
        this.$emit('update', {
          id: this.combatant.id,
          changes: { hp_current: parseInt(newHP) }
        });
      }
    },
    editAC() {
      const newAC = prompt(`CA per ${this.combatant.name}:`, this.combatant.ac);
      if (newAC !== null && !isNaN(newAC)) {
        this.$emit('update', {
          id: this.combatant.id,
          changes: { ac: parseInt(newAC) }
        });
      }
    },
    editInitiative() {
      const newInit = prompt(`Iniziativa per ${this.combatant.name}:`, this.combatant.initiative);
      if (newInit !== null && !isNaN(newInit)) {
        this.$emit('update', {
          id: this.combatant.id,
          changes: { initiative: parseInt(newInit) }
        });
      }
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
    removeCondition(condition) {
      this.$emit('remove-condition', {
        id: this.combatant.id,
        condition: condition
      });
    },
    openStatBlock() {
      this.$emit('open-stat-block', this.combatant);
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
