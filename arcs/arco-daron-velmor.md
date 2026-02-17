---
luogo_principale: Sembia/Waterdeep
stato: To-do
capitolo: Preludio - Capitolo 3
tipo: secondario
---

# Arco Narrativo: Daron Velmor - Il Serpente che si Risveglia

## Flusso delle Quest

```mermaid
flowchart TD
    %% FASE 1: L'Esca a Yhaunn
    START([🐍 Daron arriva a Yhaunn:<br/>voci su traffici di reliquie<br/>funerarie e mappe antiche]) --> A1[Il Mercante Nervoso - Varnoth:<br/>ha venduto mappe incomplete<br/>a uomini incappucciati]
    A1 --> A1a[Simbolo del teschio alato:<br/>Cavalieri del Sepolcro Ombroso]
    A1a --> A1b["Uno di loro aveva un tatuaggio<br/>identico al tuo.<br/>Ma non sembrava... vivo."]
    A1b --> A2[Il tatuaggio di Daron<br/>brucia improvvisamente]
    A2 --> A2a[Il serpente si contorce<br/>come se cercasse di fuggire]
    A2a --> A3[Tracce contraddittorie:<br/>testimoni descrivono qualcuno<br/>col tatuaggio gemello]
    A3 --> A3a["Pallido, vuoto,<br/>occhi non giusti"]
    A3a --> A3b[Un bambino: "Il serpente<br/>sul suo braccio era morto.<br/>Il tuo è vivo."]
    A3b --> A4[Messaggio criptico nel codice<br/>segreto di Daron e Serj]
    A4 --> A4a["Non cercarmi. Cerca il cuore."]
    A4a --> A4b{Interpretazione?}
    A4b -->|Serj è vivo e avverte| A4c[Segue le tracce di Serj]
    A4b -->|È una trappola| A4d[Procede con cautela]
    A4b -->|Ultimo messaggio| A4e[Cerca il Cuore di Myrkul]

    subgraph MINI1 ["Mini-Quest Fase 1 (Liv. 3-5 — Preludio)"]
        MQ1a[Infiltrarsi nel mercato nero<br/>di Yhaunn]
        MQ1b[Seguire un Cavaliere<br/>fino al nascondiglio]
        MQ1c[Decifrare messaggio<br/>criptato sul tatuaggio]
    end

    A2a -.-> MINI1

    A4c & A4d & A4e --> M1([⭐ Milestone 1: I Cavalieri<br/>cercano i portatori dei<br/>tatuaggi-mappa. Qualcuno col<br/>tatuaggio di Serj è con loro.<br/>Vivo, corrotto, o altro?])

    %% FASE 2: Il Sentiero Spezzato
    M1 --> B1[Lettera di Serj:<br/>ha trovato il padre<br/>"in un certo senso"]
    B1 --> B1a[Serj sa dove si trova<br/>il Cuore di Myrkul]
    B1a --> B2[I Cavalieri del Sepolcro Ombroso<br/>sono frammentati in correnti]
    B2 --> B2a[Alcuni venerano Myrkul,<br/>altri cercano immortalità]
    B2a --> B3[Il tatuaggio reagisce:<br/>proietta mappa illusoria]
    B3 --> B3a[Locazione: Le Catacombe<br/>Sussurranti nel Sembia]
    B3a --> B3b[Costo: ogni manifestazione<br/>svuota parte di Daron]
    B3b --> B4[Ex-membro dei Cavalieri rivela:<br/>Vartan non morì cercando il Cuore]
    B4 --> B4a[Fu trasformato:<br/>il Cuore corrompe chi lo tocca]
    B4a --> B4b[Serj lo sa...<br/>e continua comunque]

    subgraph MINI2 ["Mini-Quest Fase 2 (Liv. 6-10 — Cap. 1-2)"]
        MQ2a[Infiltrarsi in un raduno<br/>dei Cavalieri]
        MQ2b[Trovare il traditore<br/>che vendette Vartan]
        MQ2c[Esplorare una cripta<br/>dove Serj ha lasciato segni]
    end

    B2 -.-> MINI2

    B4b --> DEC{Decisioni cruciali}
    DEC -->|Rivela il tatuaggio al gruppo| DEC1[Più aiuto ma più rischio]
    DEC -->|Distrugge indizi per proteggere Serj| DEC2[Rallenta la ricerca]
    DEC -->|Considera di unirsi ai Cavalieri| DEC3[Trova Serj ma si corrompe?]

    DEC1 & DEC2 & DEC3 --> M2([⭐ Milestone 2: Vartan è ancora<br/>vivo - trasformato in non-morto<br/>legato al Cuore di Myrkul.])

    %% FASE 3: Il Cuore Spezzato
    M2 --> C1[Ritrovo con Serj<br/>nelle Catacombe Sussurranti]
    C1 --> C1a[Serj è cambiato: ossessionato,<br/>consumato, parzialmente corrotto]
    C1a --> C1b["Fratello, possiamo salvare papà.<br/>Ma solo se completiamo il rituale."]
    C1b --> C2[Verità su Vartan:<br/>Signore della Morte Minore]
    C2 --> C2a[Legato al Cuore, non può<br/>essere liberato senza distruggerlo]
    C2a --> C2b[Distruggere il Cuore<br/>= uccidere Vartan definitivamente]
    C2b --> C3[Rivelazione: il tatuaggio è<br/>un rituale incompiuto]
    C3 --> C3a[Se completato: i fratelli<br/>diventano custodi viventi del Cuore]
    C3a --> C3b[Immortali, potenti...<br/>ma schiavi dell'artefatto per sempre]
    C3b --> SCELTA

    SCELTA{🔥 SCELTA FINALE}
    SCELTA -->|A| FA[Salvare Serj:<br/>completare il rituale]
    SCELTA -->|B| FB[Distruggere il Cuore]
    SCELTA -->|C| FC[Spezzare il legame:<br/>rimuovere il tatuaggio]
    SCELTA -->|D| FD[Cercare una quarta via:<br/>redimere il Cuore]

    FA --> FA1([⛓️ Custodi del Cuore per sempre.<br/>Serj vive. Perdono l'umanità<br/>ma restano insieme.])
    FB --> FB1([💀 Vartan ucciso definitivamente.<br/>Serj non perdona mai.<br/>Daron è libero ma solo.])
    FC --> FC1([🏃 Tatuaggio rimosso, legame spezzato.<br/>Serj abbandonato al suo destino.<br/>Vive col senso di colpa.])
    FD --> FD1([✨ Cuore purificato. Vartan riposa.<br/>Serj salvato. Richiede aiuto divino<br/>e costi enormi. Potrebbe fallire.])

    %% Finale passivo
    M1 -->|Daron ignora l'arco| IGN([🚶 Serj continua da solo.<br/>Potrebbe diventare nemico minore.<br/>Cuore preso da altri.])

    %% Stili
    style START fill:#4a90d9,stroke:#333,color:#fff
    style M1 fill:#f5a623,stroke:#333,color:#000
    style M2 fill:#f5a623,stroke:#333,color:#000
    style SCELTA fill:#d0021b,stroke:#333,color:#fff
    style FA1 fill:#7ed321,stroke:#333,color:#000
    style FB1 fill:#7ed321,stroke:#333,color:#000
    style FC1 fill:#7ed321,stroke:#333,color:#000
    style FD1 fill:#7ed321,stroke:#333,color:#000
    style IGN fill:#9b9b9b,stroke:#333,color:#fff
```

