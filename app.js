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

  // Прайс резки кругов — Группа Компаний Демидов (диаметр мм → руб за резку)
  const DEMIDOV_CIRCLES_RANGES = [
    { min: 50, max: 95, price: 506 },
    { min: 100, max: 115, price: 529 },
    { min: 120, max: 140, price: 564 },
    { min: 150, max: 180, price: 633 },
    { min: 190, max: 200, price: 782 }
  ];
  const DEMIDOV_CIRCLES_SINGLE = {
    210: 863, 220: 943, 230: 1024, 240: 1139, 250: 1242, 260: 1323, 270: 1380,
    280: 1484, 290: 1564, 300: 1714, 310: 1794, 320: 1909, 330: 2013, 340: 2162,
    350: 2277, 370: 2392, 380: 2611, 385: 2645, 390: 2760, 400: 2875, 410: 2990,
    420: 3105, 430: 3278, 440: 3393, 450: 3623, 460: 3761, 470: 3922, 480: 4094,
    485: 4186, 500: 4451, 510: 4600, 520: 4830, 530: 5003, 540: 5175, 550: 5382,
    560: 5589, 570: 5785, 580: 5980, 585: 6095, 600: 6440, 620: 6670, 635: 6900,
    650: 7073, 660: 7245, 670: 7418, 680: 7590, 690: 7820, 700: 8050, 710: 8280,
    720: 8510, 730: 8798, 740: 9028, 750: 9258, 760: 9545, 770: 9775, 780: 10005,
    790: 10293, 800: 10523, 850: 11270, 900: 11500, 950: 12650, 960: 13800
  };

  const DEMIDOV_MIN_DIAMETER_MM = 100;

  function getCuttingPriceDemidovCircles(diameterMm) {
    const d = Math.round(Number(diameterMm));
    if (isNaN(d) || d < DEMIDOV_MIN_DIAMETER_MM) return null;
    for (var i = 0; i < DEMIDOV_CIRCLES_RANGES.length; i++) {
      var r = DEMIDOV_CIRCLES_RANGES[i];
      if (d >= r.min && d <= r.max) return r.price;
    }
    if (DEMIDOV_CIRCLES_SINGLE[d] != null) return DEMIDOV_CIRCLES_SINGLE[d];
    var singleDiameters = Object.keys(DEMIDOV_CIRCLES_SINGLE).map(Number).sort(function (a, b) { return a - b; });
    for (var j = 0; j < singleDiameters.length; j++) {
      if (d <= singleDiameters[j]) return DEMIDOV_CIRCLES_SINGLE[singleDiameters[j]];
    }
    return DEMIDOV_CIRCLES_SINGLE[960];
  }

  // Металлоторг: наценка +10% к стоимости металла, но не менее 800 руб на заказ; резка только от Ø80 мм
  const METALLOTORG_MARKUP_MIN_RUB = 800;
  const METALLOTORG_MIN_DIAMETER_MM = 80;
  const METALLOTORG_CIRCLES_RANGES = [
    { min: 80, max: 85, price: 422 },
    { min: 90, max: 105, price: 495 },
    { min: 110, max: 125, price: 575 },
    { min: 130, max: 155, price: 632 },
    { min: 160, max: 185, price: 770 },
    { min: 190, max: 215, price: 903 },
    { min: 220, max: 235, price: 1170 },
    { min: 240, max: 255, price: 1260 },
    { min: 260, max: 285, price: 1350 },
    { min: 290, max: 325, price: 1598 },
    { min: 330, max: 355, price: 1850 },
    { min: 360, max: 385, price: 2070 },
    { min: 390, max: 425, price: 2614 },
    { min: 430, max: 455, price: 3137 },
    { min: 460, max: 485, price: 3528 },
    { min: 490, max: 515, price: 3921 },
    { min: 520, max: 535, price: 4509 }
  ];

  function getCuttingPriceMetallotorgCircles(diameterMm) {
    var d = Math.round(Number(diameterMm));
    if (isNaN(d) || d < METALLOTORG_MIN_DIAMETER_MM) return null;
    for (var i = 0; i < METALLOTORG_CIRCLES_RANGES.length; i++) {
      var r = METALLOTORG_CIRCLES_RANGES[i];
      if (d >= r.min && d <= r.max) return r.price;
    }
    for (var j = 0; j < METALLOTORG_CIRCLES_RANGES.length; j++) {
      if (d < METALLOTORG_CIRCLES_RANGES[j].min) return METALLOTORG_CIRCLES_RANGES[j].price;
    }
    return METALLOTORG_CIRCLES_RANGES[METALLOTORG_CIRCLES_RANGES.length - 1].price;
  }

  // Стальной мир: труба круглая — припуск +70 мм, наценка +30%; прайс резки (диаметр + толщина → цена за 1 рез, руб)
  const STALNOY_MIR_PIPE_ALLOWANCE_MM = 70;
  const STALNOY_MIR_PIPE_MARKUP_PERCENT = 30;
  const STALNOY_MIR_PIPE_PRICE = [
    { d_from: 0, d_to: 49, t: '≤3', price: 900 }, { d_from: 0, d_to: 49, t: '≤7', price: 1000 }, { d_from: 0, d_to: 49, t: '>7', price: 1100 },
    { d_from: 50, d_to: 99, t: '≤9', price: 1100 }, { d_from: 50, d_to: 99, t: '≤19', price: 1200 }, { d_from: 50, d_to: 99, t: '≤29', price: 1300 }, { d_from: 50, d_to: 99, t: '>29', price: 1400 },
    { d_from: 100, d_to: 149, t: '≤9', price: 1300 }, { d_from: 100, d_to: 149, t: '≤19', price: 1400 }, { d_from: 100, d_to: 149, t: '≤29', price: 1500 }, { d_from: 100, d_to: 149, t: '≤39', price: 1600 }, { d_from: 100, d_to: 149, t: '>39', price: 1700 },
    { d_from: 150, d_to: 199, t: '≤9', price: 1400 }, { d_from: 150, d_to: 199, t: '≤19', price: 1500 }, { d_from: 150, d_to: 199, t: '≤29', price: 1600 }, { d_from: 150, d_to: 199, t: '≤39', price: 1700 }, { d_from: 150, d_to: 199, t: '≤49', price: 1800 }, { d_from: 150, d_to: 199, t: '>49', price: 1900 },
    { d_from: 200, d_to: 249, t: '≤9', price: 1600 }, { d_from: 200, d_to: 249, t: '≤19', price: 1700 }, { d_from: 200, d_to: 249, t: '≤29', price: 1900 }, { d_from: 200, d_to: 249, t: '≤39', price: 2000 }, { d_from: 200, d_to: 249, t: '≤49', price: 2100 }, { d_from: 200, d_to: 249, t: '≤59', price: 2200 }, { d_from: 200, d_to: 249, t: '>59', price: 2300 },
    { d_from: 250, d_to: 299, t: '≤9', price: 1700 }, { d_from: 250, d_to: 299, t: '≤19', price: 1800 }, { d_from: 250, d_to: 299, t: '≤29', price: 2000 }, { d_from: 250, d_to: 299, t: '≤39', price: 2100 }, { d_from: 250, d_to: 299, t: '≤49', price: 2200 }, { d_from: 250, d_to: 299, t: '≤59', price: 2300 }, { d_from: 250, d_to: 299, t: '≤69', price: 2400 }, { d_from: 250, d_to: 299, t: '≤79', price: 2700 }, { d_from: 250, d_to: 299, t: '>79', price: 2800 },
    { d_from: 300, d_to: 349, t: '≤9', price: 1900 }, { d_from: 300, d_to: 349, t: '≤19', price: 2000 }, { d_from: 300, d_to: 349, t: '≤29', price: 2200 }, { d_from: 300, d_to: 349, t: '≤39', price: 2300 }, { d_from: 300, d_to: 349, t: '≤49', price: 2400 }, { d_from: 300, d_to: 349, t: '≤59', price: 2500 }, { d_from: 300, d_to: 349, t: '≤69', price: 2600 }, { d_from: 300, d_to: 349, t: '≤79', price: 2900 }, { d_from: 300, d_to: 349, t: '>79', price: 3000 },
    { d_from: 350, d_to: 399, t: '≤9', price: 2000 }, { d_from: 350, d_to: 399, t: '≤19', price: 2100 }, { d_from: 350, d_to: 399, t: '≤29', price: 2300 }, { d_from: 350, d_to: 399, t: '≤39', price: 2400 }, { d_from: 350, d_to: 399, t: '≤49', price: 2500 }, { d_from: 350, d_to: 399, t: '≤59', price: 2600 }, { d_from: 350, d_to: 399, t: '≤69', price: 2700 }, { d_from: 350, d_to: 399, t: '≤79', price: 3000 }, { d_from: 350, d_to: 399, t: '>79', price: 3100 },
    { d_from: 400, d_to: 449, t: '≤9', price: 2200 }, { d_from: 400, d_to: 449, t: '≤19', price: 2400 }, { d_from: 400, d_to: 449, t: '≤29', price: 2600 }, { d_from: 400, d_to: 449, t: '≤39', price: 2800 }, { d_from: 400, d_to: 449, t: '≤49', price: 3100 }, { d_from: 400, d_to: 449, t: '≤59', price: 3400 }, { d_from: 400, d_to: 449, t: '≤69', price: 3700 }, { d_from: 400, d_to: 449, t: '≤79', price: 4000 }, { d_from: 400, d_to: 449, t: '≤89', price: 4300 }, { d_from: 400, d_to: 449, t: '>89', price: 4500 },
    { d_from: 450, d_to: 499, t: '≤9', price: 2400 }, { d_from: 450, d_to: 499, t: '≤19', price: 2600 }, { d_from: 450, d_to: 499, t: '≤29', price: 2900 }, { d_from: 450, d_to: 499, t: '≤39', price: 3200 }, { d_from: 450, d_to: 499, t: '≤49', price: 3600 }, { d_from: 450, d_to: 499, t: '≤59', price: 4000 }, { d_from: 450, d_to: 499, t: '≤69', price: 4400 }, { d_from: 450, d_to: 499, t: '≤79', price: 4800 }, { d_from: 450, d_to: 499, t: '≤89', price: 5200 }, { d_from: 450, d_to: 499, t: '≤99', price: 5600 }, { d_from: 450, d_to: 499, t: '>99', price: 6000 },
    { d_from: 500, d_to: 549, t: '≤9', price: 2700 }, { d_from: 500, d_to: 549, t: '≤19', price: 2900 }, { d_from: 500, d_to: 549, t: '≤29', price: 3200 }, { d_from: 500, d_to: 549, t: '≤39', price: 3600 }, { d_from: 500, d_to: 549, t: '≤49', price: 3900 }, { d_from: 500, d_to: 549, t: '≤59', price: 4300 }, { d_from: 500, d_to: 549, t: '≤69', price: 4700 }, { d_from: 500, d_to: 549, t: '≤79', price: 5100 }, { d_from: 500, d_to: 549, t: '≤89', price: 5400 }, { d_from: 500, d_to: 549, t: '≤99', price: 5900 }, { d_from: 500, d_to: 549, t: '>99', price: 6400 },
    { d_from: 550, d_to: 599, t: '≤9', price: 3000 }, { d_from: 550, d_to: 599, t: '≤19', price: 3300 }, { d_from: 550, d_to: 599, t: '≤29', price: 3600 }, { d_from: 550, d_to: 599, t: '≤39', price: 3900 }, { d_from: 550, d_to: 599, t: '≤49', price: 4300 }, { d_from: 550, d_to: 599, t: '≤59', price: 4800 }, { d_from: 550, d_to: 599, t: '≤69', price: 5300 }, { d_from: 550, d_to: 599, t: '≤79', price: 5900 }, { d_from: 550, d_to: 599, t: '≤89', price: 6400 }, { d_from: 550, d_to: 599, t: '≤99', price: 6900 }, { d_from: 550, d_to: 599, t: '>99', price: 7500 },
    { d_from: 600, d_to: 649, t: '≤9', price: 3300 }, { d_from: 600, d_to: 649, t: '≤19', price: 3600 }, { d_from: 600, d_to: 649, t: '≤29', price: 3900 }, { d_from: 600, d_to: 649, t: '≤39', price: 4300 }, { d_from: 600, d_to: 649, t: '≤49', price: 4900 }, { d_from: 600, d_to: 649, t: '≤59', price: 5500 }, { d_from: 600, d_to: 649, t: '≤69', price: 6000 }, { d_from: 600, d_to: 649, t: '≤79', price: 6500 }, { d_from: 600, d_to: 649, t: '≤89', price: 7000 }, { d_from: 600, d_to: 649, t: '≤99', price: 7500 }, { d_from: 600, d_to: 649, t: '>99', price: 8000 },
    { d_from: 650, d_to: 699, t: '≤9', price: 3600 }, { d_from: 650, d_to: 699, t: '≤19', price: 3900 }, { d_from: 650, d_to: 699, t: '≤29', price: 4300 }, { d_from: 650, d_to: 699, t: '≤39', price: 4900 }, { d_from: 650, d_to: 699, t: '≤49', price: 5500 }, { d_from: 650, d_to: 699, t: '≤59', price: 6000 }, { d_from: 650, d_to: 699, t: '≤69', price: 6500 }, { d_from: 650, d_to: 699, t: '≤79', price: 7000 }, { d_from: 650, d_to: 699, t: '≤89', price: 7500 }, { d_from: 650, d_to: 699, t: '≤99', price: 8000 }, { d_from: 650, d_to: 699, t: '>99', price: 8500 },
    { d_from: 700, d_to: 749, t: '≤9', price: 3900 }, { d_from: 700, d_to: 749, t: '≤19', price: 4300 }, { d_from: 700, d_to: 749, t: '≤29', price: 4900 }, { d_from: 700, d_to: 749, t: '≤39', price: 5500 }, { d_from: 700, d_to: 749, t: '≤49', price: 6100 }, { d_from: 700, d_to: 749, t: '≤59', price: 6600 }, { d_from: 700, d_to: 749, t: '≤69', price: 7300 }, { d_from: 700, d_to: 749, t: '≤79', price: 7900 }, { d_from: 700, d_to: 749, t: '≤89', price: 8600 }, { d_from: 700, d_to: 749, t: '≤99', price: 9200 }, { d_from: 700, d_to: 749, t: '>99', price: 9700 },
    { d_from: 750, d_to: 799, t: '≤9', price: 4900 }, { d_from: 750, d_to: 799, t: '≤19', price: 5400 }, { d_from: 750, d_to: 799, t: '≤29', price: 6100 }, { d_from: 750, d_to: 799, t: '≤39', price: 6800 }, { d_from: 750, d_to: 799, t: '≤49', price: 7500 }, { d_from: 750, d_to: 799, t: '≤59', price: 8200 }, { d_from: 750, d_to: 799, t: '≤69', price: 8900 }, { d_from: 750, d_to: 799, t: '≤79', price: 9600 }, { d_from: 750, d_to: 799, t: '≤89', price: 10300 }, { d_from: 750, d_to: 799, t: '≤99', price: 11000 }, { d_from: 750, d_to: 799, t: '>99', price: 11700 },
    { d_from: 800, d_to: 849, t: '≤9', price: 6100 }, { d_from: 800, d_to: 849, t: '≤19', price: 6800 }, { d_from: 800, d_to: 849, t: '≤29', price: 7500 }, { d_from: 800, d_to: 849, t: '≤39', price: 8200 }, { d_from: 800, d_to: 849, t: '≤49', price: 8900 }, { d_from: 800, d_to: 849, t: '≤59', price: 9600 }, { d_from: 800, d_to: 849, t: '≤69', price: 10300 }, { d_from: 800, d_to: 849, t: '≤79', price: 11000 }, { d_from: 800, d_to: 849, t: '≤89', price: 11700 }, { d_from: 800, d_to: 849, t: '≤99', price: 12500 }, { d_from: 800, d_to: 849, t: '>99', price: 13500 },
    { d_from: 850, d_to: 899, t: '≤9', price: 7300 }, { d_from: 850, d_to: 899, t: '≤19', price: 8000 }, { d_from: 850, d_to: 899, t: '≤29', price: 8700 }, { d_from: 850, d_to: 899, t: '≤39', price: 9500 }, { d_from: 850, d_to: 899, t: '≤49', price: 10300 },
    { d_from: 900, d_to: 949, t: '≤9', price: 11100 }, { d_from: 900, d_to: 949, t: '≤19', price: 12000 }, { d_from: 900, d_to: 949, t: '≤29', price: 12900 }, { d_from: 900, d_to: 949, t: '≤39', price: 13800 }, { d_from: 900, d_to: 949, t: '≤49', price: 14800 },
    { d_from: 950, d_to: 999, t: '≤9', price: 10900 }, { d_from: 950, d_to: 999, t: '≤19', price: 11800 }, { d_from: 950, d_to: 999, t: '≤29', price: 12700 }, { d_from: 950, d_to: 999, t: '≤39', price: 13700 }, { d_from: 950, d_to: 999, t: '≤49', price: 14800 },
    { d_from: 1000, d_to: 1049, t: '≤9', price: 12100 }, { d_from: 1000, d_to: 1049, t: '≤19', price: 13100 }, { d_from: 1000, d_to: 1049, t: '≤29', price: 14100 }, { d_from: 1000, d_to: 1049, t: '≤39', price: 15100 }, { d_from: 1000, d_to: 1049, t: '≤49', price: 16100 },
    { d_from: 1050, d_to: 1099, t: '≤9', price: 13400 }, { d_from: 1050, d_to: 1099, t: '≤19', price: 14500 }, { d_from: 1050, d_to: 1099, t: '≤29', price: 15600 }, { d_from: 1050, d_to: 1099, t: '≤39', price: 16700 }, { d_from: 1050, d_to: 1099, t: '≤49', price: 17800 },
    { d_from: 1100, d_to: 1149, t: '≤9', price: 14500 }, { d_from: 1100, d_to: 1149, t: '≤19', price: 15600 }, { d_from: 1100, d_to: 1149, t: '≤29', price: 16700 }, { d_from: 1100, d_to: 1149, t: '≤39', price: 17800 }, { d_from: 1100, d_to: 1149, t: '≤49', price: 18900 },
    { d_from: 1150, d_to: 1199, t: '≤9', price: 15600 }, { d_from: 1150, d_to: 1199, t: '≤19', price: 16800 }, { d_from: 1150, d_to: 1199, t: '≤29', price: 18000 }, { d_from: 1150, d_to: 1199, t: '≤39', price: 19200 }, { d_from: 1150, d_to: 1199, t: '≤49', price: 20400 },
    { d_from: 1200, d_to: 1249, t: '≤9', price: 17700 }, { d_from: 1200, d_to: 1249, t: '≤19', price: 19000 }, { d_from: 1200, d_to: 1249, t: '≤29', price: 20300 }, { d_from: 1200, d_to: 1249, t: '≤39', price: 21600 }, { d_from: 1200, d_to: 1249, t: '≤49', price: 22900 },
    { d_from: 1250, d_to: 1299, t: '≤9', price: 20700 }, { d_from: 1250, d_to: 1299, t: '≤19', price: 22100 }, { d_from: 1250, d_to: 1299, t: '≤29', price: 23500 }, { d_from: 1250, d_to: 1299, t: '≤39', price: 24900 }, { d_from: 1250, d_to: 1299, t: '≤49', price: 26300 },
    { d_from: 1300, d_to: 1349, t: '≤9', price: 24700 }, { d_from: 1300, d_to: 1349, t: '≤19', price: 26100 }, { d_from: 1300, d_to: 1349, t: '≤29', price: 27500 }, { d_from: 1300, d_to: 1349, t: '≤39', price: 28900 }, { d_from: 1300, d_to: 1349, t: '≤49', price: 30300 },
    { d_from: 1350, d_to: 1399, t: '≤9', price: 29700 }, { d_from: 1350, d_to: 1399, t: '≤19', price: 31200 }, { d_from: 1350, d_to: 1399, t: '≤29', price: 32700 }, { d_from: 1350, d_to: 1399, t: '≤39', price: 34200 }, { d_from: 1350, d_to: 1399, t: '≤49', price: 35700 },
    { d_from: 1400, d_to: 1449, t: '≤9', price: 33700 }, { d_from: 1400, d_to: 1449, t: '≤19', price: 35300 }, { d_from: 1400, d_to: 1449, t: '≤29', price: 36900 }, { d_from: 1400, d_to: 1449, t: '≤39', price: 38500 }, { d_from: 1400, d_to: 1449, t: '≤49', price: 40100 }
  ];

  function getCuttingPriceStalnoyMirPipe(diameterMm, thicknessMm) {
    var D = Math.round(Number(diameterMm));
    var S = Math.round(Number(thicknessMm));
    if (isNaN(D) || isNaN(S) || D < 0 || S < 0) return null;
    var rows = STALNOY_MIR_PIPE_PRICE.filter(function (r) { return D >= r.d_from && D <= r.d_to; });
    if (rows.length === 0) return null;
    rows.sort(function (a, b) {
      var na = parseFloat(a.t.replace(/\D/g, '')) || 0;
      var nb = parseFloat(b.t.replace(/\D/g, '')) || 0;
      if (na !== nb) return na - nb;
      return (a.t.indexOf('≤') === 0 ? 0 : 1) - (b.t.indexOf('≤') === 0 ? 0 : 1);
    });
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var x = parseFloat(row.t.replace(/\D/g, '')) || 0;
      if (row.t.indexOf('≤') === 0 && S <= x) return row.price;
      if (row.t.indexOf('>') === 0 && S > x) return row.price;
    }
    return null;
  }

  // ИНОКС: труба круглая — без припуска (чистовой размер), наценка +20%; прайс резки (диаметр + толщина → руб)
  const INOX_PIPE_MARKUP_PERCENT = 20;
  const INOX_PIPE_PRICE = [
    { d_from: 57, d_to: 245, thickness: '≤25', price: 500 },
    { d_from: 57, d_to: 245, thickness: '>25', price: 700 },
    { d_from: 245, d_to: 426, thickness: '≤50', price: 1000 },
    { d_from: 245, d_to: 426, thickness: '>50', price: 2000 },
    { d_from: 426, d_to: 610, thickness: '≤50', price: 2000 },
    { d_from: 426, d_to: 610, thickness: '>50', price: 3000 }
  ];

  function getCuttingPriceInoxPipe(diameterMm, thicknessMm) {
    var D = Math.round(Number(diameterMm));
    var S = Math.round(Number(thicknessMm));
    if (isNaN(D) || isNaN(S) || D < 0 || S < 0) return null;
    var rows = INOX_PIPE_PRICE.filter(function (r) { return D >= r.d_from && D <= r.d_to; });
    if (rows.length === 0) return null;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var x = parseFloat(row.thickness.replace(/\D/g, '')) || 0;
      if (row.thickness.indexOf('≤') === 0 && S <= x) return row.price;
      if (row.thickness.indexOf('>') === 0 && S > x) return row.price;
    }
    return null;
  }

  // СпецТруба: труба круглая — припуск +60 мм, наценка +30%; цены за тонну и резку по прайсу (Google Таблицы)
  const SPEC_TRUBA_PIPE_ALLOWANCE_MM = 60;
  const SPEC_TRUBA_PIPE_MARKUP_PERCENT = 30;
  // Прайс трубы (диаметр мм, стенка мм → цена руб/тн с НДС). Источник: https://docs.google.com/spreadsheets/d/1fQ9AmZijd7HxZgP1zSL8VdxBsspV0jp7/edit?gid=1180065566
  const SPEC_TRUBA_PIPE_PRICE = [
    { d: 12, s: 2, pricePerTon: 395700 }, { d: 15, s: 1, pricePerTon: 495700 }, { d: 15, s: 2, pricePerTon: 395700 },
    { d: 22, s: 4.5, pricePerTon: 248700 }, { d: 25, s: 2, pricePerTon: 248700 }, { d: 27, s: 2, pricePerTon: 248700 },
    { d: 30, s: 2, pricePerTon: 248700 }, { d: 30, s: 4, pricePerTon: 228700 }, { d: 32, s: 8, pricePerTon: 228700 },
    { d: 36, s: 5, pricePerTon: 228700 }, { d: 38, s: 4, pricePerTon: 228700 }, { d: 38, s: 5, pricePerTon: 179700 },
    { d: 42, s: 2, pricePerTon: 248700 }, { d: 50, s: 10, pricePerTon: 248700 }, { d: 51, s: 6, pricePerTon: 205700 },
    { d: 56, s: 8, pricePerTon: 158700 }, { d: 57, s: 6, pricePerTon: 165700 }, { d: 57, s: 8, pricePerTon: 158700 },
    { d: 57, s: 10, pricePerTon: 165700 }, { d: 60, s: 2, pricePerTon: 195700 }, { d: 60, s: 4, pricePerTon: 158700 },
    { d: 60, s: 10, pricePerTon: 189700 }, { d: 63.5, s: 9, pricePerTon: 185700 }, { d: 73, s: 5, pricePerTon: 168700 },
    { d: 73, s: 9, pricePerTon: 175700 }, { d: 73, s: 10, pricePerTon: 189700 }, { d: 73, s: 14, pricePerTon: 158700 },
    { d: 76, s: 9, pricePerTon: 158700 }, { d: 76, s: 12, pricePerTon: 165700 }, { d: 80, s: 6, pricePerTon: 158700 },
    { d: 85, s: 12, pricePerTon: 165700 }, { d: 89, s: 4, pricePerTon: 165700 }, { d: 89, s: 5, pricePerTon: 158700 },
    { d: 89, s: 6, pricePerTon: 158700 }, { d: 89, s: 8, pricePerTon: 158700 }, { d: 89, s: 9, pricePerTon: 158700 },
    { d: 89, s: 12, pricePerTon: 158700 }, { d: 89, s: 18, pricePerTon: 185700 }, { d: 95, s: 8, pricePerTon: 185700 },
    { d: 95, s: 22, pricePerTon: 198700 }, { d: 102, s: 6, pricePerTon: 158700 }, { d: 102, s: 20, pricePerTon: 168700 },
    { d: 108, s: 4, pricePerTon: 158700 }, { d: 108, s: 8, pricePerTon: 158700 }, { d: 108, s: 18, pricePerTon: 165700 },
    { d: 114, s: 5, pricePerTon: 158700 }, { d: 114, s: 6, pricePerTon: 158700 }, { d: 114, s: 7, pricePerTon: 158700 },
    { d: 114, s: 10, pricePerTon: 165700 }, { d: 114, s: 12, pricePerTon: 158700 }, { d: 114, s: 14, pricePerTon: 158700 },
    { d: 114, s: 18, pricePerTon: 189700 }, { d: 114, s: 20, pricePerTon: 168700 }, { d: 121, s: 25, pricePerTon: 198700 },
    { d: 127, s: 20, pricePerTon: 195700 }, { d: 127, s: 22, pricePerTon: 185700 }, { d: 127, s: 25, pricePerTon: 195700 },
    { d: 127, s: 30, pricePerTon: 189700 }, { d: 133, s: 11, pricePerTon: 175700 }, { d: 133, s: 20, pricePerTon: 185700 },
    { d: 133, s: 22, pricePerTon: 185700 }, { d: 133, s: 28, pricePerTon: 165700 }, { d: 140, s: 8, pricePerTon: 158700 },
    { d: 140, s: 9, pricePerTon: 185700 }, { d: 140, s: 12, pricePerTon: 158700 }, { d: 140, s: 13, pricePerTon: 158700 },
    { d: 140, s: 14, pricePerTon: 158700 }, { d: 140, s: 17, pricePerTon: 189700 }, { d: 140, s: 24, pricePerTon: 189700 },
    { d: 146, s: 7, pricePerTon: 165700 }, { d: 146, s: 8, pricePerTon: 165700 }, { d: 146, s: 12, pricePerTon: 165700 },
    { d: 146, s: 18, pricePerTon: 189700 }, { d: 152, s: 20, pricePerTon: 195700 }, { d: 152, s: 25, pricePerTon: 185700 },
    { d: 159, s: 6, pricePerTon: 165700 }, { d: 159, s: 8, pricePerTon: 158700 }, { d: 159, s: 12, pricePerTon: 158700 },
    { d: 159, s: 16, pricePerTon: 185700 }, { d: 159, s: 32, pricePerTon: 185700 }
  ];
  // Прайс резки СпецТруба: диаметр + стенка → цена за 1 рез, руб с НДС
  const SPEC_TRUBA_CUT_PRICE = [
    { d_from: 28, d_to: 68, t: '≤10', price: 500 }, { d_from: 28, d_to: 68, t: '>10', price: 500 },
    { d_from: 70, d_to: 102, t: '≤10', price: 700 }, { d_from: 70, d_to: 102, t: '>10', price: 700 }, { d_from: 70, d_to: 102, t: '>20', price: 1000 },
    { d_from: 104, d_to: 133, t: '≤10', price: 1000 }, { d_from: 104, d_to: 133, t: '>10', price: 1000 }, { d_from: 104, d_to: 133, t: '>20', price: 1000 },
    { d_from: 140, d_to: 168, t: '≤10', price: 1000 }, { d_from: 140, d_to: 168, t: '>10', price: 1000 }, { d_from: 140, d_to: 168, t: '>20', price: 1000 }, { d_from: 140, d_to: 168, t: '>30', price: 1200 },
    { d_from: 180, d_to: 203, t: '≤10', price: 1000 }, { d_from: 180, d_to: 203, t: '>10', price: 1000 }, { d_from: 180, d_to: 203, t: '>20', price: 1200 }, { d_from: 180, d_to: 203, t: '>30', price: 1200 }, { d_from: 180, d_to: 203, t: '>40', price: 1500 },
    { d_from: 219, d_to: 299, t: '≤10', price: 1000 }, { d_from: 219, d_to: 299, t: '>10', price: 1200 }, { d_from: 219, d_to: 299, t: '>20', price: 1500 }, { d_from: 219, d_to: 299, t: '>30', price: 1500 }, { d_from: 219, d_to: 299, t: '>40', price: 1500 }, { d_from: 219, d_to: 299, t: '>50', price: 2000 },
    { d_from: 325, d_to: 406, t: '≤10', price: 1500 }, { d_from: 325, d_to: 406, t: '>10', price: 1500 }, { d_from: 325, d_to: 406, t: '>20', price: 1700 }, { d_from: 325, d_to: 406, t: '>30', price: 2000 }, { d_from: 325, d_to: 406, t: '>40', price: 2000 }, { d_from: 325, d_to: 406, t: '>50', price: 2000 },
    { d_from: 426, d_to: 465, t: '≤10', price: 1500 }, { d_from: 426, d_to: 465, t: '>10', price: 1500 }, { d_from: 426, d_to: 465, t: '>20', price: 1500 }, { d_from: 426, d_to: 465, t: '>30', price: 2000 }, { d_from: 426, d_to: 465, t: '>40', price: 2000 }, { d_from: 426, d_to: 465, t: '>50', price: 2000 },
    { d_from: 480, d_to: 630, t: '≤10', price: 1700 }, { d_from: 480, d_to: 630, t: '>10', price: 1700 }, { d_from: 480, d_to: 630, t: '>20', price: 2000 }, { d_from: 480, d_to: 630, t: '>30', price: 2500 }, { d_from: 480, d_to: 630, t: '>40', price: 2500 }, { d_from: 480, d_to: 630, t: '>50', price: 2500 }
  ];

  function getPricePerTonSpecTrubaPipe(diameterMm, thicknessMm) {
    var D = parseFloat(String(diameterMm).replace(',', '.'));
    var S = parseFloat(String(thicknessMm).replace(',', '.'));
    if (isNaN(D) || isNaN(S) || D < 0 || S < 0) return null;
    var exact = SPEC_TRUBA_PIPE_PRICE.find(function (r) { return Math.abs(r.d - D) < 0.01 && Math.abs(r.s - S) < 0.01; });
    if (exact) return exact.pricePerTon;
    var byD = SPEC_TRUBA_PIPE_PRICE.filter(function (r) { return Math.abs(r.d - D) < 0.5; });
    if (byD.length === 0) {
      byD = SPEC_TRUBA_PIPE_PRICE.slice().sort(function (a, b) { return Math.abs(a.d - D) - Math.abs(b.d - D); });
      byD = byD.slice(0, 5);
    }
    var byS = byD.filter(function (r) { return Math.abs(r.s - S) < 0.5; });
    if (byS.length > 0) byD = byS;
    byD.sort(function (a, b) { return Math.abs(a.s - S) - Math.abs(b.s - S); });
    return byD.length ? byD[0].pricePerTon : null;
  }

  function getCuttingPriceSpecTrubaPipe(diameterMm, thicknessMm) {
    var D = Math.round(Number(diameterMm));
    var S = Math.round(Number(thicknessMm));
    if (isNaN(D) || isNaN(S) || D < 0 || S < 0) return null;
    var rows = SPEC_TRUBA_CUT_PRICE.filter(function (r) { return D >= r.d_from && D <= r.d_to; });
    if (rows.length === 0) return null;
    // Сначала проверяем «>» по убыванию порога (чтобы для S=25 сработало «>20», а не «>10»), затем «≤»
    rows.sort(function (a, b) {
      var na = parseFloat(a.t.replace(/\D/g, '')) || 0;
      var nb = parseFloat(b.t.replace(/\D/g, '')) || 0;
      var aIsLe = a.t.indexOf('≤') === 0;
      var bIsLe = b.t.indexOf('≤') === 0;
      if (aIsLe && !bIsLe) return 1;
      if (!aIsLe && bIsLe) return -1;
      if (aIsLe && bIsLe) return na - nb;
      return nb - na;
    });
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var x = parseFloat(row.t.replace(/\D/g, '')) || 0;
      if (row.t.indexOf('≤') === 0 && S <= x) return row.price;
      if (row.t.indexOf('>') === 0 && S > x) return row.price;
    }
    return null;
  }

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
  const costSuppliersRow = document.getElementById('cost-suppliers-row');
  const costSuppliersCircles = document.getElementById('cost-suppliers-circles');
  const costSuppliersPipe = document.getElementById('cost-suppliers-pipe');
  const supplierDemidovCheckbox = document.getElementById('supplier-demidov');
  const supplierMetallotorgCheckbox = document.getElementById('supplier-metallotorg');
  const supplierStalnoyMirCheckbox = document.getElementById('supplier-stalnoy-mir');
  const supplierInoxCheckbox = document.getElementById('supplier-inox');
  const supplierUraltehpromCheckbox = document.getElementById('supplier-uraltehprom');
  const supplierSpecTrubaCheckbox = document.getElementById('supplier-spectruba');
  const URALTEHPROM_PIPE_MARKUP_PERCENT = 30;
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
    const isBlank = costBlankCheckbox && costBlankCheckbox.checked;
    const sort = getCurrentSortament();
    if (isBlank && sort && sort.id === 'circle') {
      var dInput = document.getElementById('param-D');
      var d = dInput ? parseFloat(String(dInput.value).replace(',', '.')) : NaN;
      if (supplierDemidovCheckbox && supplierDemidovCheckbox.checked && !isNaN(d) && d < DEMIDOV_MIN_DIAMETER_MM) {
        costResultEl.innerHTML = 'Демидов выполняет резку только от Ø100 мм. Укажите диаметр ≥ 100 мм.';
        costResultEl.classList.add('has-value');
        costResultEl.classList.add('cost-result--error');
        return;
      }
      if (supplierMetallotorgCheckbox && supplierMetallotorgCheckbox.checked && !isNaN(d) && d < METALLOTORG_MIN_DIAMETER_MM) {
        costResultEl.innerHTML = 'Металлоторг выполняет резку только от Ø80 мм. Укажите диаметр ≥ 80 мм.';
        costResultEl.classList.add('has-value');
        costResultEl.classList.add('cost-result--error');
        return;
      }
    }
    costResultEl.classList.remove('cost-result--error');
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
    var base = (weight / 1000) * pricePerTon;
    var total = base;
    if (isBlank && costBlankPanel) {
      var cutting = parseFloat((costCuttingInput && costCuttingInput.value) ? costCuttingInput.value.replace(',', '.') : 0) || 0;
      if (sort && sort.id === 'circle' && supplierMetallotorgCheckbox && supplierMetallotorgCheckbox.checked) {
        var markupAmount = Math.max(base * 0.10, METALLOTORG_MARKUP_MIN_RUB);
        total = base + markupAmount + cutting;
      } else if (sort && sort.id === 'pipe_round' && supplierStalnoyMirCheckbox && supplierStalnoyMirCheckbox.checked) {
        total = base * (1 + STALNOY_MIR_PIPE_MARKUP_PERCENT / 100) + cutting;
      } else if (sort && sort.id === 'pipe_round' && supplierInoxCheckbox && supplierInoxCheckbox.checked) {
        total = base * (1 + INOX_PIPE_MARKUP_PERCENT / 100) + cutting;
      } else if (sort && sort.id === 'pipe_round' && supplierUraltehpromCheckbox && supplierUraltehpromCheckbox.checked) {
        total = base * (1 + URALTEHPROM_PIPE_MARKUP_PERCENT / 100);
      } else if (sort && sort.id === 'pipe_round' && supplierSpecTrubaCheckbox && supplierSpecTrubaCheckbox.checked) {
        var dInput = document.getElementById('param-D');
        var sInput = document.getElementById('param-S');
        var D = dInput ? parseFloat(String(dInput.value).replace(',', '.')) : NaN;
        var S = sInput ? parseFloat(String(sInput.value).replace(',', '.')) : NaN;
        var specPricePerTon = (!isNaN(D) && D > 0 && !isNaN(S) && S >= 0) ? getPricePerTonSpecTrubaPipe(D, S) : null;
        var pricePerTonSpec = specPricePerTon != null ? specPricePerTon : pricePerTon;
        base = (weight / 1000) * pricePerTonSpec;
        total = base * (1 + SPEC_TRUBA_PIPE_MARKUP_PERCENT / 100) + cutting;
      } else {
        var markup = parseFloat((costMarkupInput && costMarkupInput.value) ? costMarkupInput.value.replace(',', '.') : 0) || 0;
        total = base * (1 + markup / 100) + cutting;
      }
    }
    const totalRounded = Math.round(total * 100) / 100;
    costResultEl.innerHTML = 'Итого: <span class="weight">' + totalRounded + ' руб</span>';
    costResultEl.classList.add('has-value');
  }

  function toggleCostBlankPanel() {
    const blankChecked = costBlankCheckbox && costBlankCheckbox.checked;
    if (costBlankPanel) costBlankPanel.hidden = !blankChecked;
    const sort = getCurrentSortament();
    const isCircle = sort && sort.id === 'circle'; // только «Круг / Пруток»
    const isPipeRound = sort && sort.id === 'pipe_round'; // только «Труба круглая»
    if (costSuppliersRow) {
      costSuppliersRow.hidden = !(blankChecked && (isCircle || isPipeRound));
    }
    // Демидов и Металлоторг — только при сортаменте «Круг / Пруток»
    if (costSuppliersCircles) {
      costSuppliersCircles.hidden = !isCircle;
      costSuppliersCircles.style.display = isCircle ? '' : 'none';
    }
    // Стальной мир — только при сортаменте «Труба круглая»
    if (costSuppliersPipe) {
      costSuppliersPipe.hidden = !isPipeRound;
      costSuppliersPipe.style.display = isPipeRound ? '' : 'none';
    }
    if (!isCircle && !isPipeRound) {
      if (supplierDemidovCheckbox) supplierDemidovCheckbox.checked = false;
      if (supplierMetallotorgCheckbox) supplierMetallotorgCheckbox.checked = false;
      if (supplierStalnoyMirCheckbox) supplierStalnoyMirCheckbox.checked = false;
      if (costMarkupInput) costMarkupInput.value = '0';
      if (costCuttingInput) costCuttingInput.value = '0';
    } else if (!isCircle) {
      if (supplierDemidovCheckbox) supplierDemidovCheckbox.checked = false;
      if (supplierMetallotorgCheckbox) supplierMetallotorgCheckbox.checked = false;
    } else if (!isPipeRound) {
      if (supplierStalnoyMirCheckbox) supplierStalnoyMirCheckbox.checked = false;
      if (supplierInoxCheckbox) supplierInoxCheckbox.checked = false;
      if (supplierUraltehpromCheckbox) supplierUraltehpromCheckbox.checked = false;
      if (supplierSpecTrubaCheckbox) supplierSpecTrubaCheckbox.checked = false;
    }
    if (isCircle && blankChecked) {
      if (supplierDemidovCheckbox && supplierDemidovCheckbox.checked) applyDemidovCircles();
      else if (supplierMetallotorgCheckbox && supplierMetallotorgCheckbox.checked) applyMetallotorgCircles();
    } else if (isPipeRound && blankChecked) {
      if (supplierStalnoyMirCheckbox && supplierStalnoyMirCheckbox.checked) applyStalnoyMirPipe();
      else if (supplierInoxCheckbox && supplierInoxCheckbox.checked) applyInoxPipe();
      else if (supplierUraltehpromCheckbox && supplierUraltehpromCheckbox.checked) applyUraltehpromPipe();
      else if (supplierSpecTrubaCheckbox && supplierSpecTrubaCheckbox.checked) applySpecTrubaPipe();
    }
    updateCostResult();
  }

  function applyStalnoyMirPipe() {
    if (!costMarkupInput || !costCuttingInput) return;
    costMarkupInput.value = String(STALNOY_MIR_PIPE_MARKUP_PERCENT);
    var dInput = document.getElementById('param-D');
    var sInput = document.getElementById('param-S');
    var D = dInput ? parseFloat(String(dInput.value).replace(',', '.')) : NaN;
    var S = sInput ? parseFloat(String(sInput.value).replace(',', '.')) : NaN;
    var cuttingPrice = (!isNaN(D) && D > 0 && !isNaN(S) && S >= 0) ? getCuttingPriceStalnoyMirPipe(D, S) : null;
    costCuttingInput.value = cuttingPrice != null ? cuttingPrice : '';
    updateCostResult();
  }

  function applyDemidovCircles() {
    if (!costMarkupInput || !costCuttingInput) return;
    costMarkupInput.value = '10';
    var dInput = document.getElementById('param-D');
    var d = dInput ? parseFloat(String(dInput.value).replace(',', '.')) : NaN;
    costCuttingInput.value = (!isNaN(d) && d > 0) ? getCuttingPriceDemidovCircles(d) : '';
    updateCostResult();
  }

  function applyMetallotorgCircles() {
    if (!costMarkupInput || !costCuttingInput) return;
    costMarkupInput.value = '10';
    var dInput = document.getElementById('param-D');
    var d = dInput ? parseFloat(String(dInput.value).replace(',', '.')) : NaN;
    var cuttingPrice = (!isNaN(d) && d > 0) ? getCuttingPriceMetallotorgCircles(d) : null;
    costCuttingInput.value = cuttingPrice != null ? cuttingPrice : '';
    updateCostResult();
  }

  function applyInoxPipe() {
    if (!costMarkupInput || !costCuttingInput) return;
    costMarkupInput.value = String(INOX_PIPE_MARKUP_PERCENT);
    var dInput = document.getElementById('param-D');
    var sInput = document.getElementById('param-S');
    var D = dInput ? parseFloat(String(dInput.value).replace(',', '.')) : NaN;
    var S = sInput ? parseFloat(String(sInput.value).replace(',', '.')) : NaN;
    var cuttingPrice = (!isNaN(D) && D > 0 && !isNaN(S) && S >= 0) ? getCuttingPriceInoxPipe(D, S) : null;
    costCuttingInput.value = cuttingPrice != null ? cuttingPrice : '';
    updateCostResult();
  }

  function applyUraltehpromPipe() {
    if (!costMarkupInput || !costCuttingInput) return;
    costMarkupInput.value = String(URALTEHPROM_PIPE_MARKUP_PERCENT);
    costCuttingInput.value = '0';
    updateCostResult();
  }

  function applySpecTrubaPipe() {
    if (!costMarkupInput || !costCuttingInput) return;
    costMarkupInput.value = String(SPEC_TRUBA_PIPE_MARKUP_PERCENT);
    var dInput = document.getElementById('param-D');
    var sInput = document.getElementById('param-S');
    var D = dInput ? parseFloat(String(dInput.value).replace(',', '.')) : NaN;
    var S = sInput ? parseFloat(String(sInput.value).replace(',', '.')) : NaN;
    var pricePerTonVal = (!isNaN(D) && D > 0 && !isNaN(S) && S >= 0) ? getPricePerTonSpecTrubaPipe(D, S) : null;
    if (pricePerTonInput && pricePerTonVal != null) pricePerTonInput.value = String(pricePerTonVal);
    var cuttingPrice = (!isNaN(D) && D > 0 && !isNaN(S) && S >= 0) ? getCuttingPriceSpecTrubaPipe(D, S) : null;
    costCuttingInput.value = cuttingPrice != null ? cuttingPrice : '';
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
      var costInfo = getHistoryCostInfo(params.M, sort);
      history.unshift({
        sortament: sort.name,
        weight: lengthRounded + unit,
        params: params,
        isLength: true,
        pricePerTon: costInfo.pricePerTon,
        isBlank: costInfo.isBlank,
        supplier: costInfo.supplier,
        totalCost: costInfo.totalCost
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
    var paramsForCalc = params;
    var circleWithSupplier = sort.id === 'circle' && ((supplierDemidovCheckbox && supplierDemidovCheckbox.checked) || (supplierMetallotorgCheckbox && supplierMetallotorgCheckbox.checked));
    var pipeWithStalnoyMir = sort.id === 'pipe_round' && supplierStalnoyMirCheckbox && supplierStalnoyMirCheckbox.checked;
    var pipeWithSpecTruba = sort.id === 'pipe_round' && supplierSpecTrubaCheckbox && supplierSpecTrubaCheckbox.checked;
    if (circleWithSupplier) {
      paramsForCalc = Object.assign({}, params, { L: params.L + 0.005 });
    } else if (pipeWithStalnoyMir) {
      paramsForCalc = Object.assign({}, params, { L: params.L + STALNOY_MIR_PIPE_ALLOWANCE_MM / 1000 });
    } else if (pipeWithSpecTruba) {
      paramsForCalc = Object.assign({}, params, { L: params.L + SPEC_TRUBA_PIPE_ALLOWANCE_MM / 1000 });
    }
    let weight = null;
    try {
      weight = sort.calc(paramsForCalc, rho);
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
    const lengthM = paramsForCalc.L;
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

    var costInfo = getHistoryCostInfo(weightKg, sort);
    history.unshift({
      sortament: sort.name,
      weight: weightKg,
      params: params,
      pricePerTon: costInfo.pricePerTon,
      isBlank: costInfo.isBlank,
      supplier: costInfo.supplier,
      totalCost: costInfo.totalCost
    });
    if (history.length > 20) history.pop();
    renderHistory();
  }

  function getHistoryCostInfo(weightKg, sort) {
    if (!weightKg || weightKg <= 0) return { pricePerTon: null, isBlank: false, supplier: null, totalCost: null };
    var pricePerTon = parseFloat((pricePerTonInput && pricePerTonInput.value) ? pricePerTonInput.value.replace(',', '.') : 0) || 0;
    if (pricePerTon <= 0) return { pricePerTon: null, isBlank: false, supplier: null, totalCost: null };
    var isBlank = costBlankCheckbox && costBlankCheckbox.checked;
    var supplier = null;
    if (supplierDemidovCheckbox && supplierDemidovCheckbox.checked) supplier = 'Демидов';
    else if (supplierMetallotorgCheckbox && supplierMetallotorgCheckbox.checked) supplier = 'Металлоторг';
    else if (supplierStalnoyMirCheckbox && supplierStalnoyMirCheckbox.checked) supplier = 'Стальной мир';
    else if (supplierInoxCheckbox && supplierInoxCheckbox.checked) supplier = 'ИНОКС';
    else if (supplierUraltehpromCheckbox && supplierUraltehpromCheckbox.checked) supplier = 'УралТехПром';
    else if (supplierSpecTrubaCheckbox && supplierSpecTrubaCheckbox.checked) supplier = 'СпецТруба';
    var totalCost = null;
    if (isBlank) {
      var base = (weightKg / 1000) * pricePerTon;
      var cutting = parseFloat((costCuttingInput && costCuttingInput.value) ? costCuttingInput.value.replace(',', '.') : 0) || 0;
      if (sort && sort.id === 'circle' && supplierMetallotorgCheckbox && supplierMetallotorgCheckbox.checked) {
        totalCost = base + Math.max(base * 0.10, METALLOTORG_MARKUP_MIN_RUB) + cutting;
      } else if (sort && sort.id === 'pipe_round' && supplierStalnoyMirCheckbox && supplierStalnoyMirCheckbox.checked) {
        totalCost = base * (1 + STALNOY_MIR_PIPE_MARKUP_PERCENT / 100) + cutting;
      } else if (sort && sort.id === 'pipe_round' && supplierInoxCheckbox && supplierInoxCheckbox.checked) {
        totalCost = base * (1 + INOX_PIPE_MARKUP_PERCENT / 100) + cutting;
      } else if (sort && sort.id === 'pipe_round' && supplierUraltehpromCheckbox && supplierUraltehpromCheckbox.checked) {
        totalCost = base * (1 + URALTEHPROM_PIPE_MARKUP_PERCENT / 100);
      } else if (sort && sort.id === 'pipe_round' && supplierSpecTrubaCheckbox && supplierSpecTrubaCheckbox.checked) {
        var dP = document.getElementById('param-D');
        var sP = document.getElementById('param-S');
        var dVal = dP ? parseFloat(String(dP.value).replace(',', '.')) : NaN;
        var sVal = sP ? parseFloat(String(sP.value).replace(',', '.')) : NaN;
        var specTon = (!isNaN(dVal) && dVal > 0 && !isNaN(sVal) && sVal >= 0) ? getPricePerTonSpecTrubaPipe(dVal, sVal) : null;
        var tonSpec = specTon != null ? specTon : pricePerTon;
        base = (weightKg / 1000) * tonSpec;
        totalCost = base * (1 + SPEC_TRUBA_PIPE_MARKUP_PERCENT / 100) + cutting;
      } else {
        var markup = parseFloat((costMarkupInput && costMarkupInput.value) ? costMarkupInput.value.replace(',', '.') : 0) || 0;
        totalCost = base * (1 + markup / 100) + cutting;
      }
      totalCost = Math.round(totalCost * 100) / 100;
    }
    return { pricePerTon: pricePerTon, isBlank: isBlank, supplier: supplier, totalCost: totalCost };
  }

  function renderHistory() {
    if (history.length === 0) {
      historySection.style.display = 'none';
      return;
    }
    historySection.style.display = 'block';
    historyList.innerHTML = history.slice(0, 10).map(function (h) {
      var desc = h.sortament + ' — ' + Object.keys(h.params).filter(function (k) { return k !== 'M'; }).map(function (k) { return h.params[k]; }).join(' × ');
      var value = h.isLength ? ('Длина: ' + h.weight) : (h.weight + ' кг');
      var extra = [];
      if (h.totalCost != null) extra.push(h.totalCost + ' руб');
      if (h.supplier) extra.push(h.supplier);
      var extraStr = extra.length ? ' <span class="history-extra">(' + extra.join(', ') + ')</span>' : '';
      return '<li>' + desc + ' → <span class="history-weight">' + value + '</span>' + extraStr + '</li>';
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
    toggleCostBlankPanel();
  });

  calcBtn.addEventListener('click', calculate);

  if (costBlankCheckbox) {
    costBlankCheckbox.addEventListener('change', toggleCostBlankPanel);
  }
  if (supplierDemidovCheckbox) {
    supplierDemidovCheckbox.addEventListener('change', function () {
      if (supplierDemidovCheckbox.checked) {
        if (supplierMetallotorgCheckbox) supplierMetallotorgCheckbox.checked = false;
        applyDemidovCircles();
      } else {
        if (costMarkupInput) costMarkupInput.value = '0';
        if (costCuttingInput) costCuttingInput.value = '0';
        updateCostResult();
      }
    });
  }
  if (supplierMetallotorgCheckbox) {
    supplierMetallotorgCheckbox.addEventListener('change', function () {
      if (supplierMetallotorgCheckbox.checked) {
        if (supplierDemidovCheckbox) supplierDemidovCheckbox.checked = false;
        applyMetallotorgCircles();
      } else {
        if (costMarkupInput) costMarkupInput.value = '0';
        if (costCuttingInput) costCuttingInput.value = '0';
        updateCostResult();
      }
    });
  }
  if (supplierStalnoyMirCheckbox) {
    supplierStalnoyMirCheckbox.addEventListener('change', function () {
      if (supplierStalnoyMirCheckbox.checked) {
        if (supplierDemidovCheckbox) supplierDemidovCheckbox.checked = false;
        if (supplierMetallotorgCheckbox) supplierMetallotorgCheckbox.checked = false;
        if (supplierInoxCheckbox) supplierInoxCheckbox.checked = false;
        if (supplierUraltehpromCheckbox) supplierUraltehpromCheckbox.checked = false;
        if (supplierSpecTrubaCheckbox) supplierSpecTrubaCheckbox.checked = false;
        applyStalnoyMirPipe();
      } else {
        if (costMarkupInput) costMarkupInput.value = '0';
        if (costCuttingInput) costCuttingInput.value = '0';
        updateCostResult();
      }
    });
  }
  if (supplierInoxCheckbox) {
    supplierInoxCheckbox.addEventListener('change', function () {
      if (supplierInoxCheckbox.checked) {
        if (supplierDemidovCheckbox) supplierDemidovCheckbox.checked = false;
        if (supplierMetallotorgCheckbox) supplierMetallotorgCheckbox.checked = false;
        if (supplierStalnoyMirCheckbox) supplierStalnoyMirCheckbox.checked = false;
        if (supplierUraltehpromCheckbox) supplierUraltehpromCheckbox.checked = false;
        if (supplierSpecTrubaCheckbox) supplierSpecTrubaCheckbox.checked = false;
        applyInoxPipe();
      } else {
        if (costMarkupInput) costMarkupInput.value = '0';
        if (costCuttingInput) costCuttingInput.value = '0';
        updateCostResult();
      }
    });
  }
  if (supplierUraltehpromCheckbox) {
    supplierUraltehpromCheckbox.addEventListener('change', function () {
      if (supplierUraltehpromCheckbox.checked) {
        if (supplierDemidovCheckbox) supplierDemidovCheckbox.checked = false;
        if (supplierMetallotorgCheckbox) supplierMetallotorgCheckbox.checked = false;
        if (supplierStalnoyMirCheckbox) supplierStalnoyMirCheckbox.checked = false;
        if (supplierInoxCheckbox) supplierInoxCheckbox.checked = false;
        if (supplierSpecTrubaCheckbox) supplierSpecTrubaCheckbox.checked = false;
        applyUraltehpromPipe();
      } else {
        if (costMarkupInput) costMarkupInput.value = '0';
        if (costCuttingInput) costCuttingInput.value = '0';
        updateCostResult();
      }
    });
  }
  if (supplierSpecTrubaCheckbox) {
    supplierSpecTrubaCheckbox.addEventListener('change', function () {
      if (supplierSpecTrubaCheckbox.checked) {
        if (supplierDemidovCheckbox) supplierDemidovCheckbox.checked = false;
        if (supplierMetallotorgCheckbox) supplierMetallotorgCheckbox.checked = false;
        if (supplierStalnoyMirCheckbox) supplierStalnoyMirCheckbox.checked = false;
        if (supplierInoxCheckbox) supplierInoxCheckbox.checked = false;
        if (supplierUraltehpromCheckbox) supplierUraltehpromCheckbox.checked = false;
        applySpecTrubaPipe();
      } else {
        if (costMarkupInput) costMarkupInput.value = '0';
        if (costCuttingInput) costCuttingInput.value = '0';
        updateCostResult();
      }
    });
  }
  if (paramsContainer) {
    paramsContainer.addEventListener('input', function (e) {
      var sort = getCurrentSortament();
      if (!sort || !costCuttingInput) return;
      if (sort.id === 'circle' && (e.target.id === 'param-D')) {
        var d = parseFloat(String(e.target.value).replace(',', '.'));
        if (supplierDemidovCheckbox && supplierDemidovCheckbox.checked) {
          costCuttingInput.value = (!isNaN(d) && d > 0) ? getCuttingPriceDemidovCircles(d) : '';
        } else if (supplierMetallotorgCheckbox && supplierMetallotorgCheckbox.checked) {
          var price = (!isNaN(d) && d > 0) ? getCuttingPriceMetallotorgCircles(d) : null;
          costCuttingInput.value = price != null ? price : '';
        }
      } else if (sort.id === 'pipe_round' && (e.target.id === 'param-D' || e.target.id === 'param-S')) {
        var dInput = document.getElementById('param-D');
        var sInput = document.getElementById('param-S');
        var D = dInput ? parseFloat(String(dInput.value).replace(',', '.')) : NaN;
        var S = sInput ? parseFloat(String(sInput.value).replace(',', '.')) : NaN;
        if (supplierStalnoyMirCheckbox && supplierStalnoyMirCheckbox.checked) {
          var cuttingPrice = (!isNaN(D) && D > 0 && !isNaN(S) && S >= 0) ? getCuttingPriceStalnoyMirPipe(D, S) : null;
          costCuttingInput.value = cuttingPrice != null ? cuttingPrice : '';
        } else if (supplierInoxCheckbox && supplierInoxCheckbox.checked) {
          var inoxPrice = (!isNaN(D) && D > 0 && !isNaN(S) && S >= 0) ? getCuttingPriceInoxPipe(D, S) : null;
          costCuttingInput.value = inoxPrice != null ? inoxPrice : '';
        } else if (supplierSpecTrubaCheckbox && supplierSpecTrubaCheckbox.checked) {
          var specTonVal = (!isNaN(D) && D > 0 && !isNaN(S) && S >= 0) ? getPricePerTonSpecTrubaPipe(D, S) : null;
          if (pricePerTonInput && specTonVal != null) pricePerTonInput.value = String(specTonVal);
          var specCut = (!isNaN(D) && D > 0 && !isNaN(S) && S >= 0) ? getCuttingPriceSpecTrubaPipe(D, S) : null;
          costCuttingInput.value = specCut != null ? specCut : '';
        }
      }
      updateCostResult();
    });
  }
  [pricePerTonInput, costMarkupInput, costCuttingInput].forEach(function (el) {
    if (el) el.addEventListener('input', updateCostResult);
  });

  renderGrades();
  renderSortaments();
  renderHistory();
  toggleCostBlankPanel();
})();
