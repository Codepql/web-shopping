from pathlib import Path
import json
from playwright.sync_api import sync_playwright

out = Path(__file__).parents[1] / 'test-results'
out.mkdir(exist_ok=True)
reports=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    page=browser.new_page(viewport={'width':1440,'height':1000})
    page.goto('http://127.0.0.1:5173',wait_until='networkidle')
    def audit(name):
        page.wait_for_timeout(350)
        page.add_script_tag(path=str(Path(__file__).parents[1]/'node_modules/axe-core/axe.min.js'))
        data=page.evaluate("async () => { const dialogs=[...document.querySelectorAll('[role=dialog]')]; const r=await axe.run(dialogs.at(-1) || document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}); return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})), passes:r.passes.length}; }")
        reports.append({'view':name,**data})
        print(json.dumps({'view':name,'passes':data['passes'],'violations':[{'id':v['id'],'nodes':v['nodes'][:4],'count':len(v['nodes'])} for v in data['violations']]},ensure_ascii=False),flush=True)
    audit('desktop-home')
    page.get_by_role('link',name='查看暖光 · 桌面台灯详情',exact=True).click()
    audit('desktop-detail')
    page.keyboard.press('Escape')
    page.get_by_role('button',name='将暖光 · 桌面台灯加入购物车',exact=True).click()
    page.get_by_role('button',name='打开购物车，共1件商品').click()
    audit('desktop-cart')
    page.get_by_role('button',name='立即购买',exact=True).click()
    audit('purchase-notice')
    page.get_by_role('button',name='返回购物车',exact=True).click()
    page.keyboard.press('Escape')
    page.set_viewport_size({'width':390,'height':844})
    page.get_by_role('button',name='打开筛选与排序').click()
    audit('mobile-filters')
    page.keyboard.press('Escape')
    page.get_by_role('link',name='查看暖光 · 桌面台灯详情',exact=True).click()
    audit('mobile-detail')
    (out/'accessibility.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf-8')
    browser.close()
