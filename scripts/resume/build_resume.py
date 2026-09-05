import json
import html
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether, HRFlowable
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
# Arial on macOS; Liberation Sans is a metrically compatible Linux alternative.
font_pairs = [(Path('/System/Library/Fonts/Supplemental'), 'Arial.ttf', 'Arial Bold.ttf'), (Path('/usr/share/fonts/truetype/liberation2'), 'LiberationSans-Regular.ttf', 'LiberationSans-Bold.ttf')]
font_dir, regular, bold = next((pair for pair in font_pairs if (pair[0] / pair[1]).exists()), (None, None, None))
if font_dir is None: raise SystemExit('Install Arial or fonts-liberation2 before generating the resume.')
pdfmetrics.registerFont(TTFont('CareerArial', str(font_dir / regular)))
pdfmetrics.registerFont(TTFont('CareerArial-Bold', str(font_dir / bold)))
pdfmetrics.registerFontFamily('CareerArial',normal='CareerArial',bold='CareerArial-Bold')

base = Path(__file__).parent
repo = base.parent.parent
d = json.loads((base / 'resume-content.json').read_text())
out = repo / 'public/resume/zakhar-pashkin-senior-ml-engineer.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
navy = colors.HexColor('#142436')
ink = colors.HexColor('#243444')
muted = colors.HexColor('#526273')
accent = colors.HexColor('#186078')
styles = {
 'name': ParagraphStyle('Name',fontName='CareerArial-Bold',fontSize=26,leading=30,textColor=navy,spaceAfter=4),
 'role': ParagraphStyle('Role',fontName='CareerArial-Bold',fontSize=12.5,leading=17,textColor=navy,spaceAfter=3),
 'contact': ParagraphStyle('Contact',fontName='CareerArial',fontSize=9.2,leading=13,textColor=muted,spaceAfter=3),
 'body': ParagraphStyle('Body',fontName='CareerArial',fontSize=10.5,leading=14.4,textColor=ink,spaceAfter=6),
 'section': ParagraphStyle('Section',fontName='CareerArial-Bold',fontSize=11,leading=15,textColor=accent,spaceBefore=12,spaceAfter=7,keepWithNext=True),
 'job': ParagraphStyle('Job',fontName='CareerArial-Bold',fontSize=11,leading=14,textColor=navy,spaceAfter=2,keepWithNext=True),
 'meta': ParagraphStyle('Meta',fontName='CareerArial',fontSize=9.3,leading=13,textColor=muted,spaceAfter=6,keepWithNext=True),
 'bullet': ParagraphStyle('Bullet',fontName='CareerArial',fontSize=10.5,leading=14.4,textColor=ink,leftIndent=10,firstLineIndent=0,bulletIndent=0,spaceAfter=6),
 'project': ParagraphStyle('Project',fontName='CareerArial',fontSize=10.2,leading=14,textColor=ink,spaceAfter=8),
 'skill': ParagraphStyle('Skill',fontName='CareerArial',fontSize=9.7,leading=13.2,textColor=ink,spaceAfter=5)
}
def e(v): return html.escape(v)
def p(v,s='body'): return Paragraph(v,styles[s])
def link(label,url): return '<link href="'+e(url)+'" color="#186078">'+e(label)+'</link>'

story=[p(e(d['name']),'name'),p(e(d['title'])+' | '+e(d['specialisms']),'role'),
 p(e(d['location'])+' | '+link(d['email'],'mailto:'+d['email']),'contact'),
 p(' | '.join([link('zack-dev-cm.github.io',d['website']),link('GitHub',d['github']),link('LinkedIn',d['linkedin'])]),'contact'),
 Spacer(1,7),HRFlowable(width='100%',thickness=.6,color=colors.HexColor('#CBD4DD')),Spacer(1,9),p(e(d['summary'])),p('EXPERIENCE','section')]

def add_job(j):
 story.extend([p(e(j['role']),'job'),p(e(j['company'])+' | '+e(j['dates'])+'<br/>'+e(j['context']),'meta')])
 for b in j['bullets']: story.append(Paragraph(e(b),styles['bullet'],bulletText='\u2022'))
 if j.get('links'): story.append(p(' | '.join(link(item['label'],item['url']) for item in j['links']),'contact'))
 story.append(Spacer(1,3))

for j in d['experience'][:3]: add_job(j)
story.extend([PageBreak(),p('EARLIER EXPERIENCE','section')])
for j in d['experience'][3:]: add_job(j)
story.append(p('SELECTED PROJECTS & RESEARCH','section'))
for q in d['projects']:
 story.append(p('<b>'+link(q['name'],q['url'])+'</b> | '+e(q['status'])+'<br/>'+e(q['text']),'project'))
story.append(p('TECHNICAL EXPERTISE','section'))
for s in d['skills']: story.append(p('<b>'+e(s['label'])+':</b> '+e(s['text']),'skill'))
story.extend([p('EDUCATION','section'),p(e(d['education']),'skill')])