---

## Tipo di Arco

**Arco Personale PG** - Daron Velmor (Daniele)

## Tema Centrale

> Fino a che punto sei disposto a spingerti per salvare chi ami? E se salvarlo significasse dannare te stesso?

**Conflitto Centrale**: Daron vuole ritrovare suo fratello Serj e recuperare l'eredità del padre, ma la ricerca lo porta sempre più vicino a segreti che dovrebbero rimanere sepolti.

## Desiderio vs Paura

### Desiderio
- Ritrovare Serj vivo
- Recuperare il Cuore di Myrkul (per onorare il padre)
- Scoprire la verità sulla scomparsa di Vartan
- Completare la mappa tatuata

### Paura
- Scoprire che Serj è morto... o peggio
- Diventare come i Cavalieri del Sepolcro Ombroso (ossessionato dal potere)
- Che la ricerca del padre fosse maledetta fin dall'inizio
- Perdere se stesso nella ricerca

### Conflitto Impossibile

**Non può avere entrambi**: Se trova Serj, potrebbe scoprire che suo fratello è diventato ciò che Daron teme di più. Se recupera il Cuore di Myrkul, potrebbe dover scegliere tra distruggerlo (tradendo il padre) o usarlo (diventando pericoloso).

## Struttura dell'Arco (3 Fasi)

