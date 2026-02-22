Aggiungi una nota rapida alla sessione di D&D corrente.

**Procedura:**

1. Trova l'ultima sessione: cerca il file più recente in `sessions/` con pattern `*-sessione-*.md`

2. Se non trovi nessuna sessione, rispondi: "Nessuna sessione attiva. Usa /session-start per iniziarne una."

3. Analizza il testo della nota (fornito dall'utente dopo il comando) e determina il tipo:
   - Se contiene "deciso", "scelto", "decidono" → **Decisioni Chiave**
   - Se contiene "combattimento", "scontro", "battaglia", "attacco" → **Eventi Principali** (nota: potrebbe essere utile /session-combat)
   - Se contiene "conseguenza", "risultato", "effetto" → **Conseguenze > Aperte**
   - Altrimenti → **Note DM**

4. Usa il tool Edit per aggiungere la nota nella sezione appropriata del file sessione:
   - Aggiungi un bullet point `- [testo della nota]`
   - Mantieni la formattazione esistente

5. Conferma brevemente:
   ```
   ✅ Nota aggiunta a [Sezione]:
   "[testo]"
   ```

**Importante:** Deve essere velocissimo - nessun agent, azione diretta.

**Esempi di utilizzo:**
- /session-note I giocatori hanno deciso di aiutare Ralen Thorn
- /session-note Combattimento con 5 banditi sulla strada - tutti sconfitti
- /session-note Alan ha trovato una lettera misteriosa su un bandito
