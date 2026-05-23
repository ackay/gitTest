/* TradeCalc.io — Calculator Logic */
(function () {
  'use strict';

  const fmt = (n, dec = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const fmtDec = (n) => fmt(n, 2);

  function showResults(el) {
    const empty = el.querySelector('.results-empty');
    const data = el.querySelector('.results-data');
    if (empty) empty.style.display = 'none';
    if (data) data.style.display = 'block';
  }

  // ===== BTU CALCULATOR =====
  window.calcBTU = function () {
    const length = parseFloat(document.getElementById('btu-length')?.value) || 0;
    const width = parseFloat(document.getElementById('btu-width')?.value) || 0;
    const height = parseFloat(document.getElementById('btu-height')?.value) || 8;
    const insulation = document.getElementById('btu-insulation')?.value || 'average';
    const climate = document.getElementById('btu-climate')?.value || 'moderate';

    if (!length || !width) { alert('Please enter room dimensions.'); return; }

    const area = length * width;
    let btuPerSqFt = 25;

    // Climate adjustment
    if (climate === 'hot') btuPerSqFt = 30;
    else if (climate === 'cold') btuPerSqFt = 22;
    else if (climate === 'mild') btuPerSqFt = 20;

    // Ceiling height adjustment (above 8ft)
    const extraHeight = Math.max(0, height - 8);
    const heightFactor = 1 + (extraHeight * 0.1);

    // Insulation adjustment
    let insulFactor = 1;
    if (insulation === 'poor') insulFactor = 1.25;
    else if (insulation === 'good') insulFactor = 0.85;
    else if (insulation === 'excellent') insulFactor = 0.75;

    const btus = Math.round(area * btuPerSqFt * heightFactor * insulFactor);
    const tonnage = btus / 12000;
    const tonnageRounded = Math.ceil(tonnage * 2) / 2; // round to nearest 0.5 ton

    document.getElementById('res-btu').textContent = fmt(btus);
    document.getElementById('res-tonnage').textContent = fmtDec(tonnage);
    document.getElementById('res-tonnage-rec').textContent = fmtDec(tonnageRounded);
    document.getElementById('res-area').textContent = fmt(area);

    const note = `Based on ${area.toLocaleString()} sq ft with ${insulation} insulation in a ${climate} climate.`;
    document.getElementById('res-btu-note').textContent = note;

    showResults(document.getElementById('btu-results'));
  };

  // ===== AC TONNAGE CALCULATOR =====
  window.calcACTonnage = function () {
    const sqft = parseFloat(document.getElementById('ac-sqft')?.value) || 0;
    const climate = document.getElementById('ac-climate')?.value || 'moderate';
    const insulation = document.getElementById('ac-insulation')?.value || 'average';

    if (!sqft) { alert('Please enter square footage.'); return; }

    let basePerSqFt = 0.0025; // tons per sq ft
    if (climate === 'hot') basePerSqFt = 0.003;
    else if (climate === 'hot-humid') basePerSqFt = 0.0033;
    else if (climate === 'cold') basePerSqFt = 0.002;

    let insulFactor = 1;
    if (insulation === 'poor') insulFactor = 1.2;
    else if (insulation === 'good') insulFactor = 0.85;

    const tons = sqft * basePerSqFt * insulFactor;
    const tonsRounded = Math.ceil(tons * 2) / 2;
    const btus = Math.round(tons * 12000);

    document.getElementById('res-ac-tons').textContent = fmtDec(tons);
    document.getElementById('res-ac-tons-rec').textContent = fmtDec(tonsRounded);
    document.getElementById('res-ac-btus').textContent = fmt(btus);

    showResults(document.getElementById('ac-results'));
  };

  // ===== CFM CALCULATOR =====
  window.calcCFM = function () {
    const length = parseFloat(document.getElementById('cfm-length')?.value) || 0;
    const width = parseFloat(document.getElementById('cfm-width')?.value) || 0;
    const height = parseFloat(document.getElementById('cfm-height')?.value) || 8;
    const ach = parseFloat(document.getElementById('cfm-ach')?.value) || 6;

    if (!length || !width) { alert('Please enter room dimensions.'); return; }

    const volume = length * width * height;
    const cfm = (volume * ach) / 60;

    document.getElementById('res-cfm').textContent = fmt(cfm, 1);
    document.getElementById('res-volume').textContent = fmt(volume);
    document.getElementById('res-ach').textContent = ach;

    showResults(document.getElementById('cfm-results'));
  };

  // ===== CONCRETE SLAB CALCULATOR =====
  window.calcConcreteSlab = function () {
    const length = parseFloat(document.getElementById('slab-length')?.value) || 0;
    const width = parseFloat(document.getElementById('slab-width')?.value) || 0;
    const depth = parseFloat(document.getElementById('slab-depth')?.value) || 0;
    const unit = document.getElementById('slab-depth-unit')?.value || 'inches';

    if (!length || !width || !depth) { alert('Please fill in all dimensions.'); return; }

    const depthFt = unit === 'inches' ? depth / 12 : depth;
    const cubicFt = length * width * depthFt;
    const cubicYards = cubicFt / 27;
    const bags60 = Math.ceil(cubicFt / 0.45);
    const bags80 = Math.ceil(cubicFt / 0.60);

    document.getElementById('res-cu-yd').textContent = fmtDec(cubicYards);
    document.getElementById('res-cu-ft').textContent = fmtDec(cubicFt);
    document.getElementById('res-bags60').textContent = fmt(bags60);
    document.getElementById('res-bags80').textContent = fmt(bags80);

    showResults(document.getElementById('slab-results'));
  };

  // ===== SONOTUBE CALCULATOR =====
  window.calcSonotube = function () {
    const diameter = parseFloat(document.getElementById('sono-diameter')?.value) || 0;
    const depth = parseFloat(document.getElementById('sono-depth')?.value) || 0;
    const qty = parseInt(document.getElementById('sono-qty')?.value) || 1;

    if (!diameter || !depth) { alert('Please fill in diameter and depth.'); return; }

    const radiusIn = diameter / 2;
    const radiusFt = radiusIn / 12;
    const volumeEach = Math.PI * radiusFt * radiusFt * depth;
    const totalVolumeFt = volumeEach * qty;
    const totalVolumeYd = totalVolumeFt / 27;
    const bags60 = Math.ceil(totalVolumeFt / 0.45);
    const bags80 = Math.ceil(totalVolumeFt / 0.60);

    document.getElementById('res-sono-cu-ft').textContent = fmtDec(totalVolumeFt);
    document.getElementById('res-sono-cu-yd').textContent = fmtDec(totalVolumeYd);
    document.getElementById('res-sono-bags60').textContent = fmt(bags60);
    document.getElementById('res-sono-bags80').textContent = fmt(bags80);

    showResults(document.getElementById('sono-results'));
  };

  // ===== GRAVEL CALCULATOR =====
  window.calcGravel = function () {
    const length = parseFloat(document.getElementById('gravel-length')?.value) || 0;
    const width = parseFloat(document.getElementById('gravel-width')?.value) || 0;
    const depth = parseFloat(document.getElementById('gravel-depth')?.value) || 0;
    const gravelType = document.getElementById('gravel-type')?.value || 'standard';

    if (!length || !width || !depth) { alert('Please fill in all dimensions.'); return; }

    const depthFt = depth / 12;
    const cubicFt = length * width * depthFt;
    const cubicYards = cubicFt / 27;

    // Density factors (tons/cubic yard)
    const density = { standard: 1.4, pea: 1.3, crushed: 1.5, decomposed: 1.2 };
    const tons = cubicYards * (density[gravelType] || 1.4);
    const pounds = tons * 2000;

    document.getElementById('res-gravel-cu-yd').textContent = fmtDec(cubicYards);
    document.getElementById('res-gravel-cu-ft').textContent = fmtDec(cubicFt);
    document.getElementById('res-gravel-tons').textContent = fmtDec(tons);
    document.getElementById('res-gravel-lbs').textContent = fmt(pounds);

    showResults(document.getElementById('gravel-results'));
  };

  // ===== MULCH CALCULATOR =====
  window.calcMulch = function () {
    const length = parseFloat(document.getElementById('mulch-length')?.value) || 0;
    const width = parseFloat(document.getElementById('mulch-width')?.value) || 0;
    const depth = parseFloat(document.getElementById('mulch-depth')?.value) || 3;

    if (!length || !width) { alert('Please enter dimensions.'); return; }

    const depthFt = depth / 12;
    const cubicFt = length * width * depthFt;
    const cubicYards = cubicFt / 27;
    const bags2cuft = Math.ceil(cubicFt / 2);
    const bags3cuft = Math.ceil(cubicFt / 3);

    document.getElementById('res-mulch-cu-yd').textContent = fmtDec(cubicYards);
    document.getElementById('res-mulch-cu-ft').textContent = fmtDec(cubicFt);
    document.getElementById('res-mulch-bags2').textContent = fmt(bags2cuft);
    document.getElementById('res-mulch-bags3').textContent = fmt(bags3cuft);

    showResults(document.getElementById('mulch-results'));
  };

  // ===== TILE CALCULATOR =====
  window.calcTile = function () {
    const roomLength = parseFloat(document.getElementById('tile-room-length')?.value) || 0;
    const roomWidth = parseFloat(document.getElementById('tile-room-width')?.value) || 0;
    const tileWidth = parseFloat(document.getElementById('tile-width')?.value) || 0;
    const tileHeight = parseFloat(document.getElementById('tile-height')?.value) || 0;
    const waste = parseFloat(document.getElementById('tile-waste')?.value) || 10;

    if (!roomLength || !roomWidth || !tileWidth || !tileHeight) { alert('Please fill in all fields.'); return; }

    const roomArea = roomLength * roomWidth;
    const tileAreaSqIn = tileWidth * tileHeight;
    const tileAreaSqFt = tileAreaSqIn / 144;
    const tilesBase = Math.ceil(roomArea / tileAreaSqFt);
    const tilesTotal = Math.ceil(tilesBase * (1 + waste / 100));
    const boxesOf12 = Math.ceil(tilesTotal / 12);

    document.getElementById('res-tile-area').textContent = fmtDec(roomArea);
    document.getElementById('res-tile-base').textContent = fmt(tilesBase);
    document.getElementById('res-tile-total').textContent = fmt(tilesTotal);
    document.getElementById('res-tile-boxes').textContent = fmt(boxesOf12);
    document.getElementById('res-tile-waste-tiles').textContent = fmt(tilesTotal - tilesBase);

    showResults(document.getElementById('tile-results'));
  };

  // ===== FLOORING WASTE CALCULATOR =====
  window.calcFlooringWaste = function () {
    const area = parseFloat(document.getElementById('fw-area')?.value) || 0;
    const type = document.getElementById('fw-type')?.value || 'hardwood';
    const pattern = document.getElementById('fw-pattern')?.value || 'straight';

    if (!area) { alert('Please enter room area.'); return; }

    const baseWaste = { hardwood: 10, tile: 10, carpet: 8, vinyl: 10, laminate: 12, cork: 10 };
    const patternAdj = { straight: 0, diagonal: 15, herringbone: 15, staggered: 5 };

    const wastePercent = (baseWaste[type] || 10) + (patternAdj[pattern] || 0);
    const extraSqFt = area * (wastePercent / 100);
    const totalSqFt = area + extraSqFt;

    document.getElementById('res-fw-waste').textContent = wastePercent;
    document.getElementById('res-fw-extra').textContent = fmtDec(extraSqFt);
    document.getElementById('res-fw-total').textContent = fmtDec(totalSqFt);
    document.getElementById('res-fw-boxes').textContent = fmtDec(totalSqFt / 20); // assume 20 sqft/box

    showResults(document.getElementById('fw-results'));
  };

  // ===== ROOF PITCH CALCULATOR =====
  window.calcRoofPitch = function () {
    const rise = parseFloat(document.getElementById('pitch-rise')?.value) || 0;
    const run = parseFloat(document.getElementById('pitch-run')?.value) || 12;

    if (!rise || !run) { alert('Please enter rise and run values.'); return; }

    const pitchStr = rise + ':' + run;
    const angleRad = Math.atan(rise / run);
    const angleDeg = angleRad * (180 / Math.PI);
    const multiplier = Math.sqrt(rise * rise + run * run) / run;

    let category = 'Low slope';
    if (rise / run > 0.42) category = 'Steep slope';
    else if (rise / run > 0.25) category = 'Moderate slope';
    else if (rise / run > 0.083) category = 'Standard slope';

    document.getElementById('res-pitch').textContent = pitchStr;
    document.getElementById('res-angle').textContent = fmtDec(angleDeg);
    document.getElementById('res-multiplier').textContent = fmtDec(multiplier);
    document.getElementById('res-category').textContent = category;
    document.getElementById('res-pitch-percent').textContent = fmtDec((rise / run) * 100);

    showResults(document.getElementById('pitch-results'));
  };

  // ===== PAINT COVERAGE CALCULATOR =====
  window.calcPaint = function () {
    const wallLength = parseFloat(document.getElementById('paint-length')?.value) || 0;
    const wallHeight = parseFloat(document.getElementById('paint-height')?.value) || 0;
    const numWalls = parseInt(document.getElementById('paint-walls')?.value) || 4;
    const coats = parseInt(document.getElementById('paint-coats')?.value) || 2;
    const coverage = parseFloat(document.getElementById('paint-coverage')?.value) || 400;
    const doors = parseInt(document.getElementById('paint-doors')?.value) || 0;
    const windows = parseInt(document.getElementById('paint-windows')?.value) || 0;

    if (!wallLength || !wallHeight) { alert('Please enter wall dimensions.'); return; }

    const grossArea = wallLength * wallHeight * numWalls;
    const deductArea = (doors * 21) + (windows * 15); // avg door 3x7, window 3x5
    const netArea = Math.max(0, grossArea - deductArea);
    const totalPaintArea = netArea * coats;
    const gallons = totalPaintArea / coverage;
    const gallonsRounded = Math.ceil(gallons * 2) / 2; // round to nearest 0.5
    const quarts = Math.ceil(gallons * 4);

    document.getElementById('res-paint-area').textContent = fmt(netArea);
    document.getElementById('res-paint-gallons').textContent = fmtDec(gallons);
    document.getElementById('res-paint-gallons-rec').textContent = fmtDec(gallonsRounded);
    document.getElementById('res-paint-quarts').textContent = quarts;

    showResults(document.getElementById('paint-results'));
  };

  // Reset calculator
  window.resetCalc = function (formId, resultsId) {
    const form = document.getElementById(formId);
    const results = document.getElementById(resultsId);
    if (form) form.reset();
    if (results) {
      const empty = results.querySelector('.results-empty');
      const data = results.querySelector('.results-data');
      if (empty) empty.style.display = 'block';
      if (data) data.style.display = 'none';
    }
  };

})();
