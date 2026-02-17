(function () {
  'use strict';

  // DOM refs
  const svg = document.getElementById('diagram');
  const drawerEl = document.getElementById('drawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerTabs = document.getElementById('drawerTabs');
  const drawerBody = document.getElementById('drawerBody');
  const navPrev = document.getElementById('navPrev');
  const navNext = document.getElementById('navNext');
  const drawerHandle = document.getElementById('drawerHandle');
  const diagramWrap = document.querySelector('.diagram-wrap');
  const mobileNav = document.getElementById('mobileNav');

  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Desktop floating icons
  document.getElementById('btnInfo').addEventListener('click', function () { openUtilityPanel('about'); });
  document.getElementById('btnContact').addEventListener('click', function () { openUtilityPanel('contact'); });
  document.getElementById('btnRefs').addEventListener('click', function () { openUtilityPanel('references'); });
  document.getElementById('btnHelp').addEventListener('click', function () { openUtilityPanel('help'); });

  // Mobile nav bar buttons
  document.getElementById('mNavInfo').addEventListener('click', function () { openUtilityPanel('about'); });
  document.getElementById('mNavContact').addEventListener('click', function () { openUtilityPanel('contact'); });
  document.getElementById('mNavRefs').addEventListener('click', function () { openUtilityPanel('references'); });
  document.getElementById('mNavHelp').addEventListener('click', function () { openUtilityPanel('help'); });

  const { nodes, edges, annotations, lanes, meta, nodeOrder } = window.PROJECT;

  // Node dimensions
  const W = 210;
  const H = 72;
  const R = 10;

  let selectedNodeId = null;
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  var userSheetHeight = null; // tracks user's manual resize choice

  function trackEvent(path, title) {
    if (typeof goatcounter !== 'undefined') {
      goatcounter.count({ path: path, title: title, event: true });
    }
  }

  // SVG helpers
  function svgEl(tag, attrs) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Edge path (bezier)
  function calcEdgePath(a, b) {
    const sameCol = Math.abs(a.x - b.x) < 80;
    if (sameCol) {
      const sx = a.x + W / 2, sy = a.y + H;
      const tx = b.x + W / 2, ty = b.y;
      const g = (ty - sy) * 0.38;
      return `M ${sx} ${sy} C ${sx} ${sy + g}, ${tx} ${ty - g}, ${tx} ${ty}`;
    }
    const sx = a.x + W, sy = a.y + H / 2;
    const tx = b.x,     ty = b.y + H / 2;
    const dx = (tx - sx) * 0.42;
    return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
  }

  function edgeLabelPos(a, b) {
    const sameCol = Math.abs(a.x - b.x) < 80;
    if (sameCol) {
      return { x: a.x + W / 2 + 10, y: (a.y + H + b.y) / 2, anchor: 'start' };
    }
    return {
      x: (a.x + W + b.x) / 2,
      y: (a.y + H / 2 + b.y + H / 2) / 2 - 7,
      anchor: 'middle'
    };
  }

  // Render diagram
  function render() {
    svg.innerHTML = '';

    var defs = svgEl('defs');
    var arrow = svgEl('marker', {
      id: 'arrow', viewBox: '0 0 10 10',
      refX: '10', refY: '5',
      markerWidth: '6', markerHeight: '6',
      orient: 'auto'
    });
    arrow.appendChild(svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#475569' }));
    defs.appendChild(arrow);
    svg.appendChild(defs);

    // Lane backgrounds
    var colMap = {};
    nodes.forEach(function (n) {
      if (!colMap[n.lane]) colMap[n.lane] = [];
      colMap[n.lane].push(n);
    });

    Object.keys(colMap).forEach(function (laneId) {
      var laneNodes = colMap[laneId];
      var lane = lanes[laneId];
      var minX = Infinity, maxX = -Infinity;
      laneNodes.forEach(function (n) {
        if (n.x < minX) minX = n.x;
        if (n.x + W > maxX) maxX = n.x + W;
      });
      svg.appendChild(svgEl('rect', {
        x: String(minX - 16),
        y: '10',
        width: String(maxX - minX + 32),
        height: '490',
        fill: lane.color,
        opacity: '0.045',
        rx: '10',
        'class': 'lane-band'
      }));
    });

    // Lane labels
    Object.keys(colMap).forEach(function (laneId) {
      var laneNodes = colMap[laneId];
      var lane = lanes[laneId];
      var minX = Infinity, maxX = -Infinity;
      laneNodes.forEach(function (n) {
        if (n.x < minX) minX = n.x;
        if (n.x + W > maxX) maxX = n.x + W;
      });
      var cx = (minX + maxX) / 2;
      var minY = Math.min.apply(null, laneNodes.map(function (n) { return n.y; }));
      var lbl = svgEl('text', {
        x: String(cx), y: String(minY - 18),
        'text-anchor': 'middle',
        fill: lane.color,
        opacity: '0.5',
        'font-size': '18',
        'class': 'lane-label'
      });
      lbl.textContent = lane.label;
      svg.appendChild(lbl);
    });

    // Edges
    edges.forEach(function (e) {
      var a = nodeById(e.from);
      var b = nodeById(e.to);
      if (!a || !b) return;

      svg.appendChild(svgEl('path', {
        d: calcEdgePath(a, b),
        fill: 'none',
        stroke: '#334155',
        'stroke-width': '1.5',
        'marker-end': 'url(#arrow)',
        'class': 'edge',
        'data-from': e.from,
        'data-to': e.to
      }));

      if (e.label) {
        var pos = edgeLabelPos(a, b);
        var et = svgEl('text', {
          x: String(pos.x), y: String(pos.y),
          'text-anchor': pos.anchor,
          fill: '#475569',
          'font-size': '17',
          'class': 'edge-label'
        });
        var elines = e.label.split('\n');
        if (elines.length === 1) {
          et.textContent = e.label;
        } else {
          elines.forEach(function (line, i) {
            var ts = svgEl('tspan', {
              x: String(pos.x),
              dy: i === 0 ? '0' : '18'
            });
            ts.textContent = line;
            et.appendChild(ts);
          });
        }
        svg.appendChild(et);
      }
    });

    // Nodes
    nodes.forEach(function (n) {
      var g = svgEl('g', {
        'class': 'node',
        'data-id': n.id,
        transform: 'translate(' + n.x + ',' + n.y + ')'
      });

      var lane = lanes[n.lane];

      g.appendChild(svgEl('rect', {
        x: '0', y: '0', rx: String(R), ry: String(R),
        width: String(W), height: String(H),
        fill: '#0f1621',
        stroke: '#1e2d3d',
        'stroke-width': '1',
        'class': 'node-bg'
      }));

      g.appendChild(svgEl('rect', {
        x: '0', y: '3', width: '3.5',
        height: String(H - 6),
        rx: '1.75',
        fill: lane.color,
        opacity: '0.7'
      }));

      var text = svgEl('text', {
        x: '14', y: '0',
        fill: '#e5e9f0',
        'font-size': '18',
        'font-weight': '600'
      });
      var lines = n.label.split('\n');
      var startY = lines.length === 1 ? 40 : 26;
      lines.forEach(function (line, i) {
        var ts = svgEl('tspan', {
          x: '14',
          dy: i === 0 ? String(startY) : '21'
        });
        ts.textContent = line;
        text.appendChild(ts);
      });
      g.appendChild(text);

      g.addEventListener('click', function () { openDrawerForNode(n.id); });
      svg.appendChild(g);
    });

    applyVisualState();
  }

  // Visual state (selected node highlight)
  function applyVisualState() {
    svg.querySelectorAll('.node').forEach(function (el) {
      el.classList.toggle('selected', el.getAttribute('data-id') === selectedNodeId);
    });

    svg.querySelectorAll('.node .node-bg').forEach(function (el) {
      el.setAttribute('stroke', '#1e2d3d');
      el.setAttribute('stroke-width', '1');
    });
    if (selectedNodeId) {
      var node = nodeById(selectedNodeId);
      if (node) {
        var lane = lanes[node.lane];
        var bg = svg.querySelector('.node[data-id="' + selectedNodeId + '"] .node-bg');
        if (bg) {
          bg.setAttribute('stroke', lane.color);
          bg.setAttribute('stroke-width', '2');
        }
      }
    }
  }

  // ==================================================
  // DRAWER: Node detail
  // ==================================================

  function openDrawerForNode(nodeId) {
    if (selectedNodeId !== nodeId) {
      var n = nodeById(nodeId);
      if (n) trackEvent('node/' + nodeId, 'Node: ' + n.label.replace('\n', ' '));
    }
    selectedNodeId = nodeId;

    var node = nodeById(nodeId);
    var lane = lanes[node.lane];
    var ann = annotations[nodeId] || {};

    drawerTitle.innerHTML =
      '<span class="drawer-lane-dot" style="background:' + lane.color + '"></span>' +
      esc(node.label.replace('\n', ' '));

    drawerTabs.innerHTML = '';

    navPrev.style.display = '';
    navNext.style.display = '';
    updateNavArrows(nodeId);

    var blurbParas = node.blurb.split('\n\n');
    var html = blurbParas.map(function (p) { return '<p class="blurb">' + esc(p.trim()) + '</p>'; }).join('');

    if (ann.relevance) {
      html += '<div class="section-label">Relevance to this project</div>';
      var paras = ann.relevance.split('\n\n');
      paras.forEach(function (p) {
        html += '<p class="relevance-text">' + esc(p.trim()) + '</p>';
      });
    }

    drawerBody.innerHTML = html;
    drawerBody.scrollTop = 0;
    showDrawer();
    scrollToNode(nodeId);
    applyVisualState();
  }

  function updateNavArrows(nodeId) {
    var idx = nodeOrder.indexOf(nodeId);
    var prevId = idx > 0 ? nodeOrder[idx - 1] : null;
    var nextId = idx < nodeOrder.length - 1 ? nodeOrder[idx + 1] : null;

    navPrev.disabled = !prevId;
    navNext.disabled = !nextId;

    if (prevId) {
      navPrev.title = 'Previous: ' + nodeById(prevId).label.replace('\n', ' ');
    } else {
      navPrev.title = 'No previous node';
    }

    if (nextId) {
      navNext.title = 'Next: ' + nodeById(nextId).label.replace('\n', ' ');
    } else {
      navNext.title = 'No next node';
    }
  }

  function navigateNode(direction) {
    if (!selectedNodeId) return;
    trackEvent('nav/' + (direction === 1 ? 'next' : 'prev'), direction === 1 ? 'Nav: Next' : 'Nav: Previous');
    var idx = nodeOrder.indexOf(selectedNodeId);
    var newIdx = idx + direction;
    if (newIdx >= 0 && newIdx < nodeOrder.length) {
      openDrawerForNode(nodeOrder[newIdx]);
    }
  }

  navPrev.addEventListener('click', function () { navigateNode(-1); });
  navNext.addEventListener('click', function () { navigateNode(1); });

  // ==================================================
  // UTILITY PANELS
  // ==================================================

  var utilityPanels = [
    { key: 'about',      label: 'About' },
    { key: 'contact',    label: 'Contact' },
    { key: 'references', label: 'References' },
    { key: 'help',       label: 'Help' }
  ];

  var activeUtilityPanel = null;

  function openUtilityPanel(panelKey) {
    trackEvent('panel/' + panelKey, 'Panel: ' + panelKey.charAt(0).toUpperCase() + panelKey.slice(1));
    selectedNodeId = null;
    activeUtilityPanel = panelKey;

    navPrev.style.display = 'none';
    navNext.style.display = 'none';

    drawerTabs.innerHTML = utilityPanels.map(function (p) {
      var cls = p.key === panelKey ? 'drawer-tab active' : 'drawer-tab';
      return '<button class="' + cls + '" data-panel="' + p.key + '">' + p.label + '</button>';
    }).join('');

    drawerTabs.querySelectorAll('.drawer-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        openUtilityPanel(tab.getAttribute('data-panel'));
      });
    });

    var titles = {
      about: 'About This Project',
      references: 'References',
      contact: 'Contact & Collaborate',
      help: 'How to Use'
    };
    drawerTitle.textContent = titles[panelKey] || '';

    var renderers = {
      about: renderAbout,
      references: renderReferences,
      contact: renderContact,
      help: renderHelp
    };
    drawerBody.innerHTML = renderers[panelKey]();

    showDrawer();
    applyVisualState();
  }

  function renderAbout() {
    return '' +
      '<p class="blurb">' + esc(meta.thesis) + '</p>' +
      '<div class="section-label">Why this site exists</div>' +
      '<p class="relevance-text">This site is a living document. It exists to communicate the project clearly, invite collaboration, and keep the science in the open from the start. It will be updated as the research develops.</p>' +
      '<div class="section-label">Project Status</div>' +
      '<p class="relevance-text">This project hasn\u2019t begun.</p>' +
      '';
  }

  function renderHelp() {
    return '' +
      '<div class="help-item"><span class="help-key" style="width:auto;padding:0 8px;">node</span><span class="help-desc">Click any node to read about that research component</span></div>' +
      '<div class="help-item"><span class="help-key">\u2190</span><span class="help-desc">Previous node (when drawer is open)</span></div>' +
      '<div class="help-item"><span class="help-key">\u2192</span><span class="help-desc">Next node</span></div>' +
      '<div class="help-item"><span class="help-key">Esc</span><span class="help-desc">Close the drawer</span></div>' +
      '<div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--border);">' +
        '<p style="font-size:0.82rem; color:var(--text-dim);">' +
          'The diagram reads left to right: Problem \u2192 Technology \u2192 Methodology \u2192 Responses \u2192 Impact. ' +
          'Each node opens a panel with a description and its relevance to the project.' +
        '</p>' +
        '<p style="font-size:0.82rem; color:var(--text-dim); margin-top:10px;">' +
          'Any issues with the site or copy, please <a href="mailto:s372318@student.rmit.edu.au" style="color:#60a5fa; text-decoration:none;">contact me through email</a>.' +
        '</p>' +
      '</div>';
  }

  function renderReferences() {
    var sections = [
      {
        title: 'Salt Stress & Plant Tolerance',
        refs: [
          { text: 'Chinnusamy, V. & Zhu, J.-K. (2003). Plant salt tolerance. In H. Hirt & K. Shinozaki (Eds.), <em>Plant Responses to Abiotic Stress</em> (Topics in Current Genetics, Vol. 4, pp. 241\u2013270). Springer-Verlag Berlin Heidelberg.', doi: 'https://doi.org/10.1007/978-3-540-39402-0_10' },
          { text: 'Wicke, B., Smeets, E., Dornburg, V., Vashev, B., Gaiser, T., Turkenburg, W. & Faaij, A. (2011). The global technical and economic potential of bioenergy from salt-affected soils. <em>Energy & Environmental Science</em>, 4(8), 2669\u20132681.', doi: 'https://doi.org/10.1039/C1EE01029H' }
        ]
      },
      {
        title: 'Plasma-Activated Water',
        refs: [
          { text: 'Antoni, V., Cortese, E. & Navazio, L. (2025). Plasma-activated water to foster sustainable agriculture: Evidence and quest for the fundamentals. <em>Plants, People, Planet</em>, 7(6), 1596\u20131603.', doi: 'https://doi.org/10.1002/ppp3.70025' },
          { text: 'Montalbetti, R., Machala, Z., Gherardi, M. & Laurita, R. (2025). Production and chemical composition of plasma activated water: A systematic review and meta-analysis. <em>Plasma Processes and Polymers</em>, 22(1), 2400249.', doi: 'https://doi.org/10.1002/ppap.202400249' }
        ]
      },
      {
        title: 'Experimental Design & Methods',
        refs: [
          { text: 'International Seed Testing Association (ISTA). <em>International Rules for Seed Testing</em>. Wallisellen, Switzerland.', doi: 'https://www.seedtest.org' },
          { text: 'Asghari, A., Sabbaghtazeh, E., Roshan Milani, N., Kouhi, M., Ahangarzadeh Maralani, A., Gharbani, P. & Sotoudeh Khiaban, A. (2025). Effects of plasma-activated water on germination and initial seedling growth of wheat. <em>PLOS ONE</em>, 20(1), e0312008.', doi: 'https://doi.org/10.1371/journal.pone.0312008' },
          { text: 'Kizer, J., Robinson, C., Lucas, T., Shannon, S., Hernandez, R., Stapelmann, K. & Rojas-Pierce, M. (2025). Non-thermal plasma activated water is an effective nitrogen fertilizer alternative for <em>Arabidopsis thaliana</em>. <em>PLOS ONE</em>, 20(9), e0327091.', doi: 'https://doi.org/10.1371/journal.pone.0327091' }
        ]
      },
      {
        title: 'Stress Physiology & Biomarkers',
        refs: [
          { text: 'Barrs, H.D. & Weatherley, P.E. (1962). A re-examination of the relative turgidity technique for estimating water deficits in leaves. <em>Australian Journal of Biological Sciences</em>, 15(3), 413\u2013428.', doi: 'https://doi.org/10.1071/BI9620413' },
          { text: 'Bates, L.S., Waldren, R.P. & Teare, I.D. (1973). Rapid determination of free proline for water-stress studies. <em>Plant and Soil</em>, 39, 205\u2013207.', doi: 'https://doi.org/10.1007/BF00018060' }
        ]
      },
      {
        title: 'Epigenetics & Molecular Response',
        refs: [
          { text: 'Sun, M., Yang, Z., Liu, L. & Duan, L. (2022). DNA methylation in plant responses and adaption to abiotic stresses. <em>International Journal of Molecular Sciences</em>, 23(13), 6910.', doi: 'https://doi.org/10.3390/ijms23136910' },
          { text: 'Agius, D.R. et al. (2023). Exploring the crop epigenome: A comparison of DNA methylation profiling techniques. <em>Frontiers in Plant Science</em>, 14, 1181039.', doi: 'https://doi.org/10.3389/fpls.2023.1181039' },
          { text: 'Yaish, M.W., Al-Lawati, A., Al-Harrasi, I. & Patankar, H.V. (2018). Genome-wide DNA methylation analysis in response to salinity in the model plant caliph medic (<em>Medicago truncatula</em>). <em>BMC Genomics</em>, 19(1), 78.', doi: 'https://doi.org/10.1186/s12864-018-4484-5' },
          { text: 'Jiang, C., Mithani, A., Belfield, E.J., Mott, R., Hurst, L.D. & Harberd, N.P. (2014). Environmentally responsive genome-wide accumulation of de novo <em>Arabidopsis thaliana</em> mutations and epimutations. <em>Genome Research</em>, 24(11), 1821\u20131829.', doi: 'https://doi.org/10.1101/gr.177659.114' }
        ]
      }
    ];

    var html = '';
    sections.forEach(function (sec) {
      html += '<div class="section-label">' + esc(sec.title) + '</div>';
      sec.refs.forEach(function (ref) {
        html += '<div class="ann-item" style="margin-bottom:10px;">' +
          '<div class="ann-note" style="line-height:1.55;">' + ref.text +
          '<br><a href="' + ref.doi + '" target="_blank" rel="noopener" style="color:#60a5fa; font-size:0.78rem; text-decoration:none;">' + ref.doi.replace('https://', '') + '</a>' +
          '</div></div>';
      });
    });

    return html;
  }

  function renderContact() {
    return '' +
      '<div class="contact-section">' +
        '<p class="blurb">Looking for advisors, collaborators, and people happy to share what they know. Students, researchers, scientists, engineers \u2014 all welcome.</p>' +
      '</div>' +
      '<div class="contact-section">' +
        '<h3>What I\u2019m looking for</h3>' +
        '<div class="ann-item">' +
          '<div class="ann-title">Supervisors</div>' +
          '<div class="ann-note">Primary and secondary, with experience in any of the areas below.</div>' +
        '</div>' +
        '<div class="ann-item">' +
          '<div class="ann-title">Advisors & Mentors</div>' +
          '<div class="ann-note">Anyone willing to share guidance or experience \u2014 doesn\u2019t need to be formal.</div>' +
        '</div>' +
        '<div class="ann-item">' +
          '<div class="ann-title">PAW & Plasma</div>' +
          '<div class="ann-note">Plasma-activated water systems, characterisation, RONS and water chemistry.</div>' +
        '</div>' +
        '<div class="ann-item">' +
          '<div class="ann-title">Plant Stress Physiology</div>' +
          '<div class="ann-note">Salinity stress responses, biomarker assays.</div>' +
        '</div>' +
        '<div class="ann-item">' +
          '<div class="ann-title">Molecular & Epigenetics</div>' +
          '<div class="ann-note">Bioassays, techniques, bioinformatics.</div>' +
        '</div>' +
        '<div class="ann-item">' +
          '<div class="ann-title">Ecological Framing</div>' +
          '<div class="ann-note">Environmental risk assessment, restoration ecology.</div>' +
        '</div>' +
      '</div>' +
      '<div class="contact-section">' +
        '<h3>Get in Touch</h3>' +
        '<p style="color:var(--text)"><strong>Ali Al Saleh</strong></p>' +
        '<p>Honours Candidate, School of Science, RMIT University</p>' +
        '<p style="margin-top:10px;"><a href="mailto:s372318@student.rmit.edu.au" style="color:#60a5fa; text-decoration:none;">s372318@student.rmit.edu.au</a></p>' +
        '<p><a href="https://www.linkedin.com/in/xyz-ali/" target="_blank" rel="noopener" style="color:#60a5fa; text-decoration:none;">LinkedIn</a></p>' +
      '</div>';
  }

  // ==================================================
  // DRAWER: Show / Close
  // ==================================================

  function showDrawer() {
    if (mobileQuery.matches) {
      if (!userSheetHeight) {
        drawerEl.style.height = '85dvh';
      }
      if (activeUtilityPanel) {
        drawerEl.classList.add('utility-mode');
        if (mobileNav) {
          mobileNav.classList.remove('hidden');
          mobileNav.classList.add('above-backdrop');
        }
      } else {
        drawerEl.classList.remove('utility-mode');
        if (mobileNav) {
          mobileNav.classList.add('hidden');
          mobileNav.classList.remove('above-backdrop');
        }
      }
    }
    drawerEl.classList.add('open');
    backdrop.classList.add('open');
  }

  function closeDrawer() {
    drawerEl.classList.remove('open');
    backdrop.classList.remove('open');
    selectedNodeId = null;
    activeUtilityPanel = null;
    drawerTabs.innerHTML = '';
    if (mobileQuery.matches) {
      userSheetHeight = null;
      setTimeout(function () { drawerEl.style.height = ''; drawerEl.classList.remove('utility-mode'); }, 300);
      if (mobileNav) {
        mobileNav.classList.remove('hidden');
        mobileNav.classList.remove('above-backdrop');
      }
    }
    applyVisualState();
  }

  // ==================================================
  // KEYBOARD
  // ==================================================

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }

    if (drawerEl.classList.contains('open') && selectedNodeId) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateNode(-1);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateNode(1);
        return;
      }
    }
  });

  // ==================================================
  // MOBILE: Bottom sheet drag
  // ==================================================

  var sheetDrag = null;

  if (drawerHandle) {
    drawerHandle.addEventListener('touchstart', onSheetTouchStart, { passive: true });
  }

  function onSheetTouchStart(e) {
    if (!mobileQuery.matches) return;
    var touch = e.touches[0];
    sheetDrag = {
      startY: touch.clientY,
      startHeight: drawerEl.getBoundingClientRect().height
    };
    drawerEl.classList.add('dragging');
    document.addEventListener('touchmove', onSheetTouchMove, { passive: false });
    document.addEventListener('touchend', onSheetTouchEnd);
  }

  function onSheetTouchMove(e) {
    e.preventDefault();
    var touch = e.touches[0];
    var delta = sheetDrag.startY - touch.clientY;
    var vh = window.innerHeight;
    var newHeight = Math.max(80, Math.min(vh * 0.92, sheetDrag.startHeight + delta));
    drawerEl.style.height = newHeight + 'px';
  }

  function onSheetTouchEnd() {
    document.removeEventListener('touchmove', onSheetTouchMove);
    document.removeEventListener('touchend', onSheetTouchEnd);
    drawerEl.classList.remove('dragging');
    var currentHeight = drawerEl.getBoundingClientRect().height;
    var vh = window.innerHeight;
    var ratio = currentHeight / vh;

    if (ratio < 0.2) {
      closeDrawer();
    } else {
      // keep the user's chosen height
      userSheetHeight = currentHeight + 'px';
      drawerEl.style.height = userSheetHeight;
    }

    sheetDrag = null;
  }

  // ==================================================
  // MOBILE: Scroll diagram to selected node
  // ==================================================

  function scrollToNode(nodeId) {
    if (!mobileQuery.matches || !diagramWrap) return;
    var node = nodeById(nodeId);
    if (!node) return;

    var svgRect = svg.getBoundingClientRect();
    var scale = svgRect.width / 1380;
    var nodeCenterX = (node.x + W / 2) * scale;
    var visibleWidth = diagramWrap.clientWidth;
    var scrollTarget = nodeCenterX - visibleWidth / 2;

    diagramWrap.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
  }

  // ==================================================
  // HELPERS
  // ==================================================

  function nodeById(id) {
    return nodes.find(function (n) { return n.id === id; }) || null;
  }

  // ==================================================
  // INIT
  // ==================================================

  // Event delegation for contact & DOI link clicks
  drawerBody.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0) {
      trackEvent('contact/email', 'Contact: Email');
    } else if (href.indexOf('linkedin.com') !== -1) {
      trackEvent('contact/linkedin', 'Contact: LinkedIn');
    } else if (href.indexOf('doi.org') !== -1 || href.indexOf('seedtest.org') !== -1) {
      trackEvent('ref/doi-click', 'Reference: DOI Click');
    }
  });

  render();

  // Welcome toast — show once, remove after animation
  var toast = document.getElementById('welcomeToast');
  if (toast) {
    if (sessionStorage.getItem('toastSeen')) {
      toast.remove();
    } else {
      sessionStorage.setItem('toastSeen', '1');
      toast.addEventListener('animationend', function (e) {
        if (e.animationName === 'toastOut') toast.remove();
      });
    }
  }

})();
