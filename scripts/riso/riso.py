# Riso separation generator: makes per-drum ink layers (ink on white) for multiply stacking in CSS.
#   python3 scripts/riso/riso.py            (from the repo root)
# Reads the public-domain originals in public/images/archive/ (fetched by scripts/fetch-images.mjs)
# and writes PNG layers to .cache/riso/; convert the ones you use to WebP in public/images/riso/:
#   cwebp -q 82 .cache/riso/x.png -o public/images/riso/x.webp
import numpy as np
from PIL import Image, ImageFilter, ImageOps
import os, sys
K = os.environ.get('RISO_SRC', 'public/images/archive/')
O = os.environ.get('RISO_OUT', '.cache/riso/')
os.makedirs(O, exist_ok=True)
# Source names used below → files in public/images/archive/
ALIAS = {'dancing.jpg': 'dancing-pilgrims.jpg', 'poyais-note.jpg': 'poyais-banknote.jpg',
         'macgregor.jpg': 'gregor-macgregor.jpg', 'beach.jpg': 'beach-pneumatic.jpg',
         'molasses.jpg': 'molasses-flood.jpg', 'eiffel.jpg': 'eiffel-construction.jpg'}
INK = {'ink': (20,16,21), 'pink': (255,79,154), 'blue': (47,91,255), 'sun': (255,210,63)}
rng = np.random.default_rng(7)

def load(name, W, crop=None):
    im = Image.open(K+ALIAS.get(name, name)).convert('L')
    if crop:  # fractional crop l,t,r,b
        w,h = im.size; im = im.crop((int(crop[0]*w),int(crop[1]*h),int(crop[2]*w),int(crop[3]*h)))
    H = round(im.size[1]*W/im.size[0])
    im = im.resize((W,H), Image.LANCZOS)
    im = ImageOps.autocontrast(im, cutoff=1)
    return im

def dark(im, gamma=1.0, lo=0.0, hi=1.0):
    d = 1 - np.asarray(im, dtype=np.float32)/255.
    d = np.clip((d-lo)/(hi-lo), 0, 1)
    return d**gamma

