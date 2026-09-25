# Teachers Pay Teachers listing pack

Teachers buy bell-ringers in August and September and again in January; seasonal and
"sub plan" resources sell all year. The owner uploads; the product-maker keeps this file current.

**Files:** upload a ZIP containing `almost-lore-classroom-slides.pdf` and both printables PDFs
(US Letter + A4). **Preview:** a PDF of slides 1–7 and the teacher guide page (build with the
command at the bottom). **Thumbnails:** `ops/marketplace/previews/classroom-*.png`.

## Classroom Pack, Vol. 1 — $15 (additional licences at TPT's default discount)

**Title (≤80):** History Bell Ringers: Happened, Almost, or Lore? Evaluating Sources Warm-Ups

**Grades:** 6th–12th · **Subjects:** U.S. History, World History, Social Studies – History
**Resource types:** Bell Ringers, Activities, Printables · **Format:** PDF

**Standards (tag in TPT's standards picker):** CCSS.ELA-LITERACY.RH.6-8.8,
CCSS.ELA-LITERACY.RH.9-10.8 · C3 Framework D3 (Evaluating Sources and Using Evidence)

**Description:**
> Start class with an argument about evidence. Each bell-ringer is a history claim written as
> plain fact. Students commit to a verdict — HAPPENED (true exactly as written), ALMOST (it didn't
> happen, but documents show it came close) or LORE (a popular myth) — then check it against the
> record and two named sources.
>
> The middle verdict is the lesson. "Almost" makes students ask how close something came and what
> the documents actually show: a vote that failed, an offer that was refused, a mission called off.
>
> INCLUDED
> • 48 claim slides + 48 answer slides (16:9 PDF, projects from any computer)
> • Five-minute routine and teacher guide
> • Student recording sheet (verdict, confidence, "what would change my mind?")
> • Answer key
> • Extension lesson: Write Your Own ALMOST (find a near-miss, prove it with two sources, test it
>   on a classmate)
> • Exit ticket slips
>
> Every claim is school-safe and every answer is sourced and fact-checked. No student accounts, no
> devices, no data collected.
>
> Free daily version for the projector: almostlore.com/class
>
> How it's made: researched and drafted with AI tools, checked against named sources under a
> public rubric, with a human publisher accountable for every answer.

**Keywords to work into the first 2 lines if TPT search data suggests them:** bell ringers,
warm ups, evaluating sources, primary sources, historical thinking, critical thinking, do now.

## Rebuilding the preview
```
PRODUCTS_KEY=… node scripts/build-pdfs.mjs classroom
python3 - <<'PY'
import pymupdf
src = pymupdf.open("private/products/almost-lore-classroom-slides.pdf")
out = pymupdf.open(); out.insert_pdf(src, from_page=0, to_page=6)
out.save("ops/marketplace/previews/classroom-preview.pdf")
PY
```
