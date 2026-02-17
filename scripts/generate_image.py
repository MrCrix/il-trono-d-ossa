#!/usr/bin/env python3
"""
Script per generare immagini di personaggi usando Amazon Bedrock Nova Canvas.

Uso:
    python scripts/generate_image.py characters/npcs/orsinar-tharavos.md
    python scripts/generate_image.py characters/npcs/maitre-velloran.md --output images/npcs
    python scripts/generate_image.py characters/npcs/*.md --batch
"""

import os
import json
import base64
import argparse
import re
from pathlib import Path
from dotenv import load_dotenv
import boto3

# Carica variabili ambiente
load_dotenv(override=True)


def parse_frontmatter(content):
    """Estrae il frontmatter YAML e il contenuto markdown."""
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.match(frontmatter_pattern, content, re.DOTALL)

    if not match:
        return {}, content

    frontmatter = match.group(1)
    content_without = content[match.end():]

    # Parse semplice del YAML
    metadata = {}
    for line in frontmatter.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            metadata[key.strip()] = value.strip()

    return metadata, content_without


def extract_physical_description(content):
    """Estrae la sezione 'Descrizione Fisica' dal markdown."""
    lines = content.split('\n')
    description_lines = []
    capture = False

    for line in lines:
        # Inizia a catturare quando trova la sezione Descrizione
        if '## Descrizione Fisica' in line or '## Descrizione' in line:
            capture = True
            continue
        # Stop quando trova un'altra sezione
        elif line.startswith('##') and capture:
            break
        # Cattura le righe della descrizione
        elif capture and line.strip():
            # Rimuovi markdown come ** e altri formattatori
            clean_line = line.strip()
            clean_line = clean_line.replace('**', '')
            description_lines.append(clean_line)

    return '\n'.join(description_lines)


def extract_character_name(content):
    """Estrae il nome del personaggio dal primo heading # Nome."""
    lines = content.split('\n')
    for line in lines:
        if line.startswith('# '):
            return line[2:].strip()
    return "Unknown Character"


def generate_image(description, character_name, output_dir="images/npcs", style="dnd-manual"):
    """
    Genera un'immagine del personaggio usando Amazon Bedrock Nova Canvas.

    Args:
        description: Descrizione fisica del personaggio
        character_name: Nome del personaggio
        output_dir: Directory di output
        style: Stile artistico (dnd-manual, portrait, fantasy-art)

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

        print(f"\n🎨 Generazione immagine per: {character_name}")
        print(f"   Modello: {model_id}")
        print(f"   Dimensioni: {width}x{height}")
        print(f"   Varianti: {num_images}")

        # Crea client Bedrock
        bedrock = boto3.client('bedrock-runtime', region_name=region)

        # Selezione stile
        style_prompts = {
            "dnd-manual": "Classic Dungeons & Dragons manual illustration, detailed fantasy art, neutral standing pose, full body or upper body portrait, official D&D 5e art style",
            "portrait": "High quality fantasy portrait painting, oil painting style, detailed facial features, dignified pose, warm lighting",
            "fantasy-art": "Epic fantasy character art, detailed illustration, professional digital painting, dynamic lighting, fantasy RPG style"
        }

        style_suffix = style_prompts.get(style, style_prompts["dnd-manual"])

        # Accorcia la descrizione se troppo lunga (limite Nova Canvas: 1024 caratteri)
        # Prendiamo solo le prime righe più importanti
        description_lines = description.split('\n')
        short_description = []
        char_count = 0

        for line in description_lines:
            if char_count + len(line) < 600:  # Lasciamo spazio per il resto del prompt
                short_description.append(line)
                char_count += len(line)
            else:
                break

        description_short = ' '.join(short_description)

        # Costruisci prompt conciso con enfasi su caratteristiche chiave
        prompt = f"""{description_short}

