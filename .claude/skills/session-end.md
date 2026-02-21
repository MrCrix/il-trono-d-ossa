# Session End Skill

Finalizza la sessione corrente analizzando gli eventi e integrando le conseguenze con gli archi narrativi della campagna.

## Comportamento

Quando l'utente invoca `/session-end`, devi:

1. **Leggere la sessione corrente**: Trova e leggi l'ultima sessione in `sessions/`
2. **Chiedere informazioni finali**: Usa AskUserQuestion per raccogliere:
   - XP guadagnati dai giocatori
   - Oro e tesori trovati
   - Oggetti magici o importanti ottenuti
   - Breve riassunto della sessione (2-3 frasi)
3. **Analizzare conseguenze**: Lancia il **consequence-weaver agent** passandogli:
   - Eventi principali della sessione
   - Decisioni chiave del gruppo
   - Contesto della campagna (lettura rapida di `CAMPAIGN_RULES.md`)

   Il consequence-weaver identificherà:
   - Conseguenze immediate da materializzare
   - Reazioni di fazioni e NPC
   - Nuovi problemi emergenti
   - Opportunità create

4. **Aggiornare archi narrativi**: Lancia il **narrative-arc-architect agent** per:
   - Verificare quali archi narrativi sono stati toccati
   - Identificare nuovi thread narrativi emersi
   - Aggiornare lo stato degli archi attivi

5. **Completare il file sessione**: Usa `Edit` per aggiungere:
   - Riassunto nella sezione apposita
   - XP, oro e oggetti
   - Conseguenze immediate e aperte (dal consequence-weaver)
   - Hook per la prossima sessione
   - Note DM con suggerimenti narrativi (dall'arc-architect)

6. **Confermare e suggerire**: Mostra un breve report e suggerisci eventuali follow-up

## Esempio Output

```
✅ Sessione 4 finalizzata!

📊 Ricompense:
- XP: 450 per giocatore (ora livello 2)
- Oro: 75 mo ciascuno
- Oggetti: Diario di Ralen Thorn, Mappa antica

⚔️ Conseguenze analizzate:
- 3 conseguenze immediate
- 5 conseguenze aperte
- 2 archi narrativi aggiornati (Ralen Thorn, Custodi del Sapere Sigillato)

📖 Archi toccati:
- arco-ralen-thorn.md: Progressione registrata
- arco-custodi-sapere-sigillato.md: Nuovo thread emerso

🎯 Prossima sessione:
I giocatori arriveranno a Yhaunn con lo scrigno. Ralen vorrà aprirlo...

Usa `/session-start` per iniziare la prossima sessione.
```

## Note Tecniche

- Usa `Task` tool con `consequence-weaver` subagent_type
- Usa `Task` tool con `narrative-arc-architect` subagent_type
- Passa contesto completo agli agenti includendo:
  - Sessione corrente completa
  - Eventi precedenti rilevanti
  - Stato archi narrativi
- Gli agenti possono girare in parallelo per efficienza
- Dopo il loro completamento, integra i risultati nel file sessione