### FASE 1: L'Esca a Yhaunn (Livelli 3-5) - PRELUDIO

**Incipit**: Daron arriva a Yhaunn seguendo voci su traffici mercantili legati a reliquie funerarie e mappe antiche che potrebbero indicare un ritorno d'attività dei Cavalieri del Sepolcro Ombroso.

**Eventi Chiave:**

1. **Il Mercante Nervoso**
   - A Yhaunn, Daron incontra un mercante di antiquariato (Varnoth) che traffica reliquie
   - Varnoth è terrorizzato: ha venduto "mappe incomplete" a uomini incappucciati
   - Menziona il simbolo del "teschio alato" - simbolo dei Cavalieri
   - **Indizio**: Una delle mappe vendute era simile a quella sul tatuaggio di Daron
   - Varnoth sussurra: "Uno di loro... aveva un tatuaggio identico al tuo. Ma non sembrava... vivo."

2. **Il Tatuaggio Reagisce**
   - Durante l'investigazione, il tatuaggio di Daron brucia improvvisamente
   - È doloroso, ma non si illumina - sembra più un *avvertimento* che un segnale
   - Il serpente sembra contorcersi, come se cercasse di fuggire dalla pelle
   - **Significato ambiguo**: Qualcuno sta usando magia simile? È pericolo? È Serj... o qualcosa che lo ha sostituito?

3. **Tracce Contraddittorie**
   - Daron trova indizi che qualcuno con un tatuaggio gemello è passato da Yhaunn
   - **Ma**: I testimoni danno descrizioni contrastanti
     - "Un giovane uomo, sembrava malato, pallido"
     - "Camminava in modo strano, come se fosse... vuoto"
     - "Gli occhi... non erano giusti"
   - Un bambino dice: "Il serpente sul suo braccio era morto. Il tuo è vivo."
   - **Dubbio seminato**: Era davvero Serj? O qualcosa che indossava la sua forma?

4. **Il Messaggio Criptico**
   - Daron trova un messaggio lasciato per lui (inciso su una parete, o su un oggetto)
   - Non è firmato, ma usa un codice che solo lui e Serj conoscevano
   - Dice solo: "Non cercarmi. Cerca il cuore."
   - **Interpretazioni possibili**:
     - Serj è vivo e avverte Daron di stare lontano
     - Qualcuno ha estorto il codice a Serj
     - Serj è morto e questo è l'ultimo messaggio che ha lasciato
     - È una trappola di chi conosce il loro passato

**Pressioni del Mondo:**
- I Cavalieri del Sepolcro Ombroso sono tornati attivi
- Cercano reliquie di Myrkul per ottenere potere personale e immortalità
- Orsinar Tharavos (PNG principale) possiede un libro che menziona il Cuore di Myrkul

