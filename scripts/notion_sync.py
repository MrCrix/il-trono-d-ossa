#!/usr/bin/env python3
"""
Script per sincronizzare contenuti markdown con Notion.

Uso:
    python scripts/notion_sync.py --test
    python scripts/notion_sync.py --push characters/npcs/npc-example.md --db npcs
    python scripts/notion_sync.py --push characters/pcs/pc-example.md --db pcs
"""

import os
import json
import base64
from pathlib import Path
from dotenv import load_dotenv
from notion_client import Client
import argparse
import httpx
import re
import boto3
from PIL import Image
from io import BytesIO

# Carica variabili ambiente (override=True per sovrascrivere variabili sistema)
load_dotenv(override=True)

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
SSL_CERT_FILE = os.getenv("SSL_CERT_FILE")

# Database IDs
DATABASES = {
    'npcs': os.getenv("NOTION_DB_NPCS"),
    'pcs': os.getenv("NOTION_DB_PCS"),
    'sessions': os.getenv("NOTION_DB_SESSIONS"),
    'arcs': os.getenv("NOTION_DB_ARCS"),
    'locations': os.getenv("NOTION_DB_LOCATIONS"),
}


def check_configuration(db_type=None):
    """Verifica che la configurazione sia completa."""
    if not NOTION_TOKEN:
        print("❌ NOTION_TOKEN non trovato in .env")
        return False

    if db_type:
        if db_type not in DATABASES:
            print(f"❌ Database type '{db_type}' non valido. Opzioni: {', '.join(DATABASES.keys())}")
            return False
        if not DATABASES[db_type]:
            print(f"❌ NOTION_DB_{db_type.upper()} non trovato in .env")
            return False
    else:
        missing = [name for name, db_id in DATABASES.items() if not db_id]
        if missing:
            print(f"⚠️  Database mancanti in .env: {', '.join(missing)}")

    print("✅ Configurazione trovata")
    return True


def get_notion_client():
    """Crea un client Notion configurato con il certificato SSL se necessario."""
    if SSL_CERT_FILE and os.path.exists(SSL_CERT_FILE):
        http_client = httpx.Client(verify=SSL_CERT_FILE)
        return Client(auth=NOTION_TOKEN, client=http_client)
    return Client(auth=NOTION_TOKEN)


def generate_npc_image(description, character_name, output_dir="images/npcs"):
    """
    Genera un'immagine del PNG usando Amazon Nova Canvas.

    Args:
        description: Descrizione fisica e background del personaggio
        character_name: Nome del personaggio (per il filename)
        output_dir: Directory dove salvare l'immagine

    Returns:
        Path dell'immagine salvata o None se fallisce
    """
    try:
        # Configurazione AWS
        region = os.getenv("AWS_REGION", "eu-west-1")
        model_id = os.getenv("BEDROCK_MODEL_ID", "amazon.nova-canvas-v1:0")
        width = int(os.getenv("IMAGE_WIDTH", "1280"))
        height = int(os.getenv("IMAGE_HEIGHT", "720"))
        num_images = int(os.getenv("IMAGE_COUNT", "3"))
        cfg_scale = float(os.getenv("CFG_SCALE", "6.5"))

        print(f"🎨 Generazione immagine per {character_name}...")

        # Crea client Bedrock (usa credenziali da ~/.aws/credentials)
        bedrock = boto3.client('bedrock-runtime', region_name=region)

        # Costruisci prompt in stile D&D manual
        prompt = f"""Generate an image in the style of a Dungeons & Dragons manual illustration.
The character should be in a neutral, non-combat pose.

Character description:
{description}

Art style: Classic D&D manual illustration, detailed fantasy art, neutral standing pose, full body or upper body portrait."""

        # Prepara body della richiesta
        body = json.dumps({
            "textToImageParams": {
                "text": prompt
            },
            "taskType": "TEXT_IMAGE",
            "imageGenerationConfig": {
                "cfgScale": cfg_scale,
                "seed": 0,
                "width": width,
                "height": height,
                "numberOfImages": num_images
            }
        })

        # Invoca il modello
        response = bedrock.invoke_model(
            modelId=model_id,
            body=body
        )

        # Parse risposta
        response_body = json.loads(response['body'].read())

        # Estrai immagini (Nova Canvas ritorna array di immagini base64)
        images = response_body.get('images', [])

        if not images:
            print("❌ Nessuna immagine generata")
            return None

        # Crea directory se non esiste
        os.makedirs(output_dir, exist_ok=True)

        # Salva la prima immagine (o tutte se vuoi)
        image_data = base64.b64decode(images[0])

        # Nome file safe
        safe_name = character_name.lower().replace(' ', '-').replace("'", '')
        image_path = os.path.join(output_dir, f"{safe_name}.png")

        # Salva immagine
        with open(image_path, 'wb') as f:
            f.write(image_data)

        print(f"✅ Immagine salvata: {image_path}")
        print(f"   ({num_images} varianti generate, salvata la prima)")

        return image_path

    except Exception as e:
        print(f"⚠️  Errore generazione immagine: {e}")
        print(f"   Continuo senza immagine...")
        return None


