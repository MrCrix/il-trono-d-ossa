const { exec } = require('child_process');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

/**
 * Bridge per invocare comandi bash CLI esistenti
 * Permette compatibilità tra web app e workflow CLI
 */
class CliBridge {
  constructor() {
    this.combatCmdScript = path.join(__dirname, '../../../.claude/commands/combat-cmd.sh');
    this.combatInitScript = path.join(__dirname, '../../../.claude/commands/combat-init.sh');
  }

  /**
   * Esegue comando combat-cmd.sh
   * @param {string} command - Comando (damage, heal, next, ecc)
   * @param {Array<string>} args - Argomenti comando
   * @returns {Promise<Object>} - { success, stdout, stderr }
   */
  async executeCombatCommand(command, args = []) {
    try {
      const argsStr = args.map(arg => {
        // Escape spazi in argomenti
        if (arg.includes(' ')) {
          return `"${arg}"`;
        }
        return arg;
      }).join(' ');

      const fullCommand = `bash ${this.combatCmdScript} ${command} ${argsStr}`;

      console.log(`[CLI Bridge] Executing: ${fullCommand}`);

      const { stdout, stderr } = await execPromise(fullCommand, {
        cwd: path.join(__dirname, '../../..'),
        timeout: 5000
      });

      return {
        success: true,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      };
    } catch (error) {
      console.error(`[CLI Bridge] Error executing ${command}:`, error);
      return {
        success: false,
        stdout: '',
        stderr: error.message
      };
    }
  }

  /**
   * Applica danno via CLI
   */
  async damage(name, amount) {
    return this.executeCombatCommand('damage', [name, amount.toString()]);
  }

  /**
   * Cura HP via CLI
   */
  async heal(name, amount) {
    return this.executeCombatCommand('heal', [name, amount.toString()]);
  }

  /**
   * Next turn via CLI
   */
  async nextTurn() {
    return this.executeCombatCommand('next', []);
  }

  /**
   * Aggiungi condizione via CLI
   */
  async addCondition(name, condition) {
    return this.executeCombatCommand('condition', [name, condition]);
  }

  /**
   * Rimuovi condizione via CLI
   */
  async removeCondition(name, condition) {
    return this.executeCombatCommand('remove', [name, condition]);
  }

  /**
   * Aggiungi PG via CLI
   */
  async addPC(name, initiative, hp, ac) {
    return this.executeCombatCommand('addpc', [
      name,
      initiative.toString(),
      hp ? hp.toString() : '50',
      ac ? ac.toString() : '15'
    ]);
  }
}

module.exports = new CliBridge();
