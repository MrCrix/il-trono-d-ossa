// StatBlockModal Component - FASE 2: Base Modal
const StatBlockModal = {
  name: 'StatBlockModal',
  template: `
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content stat-block-modal">
        <!-- Header -->
        <div class="modal-header">
          <h2>{{ combatant.name }}</h2>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Tipo e Info Base -->
          <div class="stat-section">
            <div class="stat-type">
              {{ combatant.type === 'player' ? '👤 Personaggio Giocante' : '💀 Nemico' }}
            </div>
          </div>

          <!-- HP e CA -->
          <div class="stat-section">
            <div class="stat-grid">
              <div class="stat-item">
                <span class="stat-label">❤️ Punti Ferita</span>
                <span class="stat-value">{{ combatant.hp_current }} / {{ combatant.hp_max }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">🛡️ Classe Armatura</span>
                <span class="stat-value">{{ combatant.ac }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">🎲 Iniziativa</span>
                <span class="stat-value">{{ combatant.initiative }}</span>
              </div>
            </div>
          </div>

          <!-- Condizioni Attive -->
          <div class="stat-section" v-if="combatant.conditions && combatant.conditions.length > 0">
            <h3>⚠️ Condizioni Attive</h3>
            <div class="conditions-display">
              <span
                v-for="(condition, index) in combatant.conditions"
                :key="index"
                class="condition-badge-large"
              >
                {{ condition }}
              </span>
            </div>
          </div>

          <!-- Note -->
          <div class="stat-section" v-if="combatant.notes">
            <h3>📝 Note</h3>
            <p class="stat-notes">{{ combatant.notes }}</p>
          </div>

          <!-- Stat Block (se disponibile - FASE 3) -->
          <div class="stat-section" v-if="combatant.stat_block">
            <h3>📋 Statistiche Complete</h3>
            <div class="stat-block-content">
              <p class="placeholder">Stat block completo sarà disponibile in FASE 3</p>
            </div>
          </div>

          <!-- Placeholder se nessun stat block -->
          <div class="stat-section" v-else>
            <div class="stat-placeholder">
              <p>📋 Stat block dettagliato non ancora disponibile</p>
              <p class="placeholder-hint">Le statistiche complete saranno aggiunte in FASE 3</p>
            </div>
          </div>

          <!-- Info Rapide -->
          <div class="stat-section">
            <h3>ℹ️ Informazioni Rapide</h3>
            <div class="quick-info">
              <div class="info-row">
                <span class="info-label">Stato:</span>
                <span :class="['info-value', { dead: combatant.is_dead }]">
                  {{ combatant.is_dead ? '💀 Morto' : '✅ Vivo' }}
                </span>
              </div>
              <div class="info-row" v-if="combatant.temp_hp && combatant.temp_hp > 0">
                <span class="info-label">HP Temporanei:</span>
                <span class="info-value">{{ combatant.temp_hp }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn-modal-close" @click="closeModal">Chiudi</button>
        </div>
      </div>
    </div>
  `,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    combatant: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      handleEscape: null
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  },
  mounted() {
    // Chiudi con ESC
    this.handleEscape = (e) => {
      if (e.key === 'Escape' && this.show) {
        this.closeModal();
      }
    };
    document.addEventListener('keydown', this.handleEscape);
  },
  beforeUnmount() {
    // Rimuovi listener quando componente viene distrutto
    if (this.handleEscape) {
      document.removeEventListener('keydown', this.handleEscape);
    }
  }
};
