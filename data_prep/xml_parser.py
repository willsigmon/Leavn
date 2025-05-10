"""
XML Bible Parser for USFX and OSIS formats (WEB & KJV)
- Extracts book, chapter, verse, and text from .usfx.xml and .osis.xml files.
- Extensible for enrichment (summaries, themes, figures, tags).
"""
import xml.etree.ElementTree as ET
import pathlib

BOOK_ABBREV = {
    # Add more as needed
    'GEN': 'Genesis',
    'EXO': 'Exodus',
    'LEV': 'Leviticus',
    # ...
}

def parse_usfx(usfx_path):
    """
    Parse USFX XML (e.g. eng-web.usfx.xml) and yield dicts: {book, chapter, verse, text, xml_path}
    """
    tree = ET.parse(usfx_path)
    root = tree.getroot()
    book = None
    for b in root.findall('.//book'):
        book = b.attrib.get('code')
        book_name = BOOK_ABBREV.get(book, book)
        for c in b.findall('.//c'):
            chapter = int(c.attrib['id'])
            for v in c.findall('.//v'):
                verse = int(v.attrib['id'])
                text = ''.join(v.itertext()).strip()
                yield dict(book=book_name, chapter=chapter, verse=verse, text=text, xml_path=str(usfx_path))

def parse_osis(osis_path):
    """
    Parse OSIS XML (e.g. eng-kjv.osis.xml) and yield dicts: {book, chapter, verse, text, xml_path}
    Robust for KJV: extracts book/chapter/verse from osisID of <verse>, collects text after <verse> tag.
    """
    import logging
    tree = ET.parse(osis_path)
    root = tree.getroot()
    ns = {'osis': 'http://www.bibletechnologies.net/2003/OSIS/namespace'}
    for div in root.findall('.//osis:div[@type="book"]', ns):
        book = div.attrib.get('osisID', 'Unknown')
        # Find all <verse> elements in this book
        for v in div.findall('.//osis:verse', ns):
            if 'osisID' not in v.attrib:
                logging.warning(f"Skipping verse with no osisID in {osis_path}")
                continue
            try:
                osis_parts = v.attrib['osisID'].split('.')
                book_id = osis_parts[0]
                chapter = int(osis_parts[1]) if len(osis_parts) > 1 else None
                verse = int(osis_parts[2]) if len(osis_parts) > 2 else None
            except Exception as e:
                logging.warning(f"Bad osisID: {v.attrib['osisID']} in {osis_path}")
                continue
            # The text is usually the tail after the <verse> tag
            text = (v.tail or '').strip()
            # Sometimes the text is inside the <verse> tag
            if not text:
                text = ''.join(v.itertext()).strip()
            yield dict(book=book, chapter=chapter, verse=verse, text=text, xml_path=str(osis_path))

if __name__ == "__main__":
    for xml_file in pathlib.Path("data_prep/raw").glob("*.usfx.xml"):
        for verse in parse_usfx(xml_file):
            print(verse)
    for xml_file in pathlib.Path("data_prep/raw").glob("*.osis.xml"):
        for verse in parse_osis(xml_file):
            print(verse)