def test_connection(db_type=None):
    """Testa la connessione con Notion."""
    if not check_configuration(db_type):
        return False

    try:
        notion = get_notion_client()
        print(f"🔗 Tentativo connessione a Notion...")

        # Se specificato un database, testa solo quello
        if db_type:
            db_id = DATABASES[db_type]
            database = notion.databases.retrieve(database_id=db_id)
            title = database.get('title', [{}])[0].get('plain_text', 'Unnamed')
            print(f"✅ Connessione riuscita!")
            print(f"📚 Database '{db_type}': {title}")
        else:
            # Testa tutti i database configurati
            print(f"✅ Connessione riuscita!")
            print(f"📚 Database disponibili:")
            for name, db_id in DATABASES.items():
                if db_id:
                    try:
                        database = notion.databases.retrieve(database_id=db_id)
                        title = database.get('title', [{}])[0].get('plain_text', 'Unnamed')
                        print(f"  - {name}: {title}")
                    except Exception as e:
                        print(f"  - {name}: ❌ Errore ({str(e)[:50]}...)")

        return True

    except Exception as e:
        print(f"❌ Errore connessione: {e}")
        return False


def parse_frontmatter(content):
    """
    Estrae il frontmatter YAML e il contenuto markdown.
    Ritorna (metadata_dict, content_without_frontmatter).
    """
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.match(frontmatter_pattern, content, re.DOTALL)

    if not match:
        return {}, content

    frontmatter = match.group(1)
    content_without = content[match.end():]

    # Parse semplice del YAML (solo key: value)
    metadata = {}
    for line in frontmatter.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            metadata[key.strip()] = value.strip()

    return metadata, content_without


def markdown_to_notion_blocks(md_content):
    """
    Converte contenuto markdown in blocchi Notion.
    Implementazione base - può essere espansa.
    """
    blocks = []
    lines = md_content.split('\n')

    for line in lines:
        line = line.strip()

        if not line:
            continue

        # Titoli
        if line.startswith('# '):
            blocks.append({
                "object": "block",
                "type": "heading_1",
                "heading_1": {
                    "rich_text": [{"type": "text", "text": {"content": line[2:]}}]
                }
            })
        elif line.startswith('## '):
            blocks.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [{"type": "text", "text": {"content": line[3:]}}]
                }
            })
        elif line.startswith('### '):
            blocks.append({
                "object": "block",
                "type": "heading_3",
                "heading_3": {
                    "rich_text": [{"type": "text", "text": {"content": line[4:]}}]
                }
            })
        # Quote
        elif line.startswith('> '):
            blocks.append({
                "object": "block",
                "type": "quote",
                "quote": {
                    "rich_text": [{"type": "text", "text": {"content": line[2:]}}]
                }
            })
        # Lista puntata
        elif line.startswith('- ') or line.startswith('* '):
            blocks.append({
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": [{"type": "text", "text": {"content": line[2:]}}]
                }
            })
        # Testo normale
        else:
            blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": line}}]
                }
            })

    return blocks


