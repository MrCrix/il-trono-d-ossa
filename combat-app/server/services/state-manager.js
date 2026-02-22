const fs = require('fs');
const path = require('path');
const lockfile = require('proper-lockfile');

/**
 * Gestisce lo stato del combattimento (CRUD su JSON)
 * Include file locking per prevenire race conditions tra CLI e web app
 */
class StateManager {
  constructor() {
    this.stateFile = path.join(__dirname, '../../..', 'combat-state.json');
    this.backupFile = path.join(__dirname, '../../..', 'combat-state.backup.json');
  }

  /**
   * Carica lo stato corrente
   * @returns {Object} - Stato combattimento
   */
  load() {
    try {
      if (!fs.existsSync(this.stateFile)) {
        return this.getEmptyState();
      }

      const content = fs.readFileSync(this.stateFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Errore caricamento state:', error);
      // Prova backup
      if (fs.existsSync(this.backupFile)) {
        console.log('Caricamento da backup...');
        const backupContent = fs.readFileSync(this.backupFile, 'utf-8');
        return JSON.parse(backupContent);
      }
      return this.getEmptyState();
    }
  }

  /**
   * Salva lo stato con file locking
   * @param {Object} state - Stato da salvare
   */
  async save(state) {
    try {
      // Backup prima di salvare
      if (fs.existsSync(this.stateFile)) {
        fs.copyFileSync(this.stateFile, this.backupFile);
      }

      // Lock file per evitare race conditions
      let release;
      try {
        release = await lockfile.lock(this.stateFile, {
          retries: {
            retries: 5,
            minTimeout: 100,
            maxTimeout: 500
          }
        });
      } catch (err) {
        // File non esiste ancora, nessun lock necessario
        console.log('Lock non necessario, file non esiste');
      }

      // Scrivi file
      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), 'utf-8');

      // Rilascia lock
      if (release) {
        await release();
      }

      return true;
    } catch (error) {
      console.error('Errore salvataggio state:', error);
      throw error;
    }
  }

  /**
   * Stato vuoto di default
   */
  getEmptyState() {
    return {
      encounter: 'In attesa di iniziare...',
      encounter_file: null,
      round: 0,
      current_turn: 0,
      combatants: [],
      log: []
    };
  }

  /**
   * Inizializza nuovo combattimento
   * @param {Object} encounterData - Dati da parser
   */
  async initCombat(encounterData) {
    const state = {
      encounter: encounterData.encounter_name,
      encounter_file: encounterData.encounter_file,
      round: 1,
      current_turn: 0,
      combatants: encounterData.combatants.sort((a, b) => b.initiative - a.initiative),
      log: [
        {
          timestamp: new Date().toISOString(),
          round: 1,
          type: 'system',
          message: `Combattimento iniziato: ${encounterData.encounter_name}`
        }
      ]
    };

    await this.save(state);
    return state;
  }

  /**
   * Reset stato
   */
  async reset() {
    await this.save(this.getEmptyState());
  }

  /**
   * Trova combattente per ID
   */
  findCombatant(state, id) {
    return state.combatants.find(c => c.id === id);
  }

  /**
   * Trova index combattente per ID
   */
  findCombatantIndex(state, id) {
    return state.combatants.findIndex(c => c.id === id);
  }

  /**
   * Aggiungi entry al log
   */
  addLogEntry(state, entry) {
    state.log.push({
      timestamp: new Date().toISOString(),
      round: state.round,
      ...entry
    });
  }
}

module.exports = new StateManager();
