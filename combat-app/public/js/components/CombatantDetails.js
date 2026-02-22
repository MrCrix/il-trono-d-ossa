// Combatant Details Component - Right Panel
const CombatantDetails = {
  template: `
    <div class="right-panel details-panel">
      <!-- Header -->
      <div class="details-header">
        <h3>{{ combatant.name }}</h3>
        <button @click="$emit('close')" class="btn-close">✕</button>
      </div>

      <!-- Type Badge -->
      <div class="details-type" :class="combatant.type">
        {{ combatant.type === 'player' ? '👤 PG' : '💀 Nemico' }}
      </div>

      <!-- Stats Grid -->
      <div class="details-stats">
        <div class="stat-card">
          <label>❤️ HP</label>
          <div class="stat-editable" @click="editHP">
            <strong>{{ combatant.hp_current }}</strong> / {{ combatant.hp_max }}
          </div>
        </div>
        <div class="stat-card">
          <label>🛡️ CA</label>
          <div class="stat-editable" @click="editAC">
            <strong>{{ combatant.ac }}</strong>
          </div>
        </div>
        <div class="stat-card">
          <label>🎲 Init</label>
          <div class="stat-editable" @click="editInit">
            <strong>{{ combatant.initiative }}</strong>
          </div>
        </div>
      </div>

      <!-- HP Actions -->
      <div class="details-section">
        <h4>⚔️ Azioni HP</h4>
        <div class="action-grid">
          <button @click="applyDamage(5)" class="btn-damage">-5</button>
          <button @click="applyDamage(10)" class="btn-damage">-10</button>
          <button @click="applyDamage(15)" class="btn-damage">-15</button>
          <button @click="applyHeal(5)" class="btn-heal">+5</button>
          <button @click="applyHeal(10)" class="btn-heal">+10</button>
          <button @click="applyHeal(15)" class="btn-heal">+15</button>
        </div>
        <div class="custom-input">
          <input
            v-model.number="customAmount"
            type="number"
            placeholder="Custom..."
            ref="customAmountInput"
            @keyup.enter="applyCustomDamage" />
          <button @click="applyCustomDamage" class="btn-damage" :disabled="!customAmount">
            Danno
          </button>
          <button @click="applyCustomHeal" class="btn-heal" :disabled="!customAmount">
            Cura
          </button>
        </div>
      </div>

      <!-- Conditions -->
      <div class="details-section">
        <h4>⚠️ Condizioni</h4>
        <div class="conditions-list">
          <span
            v-for="(cond, i) in combatant.conditions"
            :key="i"
            class="condition-badge"
            @click="removeCondition(cond)"
            title="Click per rimuovere">
            {{ cond }} ✕
          </span>
          <button @click="showAddCondition = !showAddCondition" class="add-condition-btn">
            + Aggiungi
          </button>
        </div>
        <div v-if="showAddCondition" class="add-condition-form custom-input">
          <input
            v-model="newCondition"
            placeholder="Nome condizione..."
            @keyup.enter="addCondition"
            ref="conditionInput" />
          <button @click="addCondition" :disabled="!newCondition">✓</button>
        </div>
      </div>

      <!-- Notes -->
      <div class="details-section">
        <h4>📝 Note</h4>
        <textarea
          v-model="localNotes"
          @blur="updateNotes"
          placeholder="Aggiungi note..."
          rows="3">
        </textarea>
      </div>

      <!-- Toggle Dead -->
      <div class="details-actions">
        <button
          @click="toggleDead"
          :class="['btn-toggle-dead', { dead: combatant.is_dead }]">
          {{ combatant.is_dead ? '💀 Morto' : '☠️ Uccidi' }}
        </button>
      </div>

      <!-- Stat Block Link -->
      <div class="details-footer">
        <button @click="$emit('open-stat-block', combatant)" class="btn-stat-block">
          📋 Stat Block Completo
        </button>
      </div>
    </div>
  `,
  props: {
    combatant: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      customAmount: null,
      showAddCondition: false,
      newCondition: '',
      localNotes: this.combatant.notes || ''
    };
  },
  watch: {
    combatant: {
      handler(newVal) {
        this.localNotes = newVal.notes || '';
      },
      deep: true
    }
  },
  methods: {
    applyDamage(amount) {
      this.$emit('damage', { id: this.combatant.id, amount });
    },

    applyHeal(amount) {
      this.$emit('heal', { id: this.combatant.id, amount });
    },

    applyCustomDamage() {
      if (!this.customAmount || this.customAmount <= 0) return;
      this.$emit('damage', { id: this.combatant.id, amount: this.customAmount });
      this.customAmount = null;
    },

    applyCustomHeal() {
      if (!this.customAmount || this.customAmount <= 0) return;
      this.$emit('heal', { id: this.combatant.id, amount: this.customAmount });
      this.customAmount = null;
    },

    editHP() {
      const newHP = prompt(`HP attuale per ${this.combatant.name}:`, this.combatant.hp_current);
      if (newHP !== null) {
        const hp = parseInt(newHP);
        if (!isNaN(hp)) {
          this.$emit('update', {
            id: this.combatant.id,
            changes: { hp_current: hp }
          });
        }
      }
    },

    editAC() {
      const newAC = prompt(`CA per ${this.combatant.name}:`, this.combatant.ac);
      if (newAC !== null) {
        const ac = parseInt(newAC);
        if (!isNaN(ac)) {
          this.$emit('update', {
            id: this.combatant.id,
            changes: { ac }
          });
        }
      }
    },

    editInit() {
      const newInit = prompt(`Iniziativa per ${this.combatant.name}:`, this.combatant.initiative);
      if (newInit !== null) {
        const initiative = parseInt(newInit);
        if (!isNaN(initiative)) {
          this.$emit('update', {
            id: this.combatant.id,
            changes: { initiative }
          });
        }
      }
    },

    addCondition() {
      if (!this.newCondition.trim()) return;

      this.$emit('add-condition', {
        id: this.combatant.id,
        condition: this.newCondition.trim()
      });

      this.newCondition = '';
      this.showAddCondition = false;
    },

    removeCondition(condition) {
      this.$emit('remove-condition', {
        id: this.combatant.id,
        condition
      });
    },

    updateNotes() {
      if (this.localNotes !== this.combatant.notes) {
        this.$emit('update', {
          id: this.combatant.id,
          changes: { notes: this.localNotes }
        });
      }
    },

    toggleDead() {
      this.$emit('toggle-dead', { id: this.combatant.id });
    }
  },
  updated() {
    // Auto-focus custom amount input when section is shown
    if (this.$refs.customAmountInput && document.activeElement !== this.$refs.customAmountInput) {
      // Don't auto-focus to avoid disrupting user
    }

    // Auto-focus condition input when shown
    if (this.showAddCondition && this.$refs.conditionInput) {
      this.$nextTick(() => {
        this.$refs.conditionInput.focus();
      });
    }
  }
};
