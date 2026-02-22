// CombatLog Component
const CombatLog = {
  name: 'CombatLog',
  template: `
    <div class="combat-log">
      <div class="log-header">📜 Combat Log</div>
      <div class="log-entries">
        <div
          v-for="(entry, index) in reversedEntries"
          :key="index"
          :class="['log-entry', entry.type]"
        >
          <span class="log-time">{{ formatTime(entry.timestamp) }}</span>
          {{ entry.message }}
        </div>
      </div>
    </div>
  `,
  props: {
    entries: {
      type: Array,
      required: true
    }
  },
  computed: {
    reversedEntries() {
      // Mostra più recenti in alto, limita a 20
      return [...this.entries].reverse().slice(0, 20);
    }
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `[${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}]`;
    }
  }
};
