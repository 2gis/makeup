var data = {
    label: 'Простые блоки',
    items: [{
        name: 'promo',
        type: 'module',
        width: 900,
        items: [
            {
                name: 'default',
                type: 'type',
                image: 'images/_promo_type_default.png'
            },
            {
                name: 'full',
                type: 'type'
            }
        ]
    }, {
        name: 'Hello World!',
        type: 'module'
    }, {
        name: 'Блок 2',
        type: 'module'
    }, {
        name: 'makeup',
        type: 'module',
        width: 1000
    }, {
        name: 'miniCard',
        type: 'module',
        width: 400,
        styles: {
            markup: 'background: white;'
        },
        items: [{
            label: 'context',
            imagePrefix: 'images/_miniCard_type_',
            type: 'context',
            items: [{
                name: 'full'
            }, {
                name: 'adv'
            }, {
                name: 'recoveryStart',
                cls:  'ads _recovery'
            }, {
                name: 'recoveryEnd',
                cls:  'ads _recovery'
            }, {
                name: 'booklet',
                cls: '_photo'
            }, {
                name: 'discount'
            }, {
                name: 'eshop'
            }, {
                name: 'plusOne'
            }, {
                name: 'taxi',
                cls: '_photo'
            }, {
                name: 'truba'
            }, {
                name: 'place'
            }, {
                name: 'stop',
                cls: '_type_station'
            }, {
                name: 'route',
                cls: '_type_route _transportType_bus'
            }, {
                name: 'filials',
                cls: '_photo'
            }, {
                name: 'advWarning',
                cls: '_ads _advWarning',
                items: [{
                    name: 'dima'
                }]
            }]
        }]
    }]
};

var makeupCtx = {

    modifiers: {
        hiddenModule: 'makeup__module--hidden',
        hiddenModuleType: 'makeup__subnav-link--hidden',
        baron: 'makeup__aside--baron'
    },

    sidebar: {
        tooltip: 'Toggle menu',
        checked: true
    },

    search: {
        placeholder: ''
    },

    mode: {
        label: 'Mode',

        items: [
            {
                tooltip: 'Image',
                value: '1'
            },
            {
                tooltip: 'Markup',
                value: '2',
                checked: true
            },
            {
                tooltip: 'Markup and image',
                value: '3',
            },
            {
                tooltip: 'Markup and inversed image',
                value: '4',
            }
        ]
    },

    background: {
        label: 'Background',

        items: [
            {
                tooltip: 'Gray',
                value: 'color',
                checked: true
            },
            {
                tooltip: 'Transparency grid',
                value: 'transparency'
            }
        ]
    },

    transparency: {
        label: 'Transparency',

        slider: {
            min: 0,
            max: 1,
            value: 1
        }
    },

    zoom: {
        label: 'Zoom',

        slider: {
            min: 1,
            max: 4,
            value: 1
        }
    },

    ruler: {
        h: {
            type: 'ruler',
            name: 'makeup-ruler-h',

            slider: {
                min: 0,
                max: 2000,
                value: 400
            }
        },
        v: {
            type: 'ruler',
            name: 'makeup-ruler-v',

            slider: {
                min: 0,
                max: 1000,
                step: 10
            }
        }
    },

    smiley: {
        tooltip: 'Smiley styles on markup container',
        checked: false
    }
};

var promoCtx = {};

promoCtx['default'] = {
    projectDesc: 'Инструмент для приятного контроля за качеством вёрстки на веб-проектах',
    header: 'Сравните вёрстку с дизайном',
    controls: [{
        type: 'design',
        text: 'дизайн'
    }, {
        type: 'markup',
        text: 'вёрстка'
    }, {
        type: 'summary',
        text: 'сумма'
    }, {
        type: 'diff',
        text: 'разница'
    }]
};

promoCtx.full = {
    projectDesc: 'Инструмент для приятного контроля за качеством вёрстки на веб-проектах, с его помощью можно приятно контролировать качество приятной вёрстки',
    header: 'Сравните вёрстку с диваном, расскажите про покупки, про какие про покупки?',
    controls: [{
        type: 'design',
        text: 'дизайн великолепный'
    }, {
        type: 'markup',
        text: 'вёрстка тоже на высоте'
    }, {
        type: 'summary',
        text: 'сумма'
    }, {
        type: 'diff',
        text: 'разница'
    }, {
        type: 'diff',
        text: 'пятый элемент'
    }]
};


var miniCardCtx = {};

