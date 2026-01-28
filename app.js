(function () {
  'use strict';

  const STEEL_GRADES = {
    black: [
      'Ст3', 'Ст20', '09Г2С', '10', '20', '35', '40Х', '45',
      '30ХГСА', '12Х1МФ', 'Х12МФ', '38ХН3МФА', '40ХН', '20Х', '30Х', '35Х', '50ХН',
      '15Х5М', '95Х18', '60С2', '65Г', '50ХФА', '30ХМА', '34ХН1М', '18Х2Н4МА',
      '38ХС', '40ХФА', '45ХН2МФА', '20ХН3А', '25Х2Н4А', '40ХН2МА', '12ХН3А',
      '14Х17Н2', '09Х16Н4Б', '10Х17Н13М2Т', '08Х22Н6Т', '31Х19Н9МВБТ', '12Х18Н9'
    ],
    stainless: [
      '12Х18Н10Т', '08Х18Н10', '08Х13', '12Х13', '20Х13', '03Х17Н14М2',
      '08Х17Н13М2Т', '10Х17Н13М2Т', '08Х18Н12Т', '12Х18Н12Т', '20Х23Н18',
      '15Х25Т', '08Х21Н6М2Т', '03ХН28МДТ', '06ХН28МДТ'
    ],
    aluminum: ['АД0', 'АД1', 'АМг2', 'АМг3', 'АМг5', 'АМг6', 'Д16', 'В95', 'АМц', 'АВ'],
    copper: ['М0', 'М1', 'М2', 'М3', 'М1р', 'М2р', 'М3р'],
    brass: ['Л63', 'ЛС59-1', 'Л68', 'ЛА77-2', 'ЛО70-1', 'ЛО62-1', 'ЛАН59-3-2', 'ЛМц58-2'],
    bronze: ['БрА9-2', 'БрОФ6.5-0.15', 'БрОЦС5-5-5', 'БрОЦС4-4-17', 'БрС30', 'БрАМц9-2', 'БрКМц3-1'],
    titanium: ['ВТ1-0', 'ВТ1-00', 'ВТ3-1', 'ВТ6', 'ОТ4', 'ПТ-1М', 'ВТ20', 'ВТ22']
  };

  const DENSITY = {
    black: 7850,
    stainless: 7900,
    aluminum: 2700,
    copper: 8900,
    brass: 8500,
    bronze: 8700,
    titanium: 4500
  };

  // ГОСТ 8509-93: уголок равнополочный — масса 1 м (кг) по размерам A×A×t (мм)
  const ANGLE_MASS = {
    '20x20x3': 0.89, '20x20x4': 1.15, '25x25x3': 1.12, '25x25x4': 1.46,
    '30x30x3': 1.36, '30x30x4': 1.78, '40x40x3': 1.85, '40x40x4': 2.42, '40x40x5': 2.98,
    '50x50x4': 3.05, '50x50x5': 3.77, '50x50x6': 4.47, '63x63x4': 3.9, '63x63x5': 4.81, '63x63x6': 5.72,
    '75x75x5': 5.8, '75x75x6': 6.89, '75x75x8': 9.02, '90x90x6': 8.35, '90x90x7': 9.66, '90x90x8': 10.9,
    '100x100x6': 9.37, '100x100x8': 12.25, '100x100x10': 15.1, '125x125x8': 15.5, '125x125x10': 19.1,
    '140x140x9': 19.2, '140x140x10': 21.3, '160x160x10': 24.9, '160x160x12': 29.6,
    '180x180x11': 30.5, '200x200x12': 36.5, '200x200x14': 42.3
  };

  // ГОСТ 8240-97: швеллер У/П — масса 1 м (кг) по номеру
  const CHANNEL_MASS = {
    5: 4.84, 6.5: 5.9, 8: 7.05, 10: 8.59, 12: 10.4, 14: 12.3, 16: 14.2, 18: 16.3,
    20: 18.4, 22: 21, 24: 24, 27: 27.7, 30: 31.8, 40: 48.3
  };

  // ГОСТ 8240-97: швеллер Э (экономичный) — масса 1 м (кг)
  const CHANNEL_ECONOMY_MASS = {
    5: 4.84, 6.5: 5.9, 8: 7.05, 10: 8.59, 12: 10.4, 14: 12.3, 16: 14.01, 18: 16.3, 20: 18.4
  };

  // ГОСТ 8239-89: двутавр с уклоном полок — масса 1 м (кг) по номеру
  const IBEAM_MASS = {
    10: 9.46, 12: 11.5, 14: 13.7, 16: 15.9, 18: 18.4, 20: 21, 22: 24, 24: 27.3,
    27: 31.5, 30: 36.5, 33: 42.2, 36: 48.6, 40: 57, 45: 66.5, 50: 78.5, 55: 92.6, 60: 108
  };

  // ГОСТ 26020-83: двутавр Б (нормальный) — масса 1 м (кг)
  const IBEAM_26020_B = {
    10: 8.1, 12: 8.7, 14: 10.9, 16: 12.5, 18: 14.5, 20: 22.4, 22: 25.8, 24: 27.3, 26: 28, 28: 31.4,
    30: 32.9, 35: 41.1, 40: 48.1, 45: 66.2, 50: 92.9, 55: 104.2, 60: 115.6
  };

  // ГОСТ 26020-83: двутавр Ш (широкополочный) — масса 1 м (кг)
  const IBEAM_26020_SH = {
    20: 41.2, 25: 48.5, 30: 64.2, 35: 92.6, 40: 104, 45: 133, 50: 155, 55: 186, 60: 208
  };

  // ГОСТ 26020-83: двутавр К (колонный) — масса 1 м (кг)
  const IBEAM_26020_K = {
    20: 57, 25: 62.4, 30: 84.8, 35: 105, 40: 133, 45: 158, 50: 186, 55: 212, 60: 238
  };

  function angleKey(a, t) {
    const A = Math.round(Number(a));
    const T = Math.round(Number(t));
    return `${A}x${A}x${T}`;
  }

  function parseChannelN(value) {
    if (value == null || typeof value !== 'string') return null;
    var s = String(value).trim();
    var match = s.match(/^([0-9]+(?:[.,][0-9]+)?)\s*([ПУЭ])$/i);
    if (!match) return null;
    var num = parseFloat(match[1].replace(',', '.'));
    var series = match[2].toUpperCase();
    if (series === 'У' || series === 'П') return { num: num, series: series };
    if (series === 'Э') return { num: num, series: 'Э' };
    return null;
  }

  function channelOptionList() {
    var opts = [];
    Object.keys(CHANNEL_MASS).forEach(function (n) {
      opts.push(n + 'П');
      opts.push(n + 'У');
    });
    Object.keys(CHANNEL_ECONOMY_MASS).forEach(function (n) {
      opts.push(n + 'Э');
    });
    opts.sort(function (a, b) {
      var an = parseFloat(String(a).replace(/[ПУЭ]/gi, ''));
      var bn = parseFloat(String(b).replace(/[ПУЭ]/gi, ''));
      if (an !== bn) return an - bn;
      return String(a).localeCompare(String(b));
    });
    return opts;
  }

  const SORTAMENTS = [
    {
      id: 'pipe_round',
      name: 'Труба круглая',
      fields: [
        { id: 'D', label: 'Внешний диаметр', unit: 'мм' },
        { id: 'S', label: 'Толщина стенки', unit: 'мм' },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'Введите внешний диаметр, толщину стенки и длину. Вес: площадь кольца × длина × плотность.',
      calc: function (params, rho) {
        const D = params.D / 1000;
        const s = params.S / 1000;
        const L = params.L;
        const innerR = Math.max(0, D / 2 - s);
        const area = Math.PI * (D * D / 4 - innerR * innerR);
        return area * L * rho;
      },
      calcLength: function (params, rho) {
        const D = params.D / 1000;
        const s = params.S / 1000;
        const innerR = Math.max(0, D / 2 - s);
        const area = Math.PI * (D * D / 4 - innerR * innerR);
        return params.M / (area * rho);
      }
    },
    {
      id: 'circle',
      name: 'Круг / Пруток',
      fields: [
        { id: 'D', label: 'Диаметр', unit: 'мм' },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'Введите диаметр и длину. Вес: π×D²/4 × длина × плотность.',
      calc: function (params, rho) {
        const D = params.D / 1000;
        const L = params.L;
        return (Math.PI * D * D / 4) * L * rho;
      },
      calcLength: function (params, rho) {
        const area = Math.PI * (params.D / 1000) * (params.D / 1000) / 4;
        return params.M / (area * rho);
      }
    },
    {
      id: 'sheet',
      name: 'Лист',
      fields: [
        { id: 'T', label: 'Толщина', unit: 'мм' },
        { id: 'W', label: 'Ширина', unit: 'мм' },
        { id: 'L', label: 'Длина', unit: 'мм' },
        { id: 'Qty', label: 'Количество листов', unit: '' }
      ],
      hint: 'Введите толщину, ширину, длину в мм и количество листов. Вес: объём × плотность × кол-во.',
      calc: function (params, rho) {
        const vol = (params.T / 1000) * (params.W / 1000) * (params.L / 1000);
        const qty = (params.Qty != null && params.Qty > 0) ? params.Qty : 1;
        return vol * rho * qty;
      },
      calcLength: function (params, rho) {
        const qty = (params.Qty != null && params.Qty > 0) ? params.Qty : 1;
        const massOne = params.M / qty;
        return (massOne / rho) / ((params.T / 1000) * (params.W / 1000)) * 1000;
      }
    },
    {
      id: 'angle',
      name: 'Уголок равнополочный',
      fields: [
        { id: 'A', label: 'Полка', unit: 'мм' },
        { id: 'T', label: 'Толщина полки', unit: 'мм' },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'Введите размер полки, толщину и длину. Используется ГОСТ 8509-93 или приближённая формула.',
      calc: function (params, rho) {
        const a = params.A;
        const t = params.T;
        const L = params.L;
        const key = angleKey(a, t);
        let kgPerM = ANGLE_MASS[key];
        if (kgPerM == null) {
          kgPerM = (2 * a - t) * t * 0.00785;
        }
        return kgPerM * L * (rho / 7850);
      },
      calcLength: function (params, rho) {
        const a = params.A;
        const t = params.T;
        const key = angleKey(a, t);
        let kgPerM = ANGLE_MASS[key];
        if (kgPerM == null) kgPerM = (2 * a - t) * t * 0.00785;
        return params.M / (kgPerM * (rho / 7850));
      }
    },
    {
      id: 'angle_unequal',
      name: 'Уголок неравнополочный',
      fields: [
        { id: 'A', label: 'Большая полка', unit: 'мм' },
        { id: 'B', label: 'Меньшая полка', unit: 'мм' },
        { id: 'T', label: 'Толщина полки', unit: 'мм' },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'ГОСТ 8510-86. Вес по формуле (A+B-T)×T×0,00785 × длина × (ρ/7850).',
      calc: function (params, rho) {
        const a = params.A;
        const b = params.B;
        const t = params.T;
        const L = params.L;
        const kgPerM = (a + b - t) * t * 0.00785;
        return kgPerM * L * (rho / 7850);
      },
      calcLength: function (params, rho) {
        const a = params.A;
        const b = params.B;
        const t = params.T;
        const kgPerM = (a + b - t) * t * 0.00785;
        return params.M / (kgPerM * (rho / 7850));
      }
    },
    {
      id: 'channel',
      name: 'Швеллер',
      fields: [
        { id: 'N', label: 'Номер швеллера', unit: '', channelOptions: true },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'ГОСТ 8240-97: П — параллельные полки, У — уклон полок, Э — экономичный. Укажите длину.',
      calc: function (params, rho) {
        var parsed = parseChannelN(params.N);
        if (!parsed) return null;
        var tbl = parsed.series === 'Э' ? CHANNEL_ECONOMY_MASS : CHANNEL_MASS;
        var kgPerM = tbl[parsed.num];
        if (kgPerM == null) return null;
        return kgPerM * params.L * (rho / 7850);
      },
      calcLength: function (params, rho) {
        var parsed = parseChannelN(params.N);
        if (!parsed) return null;
        var tbl = parsed.series === 'Э' ? CHANNEL_ECONOMY_MASS : CHANNEL_MASS;
        var kgPerM = tbl[parsed.num];
        if (kgPerM == null) return null;
        return params.M / (kgPerM * (rho / 7850));
      }
    },
    {
      id: 'ibeam',
      name: 'Двутавр',
      fields: [
        { id: 'ibeamType', label: 'Тип двутавра', unit: '', options: ['ГОСТ 8239-89', 'Нормальный (Б)', 'Широкополочный (Ш)', 'Колонный (К)', 'Дополнительной серии (Д)', 'Сварной (С)'] },
        { id: 'N', label: 'Номер двутавра', unit: '' },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'ГОСТ 8239-89 или ГОСТ 26020-83: Б — нормальный, Ш — широкополочный, К — колонный, Д — доп. серии, С — сварной.',
      calc: function (params, rho) {
        const n = Number(params.N);
        var tbl = IBEAM_MASS;
        if (params.ibeamType === 'Нормальный (Б)') tbl = IBEAM_26020_B;
        else if (params.ibeamType === 'Широкополочный (Ш)') tbl = IBEAM_26020_SH;
        else if (params.ibeamType === 'Колонный (К)') tbl = IBEAM_26020_K;
        else if (params.ibeamType === 'Дополнительной серии (Д)') tbl = IBEAM_26020_B;
        else if (params.ibeamType === 'Сварной (С)') tbl = IBEAM_MASS;
        const kgPerM = tbl[n];
        if (kgPerM == null) return null;
        return kgPerM * params.L * (rho / 7850);
      },
      calcLength: function (params, rho) {
        const n = Number(params.N);
        var tbl = IBEAM_MASS;
        if (params.ibeamType === 'Нормальный (Б)') tbl = IBEAM_26020_B;
        else if (params.ibeamType === 'Широкополочный (Ш)') tbl = IBEAM_26020_SH;
        else if (params.ibeamType === 'Колонный (К)') tbl = IBEAM_26020_K;
        else if (params.ibeamType === 'Дополнительной серии (Д)') tbl = IBEAM_26020_B;
        else if (params.ibeamType === 'Сварной (С)') tbl = IBEAM_MASS;
        const kgPerM = tbl[n];
        if (kgPerM == null) return null;
        return params.M / (kgPerM * (rho / 7850));
      }
    },
    {
      id: 'pipe_rect',
      name: 'Профильная труба (прямоугольная)',
      fields: [
        { id: 'A', label: 'Сторона A', unit: 'мм' },
        { id: 'B', label: 'Сторона B', unit: 'мм' },
        { id: 'S', label: 'Толщина стенки', unit: 'мм' },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'Внешние размеры A×B и толщина стенки. Вес по площади сечения металла.',
      calc: function (params, rho) {
        const a = params.A / 1000;
        const b = params.B / 1000;
        const s = params.S / 1000;
        const L = params.L;
        const outer = a * b;
        const inner = (a - 2 * s) * (b - 2 * s);
        const area = Math.max(0, outer - inner);
        return area * L * rho;
      },
      calcLength: function (params, rho) {
        const a = params.A / 1000;
        const b = params.B / 1000;
        const s = params.S / 1000;
        const outer = a * b;
        const inner = (a - 2 * s) * (b - 2 * s);
        const area = Math.max(0, outer - inner);
        return params.M / (area * rho);
      }
    },
    {
      id: 'square',
      name: 'Квадрат',
      fields: [
        { id: 'A', label: 'Сторона', unit: 'мм' },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'Введите сторону квадрата и длину. Вес: a² × длина × плотность.',
      calc: function (params, rho) {
        const a = params.A / 1000;
        return a * a * params.L * rho;
      },
      calcLength: function (params, rho) {
        const a = params.A / 1000;
        return params.M / (a * a * rho);
      }
    },
    {
      id: 'rebar',
      name: 'Арматура',
      fields: [
        { id: 'D', label: 'Диаметр', unit: 'мм' },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'Расчёт по номинальному диаметру (как круг). ГОСТ 5781-82.',
      calc: function (params, rho) {
        const D = params.D / 1000;
        return (Math.PI * D * D / 4) * params.L * rho;
      },
      calcLength: function (params, rho) {
        const area = Math.PI * (params.D / 1000) * (params.D / 1000) / 4;
        return params.M / (area * rho);
      }
    },
    {
      id: 'strip',
      name: 'Лента',
      fields: [
        { id: 'T', label: 'Толщина', unit: 'мм' },
        { id: 'W', label: 'Ширина', unit: 'мм' },
        { id: 'L', label: 'Длина', unit: 'м' }
      ],
      hint: 'Толщина и ширина в мм, длина в метрах. Вес как у листа.',
      calc: function (params, rho) {
        const vol = (params.T / 1000) * (params.W / 1000) * params.L;
        return vol * rho;
      },
      calcLength: function (params, rho) {
        const cross = (params.T / 1000) * (params.W / 1000) * rho;
        return params.M / cross;
      }
    },
    {
      id: 'bend',
      name: 'Отвод',
      fields: [
        { id: 'D', label: 'Диаметр трубы', unit: 'мм' },
        { id: 'S', label: 'Толщина стенки', unit: 'мм' },
        { id: 'angle', label: 'Угол отвода', unit: 'град (90, 45 и т.д.)' },
        { id: 'R', label: 'Радиус изгиба', unit: 'мм' }
      ],
      hint: 'Приближённый расчёт: длина дуги × площадь сечения трубы × плотность.',
      calc: function (params, rho) {
        const D = params.D / 1000;
        const s = params.S / 1000;
        const angleRad = (params.angle * Math.PI) / 180;
        const R = params.R / 1000;
        const arcLength = R * angleRad;
        const innerR = Math.max(0, D / 2 - s);
        const area = Math.PI * (D * D / 4 - innerR * innerR);
        return area * arcLength * rho;
      }
    },
    {
      id: 'flange',
      name: 'Фланец',
      fields: [
        { id: 'D_outer', label: 'Внешний диаметр', unit: 'мм' },
        { id: 'D_inner', label: 'Внутренний диаметр', unit: 'мм' },
        { id: 'T', label: 'Толщина', unit: 'мм' }
      ],
      hint: 'Кольцо: вес по площади кольца × толщина × плотность.',
      calc: function (params, rho) {
        const Do = params.D_outer / 1000;
        const Di = params.D_inner / 1000;
        const t = params.T / 1000;
        const area = Math.PI * (Do * Do - Di * Di) / 4;
        return area * t * rho;
      }
    },
    {
      id: 'reducer',
      name: 'Переход (концентрический)',
      fields: [
        { id: 'D1', label: 'Больший диаметр', unit: 'мм' },
        { id: 'D2', label: 'Меньший диаметр', unit: 'мм' },
        { id: 'H', label: 'Высота перехода', unit: 'мм' },
        { id: 'S', label: 'Толщина стенки', unit: 'мм' }
      ],
      hint: 'Приближённо: средняя окружность × высота × толщина × плотность.',
      calc: function (params, rho) {
        const d1 = params.D1 / 1000;
        const d2 = params.D2 / 1000;
        const h = params.H / 1000;
        const s = params.S / 1000;
        const meanCirc = Math.PI * (d1 + d2) / 2;
        const vol = meanCirc * h * s;
        return vol * rho;
      }
    }
  ];

  const gradeSelect = document.getElementById('grade');
  const sortamentSelect = document.getElementById('sortament');
  const paramsContainer = document.getElementById('params');
  const calcBtn = document.getElementById('calc-btn');
  const resultEl = document.getElementById('result');
  const hintEl = document.getElementById('hint');
  const historyList = document.getElementById('history');
  const historySection = document.getElementById('history-section');
  const costBlankCheckbox = document.getElementById('cost-blank');
  const costBlankPanel = document.getElementById('cost-blank-panel');
  const pricePerTonInput = document.getElementById('price-per-ton');
  const costMarkupInput = document.getElementById('cost-markup');
  const costCuttingInput = document.getElementById('cost-cutting');
  const costResultEl = document.getElementById('cost-result');

  let history = [];
  let lastWeightKg = null;

  function getMetal() {
    return document.querySelector('input[name="metal"]:checked').value;
  }

  function getCalcMode() {
    const el = document.querySelector('input[name="calcMode"]:checked');
    return el ? el.value : 'mass';
  }

  function getDensity() {
    return DENSITY[getMetal()];
  }

  function renderGrades() {
    const metal = getMetal();
    const grades = STEEL_GRADES[metal];
    const gradeLabel = document.querySelector('label[for="grade"]');
    if (gradeLabel) {
      gradeLabel.textContent = (metal === 'black' || metal === 'stainless') ? 'Марка стали' : 'Марка / сплав';
    }
    gradeSelect.innerHTML = grades.map(function (g) {
      return '<option value="' + g + '">' + g + '</option>';
    }).join('');
  }

  function renderSortaments() {
    sortamentSelect.innerHTML = SORTAMENTS.map(function (s) {
      return '<option value="' + s.id + '">' + s.name + '</option>';
    }).join('');
    renderParams();
    renderHint();
  }

  function getCurrentSortament() {
    const id = sortamentSelect.value;
    return SORTAMENTS.find(function (s) { return s.id === id; });
  }

  function channelNOptions() {
    return channelOptionList().map(function (v) {
      return '<option value="' + v + '">' + v + '</option>';
    }).join('');
  }

  function ibeamNOptions() {
    const keys = new Set([]
      .concat(Object.keys(IBEAM_MASS), Object.keys(IBEAM_26020_B), Object.keys(IBEAM_26020_SH), Object.keys(IBEAM_26020_K)));
    return Array.from(keys).sort(function (a, b) { return parseFloat(a) - parseFloat(b); }).map(function (n) {
      return '<option value="' + n + '">' + n + '</option>';
    }).join('');
  }

  function renderParams() {
    const sort = getCurrentSortament();
    const modeLength = getCalcMode() === 'length';
    if (!sort) return;
    paramsContainer.innerHTML = sort.fields.map(function (f) {
      if (f.id === 'L' && modeLength && sort.calcLength) {
        return '<div class="param-row"><label for="param-L">Масса</label>' +
          '<input type="number" id="param-L" class="param-input" data-id="L" data-mode-length="1" min="0" step="any" placeholder="0">' +
          '<span class="unit">кг</span></div>';
      }
      if (f.options && Array.isArray(f.options)) {
        const opts = f.options.map(function (v) { return '<option value="' + v + '">' + v + '</option>'; }).join('');
        return '<div class="param-row"><label for="param-' + f.id + '">' + f.label + '</label>' +
          '<select id="param-' + f.id + '" class="select param-input" data-id="' + f.id + '">' + opts + '</select>' +
          '<span class="unit">' + (f.unit ? f.unit : '') + '</span></div>';
      }
      if (f.channelOptions && sort.id === 'channel') {
        const opts = channelNOptions();
        return '<div class="param-row"><label for="param-' + f.id + '">' + f.label + '</label>' +
          '<select id="param-' + f.id + '" class="select param-input" data-id="' + f.id + '">' + opts + '</select>' +
          '<span class="unit">' + (f.unit ? f.unit : '') + '</span></div>';
      }
      const opts = f.id === 'N' && sort.id === 'ibeam' ? ibeamNOptions() : '';
      if (opts) {
        return '<div class="param-row"><label for="param-' + f.id + '">' + f.label + '</label>' +
          '<select id="param-' + f.id + '" class="select param-input" data-id="' + f.id + '">' + opts + '</select>' +
          '<span class="unit">' + (f.unit ? f.unit : '') + '</span></div>';
      }
      const defaultValue = f.id === 'Qty' ? '1' : '';
      return '<div class="param-row"><label for="param-' + f.id + '">' + f.label + '</label>' +
        '<input type="number" id="param-' + f.id + '" class="param-input" data-id="' + f.id + '" min="' + (f.id === 'Qty' ? '1' : '0') + '" step="' + (f.id === 'Qty' ? '1' : 'any') + '" placeholder="' + defaultValue + '" value="' + (f.id === 'Qty' ? '1' : '') + '">' +
        '<span class="unit">' + (f.unit ? f.unit : '') + '</span></div>';
    }).join('');
  }

  function renderHint() {
    const sort = getCurrentSortament();
    hintEl.textContent = sort ? sort.hint : '';
  }

  function updateCostResult() {
    if (!costResultEl) return;
    const weight = lastWeightKg;
    const pricePerTon = parseFloat((pricePerTonInput && pricePerTonInput.value) ? pricePerTonInput.value.replace(',', '.') : 0) || 0;
    if (weight == null || weight <= 0) {
      costResultEl.innerHTML = '';
      costResultEl.classList.remove('has-value');
      return;
    }
    if (pricePerTon <= 0) {
      costResultEl.textContent = 'Укажите цену за тонну.';
      costResultEl.classList.remove('has-value');
      return;
    }
    let total = (weight / 1000) * pricePerTon;
    const isBlank = costBlankCheckbox && costBlankCheckbox.checked;
    if (isBlank && costBlankPanel) {
      const markup = parseFloat((costMarkupInput && costMarkupInput.value) ? costMarkupInput.value.replace(',', '.') : 0) || 0;
      const cutting = parseFloat((costCuttingInput && costCuttingInput.value) ? costCuttingInput.value.replace(',', '.') : 0) || 0;
      total = total * (1 + markup / 100) + cutting;
    }
    const totalRounded = Math.round(total * 100) / 100;
    costResultEl.innerHTML = 'Итого: <span class="weight">' + totalRounded + ' руб</span>';
    costResultEl.classList.add('has-value');
  }

  function toggleCostBlankPanel() {
    if (costBlankPanel) costBlankPanel.hidden = !(costBlankCheckbox && costBlankCheckbox.checked);
    updateCostResult();
  }

  function getParams() {
    const sort = getCurrentSortament();
    const modeLength = getCalcMode() === 'length';
    if (!sort) return null;
    const params = {};
    let valid = true;
    sort.fields.forEach(function (f) {
      const el = document.getElementById('param-' + f.id);
      if (!el) return;
      const raw = (el.tagName === 'SELECT' ? el.value : el.value.replace(',', '.')).trim();
      const num = parseFloat(raw);
      if (f.id === 'L' && modeLength && sort.calcLength) {
        if (raw === '' || isNaN(num) || num <= 0) valid = false;
        params.M = isNaN(num) ? 0 : num;
        return;
      }
      if (el.tagName === 'SELECT') {
        if (raw === '' && (sort.id === 'channel' || sort.id === 'ibeam')) valid = false;
        if (f.id === 'channelType' || f.id === 'ibeamType' || (sort.id === 'channel' && f.id === 'N')) {
          params[f.id] = raw;
        } else {
          params[f.id] = num;
        }
      } else {
        if (raw === '' || isNaN(num) || num < 0) valid = false;
        if (f.id === 'Qty') {
          params[f.id] = (isNaN(num) || num < 1) ? 1 : Math.max(1, Math.floor(num));
        } else {
          params[f.id] = isNaN(num) ? 0 : num;
        }
      }
    });
    return valid ? params : null;
  }

  function calculate() {
    const params = getParams();
    const sort = getCurrentSortament();
    const rho = getDensity();
    const modeLength = getCalcMode() === 'length';
    if (!params || !sort) {
      resultEl.innerHTML = '';
      resultEl.classList.remove('has-value');
      if (sort && !params) {
        resultEl.textContent = 'Заполните все поля положительными числами.';
      }
      return;
    }
    if (modeLength && sort.calcLength) {
      let lengthVal = null;
      try {
        lengthVal = sort.calcLength(params, rho);
      } catch (e) {
        resultEl.textContent = 'Ошибка расчёта. Проверьте введённые данные.';
        resultEl.classList.remove('has-value');
        return;
      }
      if (lengthVal == null || isNaN(lengthVal) || lengthVal < 0) {
        resultEl.textContent = 'Не удалось рассчитать длину для выбранных параметров.';
        resultEl.classList.remove('has-value');
        return;
      }
      const lengthRounded = Math.round(lengthVal * 1000) / 1000;
      const isSheet = sort.id === 'sheet';
      const unit = isSheet ? ' мм' : ' м';
      resultEl.innerHTML = 'Длина: <span class="weight">' + lengthRounded + unit + '</span>';
      resultEl.classList.add('has-value');
      history.unshift({
        sortament: sort.name,
        weight: lengthRounded + unit,
        params: params,
        isLength: true
      });
      if (history.length > 20) history.pop();
      renderHistory();
      return;
    }
    if (modeLength && !sort.calcLength) {
      resultEl.textContent = 'Для данного сортамента расчёт длины по массе недоступен.';
      resultEl.classList.remove('has-value');
      return;
    }
    let weight = null;
    try {
      weight = sort.calc(params, rho);
    } catch (e) {
      resultEl.textContent = 'Ошибка расчёта. Проверьте введённые данные.';
      resultEl.classList.remove('has-value');
      return;
    }
    if (weight == null || isNaN(weight) || weight < 0) {
      resultEl.textContent = 'Не удалось рассчитать для выбранных параметров.';
      resultEl.classList.remove('has-value');
      return;
    }
    const weightKg = Math.round(weight * 1000) / 1000;
    const lengthM = params.L;
    let perM = '';
    const hasLength = lengthM != null && !isNaN(lengthM) && lengthM > 0;
    const linearSortaments = ['pipe_round', 'circle', 'angle', 'angle_unequal', 'channel', 'ibeam', 'pipe_rect', 'square', 'rebar', 'strip'];
    if (hasLength && linearSortaments.indexOf(sort.id) !== -1) {
      perM = ' <span class="unit">(' + (Math.round((weight / lengthM) * 1000) / 1000) + ' кг/м)</span>';
    }
    resultEl.innerHTML = 'Вес: <span class="weight">' + weightKg + ' кг</span>' + perM;
    resultEl.classList.add('has-value');
    lastWeightKg = weightKg;
    updateCostResult();

    history.unshift({
      sortament: sort.name,
      weight: weightKg,
      params: params
    });
    if (history.length > 20) history.pop();
    renderHistory();
  }

  function renderHistory() {
    if (history.length === 0) {
      historySection.style.display = 'none';
      return;
    }
    historySection.style.display = 'block';
    historyList.innerHTML = history.slice(0, 10).map(function (h) {
      const desc = h.sortament + ' — ' + Object.keys(h.params).filter(function (k) { return k !== 'M'; }).map(function (k) { return h.params[k]; }).join(' × ');
      const value = h.isLength ? ('Длина: ' + h.weight) : (h.weight + ' кг');
      return '<li>' + desc + ' → <span class="history-weight">' + value + '</span></li>';
    }).join('');
  }

  document.querySelectorAll('input[name="metal"]').forEach(function (radio) {
    radio.addEventListener('change', renderGrades);
  });

  document.querySelectorAll('input[name="calcMode"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      renderParams();
      resultEl.innerHTML = '';
      resultEl.classList.remove('has-value');
    });
  });

  sortamentSelect.addEventListener('change', function () {
    renderParams();
    renderHint();
    resultEl.innerHTML = '';
    resultEl.classList.remove('has-value');
  });

  calcBtn.addEventListener('click', calculate);

  if (costBlankCheckbox) {
    costBlankCheckbox.addEventListener('change', toggleCostBlankPanel);
  }
  [pricePerTonInput, costMarkupInput, costCuttingInput].forEach(function (el) {
    if (el) el.addEventListener('input', updateCostResult);
  });

  renderGrades();
  renderSortaments();
  renderHistory();
  toggleCostBlankPanel();
})();