def footer(canvas,doc):
 canvas.saveState();canvas.setFillColor(muted);canvas.setFont('Helvetica',8)
 canvas.drawString(43,24,'Zakhar Pashkin | Senior ML Engineer')
 canvas.drawRightString(A4[0]-43,24,str(doc.page))
 canvas.restoreState()
class ResumeDocument(SimpleDocTemplate):
 def afterPage(self): footer(self.canv,self)

doc=ResumeDocument(str(out),pagesize=A4,rightMargin=43,leftMargin=43,topMargin=34,bottomMargin=39,title='Zakhar Pashkin - Senior ML Engineer',author='Zakhar Pashkin',subject=d['specialisms'])
doc.build(story)

# The website and PDF use the same content, preventing mismatched resume versions.
resume_dir=repo/'public/resume';resume_dir.mkdir(exist_ok=True)
canonical='https://zack-dev-cm.github.io/resume/zakhar-pashkin-senior-ml-engineer.html'
schema={'@context':'https://schema.org','@type':'ProfilePage','url':canonical,'dateModified':d['updated'],'mainEntity':{'@type':'Person','name':d['name'],'jobTitle':d['title'],'url':d['website'],'sameAs':[d['github'],d['linkedin']],'worksFor':{'@type':'Organization','name':'Riverstart'}}}
parts=['<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">',
 '<title>Zakhar Pashkin - Senior ML Engineer Resume</title><meta name="description" content="Senior ML Engineer resume: computer vision, document AI, agentic systems, Riverstart R&amp;D, Carb Manager, CFT, Dermaself and Agnitra.">',
 '<link rel="canonical" href="'+canonical+'"><script type="application/ld+json">'+json.dumps(schema)+'</script>',
 '<style>body{margin:0;background:#edf1f4;color:#243444;font:16px/1.55 Arial,sans-serif}main{max-width:850px;margin:36px auto;padding:48px;background:white}h1{font-size:32px;margin:0;color:#142436}h2{font-size:17px;color:#186078;margin-top:28px}h3{font-size:17px;margin:18px 0 2px}p{margin:7px 0}a{color:#186078;text-underline-offset:3px}li{margin-bottom:8px}.meta{color:#526273;font-size:14px}.actions{display:flex;gap:20px;flex-wrap:wrap;margin:20px 0;padding-bottom:20px;border-bottom:1px solid #cbd4dd}a:focus-visible{outline:3px solid #186078;outline-offset:4px}@media(max-width:640px){main{margin:0;padding:26px 22px}h1{font-size:28px}}@media print{body{background:white}main{margin:0;padding:0}.actions{display:none}h2,h3{break-after:avoid}li{break-inside:avoid}}</style></head><body><main>',
 '<h1>'+e(d['name'])+'</h1><p><strong>'+e(d['title'])+' | '+e(d['specialisms'])+'</strong></p>',
 '<p class="meta">'+e(d['location'])+' | <a href="mailto:'+e(d['email'])+'">'+e(d['email'])+'</a></p>',
 '<nav class="actions" aria-label="Resume links"><a href="/resume/zakhar-pashkin-senior-ml-engineer.pdf">Download PDF</a><a href="/">Portfolio</a><a href="'+d['github']+'">GitHub</a><a href="'+d['linkedin']+'">LinkedIn</a></nav>',
 '<p>'+e(d['summary'])+'</p><h2>Experience</h2>']
for j in d['experience']:
 parts += ['<section><h3>'+e(j['role'])+'</h3><p class="meta">'+e(j['company'])+' | '+e(j['dates'])+' | '+e(j['context'])+'</p><ul>']
 parts += ['<li>'+e(b)+'</li>' for b in j['bullets']]
 parts += ['</ul>']
 if j.get('links'): parts += ['<p class="meta">'+' · '.join('<a href="'+e(item['url'])+'">'+e(item['label'])+'</a>' for item in j['links'])+'</p>']
 parts += ['</section>']
parts += ['<h2>Selected projects &amp; research</h2>']
for q in d['projects']:parts += ['<section><h3><a href="'+e(q['url'])+'">'+e(q['name'])+'</a></h3><p class="meta">'+e(q['status'])+'</p><p>'+e(q['text'])+'</p></section>']
parts += ['<h2>Technical expertise</h2>']
for s in d['skills']:parts+=['<p><strong>'+e(s['label'])+':</strong> '+e(s['text'])+'</p>']
parts+=['<h2>Education</h2><p>'+e(d['education'])+'</p></main></body></html>']
html_out='\n'.join(parts)
(resume_dir/'zakhar-pashkin-senior-ml-engineer.html').write_text(html_out)
(resume_dir/'zakhar-pashkin-senior-ml-engineer.pdf').write_bytes(out.read_bytes())
# Keep existing download destinations valid and current.
for old in ['zakhar-pashkin-ai-product-engineer-resume','zakhar-pashkin-senior-computer-vision-engineer']:
 (resume_dir/(old+'.pdf')).write_bytes(out.read_bytes())
 (resume_dir/(old+'.html')).write_text(html_out)
print(out)