miniCardCtx.full = {
    name: 'Длинноеназваниесзабытымипробеламикотороеможетбытьиещедлиннее',
    type: 'filial',
    desc: {
        text: 'Вэтомблокедолженбытьадресдриллдайунилимаршруттранспорта',
        link: ''
    },
    showDescBlock: true,
    micro: 'Рекламныйтекстсзабытымипробеламидлярекламныхминикарточек',
    footer: true,
    attrs: [
        'Константинопольский',
        'Крестовоздвиженский',
        'Левомицетиновый',
        'Константинопольский',
        'Крестовоздвиженский',
        'Левомицетиновый'
    ],
    plusOne: '',
    plusOneCaption: 'Заказать столик',
    hasPlusOne: true,
    rating: 3,
    reviews: 19231235346,// количество отзывов на флампе
    additionalText: 'Невероятнодлинноеназваниекатегориитранспортногосредства',
    iconType: 'default', // тип булита у фирмы: 'booklet', 'photos', 'ads', 'default'
    filials: { // если у фирмы больше 1ого филиала
        id: "141274359916415", // id фирмы
        count: 26666 // количество филиалов
    },
    timeTable: { // расписание. Есть только в случае фильтрации по времени работы
        open: true, // открыто или нет на данный момент
        now: "Открытопримерносрассветаигарантированоработаетдозакатаилидопоследнегопосетителя" // текст
    },
    warning: 'Чрезмерноеупотреблениеалкоголясигаретиманнойкашивредитвашемуздоровью'
};

miniCardCtx.adv = {
    iconType: 'ads',
    name: 'Отдых, ночной клуб',
    micro: 'Ночной клуб, банкетный зал, праздничное агентство',
    type: 'filial',
    desc: {
        text: 'Богдана Хмельницкого, 19'
    },
    showDescBlock: true,
    rating: 3,
    reviews: 25,
    footer: true,
    attrs: [
        'Коктейль 200 Р.',
        'Фейсконтроль.',
        'Дресс-Код.'
    ],
    warning: 'Чрезмерное употребление алкоголя вредит вашему здоровью'
};

miniCardCtx.recoveryStart = {
    recoveryAd: true,
    recoveryHeader: true,
    advLink: {
        href: 'http://reklama.2gis.ru/?utm_source=2gis4online&utm_medium=ad_link&utm_campaign=advert_article',
        text: 'Ваша реклама в 2ГИС'
    },
    iconType: 'ads',
    name: 'СИННАБОН, кафе-пекарня',
    micro: 'Прием заказов! Доставим удовольствие на дом',
    type: 'filial',
    desc: {
        text: 'Фрунзе, 238'
    },
    showDescBlock: true,
    footer: true,
    attrs: [
        'Средний чек 280 Р',
        'Wi-Fi'
    ]
};

miniCardCtx.recoveryEnd = {
    recoveryAd: true,
    recoveryFooter: true,
    advLink: {
        href: 'http://reklama.2gis.ru/?utm_source=2gis4online&utm_medium=ad_link&utm_campaign=advert_article',
        text: 'Ваша реклама в 2ГИС'
    },
    iconType: 'ads',
    name: 'Оранжлайнс, семейный театрально_развлекательный комплекс',
    micro: 'Cемейный театрально-развлекательный комплексc',
    type: 'filial',
    desc: {
        text: 'Ветлужская, 6а'
    },
    showDescBlock: true,
    footer: true,
    attrs: [
        'Средний чек 800 Р',
        'Wi-Fi'
    ]
};

miniCardCtx.booklet = {
    iconType: 'booklet',
    photo: 'http://lorempixel.com/128/256/',
    name: 'Бавария, малоэтажный комплекс',
    micro: 'Комплексная малоэтажная кирпичная застройка.',
    type: 'filial',
    desc: {
        text: 'Краснообск, улица Восточная'
    },
    showDescBlock: true,
    footer: true,
    attrs: [
        'Квартиры 39–135 м²',
        'от 47 000 Р/м²',
        'Ипотека'
    ],
    booklet: {
        label: 'Буклет'
    },
    warning: 'Проектная декларацияна сайте bavaria54.ru. Застройщик ООО «АКД»'
};

miniCardCtx.discount = {
    iconType: 'discount',
    name: 'SunRise cafe, кафе',
    micro: 'Все наши блюда можно отведать в кафе, дома и в офисе с доставкой!',
    type: 'filial',
    desc: {
        text: 'Бердск, Ленина, 27'
    },
    showDescBlock: true,
    footer: true,
    attrs: [
        'Средний чек 500 р.',
        'Японская кухня.',
        'Европейская кухня.',
        'Бизнес-ланч.',
        'Wi-Fi.'
    ],
    discounts: {
        label: 'Посмотреть скидки'
    },
    warning: '*Подробности уточняйте по телефону 8-913-918-02-02'
};