**Mini-Quest Possibili:**
- Infiltrarsi nel mercato nero di Yhaunn
- Seguire un Cavaliere fino al loro nascondiglio
- Decifrare un messaggio criptato sul tatuaggio

**Milestone Fase 1**: Daron scopre che i Cavalieri del Sepolcro Ombroso cercano **i portatori dei tatuaggi-mappa** - e che qualcuno con un tatuaggio identico al suo è stato visto con loro. Ma non sa se è Serj vivo, Serj corrotto, o qualcos'altro che porta il suo volto.

---

### FASE 2: Il Sentiero Spezzato (Livelli 6-10) - CAPITOLO 1-2

**Funzione**: Daron scopre verità parziali su Serj e i Cavalieri, ma ogni risposta genera nuove domande più oscure.

**Eventi Chiave:**

1. **La Lettera di Serj**
   - Daron riceve (o trova) una lettera scritta dalla mano di Serj
   - Tono ambiguo: Serj è vivo ma parla di "necessarie scelte difficili"
   - Menziona che ha trovato il padre... "in un certo senso"
   - **Rivelazione**: Serj sa dove si trova il Cuore di Myrkul

2. **I Cavalieri Non Sono Soli**
   - I Cavalieri del Sepolcro Ombroso sono una fazione frammentata
   - Alcuni venerano Myrkul, altri cercano l'immortalità attraverso le sue reliquie
   - Serj potrebbe essere caduto in una di queste correnti
   - **Nota**: I Cavalieri sono una fazione indipendente di necromanti collezionisti

3. **Il Tatuaggio si Completa... Parzialmente**
   - Durante un momento di pericolo estremo, il tatuaggio di Daron reagisce
   - Proietta una mappa illusoria nell'aria, ma è distorta, incompleta
   - Mostra una locazione: **Le Catacombe Sussurranti** (luogo ignoto nel Sembia)
   - **Costo**: Ogni volta che il tatuaggio si manifesta, Daron sente una parte di sé "svuotarsi"

4. **Incontro con un Traditore**
   - Un ex-membro dei Cavalieri cerca Daron
   - Rivela che Vartan Velmor non morì cercando il Cuore di Myrkul
   - Fu **trasformato** - il Cuore corrupe chi lo tocca
   - Serj lo sa... e continua comunque a cercarlo

**Pressioni del Mondo:**
- Cicli naturali di magia necrotica rendono il Cuore più instabile e "attivo" periodicamente
- Altri collezionisti e necromanti vogliono il Cuore per il suo potere intrinseco
- Il tatuaggio di Daron potrebbe essere l'unica chiave per trovarlo

**Mini-Quest Possibili:**
- Infiltrarsi in un raduno dei Cavalieri del Sepolcro Ombroso
- Trovare il traditore che ha venduto Vartan ai nemici
- Esplorare una cripta dove Serj ha lasciato segni

**Decisioni Cruciali:**
- Daron deve scegliere se rivelare l'esistenza del tatuaggio al gruppo
- Può decidere di distruggere indizi per proteggere Serj
- Potrebbe iniziare a considerare di **unirsi** ai Cavalieri per trovare suo fratello

**Milestone Fase 2**: Daron scopre che suo padre Vartan è ancora "vivo" in un certo senso - trasformato in un non-morto legato al Cuore di Myrkul.

---

### FASE 3: Il Cuore Spezzato (Livelli 11-15) - CAPITOLO 3-4

**Funzione**: Daron deve affrontare la verità finale su Serj, suo padre e se stesso. Le scelte diventeranno impossibili.

**Eventi Chiave:**

1. **Ritrovo con Serj**
   - Daron finalmente trova Serj nelle Catacombe Sussurranti
   - Serj è cambiato: ossessionato, consumato dalla ricerca
   - Ha **già toccato** il Cuore di Myrkul ed è parzialmente corrotto
   - "Fratello, possiamo salvare papà. Ma solo se completiamo il rituale."