def build_properties(title, metadata, db_type):
    """Costruisce le properties Notion in base al tipo di database."""
    # Determina il nome della property title in base al database
    if db_type in ["npcs", "locations"]:
        title_prop = "Name"
    else:
        title_prop = "Nome"

    properties = {
        title_prop: {
            "title": [{"text": {"content": title}}]
        }
    }

    # Mapping per NPCs
    if db_type == 'npcs':
        if 'importanza' in metadata:
            properties['Importanza'] = {"select": {"name": metadata['importanza']}}
        if 'stato' in metadata:
            properties['Stato'] = {"select": {"name": metadata['stato']}}
        if 'luogo' in metadata:
            properties['Luogo'] = {"rich_text": [{"text": {"content": metadata['luogo']}}]}
        if 'ruolo_narrativo' in metadata:
            properties['Ruolo narrativo'] = {"rich_text": [{"text": {"content": metadata['ruolo_narrativo']}}]}
        if 'tipology' in metadata:
            properties['Tipology'] = {"rich_text": [{"text": {"content": metadata['tipology']}}]}

    # Mapping per PCs
    elif db_type == 'pcs':
        if 'stato' in metadata:
            properties['stato'] = {"select": {"name": metadata['stato']}}
        if 'luogo' in metadata:
            properties['Luogo'] = {"rich_text": [{"text": {"content": metadata['luogo']}}]}
        if 'livello' in metadata:
            properties['Livello'] = {"rich_text": [{"text": {"content": metadata['livello']}}]}
        if 'allineamento' in metadata:
            properties['Allineamento'] = {"select": {"name": metadata['allineamento']}}
        if 'nome_giocatore' in metadata:
            properties['Nome giocatore'] = {"rich_text": [{"text": {"content": metadata['nome_giocatore']}}]}
        if 'classe' in metadata:
            # Multi-select: separati da virgola
            classi = [c.strip() for c in metadata['classe'].split(',')]
            properties['Classe'] = {"multi_select": [{"name": c} for c in classi]}

    # Mapping per Sessioni
    elif db_type == 'sessions':
        if 'data' in metadata:
            properties['Data'] = {"date": {"start": metadata['data']}}
        if 'decisione_chiave' in metadata:
            properties['Decisione chiave'] = {"rich_text": [{"text": {"content": metadata['decisione_chiave']}}]}
        if 'conseguenze_aperte' in metadata:
            properties['Conseguenze aperte'] = {"rich_text": [{"text": {"content": metadata['conseguenze_aperte']}}]}
        if 'livello_medio' in metadata:
            properties['Livello Medio'] = {"number": int(metadata['livello_medio'])}

    # Mapping per Archi Narrativi
    elif db_type == 'arcs':
        if 'luogo_principale' in metadata:
            properties['luogo principale'] = {"rich_text": [{"text": {"content": metadata['luogo_principale']}}]}
        if 'stato' in metadata:
            properties['stato'] = {"status": {"name": metadata['stato']}}
        if 'capitolo' in metadata:
            properties['Capitolo'] = {"rich_text": [{"text": {"content": metadata['capitolo']}}]}
        if 'tipo' in metadata:
            properties['Tipo'] = {"select": {"name": metadata['tipo']}}

    # Mapping per Locations
    elif db_type == 'locations':
        if 'tipo' in metadata:
            properties['Tipo'] = {"select": {"name": metadata['tipo']}}
        if 'regione' in metadata:
            properties['Regione'] = {"rich_text": [{"text": {"content": metadata['regione']}}]}
        if 'importanza' in metadata:
            properties['Importanza'] = {"select": {"name": metadata['importanza']}}
        if 'stato' in metadata:
            properties['Stato'] = {"select": {"name": metadata['stato']}}
        if 'pericolo' in metadata:
            properties['Pericolo'] = {"select": {"name": metadata['pericolo']}}
        if 'popolazione' in metadata:
            properties['Popolazione'] = {"rich_text": [{"text": {"content": metadata['popolazione']}}]}
        # archi_narrativi gestito come relation (necessita ID delle pagine degli archi)
        # Per ora lo saltiamo, da implementare in futuro

    return properties


def push_to_notion(file_path, db_type):
    """Carica un file markdown su Notion."""
    if not check_configuration(db_type):
        return False

    try:
        notion = get_notion_client()
        database_id = DATABASES[db_type]

        # Leggi il file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Estrai frontmatter e contenuto
        metadata, content_clean = parse_frontmatter(content)

        # Estrai titolo (prima riga # Titolo del contenuto pulito)
        title = Path(file_path).stem.replace('-', ' ').title()
        first_line = content_clean.strip().split('\n')[0]
        if first_line.startswith('# '):
            title = first_line[2:].strip()

        print(f"📤 Caricamento: {title}")
        print(f"📚 Database: {db_type}")
        if metadata:
            print(f"🏷️  Metadati: {', '.join(f'{k}={v}' for k, v in metadata.items())}")

        # Genera immagine per PNG (se non esiste già)
        image_path = None
        if db_type == 'npcs':
            # Estrai sezione descrizione fisica per il prompt
            description_sections = []
            lines = content_clean.split('\n')
            capture = False
            for line in lines:
                if '## Descrizione Fisica' in line or '## Descrizione' in line:
                    capture = True
                    continue
                elif line.startswith('##') and capture:
                    break
                elif capture and line.strip():
                    description_sections.append(line.strip())

            if description_sections:
                description = '\n'.join(description_sections)
                image_path = generate_npc_image(description, title)

        # Converti markdown in blocchi Notion
        blocks = markdown_to_notion_blocks(content_clean)

        # Costruisci properties in base al tipo di database
        properties = build_properties(title, metadata, db_type)

        # Crea pagina nel database
        new_page = notion.pages.create(
            parent={"database_id": database_id},
            properties=properties,
            children=blocks[:100]  # Notion limita a 100 blocchi per richiesta
        )

        print(f"✅ Pagina creata: {new_page['url']}")
        return True

    except Exception as e:
        print(f"❌ Errore durante il caricamento: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description='Sincronizza contenuti con Notion')
    parser.add_argument('--test', action='store_true', help='Testa la connessione')
    parser.add_argument('--push', type=str, help='Carica un file su Notion')
    parser.add_argument('--db', type=str, choices=['npcs', 'pcs', 'sessions', 'arcs', 'locations'],
                        help='Database di destinazione: npcs, pcs, sessions, arcs, locations')

    args = parser.parse_args()

    if args.test:
        test_connection(args.db)
    elif args.push:
        if not args.db:
            print("❌ Specifica il database con --db (npcs, pcs, sessions, arcs)")
            return
        push_to_notion(args.push, args.db)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