miniCardCtx.eshop = {
    iconType: '',
    descType: 'website',
    name: 'Компания ТУРЕЦКИХ НОСКОВ И ТЕКСТИЛЯ',
    type: 'filial',
    showDescBlock: true,
    desc: {
        text: 'turkishsocks.ru',
        link: 'http://turkishsocks.ru'
    }
};

miniCardCtx.plusOne = {
    iconType: 'photos',
    name: 'Изюм, клуб',
    micro: 'Золотой стандарт европейских клубов',
    type: 'filial',
    desc: {
        text: 'Гоголя, 15'
    },
    showDescBlock: true,
    footer: true,
    attrs: [
        'Коктейль 300 Р',
        'Фейсконтроль',
        'Дресс-Код'
    ],
    plusOne: '',
    plusOneCaption: 'Заказать столик',
    hasPlusOne: true,
    rating: 3.5,
    reviews: 161,
    reviews_friends: 5,
    warning: 'Чрезмерное употребление алкоголя вредит вашему здоровью'
};

miniCardCtx.taxi = {
    iconType: 'ads',
    desc: {
        type: 'phone'
    },
    showDescBlock: true,
    name: 'Авто-плюс, автотранспортная компания',
    micro: '«Авто-плюс» вам доставит любой груз',
    type: 'filial',
    phone: {
        fade: true,
        parts: {
            visible: '222-24',
            invisible: '-22'
        }
    },
    footer: true,
    rating: 2,
    reviews: 3
};

miniCardCtx.truba = {
    name: 'Труба, джаз-клуб',
    type: 'filial',
    desc: {
        text: 'Фрунзе, 2'
    },
    showDescBlock: true,
    footer: true,
    attrs: [
        'Коктейль 350 р.',
        'Фейсконтроль.',
        'Дресс-Код.'
    ],
    rating: 4,
    reviews: 142, // количество отзывов на флампе
    iconType: 'photos', // тип булита у фирмы: 'booklet', 'photos', 'ads', 'default'
    filials: { // если у фирмы больше 1ого филиала
        id: "141274359916415", // id фирмы
        count: 3 // количество филиалов
    }
};

miniCardCtx.place = {
    name: "Юный ленинец",
    type: "geo",
    showDescBlock: true,
    desc: {
        text: "Населенный пункт, Новосибирская область"
    }
};

miniCardCtx.stop = {
    name: "Дом Ленина",
    type: "station",
    showDescBlock: true,
    desc: {
        text: "Центральный район, Новосибирск"
    },
    additionalText: 'Автобусная остановка'
};

miniCardCtx.route = {
    name: "13",
    note: '(г. Зеленоград)',
    type: "route",
    desc: {
        text: "Станция Крюково (Панфиловский проспект) → Западная"
    },
    showDescBlock: true,
    additionalText: 'Автобус',
    transportType: 'bus',
    transportColor: '#6385da'
};

miniCardCtx.filials = {
    iconType: 'booklet',
    photo: 'http://lorempixel.com/128/256/',
    name: 'Бавария, малоэтажный комплекс',
    micro: 'Комплексная малоэтажная кирпичная застройка.',
    type: 'filial',
    desc: {
        text: 'Поселок Краснообск, улица Восточная 156 корпус 7'
    },
    filials: { // если у фирмы больше 1ого филиала
        id: "141274359916415", // id фирмы
        count: 3 // количество филиалов
    },
    showDescBlock: true,
    footer: true,
    attrs: [
        'Квартиры 39–135 м²',
        'от 47 000 Р/м²',
        'Ипотека'
    ],
    booklet: {
        label: 'Буклет'
    },
    warning: 'Проектная декларацияна сайте bavaria54.ru. Застройщик ООО «АКД»'
};

miniCardCtx.advWarning = {
    iconType: 'photos',
    name: 'Форум, ресторан-бар',
    micro: 'Качественная организация вашего отдыха',
    type: 'filial',
    desc: {
        text: 'Инская, 56'
    },
    showDescBlock: true,
    showAdvWarning: true,
    footer: true,
    attrs: [
        'Средний чек 600 р.',
        'Бизнес-ланч',
        'Европейская кухня',
        'Wi-Fi'
    ],
    rating: 4,
    reviews: 28,
    reviews_friends: 5
};