2. **La Verità su Vartan**
   - Vartan Velmor è diventato un **Signore della Morte Minore**
   - Legato al Cuore di Myrkul, non può essere liberato senza distruggerlo
   - Ma distruggere il Cuore significherebbe uccidere definitivamente Vartan
   - **Serj vuole usare il Cuore per "riportare" il padre... ma a quale costo?**

3. **Il Rituale della Legatura**
   - Serj rivela il vero scopo del tatuaggio
   - Non era solo per nascondere la mappa - era un **rituale incompiuto**
   - Se completato, i due fratelli diventerebbero **custodi viventi** del Cuore
   - Immortali, potenti... ma schiavi dell'artefatto per sempre

4. **La Scelta Finale**

   Daron deve scegliere tra:

   **A) Salvare Serj**
   - Completare il rituale insieme
   - Diventare custodi del Cuore di Myrkul
   - Serj vive, ma entrambi perdono la loro umanità
   - Vartan rimane intrappolato

   **B) Distruggere il Cuore**
   - Uccidere definitivamente Vartan
   - Serj potrebbe non perdonarlo mai
   - Il tatuaggio svanisce, il legame spezzato
   - Libertà, ma a quale prezzo?

   **C) Spezzare il Legame**
   - Rimuovere magicamente il tatuaggio
   - Salvare se stesso ma abbandonare Serj al suo destino
   - Serj continuerà da solo... e potrebbe diventare nemico

   **D) Cercare una Quarta Via** (se i PG sono creativi)
   - Trovare un modo per "redimere" il Cuore invece di distruggerlo
   - Richiede alleati divini, sacrifici enormi
   - Potrebbe fallire comunque

**Pressioni del Mondo:**
- Altri necromanti e collezionisti vogliono il Cuore per il suo potere
- I Cavalieri del Sepolcro Ombroso si stanno frammentando
- Il Cuore è instabile per natura - potrebbe esplodere se non contenuto correttamente

**Conseguenze Permanenti:**

Qualunque scelta Daron faccia, ci sono perdite:
- Se salva Serj, perde se stesso
- Se distrugge il Cuore, perde il padre e forse il fratello
- Se scappa, vive con la colpa

**Milestone Fase 3**: Daron comprende che **non tutte le famiglie possono essere salvate intatte**. Alcune storie non hanno lieto fine.

---

## Collegamenti alla Trama Principale

### Indipendenza dell'Arco

Questo arco è **completamente indipendente** dalla trama principale della campagna. Non coinvolge direttamente Velsharoon, Kelemvor, Myrkul o il Trono d'Ossa.

### Cuore di Myrkul - Reliquia Autonoma

- Il Cuore di Myrkul è una reliquia necrotica antica, estremamente potente
- È stata ricercata da necromanti e collezionisti per secoli per il suo potere intrinseco
- Corrode e trasforma chi la tocca, indipendentemente da conflitti divini
- **NON è necessaria per nessun rituale cosmico** - è semplicemente pericolosa di per sé
- È una reliquia tra migliaia. Potente, sì. Necessaria al Trono d'Ossa? No.

### Cavalieri del Sepolcro Ombroso - Fazione Indipendente

- Fazione autonoma di necromanti che cerca reliquie di Myrkul per potere personale
- **NON collegati al Culto del Trono d'Ossa**
- Cercano il Cuore per i propri scopi: immortalità, potere necrotico, eredità di Myrkul
- Sono una minaccia parallela, non parte della trama principale

### Instabilità della Reliquia

- Il Cuore di Myrkul è sempre stato instabile e corruttivo
- Cicli naturali di magia necrotica lo rendono più "attivo" periodicamente
- Il padre di Daron (Vartan) lo trovò in uno di questi cicli - sfortuna, non destino
- Non serve alcun evento cosmico per risvegliarlo

### Serj come Possibile Antagonista Secondario

