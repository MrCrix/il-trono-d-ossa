const fs = require('fs');
const path = require('path');

/**
 * Parser per estrarre informazioni dai file encounter markdown
 * FASE 1: Parser base per HP, AC, nome, iniziativa
 * FASE 3: Parser esteso per stat blocks completi
 */
class EncounterParser {
  /**
   * Parse un file encounter e restituisce array di combattenti
   * @param {string} encounterName - Nome dell'encounter (senza .md)
   * @returns {Object} - { encounter_name, encounter_file, combatants }
   */
  parseEncounter(encounterName) {
    const encounterPath = path.join(__dirname, '../../..', 'encounters', `${encounterName}.md`);

    if (!fs.existsSync(encounterPath)) {
      throw new Error(`Encounter file non trovato: ${encounterPath}`);
    }

    const content = fs.readFileSync(encounterPath, 'utf-8');
    const lines = content.split('\n');

    const combatants = [];
    let currentCreature = null;
    let linesRead = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Cerca pattern: ### N × Nome (CR X) oppure ### N x Nome
      const headerMatch = line.match(/^###\s*(\d+)\s*[×x]\s*([^(]+)\s*\(CR/i);

      if (headerMatch) {
        const count = parseInt(headerMatch[1]);
        const creatureName = headerMatch[2].trim();

        // Cerca HP e AC nelle prossime 20 righe
        let hp = null;
        let ac = null;
        linesRead = 0;

        for (let j = i + 1; j < lines.length && linesRead < 20; j++) {
          linesRead++;
          const detailLine = lines[j];

          // Stop se nuovo header
          if (detailLine.match(/^##[^#]/)) {
            break;
          }

          // Cerca HP (PF in italiano)
          if (detailLine.includes('**PF**:') && !hp) {
            const hpMatch = detailLine.match(/\d+/);
            if (hpMatch) hp = parseInt(hpMatch[0]);
          }

          // Cerca CA
          if (detailLine.includes('**CA**:') && !ac) {
            const acMatch = detailLine.match(/\d+/);
            if (acMatch) ac = parseInt(acMatch[0]);
          }

          // Esci se trovati entrambi
          if (hp && ac) break;
        }

        // Default se non trovati
        hp = hp || 1;
        ac = ac || 10;

        // Aggiungi N copie del mostro
        for (let idx = 1; idx <= count; idx++) {
          combatants.push({
            id: this.generateId(),
            name: `${creatureName} ${idx}`,
            type: 'enemy',
            hp_current: hp,
            hp_max: hp,
            temp_hp: 0,
            ac: ac,
            initiative: this.rollInitiative(),
            initiative_modifier: 0, // TODO: parse da stat block in FASE 3
            conditions: [],
            concentration: null,
            notes: '',
            is_dead: false,
            is_hidden: false,
            stat_block: null // TODO: parse completo in FASE 3
          });
        }
      }
    }

    return {
      encounter_name: encounterName,
      encounter_file: `encounters/${encounterName}.md`,
      combatants: combatants
    };
  }

  /**
   * Genera ID univoco per combattente
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Tira iniziativa (1d20)
   */
  rollInitiative() {
    return Math.floor(Math.random() * 20) + 1;
  }

  /**
   * Lista encounter disponibili
   * @returns {Array<string>} - Array di nomi encounter (senza .md)
   */
  listEncounters() {
    const encountersDir = path.join(__dirname, '../../..', 'encounters');

    if (!fs.existsSync(encountersDir)) {
      return [];
    }

    return fs.readdirSync(encountersDir)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  }
}

module.exports = new EncounterParser();