def texture(shape, amt=0.12, speck=0.035):
    # low-frequency ink density variation + white speckle (dropouts), like a tired drum
    h,w = shape
    small = rng.random((max(2,h//40), max(2,w//40))).astype(np.float32)
    lf = np.asarray(Image.fromarray((small*255).astype(np.uint8)).resize((w,h), Image.BICUBIC), dtype=np.float32)/255.
    t = 1 - amt*lf
    sp = rng.random((h,w)) < speck
    sp = np.asarray(Image.fromarray((sp*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float32)/255.
    return np.clip(t - sp*0.9, 0, 1)

def halftone(d, cell=7.0, angle=45, blur=None):
    h,w = d.shape
    src = d
    if blur:
        src = np.asarray(Image.fromarray((d*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur)), dtype=np.float32)/255.
    th = np.deg2rad(angle); c, s = np.cos(th), np.sin(th)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    u = (x*c + y*s)/cell; v = (-x*s + y*c)/cell
    cov = np.zeros_like(d)
    for du in (-1,0,1):
        for dv in (-1,0,1):
            uc = np.floor(u)+0.5+du; vc = np.floor(v)+0.5+dv
            xc = cell*(uc*c - vc*s); yc = cell*(uc*s + vc*c)
            xi = np.clip(xc.astype(int), 0, w-1); yi = np.clip(yc.astype(int), 0, h-1)
            ds = src[yi, xi]
            r = cell*np.sqrt(ds/np.pi)*1.08
            dist = cell*np.sqrt((u-uc)**2 + (v-vc)**2)
            cov = np.maximum(cov, np.clip(r - dist + 0.5, 0, 1))
    return cov

def lines(d, lo=0.25, hi=0.75):
    # engraving: keep the burin lines, crush paper tone
    return np.clip((d-lo)/(hi-lo), 0, 1)

def save(cov, ink, path, bg=(255,255,255)):
    col = np.array(INK[ink], dtype=np.float32)
    bgc = np.array(bg, dtype=np.float32)
    out = bgc*(1-cov[...,None]) + col*cov[...,None]
    Image.fromarray(out.astype(np.uint8)).save(O+path, optimize=True)
    print('wrote', path, cov.shape)

def screen_on_dark(covs_inks, path):
    # for night plates: inks printed on black stock (lighten), used on ink background
    h,w = covs_inks[0][0].shape
    out = np.zeros((h,w,3), np.float32) + np.array(INK['ink'], np.float32)
    for cov, ink in covs_inks:
        col = np.array(INK[ink], np.float32)
        out = out*(1-cov[...,None]) + np.maximum(out, col)*cov[...,None]
    Image.fromarray(out.astype(np.uint8)).save(O+path, optimize=True)
    print('wrote', path)

jobs = sys.argv[1:] or ['dancing','poyais','macgregor','beach','molasses','eiffel','night']

if 'dancing' in jobs:
    im = load('dancing.jpg', 820, crop=(0.02,0.30,0.98,0.965))
    d = dark(im)
    t = texture(d.shape)
    save(lines(d, 0.42, 0.92)*t, 'blue', 'dancing-blue.png')
    save(lines(d, 0.40, 0.90)*t, 'ink', 'dancing-ink.png')
    save(halftone(dark(im, 2.2, 0.30, 0.95), 7, 15, blur=4)*texture(d.shape, .2, .02)*0.95, 'pink', 'dancing-pink.png')
if 'poyais' in jobs:
    im = load('poyais-note.jpg', 1200, crop=(0.015,0.03,0.985,0.97))
    d = dark(im)
    save(lines(d, 0.28, 0.85)*texture(d.shape), 'blue', 'poyais-blue.png')
    save(halftone(dark(im, 1.6, 0.22, 0.8), 7, 75, blur=5)*texture(d.shape,.2,.02)*0.9, 'pink', 'poyais-pink.png')
if 'macgregor' in jobs:
    im = load('macgregor.jpg', 460)
    d = dark(im, 1.0)
    save(halftone(np.clip((d-0.50)/0.50,0,1)**1.25, 4.4, 45)*texture(d.shape, .1, .02), 'ink', 'macgregor-ink.png')
    mid = np.clip((d-0.15)/0.6,0,1)**1.6*0.85
    save(halftone(mid, 5.5, 15, blur=2)*0.95*texture(d.shape, .2, .02), 'pink', 'macgregor-pink.png')
if 'beach' in jobs:
    im = load('beach.jpg', 700)
    d = dark(im)
    save(lines(d, 0.30, 0.80)*texture(d.shape), 'blue', 'beach-blue.png')
    save(halftone(dark(im, 1.0, 0.0, 0.6), 7, 15, blur=6)*texture(d.shape,.2,.02), 'sun', 'beach-sun.png')
if 'molasses' in jobs:
    im = load('molasses.jpg', 820, crop=(0.30,0.40,1.0,0.98))
    d = dark(im, 1.0)
    save(halftone(np.clip((d-0.12)/0.8,0,1)**1.35, 4.6, 45)*texture(d.shape,.1,.02), 'ink', 'molasses-ink.png')
    save(halftone(dark(im, 0.7, 0.0, 0.7), 6.5, 15, blur=3)*texture(d.shape,.2,.02), 'sun', 'molasses-sun.png')
if 'eiffel' in jobs:
    im = load('eiffel.jpg', 620, crop=(0.05,0.03,0.95,0.93))
    im = ImageOps.autocontrast(im, cutoff=2)
    d = dark(im, 1.5, 0.22, 0.95)
    save(np.maximum(halftone(d, 4.2, 45), lines(dark(im), 0.62, 0.9))*texture(d.shape,.1,.02), 'blue', 'eiffel-blue.png')
    save(halftone(dark(im, 0.9, 0.0, 0.8), 6.5, 15, blur=4)*texture(d.shape,.2,.02)*0.9, 'pink', 'eiffel-pink.png')
if 'night' in jobs:
    im = load('dancing.jpg', 760, crop=(0.02,0.40,0.98,0.97))
    inv = 1 - dark(im)   # light areas become ink on black stock
    l = lines(1-inv, 0.30, 0.80)
    t = texture(l.shape)
    screen_on_dark([(halftone(np.clip(inv*1.0,0,1)**1.4, 6, 45)*t*0.95, 'pink')], 'dancing-night.png')
