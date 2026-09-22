"""One-time import of the site's own images, from captured public page inventory."""
from pathlib import Path
from PIL import Image,ImageOps
import json,subprocess,hashlib,urllib.parse,concurrent.futures
inventory=json.loads(Path('review/source/inventory.json').read_text())
media=Path('public/media');media.mkdir(exist_ok=True,parents=True)
unique={}
for p in inventory:
 for im in p['images']:
  key=urllib.parse.urlsplit(im['src']).path
  unique.setdefault(key,im)
def download(entry):
 key,im=entry;ident=hashlib.sha256(key.encode()).hexdigest()[:12];temp=Path('/tmp/ted-'+ident)
 subprocess.run(['curl','-fsSL','--max-time','35',im['src'],'-o',str(temp)],check=True)
 original=ImageOps.exif_transpose(Image.open(temp)).convert('RGB')
 for width in [480,960,1600]:
  out=original.copy();out.thumbnail((width,width*2));out.save(media/(ident+'-'+str(width)+'.webp'),'WEBP',quality=85,method=4)
 temp.unlink()
 return key,dict(src='/media/'+ident+'-960.webp',small='/media/'+ident+'-480.webp',large='/media/'+ident+'-1600.webp',width=original.width,height=original.height,alt=im['alt'])
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 mapping=dict(pool.map(download,unique.items()))
for p in inventory:
 p['images']=[{**mapping[urllib.parse.urlsplit(im['src']).path],'alt':im['alt']} for im in p['images']]
 p['links']=[dict(href=l['href'].split('?')[0],text=l['text']) for l in p['links'] if l['href']]
Path('src/source-content.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2))
print('Imported',len(mapping),'unique site images')
film=Path('../trade-etching-remotion/public')
for name in ['opening-patina-letter','opening-celtic-metal','architectural-brass','product-brass-plaque','product-industrial-plates','website-etched-awards','art-deco-mural']:
 original=Image.open(film/(name+'.jpg')).convert('RGB')
 for width in [480,960,1600]:
  out=original.copy();out.thumbnail((width,width*2));out.save(media/(name+'-'+str(width)+'.webp'),'WEBP',quality=88,method=4)
Image.open(film/'trade-etching-logo.png').save(media/'trade-etching-logo.png')