Art style: {style_suffix}. Realistic proportions, mature distinguished appearance."""

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

        print(f"   Invio richiesta a Bedrock...")

        # Invoca il modello
        response = bedrock.invoke_model(
            modelId=model_id,
            body=body
        )

        # Parse risposta
        response_body = json.loads(response['body'].read())
        images = response_body.get('images', [])

        if not images:
            print("❌ Nessuna immagine generata")
            return None

        # Crea directory se non esiste
        os.makedirs(output_dir, exist_ok=True)

        # Nome file safe
        safe_name = character_name.lower().replace(' ', '-').replace("'", '').replace('lord ', '').replace('maitre ', '')

        # Salva tutte le varianti
        saved_paths = []
        for idx, image_data_b64 in enumerate(images):
            image_data = base64.b64decode(image_data_b64)

            if num_images > 1:
                image_path = os.path.join(output_dir, f"{safe_name}-variant-{idx+1}.png")
            else:
                image_path = os.path.join(output_dir, f"{safe_name}.png")

            with open(image_path, 'wb') as f:
                f.write(image_data)

            saved_paths.append(image_path)
            print(f"   ✅ Salvata: {image_path}")

        print(f"\n✅ Generazione completata!")
        print(f"   File salvati: {len(saved_paths)}")

        return saved_paths[0]  # Ritorna il primo path

    except Exception as e:
        print(f"❌ Errore generazione immagine: {e}")
        import traceback
        traceback.print_exc()
        return None


def process_character_file(file_path, output_dir, style):
    """Processa un singolo file personaggio."""
    try:
        print(f"\n📖 Lettura file: {file_path}")

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Estrai metadata e contenuto
        metadata, content_clean = parse_frontmatter(content)

        # Estrai nome personaggio
        character_name = extract_character_name(content_clean)
        print(f"   Personaggio: {character_name}")

        # Estrai descrizione fisica
        description = extract_physical_description(content_clean)

        if not description:
            print(f"⚠️  Nessuna sezione 'Descrizione Fisica' trovata")
            return False

        print(f"   Descrizione estratta: {len(description)} caratteri")

        # Genera immagine
        image_path = generate_image(description, character_name, output_dir, style)

        return image_path is not None

    except Exception as e:
        print(f"❌ Errore processamento file: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description='Genera immagini di personaggi con Amazon Bedrock Nova Canvas',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Esempi:
  # Genera immagine per Orsinar
  python scripts/generate_image.py characters/npcs/orsinar-tharavos.md

  # Genera con output personalizzato
  python scripts/generate_image.py characters/npcs/maitre-velloran.md --output images/test

  # Genera con stile ritratto
  python scripts/generate_image.py characters/npcs/orsinar-tharavos.md --style portrait

  # Batch processing di più personaggi
  python scripts/generate_image.py characters/npcs/*.md --batch

Stili disponibili:
  - dnd-manual: Stile manuale D&D classico (default)
  - portrait: Ritratto ad olio, dettagliato
  - fantasy-art: Arte fantasy epica
        """
    )

    parser.add_argument('files', nargs='+', help='File markdown del/dei personaggio/i')
    parser.add_argument('--output', '-o', default='images/npcs', help='Directory di output (default: images/npcs)')
    parser.add_argument('--style', '-s', choices=['dnd-manual', 'portrait', 'fantasy-art'],
                        default='dnd-manual', help='Stile artistico (default: dnd-manual)')
    parser.add_argument('--batch', '-b', action='store_true', help='Modalità batch per più file')

    args = parser.parse_args()

    # Verifica configurazione AWS
    if not os.getenv("AWS_REGION"):
        print("⚠️  AWS_REGION non configurato in .env, uso default: eu-west-1")

    print(f"🎨 Amazon Bedrock Image Generator")
    print(f"   Output directory: {args.output}")
    print(f"   Stile: {args.style}")
    print(f"   File da processare: {len(args.files)}")

    # Processa file
    success_count = 0
    for file_path in args.files:
        if not os.path.exists(file_path):
            print(f"⚠️  File non trovato: {file_path}")
            continue

        if process_character_file(file_path, args.output, args.style):
            success_count += 1

    # Riepilogo
    print(f"\n{'='*50}")
    print(f"✅ Completato: {success_count}/{len(args.files)} immagini generate")

    if success_count > 0:
        print(f"\n📁 Le immagini sono salvate in: {args.output}/")
        print(f"   Puoi visualizzarle con: open {args.output}/")


if __name__ == "__main__":
    main()
