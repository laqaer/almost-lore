import numpy as np, base64, io
from PIL import Image, ImageFilter
rng=np.random.default_rng(11)
import os
O=os.environ.get('RISO_OUT', '.cache/riso/'); os.makedirs(O, exist_ok=True)
def cblur(a,s):
    # circular (seamless) gaussian blur via FFT
    h,w=a.shape; fy=np.fft.fftfreq(h)[:,None]; fx=np.fft.fftfreq(w)[None,:]
    k=np.exp(-2*(np.pi*s)**2*(fx**2+fy**2))
    return np.real(np.fft.ifft2(np.fft.fft2(a)*k))
def norm(a): return (a-a.min())/(a.max()-a.min())
N=360
tooth = cblur(rng.random((N,N)),0.6); tooth=norm(tooth)
mott = norm(cblur(rng.random((N,N)),22))
mott2 = norm(cblur(rng.random((N,N)),6))
g = 1 - 0.035*tooth - 0.045*mott - 0.02*mott2
fib = np.zeros((N,N))
for _ in range(22):
    x,y = rng.random(2)*N; a = rng.random()*np.pi; L = 10+rng.random()*30
    for t in np.linspace(0,L,int(L*3)):
        xx=int(x+np.cos(a)*t+np.sin(t*.25)*1.2)%N; yy=int(y+np.sin(a)*t)%N; fib[yy,xx]=1
g -= norm(cblur(fib,0.45))*0.05
spk = (rng.random((N,N))<0.00035).astype(float)
g -= np.clip(cblur(spk,0.6)*9,0,1)*0.35
g = np.clip(g,0,1)
Image.fromarray((g*255).astype(np.uint8)).convert('RGB').save(O+'grain.png')
l = (rng.random((N,N))<0.0025).astype(float)
l = np.clip(cblur(l,0.5)*7,0,1)*0.5 + 0.035*tooth + 0.05*mott
Image.fromarray((np.clip(l,0,1)*255).astype(np.uint8)).convert('RGB').save(O+'grain-light.png')
# stamp wear mask (luminance-free alpha PNG), small, for data-URI embedding
W,H=360,180
base = norm(cblur(rng.random((H,W)),1.3))
big = norm(cblur(rng.random((H,W)),12))
holes = (base < 0.26 + 0.16*(big>0.7)).astype(float)
fine = (rng.random((H,W))<0.015).astype(float)
a = 1 - np.clip(holes*0.92 + np.clip(cblur(fine,0.5)*4,0,1)*0.8, 0, 1)
a = np.clip(a*(0.88+0.12*big),0,1)
im = Image.fromarray((a*255).astype(np.uint8),'L')
rgba = Image.merge('RGBA',[Image.new('L',(W,H),0)]*3+[im])
buf=io.BytesIO(); rgba.save(buf,'PNG',optimize=True)
open(O+'wear.b64','w').write(base64.b64encode(buf.getvalue()).decode())
rgba.save(O+'wear.png')
print('wear bytes', len(buf.getvalue()))
