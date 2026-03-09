/**
 * Данные приложения
 * Все статические данные: университеты, программы, стипендии, практики
 */

const universities = [
    { id: 1, name: 'МГУ им. Ломоносова', location: 'Москва, Россия', programs: 45, students: 1200, image: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { id: 2, name: 'СПбГУ', location: 'Санкт-Петербург, Россия', programs: 38, students: 950, image: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { id: 3, name: 'Кыргызско-Турецкий университет "Манас"', location: 'Бишкек, Кыргызстан', programs: 25, students: 3500, image: 'linear-gradient(135deg, #e74c3c, #c0392b)', isManas: true },
    { id: 4, name: 'Национальный университет Узбекистана', location: 'Ташкент, Узбекистан', programs: 52, students: 2100, image: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { id: 5, name: 'Казахский национальный университет', location: 'Алматы, Казахстан', programs: 41, students: 1800, image: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    { id: 6, name: 'Кыргызский национальный университет', location: 'Бишкек, Кыргызстан', programs: 35, students: 1500, image: 'linear-gradient(135deg, #fa709a, #fee140)' },
    { id: 7, name: 'Таджикский национальный университет', location: 'Душанбе, Таджикистан', programs: 48, students: 1700, image: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
];

const programs = [
    // Программа ОРХУН - Кыргызско-Турецкий университет Манас
    { id: 1, university: 'Кыргызско-Турецкий университет "Манас"', title: 'Программа ОРХУН - Бакалавриат', type: 'bachelor', duration: '4 года', scholarship: 'full', amount: 'Полная стипендия', deadline: '2024-03-30', description: 'Программа обучения в лучших университетах Турции. Покрытие: обучение, проживание, питание, авиабилеты', isOrhun: true },
    { id: 2, university: 'Кыргызско-Турецкий университет "Манас"', title: 'Программа ОРХУН - Магистратура', type: 'master', duration: '2 года', scholarship: 'full', amount: 'Полная стипендия', deadline: '2024-03-30', description: 'Магистерская программа ОРХУН в университетах Турции', isOrhun: true },
    
    // Другие программы Манас в Турцию
    { id: 3, university: 'Кыргызско-Турецкий университет "Манас"', title: 'Обмен по Инженерии - Турция', type: 'exchange', duration: '1 семестр', scholarship: 'full', amount: '₺50,000', deadline: '2024-04-15', description: 'Программа обмена для студентов инженерных специальностей' },
    { id: 4, university: 'Кыргызско-Турецкий университет "Манас"', title: 'Летняя школа IT - Стамбул', type: 'summer', duration: '1 месяц', scholarship: 'partial', amount: '₺25,000', deadline: '2024-05-01', description: 'Летняя школа по информационным технологиям в Стамбуле' },
    { id: 5, university: 'Кыргызско-Турецкий университет "Манас"', title: 'Медицина - Анкара', type: 'master', duration: '2 года', scholarship: 'full', amount: 'Полная стипендия', deadline: '2024-04-20', description: 'Магистратура по медицине в университетах Турции' },
    
    // Остальные программы
    { id: 6, university: 'Национальный университет Узбекистана', title: 'Программа обмена по Computer Science', type: 'exchange', duration: '1 семестр', scholarship: 'full', amount: '$5,000', deadline: '2024-03-15', description: 'Полная стипендия на обучение' },
    { id: 7, university: 'Казахский национальный университет', title: 'Магистерская программа по AI', type: 'master', duration: '2 года', scholarship: 'full', amount: '$8,000', deadline: '2024-02-28', description: 'Полная стипендия включая проживание' },
    { id: 8, university: 'МГУ им. Ломоносова', title: 'Летняя школа по физике', type: 'summer', duration: '1 месяц', scholarship: 'partial', amount: '₽50,000', deadline: '2024-04-01', description: 'Частичная стипендия' },
    { id: 9, university: 'Кыргызский национальный университет', title: 'Исследовательская практика', type: 'internship', duration: '6 месяцев', scholarship: 'full', amount: '$3,000', deadline: '2024-03-20', description: 'Стипендия для исследователей' },
    { id: 10, university: 'СПбГУ', title: 'Программа обмена гуманитарные науки', type: 'exchange', duration: '1 семестр', scholarship: 'none', amount: '—', deadline: '2024-05-01', description: 'Без стипендии' },
];

const scholarships = [
    // Стипендии ОРХУН
    {
        id: 1,
        name: 'Стипендия ОРХУН - Бакалавриат',
        provider: 'Кыргызско-Турецкий университет "Манас"',
        country: 'Турция',
        city: 'Стамбул, Анкара, Измир',
        type: 'full',
        amount: 'Полная',
        level: ['bachelor'],
        duration: '4 года',
        deadline: '2024-03-30',
        coverage: ['Обучение', 'Проживание', 'Питание', 'Авиабилеты', 'Стипендия'],
        criteria: [
            'Средний балл не менее 4.0 из 5.0',
            'Возраст до 22 лет',
            'Владение турецким или английским языком',
            'Гражданство Кыргызской Республики',
            'Завершение 1-2 курса бакалавриата'
        ],
        requirements: [
            'Заполненная анкета',
            'Академическая справка',
            'Рекомендательное письмо',
            'Мотивационное письмо',
            'Копия паспорта',
            'Фотографии 3x4'
        ],
        description: 'Грант Правительства Турции для обучения в лучших турецких университетах. Покрывает полную стоимость обучения и проживание.',
        eligible: 'Студенты бакалавриата из Кыргызстана',
        benefits: ['Бесплатное обучение', 'Проживание в общежитии', 'Ежемесячная стипендия', 'Авиабилеты туда-обратно', 'Медицинская страховка'],
        isOrhun: true,
        stats: { applications: 156, seats: 45, deadline: '30 марта 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 32, percent: 35 },
            { range: '4.5 - 4.7', count: 48, percent: 45 },
            { range: '4.0 - 4.4', count: 21, percent: 20 }
        ],
        recentApplicants: [
            { name: 'Айнура', gpa: 4.9 },
            { name: 'Бектур', gpa: 4.8 },
            { name: 'Чынгыз', gpa: 4.7 },
            { name: 'Элиза', gpa: 4.9 }
        ]
    },
    {
        id: 2,
        name: 'Стипендия ОРХУН - Магистратура',
        provider: 'Кыргызско-Турецкий университет "Манас"',
        country: 'Турция',
        city: 'Стамбул, Анкара',
        type: 'full',
        amount: 'Полная',
        level: ['master'],
        duration: '2 года',
        deadline: '2024-03-30',
        coverage: ['Обучение', 'Проживание', 'Питание', 'Авиабилеты', 'Стипендия'],
        criteria: [
            'Диплом бакалавра с отличием',
            'Возраст до 28 лет',
            'IELTS 6.0+ или турецкий B1+',
            'Гражданство Кыргызской Республики',
            'Опыт исследовательской работы'
        ],
        requirements: [
            'Диплом бакалавра',
            'Академическая справка',
            'Исследовательское предложение',
            'Рекомендательные письма (2)',
            'Сертификат языка'
        ],
        description: 'Грант для магистратуры в ведущих университетах Турции по программе ОРХУН.',
        eligible: 'Выпускники бакалавриата из Кыргызстана',
        benefits: ['Бесплатное обучение', 'Проживание', 'Стипендия $500/мес', 'Авиабилеты', 'Медицина'],
        isOrhun: true,
        stats: { applications: 89, seats: 20, deadline: '30 марта 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 28, percent: 40 },
            { range: '4.5 - 4.7', count: 35, percent: 50 },
            { range: '4.0 - 4.4', count: 7, percent: 10 }
        ],
        recentApplicants: [
            { name: 'Асель', gpa: 4.9 },
            { name: 'Дастан', gpa: 4.7 },
            { name: 'Мира', gpa: 4.8 }
        ]
    },
    {
        id: 3,
        name: 'Стипендия Манас - Турция',
        provider: 'Кыргызско-Турецкий университет "Манас"',
        country: 'Турция',
        city: 'Бишкек - Анкара',
        type: 'full',
        amount: '$15,000/год',
        level: ['bachelor', 'master'],
        duration: '1 год',
        deadline: '2024-04-15',
        coverage: ['Обучение', 'Проживание'],
        criteria: [
            'Средний балл 4.2+',
            'Владение турецким языком',
            'Рекомендация от университета'
        ],
        requirements: [
            'Заявление',
            'Справка с места учебы',
            'Сертификат турецкого языка'
        ],
        description: 'Стипендия для студентов университета Манас, желающих обучаться в Турции.',
        eligible: 'Студенты КТУ Манас',
        benefits: ['Покрытие tuition', 'Проживание'],
        isOrhun: true,
        stats: { applications: 45, seats: 15, deadline: '15 апреля 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 10, percent: 30 },
            { range: '4.5 - 4.7', count: 18, percent: 55 },
            { range: '4.0 - 4.4', count: 5, percent: 15 }
        ],
        recentApplicants: [
            { name: 'Нурлан', gpa: 4.6 },
            { name: 'Эрмек', gpa: 4.5 }
        ]
    },
    {
        id: 4,
        name: 'Президентская стипендия Узбекистана',
        provider: 'Министерство высшего образования РУз',
        country: 'Узбекистан',
        city: 'Ташкент',
        type: 'full',
        amount: '$3,000/год',
        level: ['bachelor', 'master'],
        duration: '1 год (с продлением)',
        deadline: '2024-03-15',
        coverage: ['Обучение', 'Проживание', 'Стипендия'],
        criteria: [
            'Средний балл не менее 4.5 из 5.0',
            'Возраст до 25 лет',
            'Владение английским языком (IELTS 6.0+)',
            'Отсутствие академических задолженностей',
            'Общественная деятельность'
        ],
        requirements: [
            'Заполненная анкета',
            'Академическая справка',
            'Рекомендательное письмо',
            'Мотивационное письмо',
            'Копия паспорта',
            'Фотографии 3x4'
        ],
        description: 'Президентская стипендия для талантливых студентов Узбекистана, обучающихся в ведущих университетах страны.',
        eligible: 'Граждане Узбекистана, студенты бакалавриата и магистратуры',
        benefits: ['Полное покрытие обучения', 'Ежемесячная стипендия', 'Проживание в общежитии', 'Медицинская страховка'],
        stats: { applications: 234, seats: 50, deadline: '15 марта 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 45, percent: 38 },
            { range: '4.5 - 4.7', count: 52, percent: 44 },
            { range: '4.0 - 4.4', count: 21, percent: 18 }
        ],
        recentApplicants: [
            { name: 'Азим', gpa: 4.9 },
            { name: 'Фаррух', gpa: 4.7 },
            { name: 'Нигора', gpa: 4.8 }
        ]
    },
    {
        id: 5,
        name: 'Стипендия имени Аль-Фараби',
        provider: 'Казахский национальный университет',
        country: 'Казахстан',
        city: 'Алматы',
        type: 'full',
        amount: '$5,000/год',
        level: ['master', 'phd'],
        duration: '2 года',
        deadline: '2024-04-01',
        coverage: ['Обучение', 'Проживание', 'Стипендия'],
        criteria: [
            'Диплом с отличием',
            'Публикации в научных журналах',
            'Владение казахским или русским языком',
            'Возраст до 30 лет для магистратуры',
            'Рекомендация научного руководителя'
        ],
        requirements: [
            'Заявление на стипендию',
            'Диплом и приложение',
            'Список публикаций',
            'Исследовательский proposal',
            'Рекомендательные письма'
        ],
        description: 'Престижная стипендия для магистрантов и аспирантов Казахского национального университета.',
        eligible: 'Студенты магистратуры и аспирантуры КазНУ',
        benefits: ['Полное покрытие tuition', 'Стипендия $500/мес', 'Общежитие', 'Доступ к лабораториям'],
        stats: { applications: 128, seats: 30, deadline: '1 апреля 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 38, percent: 45 },
            { range: '4.5 - 4.7', count: 32, percent: 40 },
            { range: '4.0 - 4.4', count: 14, percent: 15 }
        ],
        recentApplicants: [
            { name: 'Айгуль', gpa: 4.9 },
            { name: 'Ерлан', gpa: 4.6 },
            { name: 'Динара', gpa: 4.8 }
        ]
    },
    {
        id: 6,
        name: 'Грант "Болашак"',
        provider: 'Фонд "Болашак"',
        country: 'Казахстан',
        city: 'Астана',
        type: 'full',
        amount: '$25,000/год',
        level: ['master', 'phd'],
        duration: 'До 5 лет',
        deadline: '2024-02-28',
        coverage: ['Обучение', 'Проживание', 'Перелет', 'Стипендия'],
        criteria: [
            'Гражданство Казахстана',
            'Возраст до 30 лет',
            'Бакалавриат с отличием',
            'IELTS 6.5+',
            'Опыт работы от 1 года',
            'Лидерские качества'
        ],
        requirements: [
            'Анкета установленного образца',
            'Диплом бакалавра',
            'Сертификат IELTS/TOEFL',
            'Мотивационное эссе',
            'Рекомендации',
            'CV'
        ],
        description: 'Грант правительства Казахстана на обучение в лучших университетах мира.',
        eligible: 'Граждане Казахстана для обучения за рубежом',
        benefits: ['Полное обучение в топ-вузах', 'Стипендия', 'Проживание', 'Авиабилеты', 'Медицина'],
        stats: { applications: 312, seats: 100, deadline: '28 февраля 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 95, percent: 48 },
            { range: '4.5 - 4.7', count: 68, percent: 35 },
            { range: '4.0 - 4.4', count: 35, percent: 17 }
        ],
        recentApplicants: [
            { name: 'Нурсултан', gpa: 4.9 },
            { name: 'Алия', gpa: 4.8 },
            { name: 'Тимур', gpa: 4.7 },
            { name: 'Гульнара', gpa: 4.9 }
        ]
    },
    {
        id: 7,
        name: 'Стипендия Кыргызской Республики',
        provider: 'Министерство образования КР',
        country: 'Кыргызстан',
        city: 'Бишкек',
        type: 'partial',
        amount: '$1,500/год',
        level: ['bachelor', 'master'],
        duration: '1 год',
        deadline: '2024-05-15',
        coverage: ['Стипендия'],
        criteria: [
            'Успеваемость 4.0+ из 5.0',
            'Отсутствие оценок "3"',
            'Активное участие в общественной жизни',
            'Возраст до 24 лет'
        ],
        requirements: [
            'Заявление',
            'Справка с места учебы',
            'Характеристика',
            'Копия паспорта'
        ],
        description: 'Государственная стипендия для студентов кыргызских вузов с отличной успеваемостью.',
        eligible: 'Студенты государственных вузов Кыргызстана',
        benefits: ['Ежемесячная стипендия', 'Приоритет при обмене'],
        stats: { applications: 567, seats: 200, deadline: '15 мая 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 85, percent: 25 },
            { range: '4.5 - 4.7', count: 145, percent: 43 },
            { range: '4.0 - 4.4', count: 108, percent: 32 }
        ],
        recentApplicants: [
            { name: 'Бектур', gpa: 4.5 },
            { name: 'Айнура', gpa: 4.6 },
            { name: 'Дастан', gpa: 4.4 }
        ]
    },
    {
        id: 8,
        name: 'Стипендия Таджикистана',
        provider: 'Таджикский национальный университет',
        country: 'Таджикистан',
        city: 'Душанбе',
        type: 'partial',
        amount: '$800/год',
        level: ['bachelor'],
        duration: '4 года',
        deadline: '2024-06-01',
        coverage: ['Стипендия'],
        criteria: [
            'Средний балл 4.2+',
            'Активное участие в олимпиадах',
            'Волонтёрская деятельность',
            'Рекомендация декана'
        ],
        requirements: [
            'Справка об успеваемости',
            'Копия дипломов олимпиад',
            'Характеристика с места учебы'
        ],
        description: 'Региональная стипендия для абитуриентов и студентов Таджикского национального университета.',
        eligible: 'Студенты бакалавриата ТНУ',
        benefits: ['Ежемесячная стипендия', 'Скидка на питание'],
        stats: { applications: 189, seats: 75, deadline: '1 июня 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 28, percent: 25 },
            { range: '4.5 - 4.7', count: 52, percent: 45 },
            { range: '4.0 - 4.4', count: 35, percent: 30 }
        ],
        recentApplicants: [
            { name: 'Фаррух', gpa: 4.5 },
            { name: 'Самира', gpa: 4.3 }
        ]
    },
    {
        id: 9,
        name: 'Грант Эрдогана',
        provider: 'Правительство Турции',
        country: 'Турция',
        city: 'Анкара',
        type: 'full',
        amount: '₺80,000/год',
        level: ['bachelor', 'master', 'phd'],
        duration: 'До 5 лет',
        deadline: '2024-03-20',
        coverage: ['Обучение', 'Проживание', 'Стипендия', 'Перелет'],
        criteria: [
            'Возраст до 25 (бакалавр), до 30 (магистр), до 35 (аспирант)',
            'Средний балл 70%+',
            'Медицинская справка',
            'Без судимости'
        ],
        requirements: [
            'Online заявка',
            'Диплом/аттестат',
            'Паспорт',
            'Фото',
            'Справка о зачислении'
        ],
        description: 'Правительственный грант Турции для иностранных студентов.',
        eligible: 'Граждане всех стран',
        benefits: ['Бесплатное обучение', 'Ежемесячная стипендия', 'Общежитие', 'Медицина'],
        stats: { applications: 445, seats: 80, deadline: '20 марта 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 89, percent: 32 },
            { range: '4.5 - 4.7', count: 156, percent: 45 },
            { range: '4.0 - 4.4', count: 102, percent: 23 }
        ],
        recentApplicants: [
            { name: 'Мехмет', gpa: 4.8 },
            { name: 'Ахмед', gpa: 4.6 },
            { name: 'Фатима', gpa: 4.7 },
            { name: 'Али', gpa: 4.5 }
        ]
    },
    {
        id: 10,
        name: 'Стипендия Правительства РФ',
        provider: 'Правительство России',
        country: 'Россия',
        city: 'Москва',
        type: 'full',
        amount: '₽150,000/год',
        level: ['bachelor', 'master', 'phd'],
        duration: '1 год',
        deadline: '2024-04-15',
        coverage: ['Обучение', 'Стипендия'],
        criteria: [
            'Гражданство СНГ',
            'Отличная успеваемость',
            'Владение русским языком',
            'Активная научная деятельность'
        ],
        requirements: [
            'Заявление',
            'Справка из вуза',
            'Дипломы и сертификаты',
            'Рекомендации'
        ],
        description: 'Стипендия Правительства РФ для иностранных студентов.',
        eligible: 'Иностранные граждане - студенты российских вузов',
        benefits: ['Покрытие tuition', 'Ежемесячная стипендия', 'Социальные льготы'],
        stats: { applications: 378, seats: 120, deadline: '15 апреля 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 72, percent: 30 },
            { range: '4.5 - 4.7', count: 95, percent: 40 },
            { range: '4.0 - 4.4', count: 68, percent: 30 }
        ],
        recentApplicants: [
            { name: 'Мария', gpa: 4.9 },
            { name: 'Иван', gpa: 4.7 },
            { name: 'Анна', gpa: 4.8 }
        ]
    },
    {
        id: 11,
        name: 'Грант на исследования CA',
        provider: 'Центральноазиатский фонд развития',
        country: 'Узбекистан',
        city: 'Ташкент',
        type: 'grant',
        amount: '$10,000',
        level: ['phd'],
        duration: '1-2 года',
        deadline: '2024-03-01',
        coverage: ['Исследования', 'Оборудование'],
        criteria: [
            'Кандидат наук или аспирант',
            'Исследовательский проект',
            'Научный руководитель из вуза',
            'Инновационность проекта'
        ],
        requirements: [
            'Исследовательский проект',
            'Смета расходов',
            'CV исследователя',
            'Рекомендации научного руководителя'
        ],
        description: 'Грант для поддержки научных исследований в области экономики, экологии и технологий ЦА.',
        eligible: 'Аспиранты и молодые ученые ЦА',
        benefits: ['Финансирование проекта', 'Доступ к оборудованию', 'Менторство'],
        stats: { applications: 67, seats: 15, deadline: '1 марта 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 18, percent: 40 },
            { range: '4.5 - 4.7', count: 22, percent: 50 },
            { range: '4.0 - 4.4', count: 5, percent: 10 }
        ],
        recentApplicants: [
            { name: 'Шерзод', gpa: 4.8 },
            { name: 'Зухра', gpa: 4.6 }
        ]
    }
];

const internships = [
    { 
        id: 1, 
        company: 'Яндекс', 
        title: 'Практика Software Engineering', 
        location: 'remote', 
        paid: true, 
        salary: '₽120,000/мес', 
        duration: '3 месяца', 
        description: 'Удалённая практика в крупнейшей технологической компании России. Работа над реальными проектами с ментором.',
        requirements: ['Знание Python/Java', 'Git', 'SQL', 'Английский B1+'],
        stats: { applications: 234, seats: 25, deadline: '15 марта 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 45, percent: 32 },
            { range: '4.5 - 4.7', count: 68, percent: 45 },
            { range: '4.0 - 4.4', count: 35, percent: 23 }
        ],
        recentApplicants: [
            { name: 'Алексей', gpa: 4.8 },
            { name: 'Мария', gpa: 4.7 },
            { name: 'Игорь', gpa: 4.6 }
        ]
    },
    { 
        id: 2, 
        company: 'Kaspi.kz', 
        title: 'Практика Data Science', 
        location: 'onsite', 
        paid: true, 
        salary: '₽150,000/мес', 
        duration: '6 месяцев', 
        description: 'Офис в Алматы. Работа с большими данными и ML моделями в финтех компании.',
        requirements: ['Python', 'Machine Learning', 'SQL', 'Статистика'],
        stats: { applications: 189, seats: 15, deadline: '1 апреля 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 52, percent: 42 },
            { range: '4.5 - 4.7', count: 48, percent: 38 },
            { range: '4.0 - 4.4', count: 25, percent: 20 }
        ],
        recentApplicants: [
            { name: 'Нурлан', gpa: 4.9 },
            { name: 'Айгуль', gpa: 4.8 },
            { name: 'Ерлан', gpa: 4.7 }
        ]
    },
    { 
        id: 3, 
        company: 'UZTELECOM', 
        title: 'Практика UI/UX Design', 
        location: 'onsite', 
        paid: true, 
        salary: '₽80,000/мес', 
        duration: '4 месяца', 
        description: 'Ташкент. Дизайн интерфейсов для телеком продуктов.',
        requirements: ['Figma', 'Adobe XD', 'Портфолио', 'Основы UX'],
        stats: { applications: 156, seats: 10, deadline: '20 марта 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 28, percent: 28 },
            { range: '4.5 - 4.7', count: 45, percent: 45 },
            { range: '4.0 - 4.4', count: 27, percent: 27 }
        ],
        recentApplicants: [
            { name: 'Фаррух', gpa: 4.6 },
            { name: 'Нигора', gpa: 4.5 }
        ]
    },
    { 
        id: 4, 
        company: 'Сбербанк', 
        title: 'Практика Operations', 
        location: 'remote', 
        paid: true, 
        salary: '₽100,000/мес', 
        duration: '3 месяца', 
        description: 'Удалённо. Оптимизация бизнес-процессов в крупнейшем банке России.',
        requirements: ['Аналитическое мышление', 'Excel', 'Power BI', 'SQL'],
        stats: { applications: 312, seats: 30, deadline: '10 марта 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 62, percent: 30 },
            { range: '4.5 - 4.7', count: 95, percent: 45 },
            { range: '4.0 - 4.4', count: 55, percent: 25 }
        ],
        recentApplicants: [
            { name: 'Дмитрий', gpa: 4.7 },
            { name: 'Анна', gpa: 4.6 },
            { name: 'Сергей', gpa: 4.5 }
        ]
    },
    { 
        id: 5, 
        company: 'Kloop Media', 
        title: 'Практика Journalism', 
        location: 'onsite', 
        paid: true, 
        salary: '₽50,000/мес', 
        duration: '6 месяцев', 
        description: 'Бишкек. Журналистика и медиа в независимом медиа Кыргызстана.',
        requirements: ['Навыки интервью', 'Написание статей', 'Соцсети', 'Кыргызский/Русский'],
        stats: { applications: 78, seats: 8, deadline: '1 мая 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 15, percent: 28 },
            { range: '4.5 - 4.7', count: 25, percent: 45 },
            { range: '4.0 - 4.4', count: 15, percent: 27 }
        ],
        recentApplicants: [
            { name: 'Бектур', gpa: 4.5 },
            { name: 'Айнура', gpa: 4.4 }
        ]
    },
    { 
        id: 6, 
        company: 'Mover', 
        title: 'Практика Marketing', 
        location: 'remote', 
        paid: false, 
        salary: '—', 
        duration: '2 месяца', 
        description: 'Без оплаты. Стажировка в маркетинговом агентстве с возможностью трудоустройства.',
        requirements: ['SMM', 'Контент', 'Креативность', 'Соцсети'],
        stats: { applications: 145, seats: 20, deadline: '15 апреля 2024' },
        rating: [
            { range: '4.8 - 5.0', count: 20, percent: 22 },
            { range: '4.5 - 4.7', count: 45, percent: 38 },
            { range: '4.0 - 4.4', count: 35, percent: 40 }
        ],
        recentApplicants: [
            { name: 'Элиза', gpa: 4.4 },
            { name: 'Чынгыз', gpa: 4.3 }
        ]
    },
];

// Экспорт данных
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { universities, programs, scholarships, internships };
}
