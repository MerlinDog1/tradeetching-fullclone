(function(){
  function buildMenu(){
    if(document.getElementById('oc-mobile-nav-toggle')) return;
    var nav=document.querySelector('nav#1587919735, nav#1284501632, nav.unifiednav');
    if(!nav) return;
    var seen={};
    var links=[];
    nav.querySelectorAll('a[href]').forEach(function(a){
      var href=(a.getAttribute('href')||'').trim();
      var txt=(a.textContent||'').replace(/\s+/g,' ').trim();
      if(!href || href.startsWith('javascript:') || href==='#' || !txt) return;
      var key=(txt+'|'+href).toLowerCase();
      if(seen[key]) return;
      seen[key]=1;
      links.push({href:href,text:txt});
    });
    if(!links.length) return;

    var btn=document.createElement('button');
    btn.id='oc-mobile-nav-toggle';
    btn.type='button';
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-controls','oc-mobile-nav-panel');
    btn.innerHTML='☰';

    var panel=document.createElement('nav');
    panel.id='oc-mobile-nav-panel';
    panel.hidden=true;
    links.forEach(function(l){
      var a=document.createElement('a');
      a.href=l.href;
      a.textContent=l.text;
      panel.appendChild(a);
    });

    btn.addEventListener('click',function(){
      var open=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden=open;
    });
    panel.addEventListener('click', function(e){
      if(e.target && e.target.tagName==='A'){
        btn.setAttribute('aria-expanded','false');
        panel.hidden=true;
      }
    });

    document.body.appendChild(btn);
    document.body.appendChild(panel);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',buildMenu); else buildMenu();
})();