Se Daron non riesce a salvarlo, Serj potrebbe diventare:
- Un luogotenente dei Cavalieri del Sepolcro Ombroso
- Un rivale che cerca il Cuore per sé
- Un non-morto tragico da affrontare personalmente
- **Nota**: Questo resta un dramma personale, non un evento della main story

---

## Regole dell'Arco (Rispetto alla Bibbia)

### Libertà del Giocatore

- Daron può **ignorare completamente** questo arco
- Se lo ignora, Serj continua da solo e potrebbe apparire come nemico minore
- L'arco non è necessario per la trama principale

### Tempistica Flessibile

- Le fasi possono sovrapporsi o saltare
- Se Daniele non è interessato, alcune rivelazioni arrivano "off-screen"
- L'arco può chiudersi prima (liv 12) o restare incompiuto

### Fallimento È Possibile

- Daron potrebbe non salvare Serj
- Il Cuore potrebbe essere distrutto da altri
- Vartan potrebbe essere perduto per sempre
- **Nessuna punizione meccanica, solo narrativa**

### Pressioni Continue

Anche se Daron ignora l'arco:
- I Cavalieri del Sepolcro Ombroso continuano a muoversi
- Serj fa le sue scelte (in peggio)
- Il Cuore di Myrkul resta una minaccia nel mondo

---

## Indizi Seminati (Regola dei Tre)

Ogni rivelazione chiave ha **almeno 3 indizi indipendenti**:

### Mistero: "Qualcuno con il tatuaggio di Serj è attivo"

1. **Diretto**: Messaggio criptico con codice che solo Serj conoscerebbe
2. **Comportamentale**: Il tatuaggio di Daron reagisce con dolore/avvertimento
3. **Sistemico**: Testimoni riportano qualcuno con tatuaggio identico, ma le descrizioni sono inquietanti

**Nota**: Nella Fase 1, non è chiaro se Serj è vivo, morto, o trasformato. L'ambiguità è intenzionale.

### Mistero: "Vartan è diventato un non-morto"

1. **Diretto**: Testimonianza di un ex-Cavaliere
2. **Comportamentale**: Visioni/incubi di Daron mostrano il padre trasformato
3. **Sistemico**: Registri della Gilda menzionano "corruzione da artefatto"

### Mistero: "Il tatuaggio è un rituale incompiuto"

1. **Diretto**: Maestro Arannis (il tatuatore) rivela la verità
2. **Comportamentale**: Il tatuaggio si manifesta in momenti di stress
3. **Sistemico**: Magie di identificazione mostrano "rituale interrotto"

---

## PNG Chiave dell'Arco

### Serj Velmor (Fratello)

- **Ruolo**: Obiettivo dell'arco, possibile alleato o nemico
- **Evoluzione**: Da vittima → corrotto → perduto
- **Segreto**: Ha già toccato il Cuore e sa che li cambierà entrambi

### Vartan Velmor (Padre, Non-Morto)

- **Ruolo**: Motivazione emotiva, tragedia vivente
- **Evoluzione**: Da eroe perduto → mostro tragico → peso morale
- **Segreto**: Una parte di lui è ancora "umana" e soffre

### Maestro Arannis (Tatuatore)

- **Ruolo**: Informatore, possibile traditore
- **Evoluzione**: Da alleato → rivelazione shock
- **Segreto**: Sapeva del rituale fin dall'inizio, lavorava per i Cavalieri?

### Lady Myrrine (Cavaliere Pentita)

- **Ruolo**: Ex-membro dei Cavalieri, ora cerca redenzione
- **Evoluzione**: Informatrice → alleata → sacrificio
- **Segreto**: Fu lei a dare il Cuore a Vartan, causando la sua caduta

---

## Possibili Finali dell'Arco

### Finale A: "Il Custode"
Daron completa il rituale, diventa custode del Cuore. Serj vive. Perdono l'umanità ma restano insieme.

