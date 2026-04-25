(function(){
  function normalizeHref(href){
    if(!href) return '';
    href = href.trim();
    if(!href || href === '#' || href.startsWith('javascript:')) return '';
    href = href.replace(/^https?:\/\/www\.tradeetching\.com\/?/i, '');
    if(!href) return 'index.html';
    if(href.toLowerCase() === 'contact') return 'Contact.html';
    if(!href.includes('.') && !href.includes('#')) href += '.html';
    return href;
  }

  function pickNav(){
    return document.querySelector('nav#1284501632, nav#1587919735, nav.unifiednav');
  }

  function buildMenu(){
    if(document.getElementById('oc-mobile-nav-toggle')) return true;
    var nav = pickNav();
    if(!nav) return false;

    var preferred = [
      'index.html',
      'chemical-etching-services.html',
      'chemical-milling.html',
      'metal-patination.html',
      'large-format-chemical-etching-for-architecture.html',
      'flat-cut-metal-letters-brass-stainless-steel.html',
      'metal-etching-concepts.html',
      'etched-industrial-labels-control-panels.html',
      'etching-gallery.html',
      'Contact.html'
    ];

    var seenByHref = {};
    var links = [];
    nav.querySelectorAll('a[href]').forEach(function(a){
      var href = normalizeHref(a.getAttribute('href') || '');
      var txt = (a.textContent || '').replace(/\s+/g, ' ').trim();
      if(!href || !txt) return;
      if(seenByHref[href]) return;
      seenByHref[href] = true;
      links.push({ href: href, text: txt });
    });

    if(!links.length) return false;

    links.sort(function(a,b){
      var ia = preferred.indexOf(a.href); if(ia < 0) ia = 999;
      var ib = preferred.indexOf(b.href); if(ib < 0) ib = 999;
      return ia - ib;
    });

    var topbar = document.createElement('div');
    topbar.id = 'oc-mobile-topbar';

    var btn = document.createElement('button');
    btn.id = 'oc-mobile-nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'oc-mobile-nav-panel');
    btn.setAttribute('aria-label', 'Open menu');
    btn.textContent = '☰';

    var panel = document.createElement('nav');
    panel.id = 'oc-mobile-nav-panel';
    panel.hidden = true;

    links.forEach(function(l){
      var a = document.createElement('a');
      a.href = l.href;
      a.textContent = l.text;
      panel.appendChild(a);
    });

    btn.addEventListener('click', function(){
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });

    panel.addEventListener('click', function(e){
      if(e.target && e.target.tagName === 'A'){
        btn.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      }
    });

    document.body.appendChild(topbar);
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    return true;
  }

  function start(){
    if(buildMenu()) return;
    var tries = 0;
    var t = setInterval(function(){
      tries += 1;
      if(buildMenu() || tries > 40) clearInterval(t);
    }, 250);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
