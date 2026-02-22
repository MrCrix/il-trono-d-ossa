Finalizza la sessione di D&D corrente analizzando conseguenze e aggiornando archi narrativi.

**Procedura:**

1. Trova e leggi l'ultima sessione in `sessions/*-sessione-*.md`

2. Usa AskUserQuestion per raccogliere informazioni finali:
   - XP guadagnati dai giocatori
   - Oro e tesori trovati
   - Oggetti magici o importanti ottenuti
   - Breve riassunto della sessione (2-3 frasi)

3. Lancia in PARALLELO questi due agenti (single message, multiple Task tool calls):

   **Agent 1: consequence-weaver**
   - Prompt: Passa gli eventi principali, decisioni chiave e contesto della campagna
   - Obiettivo: Identificare conseguenze immediate, reazioni di fazioni, nuovi problemi e opportunità

   **Agent 2: narrative-arc-architect**
   - Prompt: Passa gli stessi eventi e il contesto degli archi narrativi esistenti
   - Obiettivo: Verificare quali archi sono stati toccati, identificare nuovi thread, aggiornare stati

4. Attendi il completamento di entrambi gli agenti

5. Integra i risultati nel file sessione usando Edit:
   - Aggiungi il riassunto
   - Compila XP, oro e oggetti
   - Aggiungi conseguenze immediate e aperte (dal consequence-weaver)
   - Aggiungi hook per la prossima sessione
   - Aggiungi note DM con suggerimenti narrativi (dall'arc-architect)

6. Mostra un report finale:
   ```
   ✅ Sessione N finalizzata!

   📊 Ricompense:
   - XP: X per giocatore
   - Oro: X mo ciascuno
   - Oggetti: [lista]

   ⚔️ Conseguenze analizzate:
   - X conseguenze immediate
   - X conseguenze aperte
   - X archi narrativi aggiornati

   📖 Archi toccati:
   - [nome-arco]: [breve status]

   🎯 Prossima sessione:
   [hook principale]

   Usa /session-start per iniziare la prossima sessione.
   ```

**Importante:** Questo comando è più lento degli altri perché lancia agenti di analisi. È normale che impieghi più tempo.

**Note tecniche:**
- Lancia gli agenti in parallelo per efficienza
- Passa contesto completo inclusi eventi precedenti rilevanti
- Dopo il completamento degli agenti, integra manualmente i risultati nel file