### Finale B: "La Libertà"
Daron distrugge il Cuore, uccide Vartan, perde Serj. È libero ma solo.

### Finale C: "Il Fuggitivo"
Daron rimuove il tatuaggio e lascia che Serj affronti il suo destino. Vive con il senso di colpa.

### Finale D: "La Redenzione"
Daron trova un modo per purificare il Cuore. Vartan riposa, Serj è salvato. Richiede aiuto divino e costi enormi.

### Finale E: "L'Incompiuto"
Daron non risolve l'arco. Serj diventa nemico minore, il Cuore viene preso dal Culto o distrutto da altri.

---

## Note DM

### Tono dell'Arco

Tragico, personale, con scelte impossibili. Questo arco parla di:
- **Famiglia**: Cosa significa essere fratelli
- **Eredità**: Il peso delle scelte dei genitori
- **Ossessione**: Quando la ricerca diventa dannazione

### Quando Introdurre le Fasi

- **Fase 1**: Subito nel Preludio (Yhaunn)
- **Fase 2**: Cap 1-2, quando il gruppo è coeso
- **Fase 3**: Cap 3-4, quando la trama principale si intensifica

### Cosa Fare Se Daniele Non È Interessato

- Rallentare l'arco
- Rendere Serj un PNG secondario positivo (alleato)
- Spostare il focus su altri aspetti del background (Gilda, Waterdeep)

### Cosa Fare Se Daniele È Iper-Coinvolto

- Accelerare le rivelazioni
- Rendere Serj più complesso (non solo vittima)
- Approfondire le dinamiche tra i Cavalieri e altri collezionisti di reliquie

### Impatto sulla Campagna Principale

**NESSUNO**.

Questo arco è personale e indipendente. Le scelte di Daron riguardano la sua famiglia, non il destino del mondo.

- **Se Daron distrugge il Cuore**: Chiude il suo arco personale, nessun effetto sulla main story
- **Se Daron diventa custode**: Conseguenze personali (corruzione, immortalità), nessun effetto sulla main story
- **Se Daron ignora l'arco**: Il Cuore rimane dove si trova, può essere preso da altri collezionisti per i loro scopi privati

Il Cuore di Myrkul è una reliquia tra migliaia. Potente, sì. Necessaria al Trono d'Ossa? No.

Il vero conflitto è intimo: **Famiglia vs. Se Stesso**. Non Famiglia vs. Destino del Mondo.

---

## Ganci per le Sessioni

### Prima Sessione (Yhaunn - Preludio)
"Mentre esplori il mercato di Yhaunn, noti un banco di antiquariato. Un mercante nervoso vende mappe consunte. Una di esse... sembra familiare. Troppo familiare. Il mercante sussurra: 'L'ha venduta qualcuno come te. Stesso tatuaggio. Ma gli occhi... gli occhi non erano giusti.'"

### Sessione Intermedia (Cap 1-2)
"Il tatuaggio brucia improvvisamente. Per un momento, vedi una visione: tuo fratello Serj, in una cripta oscura, con il simbolo del teschio alato sul petto."

### Sessione Finale (Cap 3-4)
"Davanti a te, Serj tiene in mano il Cuore di Myrkul. La gemma pulsa di luce nera. 'Fratello,' dice, 'è tempo di completare ciò che papà ha iniziato. Insieme, possiamo salvarlo.'"

---

## Citazioni Caratteristiche

**Daron all'inizio**: "Mio padre diceva sempre: la verità è come una mappa - basta seguirla per trovarla."

**Daron a metà**: "E se la mappa mi sta portando dove non voglio andare?"

**Daron alla fine**: "Alcune mappe non portano a un tesoro. Portano solo a scegliere cosa perdere."

---

📌 **Ricorda DM**: Questo arco è di Daron, non del gruppo. Gli altri PG possono aiutare, ma la scelta finale è sua. E qualunque cosa scelga... qualcuno verrà perso.
