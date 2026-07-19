let gameData = {
    coins: 0,
    collection: []
};

function loadGame() {
    const saved = localStorage.getItem('cardCollectorGame');
    if (saved) {
        gameData = JSON.parse(saved);
        if (typeof gameData.legendaryReceived !== 'number') gameData.legendaryReceived = 0;
        if (typeof gameData.totalSellAmount !== 'number') gameData.totalSellAmount = 0;
    }
}

function saveGame() {
    localStorage.setItem('cardCollectorGame', JSON.stringify(gameData));
}

const CARD_TYPES = [
    { type: 'retail', emoji: '🏬', names: [
        'Магазин одежды', 'Супермаркет', 'Электроника', 'Книжный магазин', 'Ювелирный', 'Магазин игрушек', 'Магазин обуви', 'Магазин техники', 'Магазин подарков', 'Магазин антиквариата', 'Магазин цветов', 'Магазин часов', 'Магазин аксессуаров', 'Магазин косметики', 'Магазин мебели', 'Магазин бытовой химии', 'Магазин спортивных товаров', 'Магазин канцтоваров', 'Магазин музыкальных инструментов', 'Магазин комиксов', 'Магазин настольных игр', 'Магазин товаров для дома', 'Магазин электроинструментов', 'Магазин рыболовных товаров', 'Магазин автозапчастей', 'Магазин товаров для животных', 'Магазин подарочных сертификатов', 'Магазин винтажных вещей', 'Магазин товаров для творчества', 'Магазин туристического снаряжения', 'Магазин товаров для сада'] },
    { type: 'food', emoji: '🍔', names: [
        'Кафе', 'Пиццерия', 'Ресторан', 'Кофейня', 'Бургерная', 'Суши-бар', 'Столовая', 'Пекарня', 'Кондитерская', 'Фудтрак', 'Молочная лавка', 'Винный бар', 'Чайная', 'Гастробар', 'Шоколадница', 'Пельменная', 'Блинная', 'Пицца-экспресс', 'Стейк-хаус', 'Веган-кафе', 'Пельменная', 'Пицца-бар', 'Смузи-бар', 'Сыроварня', 'Пивной ресторан', 'Ресторан морепродуктов', 'Пицца-студия', 'Кофейный островок', 'Фалафельная', 'Пекарня-кондитерская'] },
    { type: 'tech', emoji: '💻', names: [
        'IT-стартап', 'Хостинг', 'Разработка игр', 'Онлайн-сервис', 'Робототехника', 'VR-студия', 'Киберспорт', 'AI-лаборатория', 'Технопарк', 'Блокчейн-компания', 'Космический стартап', '3D-печать', 'Квантовые вычисления', 'Стартап по кибербезопасности', 'Облачные вычисления', 'Разработка мобильных приложений', 'Стартап по Big Data', 'Стартап по IoT', 'Стартап по AR', 'Стартап по SaaS', 'Стартап по EdTech', 'Стартап по MedTech', 'Стартап по FinTech', 'Стартап по GreenTech', 'Стартап по GovTech', 'Стартап по FoodTech', 'Стартап по MarTech', 'Стартап по LegalTech', 'Стартап по PropTech', 'Стартап по InsurTech'] },
    { type: 'industry', emoji: '🏭', names: [
        'Фабрика мебели', 'Завод игрушек', 'Пекарня', 'Типография', 'Металлургия', 'Химзавод', 'Текстильная фабрика', 'Автозавод', 'Электрозавод', 'Фармацевтика', 'Завод пластмасс', 'Завод электроники', 'Завод напитков', 'Завод бумаги', 'Завод упаковки', 'Завод бытовой техники', 'Завод строительных материалов', 'Завод керамики', 'Завод стекла', 'Завод металлоконструкций', 'Завод мебели', 'Завод игрушек', 'Завод спортивного инвентаря', 'Завод текстиля', 'Завод обуви', 'Завод одежды', 'Завод автозапчастей', 'Завод химреактивов', 'Завод удобрений', 'Завод красок'] },
    { type: 'transport', emoji: '🚚', names: [
        'Такси', 'Доставка еды', 'Логистика', 'Автосервис', 'Авиалинии', 'ЖД перевозки', 'Метро', 'Велопрокат', 'Каршеринг', 'Порт', 'Космопорт', 'Автобусный парк', 'Туристический автобус', 'Служба эвакуации', 'Прокат электросамокатов', 'Прокат автомобилей', 'Прокат велосипедов', 'Прокат катеров', 'Прокат квадроциклов', 'Прокат снегоходов', 'Прокат яхт', 'Прокат скутеров', 'Прокат мотоциклов', 'Прокат грузовиков', 'Прокат автобусов', 'Прокат лимузинов', 'Прокат фургонов', 'Прокат электровелосипедов', 'Прокат электрокаров', 'Прокат электроскутеров'] },
    { type: 'finance', emoji: '💰', names: [
        'Банк', 'Страховая', 'Инвестфонд', 'Микрокредит', 'Криптобиржа', 'Ломбард', 'Платёжная система', 'Финтех', 'Брокер', 'Казначейство', 'Фондовый рынок', 'Краудфандинг', 'Платёжный агрегатор', 'Обмен валют', 'Кредитный союз', 'Пенсионный фонд', 'Лизинговая компания', 'Факторинговая компания', 'Ипотечная компания', 'Инвестиционный клуб', 'Финансовый супермаркет', 'Финансовый консультант', 'Финансовый брокер', 'Финансовый аналитик', 'Финансовый советник', 'Финансовый управляющий', 'Финансовый директор', 'Финансовый контролёр', 'Финансовый аудитор', 'Финансовый планировщик'] },
    { type: 'sport', emoji: '🏟️', names: [
        'Футбольный клуб', 'Баскетбольная команда', 'Фитнес-центр', 'Стадион', 'Теннисный клуб', 'Плавательный бассейн', 'Гольф-клуб', 'Спортшкола', 'Хоккейный клуб', 'Йога-студия', 'Боксёрский клуб', 'Скалодром', 'Танцевальная студия', 'Клуб единоборств', 'Клуб настольного тенниса', 'Клуб бадминтона', 'Клуб сквоша', 'Клуб регби', 'Клуб бейсбола', 'Клуб американского футбола', 'Клуб волейбола', 'Клуб гандбола', 'Клуб водного поло', 'Клуб синхронного плавания', 'Клуб художественной гимнастики', 'Клуб фигурного катания', 'Клуб керлинга', 'Клуб биатлона', 'Клуб лыжного спорта', 'Клуб сноуборда'] },
    { type: 'medicine', emoji: '🏥', names: [
        'Больница', 'Клиника', 'Аптека', 'Стоматология', 'Ветеринария', 'Лаборатория', 'Санаторий', 'Диагностический центр', 'Реабилитационный центр', 'Офтальмология', 'Медицинский центр', 'Скорая помощь', 'Косметологическая клиника', 'Диализный центр', 'Кардиологический центр', 'Онкологический центр', 'Психологический центр', 'Психиатрическая клиника', 'Реанимация', 'Травмпункт', 'Родильный дом', 'Детская поликлиника', 'Гериатрический центр', 'Инфекционная больница', 'Тубдиспансер', 'Диспансер', 'Стоматологическая поликлиника', 'Ортопедический центр', 'Офтальмологическая клиника', 'ЛОР-клиника'] },
    { type: 'education', emoji: '🎓', names: [
        'Школа', 'Университет', 'Колледж', 'Детский сад', 'Онлайн-курсы', 'Языковая школа', 'Тренинговый центр', 'Академия искусств', 'Музыкальная школа', 'Техникум', 'Школа программирования', 'Бизнес-школа', 'Центр дополнительного образования', 'Школа иностранных языков', 'Школа робототехники', 'Школа искусств', 'Школа дизайна', 'Школа фотографии', 'Школа танцев', 'Школа вокала', 'Школа шахмат', 'Школа математики', 'Школа физики', 'Школа химии', 'Школа биологии', 'Школа истории', 'Школа географии', 'Школа литературы', 'Школа журналистики', 'Школа экономики'] },
    { type: 'entertainment', emoji: '🎡', names: [
        'Кинотеатр', 'Театр', 'Парк аттракционов', 'Клуб', 'Караоке', 'Музей', 'Галерея', 'Квест-комната', 'Цирк', 'Планетарий', 'Боулинг', 'Бильярдная', 'Лазертаг', 'Пейнтбол', 'Каток', 'Зоопарк', 'Дельфинарий', 'Аквапарк', 'Парк развлечений', 'Парк динозавров', 'Парк миниатюр', 'Парк скульптур', 'Парк бабочек', 'Парк птиц', 'Парк рептилий', 'Парк экзотических животных', 'Парк тропических растений', 'Парк водопадов', 'Парк фонтанов', 'Парк лабиринтов'] },
    { type: 'construction', emoji: '🏗️', names: [
        'Строительная компания', 'Архитектурное бюро', 'Девелопер', 'Ремонтная фирма', 'Проектный институт', 'Инжиниринг', 'Дорожное строительство', 'Ландшафтный дизайн', 'Производство стройматериалов', 'Проектирование мостов', 'Строительство коттеджей', 'Строительство небоскрёбов', 'Строительство мостов', 'Строительство тоннелей', 'Строительство дорог', 'Строительство аэропортов', 'Строительство портов', 'Строительство стадионов', 'Строительство бассейнов', 'Строительство парков', 'Строительство школ', 'Строительство больниц', 'Строительство театров', 'Строительство музеев', 'Строительство галерей', 'Строительство библиотек', 'Строительство спорткомплексов', 'Строительство торговых центров', 'Строительство бизнес-центров', 'Строительство жилых комплексов'] },
    { type: 'energy', emoji: '⚡', names: [
        'Электростанция', 'Солнечная ферма', 'Ветряная электростанция', 'Гидроэлектростанция', 'Нефтяная компания', 'Газовая компания', 'Атомная станция', 'Биоэнергетика', 'Теплоэлектростанция', 'Геотермальная станция', 'Водородная станция', 'Торфяная электростанция', 'ТЭС', 'ГЭС', 'АЭС', 'ВЭС', 'СЭС', 'Биогазовая станция', 'Станция накопления энергии', 'Станция распределения энергии', 'Станция передачи энергии', 'Станция хранения энергии', 'Станция преобразования энергии', 'Станция утилизации энергии', 'Станция генерации энергии', 'Станция распределения электроэнергии', 'Станция передачи электроэнергии', 'Станция хранения электроэнергии', 'Станция преобразования электроэнергии', 'Станция утилизации электроэнергии'] },
    { type: 'media', emoji: '📺', names: [
        'Телеканал', 'Радиостанция', 'Газета', 'Журнал', 'Интернет-портал', 'PR-агентство', 'Издательство', 'Киностудия', 'Рекламное агентство', 'Подкаст-студия', 'Медиа-холдинг', 'Новостной портал', 'Информационное агентство', 'Видеостудия', 'Анимационная студия', 'Фотостудия', 'Музыкальный лейбл', 'Радио-шоу', 'Телешоу', 'Видеоблог', 'Интернет-радио', 'Интернет-ТВ', 'Интернет-журнал', 'Интернет-газета', 'Интернет-издательство', 'Интернет-киностудия', 'Интернет-рекламное агентство', 'Интернет-подкаст', 'Интернет-медиа', 'Интернет-холдинг'] },
    { type: 'fashion', emoji: '👗', names: [
        'Бутик моды', 'Дизайнерское ателье', 'Модельное агентство', 'Модный дом', 'Шоурум', 'Бренд одежды', 'Салон красоты', 'Парикмахерская', 'Магазин обуви', 'Спа-салон', 'Бутик аксессуаров', 'Бутик сумок', 'Бутик часов', 'Бутик ювелирных изделий', 'Бутик парфюмерии', 'Бутик косметики', 'Бутик нижнего белья', 'Бутик купальников', 'Бутик одежды для дома', 'Бутик одежды для спорта', 'Бутик одежды для детей', 'Бутик одежды для мужчин', 'Бутик одежды для женщин', 'Бутик одежды для подростков', 'Бутик одежды для малышей', 'Бутик одежды для новорождённых', 'Бутик одежды для беременных', 'Бутик одежды для кормящих', 'Бутик одежды для полных', 'Бутик одежды для высоких'] },
    { type: 'tourism', emoji: '🗺️', names: [
        'Турфирма', 'Гостиница', 'Хостел', 'Экскурсионное бюро', 'Кемпинг', 'Спа-отель', 'Пансионат', 'Глэмпинг', 'Туристический лагерь', 'Туристический центр', 'Туристический клуб', 'Туристический офис', 'Туристический магазин', 'Туристический павильон', 'Туристический киоск', 'Туристический автобус', 'Туристический поезд', 'Туристический теплоход', 'Туристический самолёт', 'Туристический вертолёт', 'Туристический катер', 'Туристический паром', 'Туристический лайнер', 'Туристический яхт-клуб', 'Туристический кемпинг', 'Туристический глэмпинг', 'Туристический парк', 'Туристический маршрут'] },
    { type: 'art', emoji: '🎨', names: [
        'Художественная галерея', 'Арт-студия', 'Мастерская', 'Арт-кафе', 'Фотостудия', 'Театр кукол', 'Керамическая мастерская', 'Школа живописи', 'Гончарная мастерская', 'Мастерская скульптуры', 'Мастерская графики', 'Мастерская фотографии', 'Мастерская дизайна', 'Мастерская архитектуры', 'Мастерская ювелирных изделий', 'Мастерская текстиля', 'Мастерская керамики', 'Мастерская стекла', 'Мастерская дерева', 'Мастерская металла', 'Мастерская кожи', 'Мастерская бумаги', 'Мастерская пластика', 'Мастерская эмали', 'Мастерская мозаики', 'Мастерская витража', 'Мастерская росписи', 'Мастерская резьбы', 'Мастерская чеканки', 'Мастерская гравировки'] },
    { type: 'science', emoji: '🔬', names: [
        'Лаборатория', 'Научный центр', 'Исследовательский институт', 'Обсерватория', 'Биотех-компания', 'Технопарк', 'Физическая лаборатория', 'Химическая лаборатория', 'Биологическая лаборатория', 'Генетическая лаборатория', 'Астрономическая лаборатория', 'Медицинская лаборатория', 'Экологическая лаборатория', 'Инженерная лаборатория', 'Компьютерная лаборатория', 'Радиолаборатория', 'Лаборатория материаловедения', 'Лаборатория нанотехнологий', 'Лаборатория робототехники', 'Лаборатория искусственного интеллекта', 'Лаборатория биоинформатики', 'Лаборатория биомедицины', 'Лаборатория биофизики', 'Лаборатория биохимии', 'Лаборатория биотехнологий', 'Лаборатория биомеханики', 'Лаборатория биоматериалов', 'Лаборатория биомолекул', 'Лаборатория биомолекулярной инженерии'] },
    { type: 'nature', emoji: '🌳', names: [
        'Ботанический сад', 'Зоопарк', 'Питомник', 'Экоферма', 'Дендрарий', 'Заповедник', 'Парк природы', 'Океанариум', 'Парк птиц', 'Парк рептилий', 'Парк экзотических животных', 'Парк тропических растений', 'Парк водопадов', 'Парк фонтанов', 'Парк лабиринтов', 'Парк скульптур', 'Парк бабочек', 'Парк миниатюр', 'Парк динозавров', 'Парк развлечений', 'Парк аттракционов', 'Парк отдыха', 'Парк спорта', 'Парк культуры', 'Парк науки', 'Парк техники', 'Парк искусства', 'Парк истории', 'Парк географии', 'Парк экологии'] },
    { type: 'space', emoji: '🚀', names: [
        'Космическая станция', 'Обсерватория', 'Лунная база', 'Марсианская колония', 'Космический лифт', 'Звёздный крейсер', 'Космический телескоп', 'Космический спутник', 'Космический корабль', 'Космический зонд', 'Космический модуль', 'Космический шаттл', 'Космический ровер', 'Космический спутник связи', 'Космический спутник наблюдения', 'Космический спутник навигации', 'Космический спутник метеорологии', 'Космический спутник разведки', 'Космический спутник связи', 'Космический спутник навигации', 'Космический спутник метеорологии', 'Космический спутник разведки', 'Космический спутник связи', 'Космический спутник навигации', 'Космический спутник метеорологии', 'Космический спутник разведки', 'Космический спутник связи', 'Космический спутник навигации', 'Космический спутник метеорологии'] },
    { type: 'history', emoji: '🏺', names: [
        'Музей истории', 'Археологический парк', 'Историческая библиотека', 'Древний замок', 'Античный театр', 'Памятник культуры', 'Исторический музей', 'Исторический архив', 'Исторический памятник', 'Исторический центр', 'Исторический квартал', 'Исторический дом', 'Историческая улица', 'Историческая площадь', 'Исторический собор', 'Историческая церковь', 'Историческая мечеть', 'Историческая синагога', 'Исторический храм', 'Исторический дворец', 'Исторический замок', 'Историческая крепость', 'Историческая башня', 'Историческая стена', 'Исторический мост', 'Исторический туннель', 'Исторический канал', 'Исторический порт', 'Исторический вокзал', 'Исторический аэропорт'] },
    { type: 'music', emoji: '🎵', names: [
        'Концертный зал', 'Филармония', 'Музыкальная студия', 'Рок-клуб', 'Джаз-клуб', 'Оркестр', 'Хор', 'Музыкальная школа', 'Студия звукозаписи', 'Продюсерский центр', 'Музыкальный фестиваль', 'Музыкальный магазин', 'Музыкальный театр', 'Оперный театр', 'Балет', 'Симфонический оркестр', 'Камерный оркестр', 'Ансамбль', 'Солист', 'Дуэт', 'Трио', 'Квартет', 'Квинтет', 'Секстет', 'Септет', 'Октет', 'Нонет', 'Декад', 'Музыкальный конкурс', 'Музыкальный проект'] },
    { type: 'animals', emoji: '🐾', names: [
        'Питомник собак', 'Питомник кошек', 'Питомник птиц', 'Питомник грызунов', 'Питомник рептилий', 'Питомник амфибий', 'Питомник рыб', 'Питомник экзотических животных', 'Питомник сельскохозяйственных животных', 'Питомник диких животных', 'Питомник редких животных', 'Питомник исчезающих видов', 'Питомник декоративных животных', 'Питомник служебных животных', 'Питомник охотничьих животных', 'Питомник ездовых животных', 'Питомник лабораторных животных', 'Питомник спортивных животных', 'Питомник цирковых животных', 'Питомник зоопарка', 'Питомник аквариума', 'Питомник террариума', 'Питомник вивария', 'Питомник фермы', 'Питомник заповедника', 'Питомник заказника', 'Питомник национального парка', 'Питомник природного парка', 'Питомник ботанического сада', 'Питомник дендрария'] },
    { type: 'holiday', emoji: '🎉', names: [
        'Праздничное агентство', 'Организация свадеб', 'Организация дней рождения', 'Организация корпоративов', 'Организация юбилеев', 'Организация выпускных', 'Организация вечеринок', 'Организация фестивалей', 'Организация концертов', 'Организация выставок', 'Организация ярмарок', 'Организация карнавалов', 'Организация парадов', 'Организация шоу', 'Организация спектаклей', 'Организация представлений', 'Организация турниров', 'Организация соревнований', 'Организация чемпионатов', 'Организация олимпиад', 'Организация конкурсов', 'Организация викторин', 'Организация квестов', 'Организация мастер-классов', 'Организация тренингов', 'Организация семинаров', 'Организация конференций', 'Организация форумов', 'Организация симпозиумов', 'Организация выставок-продаж'] }
];
const RARITIES = [
    { name: 'common', emoji: '⚪', chance: 0.45 },
    { name: 'rare', emoji: '🟦', chance: 0.22 },
    { name: 'epic', emoji: '🟪', chance: 0.12 },
    { name: 'legendary', emoji: '🟧', chance: 0.07 },
    { name: 'mythic', emoji: '🟨', chance: 0.04 },
    { name: 'ultra', emoji: '💎', chance: 0.012 },
    { name: 'divine', emoji: '🌌', chance: 0.004 },
    { name: 'exotic', emoji: '🌠', chance: 0.001 }
];
const PACKS = {
    basic: { count: 5, guaranteedRarity: null, price: 100 },
    premium: { count: 30, guaranteedRarity: null, price: 600 },
    crystal: { count: 1, guaranteedRarity: 'ultra', price: 100000 },
    divine: { count: 1, guaranteedRarity: 'divine', price: 250000 },
    exotic: { count: 1, guaranteedRarity: 'exotic', price: 500000 },
    galaxy: { count: 30, guaranteedRarity: 'exotic', price: 15000000 },
    duplicate: { count: 1, guaranteedRarity: null, price: 100000000000 }
};

function generateAllCards() {
    let id = 1;
    const cards = [];
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }
    CARD_TYPES.forEach(cardType => {
        cardType.names.forEach(name => {
            RARITIES.forEach(rarity => {
                let baseMPS = Math.floor(Math.random() * 5) + 1;
                let rarityBonus = 0;
                if (rarity.name === 'rare') rarityBonus = 3;
                if (rarity.name === 'epic') rarityBonus = 7;
                if (rarity.name === 'legendary') rarityBonus = 15;
                if (rarity.name === 'mythic') rarityBonus = 30;
                if (rarity.name === 'ultra') rarityBonus = 60;
                if (rarity.name === 'divine') rarityBonus = 120;
                if (rarity.name === 'exotic') rarityBonus = 250;
                let typeBonus = 0;
                if (cardType.type === 'finance') typeBonus = 2;
                if (cardType.type === 'tech') typeBonus = 3;
                let upgradeBaseCost = Math.floor(Math.random() * 91) + 30;
                let uniqueMultiplier = 0.85 + (hashString(name + rarity.name + cardType.type) % 31) / 100;
                let diversityFactor = 1 + Math.sin(id * 1.7 + rarityBonus) * 0.35 + ((id % 7) - 3) * 0.04;
                let moneyPerSecond = Math.max(1, Math.floor((baseMPS + rarityBonus + typeBonus) * uniqueMultiplier * diversityFactor));
                cards.push({
                    id: id++,
                    name,
                    type: cardType.type,
                    emoji: cardType.emoji,
                    rarity: rarity.name,
                    moneyPerSecond: moneyPerSecond,
                    level: 1,
                    upgradeBaseCost
                });
            });
        });
    });
    return cards;
}

function formatBigNumber(num) {
    if (typeof num !== 'number') num = Number(num);
    if (isNaN(num)) return num;
    if (num < 1_000_000) return num.toLocaleString('ru-RU');
    const units = [
        { value: 1e33, symbol: 'Dc' },
        { value: 1e30, symbol: 'No' },
        { value: 1e27, symbol: 'Oc' },
        { value: 1e24, symbol: 'Sp' },
        { value: 1e21, symbol: 'Sx' },
        { value: 1e18, symbol: 'Qi' },
        { value: 1e15, symbol: 'Q' },
        { value: 1e12, symbol: 'T' },
        { value: 1e9, symbol: 'B' },
        { value: 1e6, symbol: 'M' }
    ];
    for (let i = 0; i < units.length; i++) {
        if (num >= units[i].value) {
            let val = Math.floor(num / units[i].value * 100) / 100;
            return val.toString().replace(/\.00$/, '') + units[i].symbol;
        }
    }
    return num.toLocaleString('ru-RU');
}

const NFT_CARDS = [
    { id: 1, name: 'CryptoPunk', emoji: '🧑‍🎤', price: 10_000_000_000 },
    { id: 2, name: 'Bored Ape', emoji: '🦍', price: 50_000_000_000 },
    { id: 3, name: 'Cat', emoji: '🐱', price: 100_000_000_000 },
    { id: 4, name: 'Eyes', emoji: '👀', price: 250_000_000_000 },
    { id: 5, name: 'Unicorn', emoji: '🦄', price: 500_000_000_000 },
    { id: 6, name: 'Golden Heart', emoji: '💛', price: 1_000_000_000_000 },
    { id: 7, name: 'Alien', emoji: '👾', price: 2_000_000_000_000 },
    { id: 8, name: 'Hot Pizza', emoji: '🍕', price: 3_500_000_000_000 },
    { id: 9, name: 'Space Doge', emoji: '🐕‍🦺🚀', price: 5_000_000_000_000 },
    { id: 10, name: 'Phoenix', emoji: '🦅🔥', price: 7_500_000_000_000 },
    { id: 11, name: 'Developer gift', emoji: '🎁', price: 10_000_000_000_000 },
    { id: 12, name: 'Perfect Cube', emoji: '🧊✨', price: 20_000_000_000_000 },
    { id: 13, name: 'Falcon', emoji: '🦅', price: 50_000_000_000_000 },
    { id: 14, name: 'Ghost', emoji: '👻', price: 100_000_000_000_000 },
    { id: 15, name: 'ALTERNATIVA', emoji: '🕊️', price: 1},
];

class Card {
    constructor(obj) { Object.assign(this, obj); }
}
class Collection {
    constructor(cards = []) { this.cards = cards.map(c => new Card(c)); }
    add(card) {
        if (!this.cards.find(c => c.id === card.id) && this.cards.length >= 30) {
            if (window.game && typeof window.game.showToast === 'function') {
                window.game.showToast('Лимит: максимум 30 разных карточек!');
            }
            return;
        }
        const existing = this.cards.find(c => c.id === card.id);
        if (existing) existing.count = (existing.count || 1) + (card.count || 1);
        else this.cards.push(new Card({ ...card, count: card.count || 1 }));
    }
    remove(cardId, count = 1) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;
        if ((card.count || 1) > count) card.count -= count;
        else this.cards = this.cards.filter(c => c.id !== cardId);
    }
    filter({ rarity, type }) {
        return this.cards.filter(c => (!rarity || c.rarity === rarity) && (!type || c.type === type));
    }
    clear() { this.cards = []; }
    toJSON() { return this.cards; }
}
class Game {
    constructor() {
        this.data = {
            coins: 0, collection: [], clickerClicks: 0, clickerEarned: 0,
            nftOwned: []
        };
        this.allCards = generateAllCards();
        this.collection = new Collection();
        this._lastStats = {};
    }
    load() {
        const saved = localStorage.getItem('cardCollectorGame');
        if (saved) {
            this.data = JSON.parse(saved);
            this.collection = new Collection(this.data.collection);
            if (!Array.isArray(this.data.nftOwned)) this.data.nftOwned = [];
            if (typeof this.data.clickerClicks !== 'number') this.data.clickerClicks = 0;
            if (typeof this.data.clickerEarned !== 'number') this.data.clickerEarned = 0;
        }
    }
    save() {
        this.data.collection = this.collection.toJSON();
        localStorage.setItem('cardCollectorGame', JSON.stringify(this.data));
    }
    getRandomCard(rarity = null) {
        let pool = this.allCards;
        if (rarity) pool = pool.filter(c => c.rarity === rarity);
        return pool[Math.floor(Math.random() * pool.length)];
    }
    getRandomRarity() {
        let rand = Math.random();
        for (const r of RARITIES.slice().reverse()) {
            if (rand < r.chance) return r.name;
        }
        return 'common';
    }
    generatePack(packType) {
        if (packType === 'duplicate') {
            if (this.collection.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * this.collection.cards.length);
                const card = this.collection.cards[randomIndex];
                return [Object.assign({}, card, { count: 1 })];
            } else {
                return [this.getRandomCard()];
            }
        }
        const config = PACKS[packType];
        const cards = [];
        if (config.guaranteedRarity) {
            for (let i = 0; i < config.count; i++) {
                cards.push(this.getRandomCard(config.guaranteedRarity));
            }
        } else {
            for (let i = 0; i < config.count; i++) {
                cards.push(this.getRandomCard(this.getRandomRarity()));
            }
        }
        return cards;
    }
    addPackToCollection(packType) {
        const cards = this.generatePack(packType);
        cards.forEach(card => this.collection.add(card));
        const reveal = document.getElementById('cards-reveal');
        const revealed = document.getElementById('revealed-cards');
        if (reveal && revealed) {
            revealed.innerHTML = '';
            cards.forEach(card => {
                const el = this.createCardElement(card, true);
                if (el) revealed.appendChild(el);
            });
            reveal.classList.remove('hidden');
        }
    }
    sellCard(cardId) {
        const card = this.collection.cards.find(c => c.id === cardId);
        if (!card) return;
        const price = Math.floor((card.moneyPerSecond || 0) * 0.7);
        this.collection.remove(cardId, 1);
        this.data.coins += price;
        this.save();
        this.renderStats();
        document.querySelector(`.card[data-card-id="${cardId}"]`)?.remove();
    }
    sellSelectedCards() {
        const selected = this.getSelectedCardIds();
        let totalCoins = 0;
        selected.forEach(cardId => {
            const card = this.collection.cards.find(c => c.id === cardId);
            if (card) totalCoins += (card.count || 1) * Math.floor((card.moneyPerSecond || 0) * 0.7);
        });
        if (!totalCoins) return;
        this.collection.cards = this.collection.cards.filter(c => !selected.includes(c.id));
        this.data.coins += totalCoins;
        this.save();
        this.render();
        this.showToast(`Продано ${selected.length} карт, получено ${totalCoins} монет!`);
    }
    sellAllCards() {
        let totalCoins = 0;
        this.collection.cards.forEach(card => {
            totalCoins += (card.count || 1) * Math.floor((card.moneyPerSecond || 0) * 0.7);
        });
        if (!totalCoins) return;
        this.collection.clear();
        this.data.coins += totalCoins;
        this.save();
        this.render();
        this.showToast(`Продано все карты, получено ${totalCoins} монет!`);
    }
    getSelectedCardIds() {
        return Array.from(document.querySelectorAll('.card-checkbox:checked')).map(cb => Number(cb.dataset.cardId));
    }
    clickerClick() {
        this.data.clickerClicks++;
        this.data.clickerEarned += 5;
        this.data.coins += 5;
        this.save();
        this.renderStats();
        document.getElementById('clicker-count').textContent = `Кликов: ${formatBigNumber(this.data.clickerClicks)}`;
        document.getElementById('clicker-earned').textContent = `Заработано монет: ${formatBigNumber(this.data.clickerEarned)}`;
    }
    render() {
        this.renderStats();
        this.renderCollection();
    }
    renderStats() {
        const stats = [
            ['coins', formatBigNumber(this.data.coins)],
            ['collection-count', formatBigNumber(this.collection.cards.length)],
            ['total-mps', formatBigNumber(this.collection.cards.reduce((sum, card) => {
                if (card.count > 1) {
                    return sum + (card.moneyPerSecond * 2 * card.count);
                } else {
                    return sum + (card.moneyPerSecond * card.count);
                }
            }, 0))],
            ['clicker-count', `Кликов: ${formatBigNumber(this.data.clickerClicks)}`],
            ['clicker-earned', `Заработано монет: ${formatBigNumber(this.data.clickerEarned)}`]
        ];
        for (const [id, value] of stats) {
            const el = document.getElementById(id);
            if (el && this._lastStats[id] !== value) {
                el.textContent = value;
                this._lastStats[id] = value;
            }
        }

    }
    renderCollection() {
        const container = document.getElementById('collection-grid');
        const rarity = document.getElementById('rarity-filter').value;
        const type = null;
        let cards = this.collection.filter({ rarity, type });
        cards = cards.slice().sort((a, b) => {
            const getTotalIncome = c => (c.count > 1 ? c.moneyPerSecond * 2 * c.count : c.moneyPerSecond * (c.count || 1));
            return getTotalIncome(b) - getTotalIncome(a);
        });
        const cardsHash = cards.map(c => c.id + ':' + c.count + ':' + c.level).join('|');
        if (container._lastHash === cardsHash) {
            this.updateMassPanelInfo();
            return;
        }
        container._lastHash = cardsHash;
        container.innerHTML = '';
        const BATCH_SIZE = 50;
        let i = 0;
        const total = cards.length;
        const fragment = document.createDocumentFragment();
        const addBatch = () => {
            let count = 0;
            while (i < total && count < BATCH_SIZE) {
                const card = cards[i++];
                const el = this.createCardElement(card);
                if (card.count > 1) {
                    const countBadge = document.createElement('div');
                    countBadge.className = 'card-count';
                    countBadge.textContent = `x${card.count}`;
                    el.appendChild(countBadge);
                }
                fragment.appendChild(el);
                count++;
            }
            container.appendChild(fragment.cloneNode(true));
            fragment.innerHTML = '';
            if (i < total) {
                requestAnimationFrame(addBatch);
            } else {
                this.updateMassPanelInfo();
                if (!container._delegated) {
                    container.addEventListener('click', (e) => {
                        const cardEl = e.target.closest('.card');
                        if (!cardEl) return;
                        const cardId = Number(cardEl.dataset.cardId);
                        if (e.target.classList.contains('card-checkbox')) {
                            cardEl.classList.toggle('selected', e.target.checked);
                            this.updateMassPanelInfo();
                            return;
                        }
                        const upgradeBtn = e.target.closest('.btn-upgrade');
                        if (upgradeBtn) {
                            e.stopPropagation();
                            this.upgradeCard(cardId);
                            return;
                        }
                        const sellBtn = e.target.closest('.btn-sell');
                        if (sellBtn) {
                            e.stopPropagation();
                            this.sellCard(cardId);
                            return;
                        }
                        if (!e.target.closest('.btn')) {
                            this.showCardModal(this.collection.cards.find(c => c.id === cardId));
                        }
                    });
                    container._delegated = true;
                }
            }
        };
        if (cards.length > 100) {
            addBatch();
        } else {
            cards.forEach(card => {
                const el = this.createCardElement(card);
                if (card.count > 1) {
                    const countBadge = document.createElement('div');
                    countBadge.className = 'card-count';
                    countBadge.textContent = `x${card.count}`;
                    el.appendChild(countBadge);
                }
                container.appendChild(el);
            });
            this.updateMassPanelInfo();
            if (!container._delegated) {
                container.addEventListener('click', (e) => {
                    const cardEl = e.target.closest('.card');
                    if (!cardEl) return;
                    const cardId = Number(cardEl.dataset.cardId);
                    if (e.target.classList.contains('card-checkbox')) {
                        cardEl.classList.toggle('selected', e.target.checked);
                        this.updateMassPanelInfo();
                        return;
                    }
                    const upgradeBtn = e.target.closest('.btn-upgrade');
                    if (upgradeBtn) {
                        e.stopPropagation();
                        this.upgradeCard(cardId);
                        return;
                    }
                    const sellBtn = e.target.closest('.btn-sell');
                    if (sellBtn) {
                        e.stopPropagation();
                        this.sellCard(cardId);
                        return;
                    }
                    if (!e.target.closest('.btn')) {
                        this.showCardModal(this.collection.cards.find(c => c.id === cardId));
                    }
                });
                container._delegated = true;
            }
        }
    }
    createCardButtons(card) {
        const btns = document.createElement('div');
        btns.className = 'card-buttons';
        btns.style.display = 'flex';
        btns.style.justifyContent = 'space-between';
        btns.style.gap = '12px';
        btns.style.marginTop = '8px';
        const upgradeBtn = document.createElement('button');
        upgradeBtn.className = 'btn btn-upgrade';
        upgradeBtn.textContent = 'Улучшить';
        upgradeBtn.onclick = (e) => {
            e.stopPropagation();
            window.game.upgradeCard(card.id);
        };
        const sellBtn = document.createElement('button');
        sellBtn.className = 'btn btn-sell';
        sellBtn.textContent = 'Продать';
        sellBtn.onclick = (e) => {
            e.stopPropagation();
            window.game.sellCard(card.id);
        };
        btns.appendChild(upgradeBtn);
        btns.appendChild(sellBtn);
        return btns;
    }
    getRarityDisplayName(rarity) {
        const map = {
            common: 'Common',
            rare: 'Rare',
            epic: 'Epic',
            legendary: 'Legendary',
            mythic: 'Mythic',
            ultra: 'Ultra',
            divine: 'Divine',
            exotic: 'Exotic',

        };
        return map[rarity] || rarity;
    }
    createCardElement(card, withoutButtons = false) {
        const template = document.getElementById('card-template');
        const node = template.content.cloneNode(true);
        const cardElement = node.querySelector('.card');
        cardElement.classList.add(card.rarity);
        cardElement.dataset.cardId = card.id;
        const checkbox = cardElement.querySelector('.card-checkbox');
        if (checkbox) {
            checkbox.dataset.cardId = card.id;
        }
        const image = cardElement.querySelector('.card-image');
        if (image) image.textContent = card.emoji;
        const name = cardElement.querySelector('.card-name');
        if (name) name.textContent = card.name;
        let mps = card.moneyPerSecond;
        if (card.count > 1) mps = mps * 2 * card.count;
        else mps = mps * (card.count || 1);
        const upgradeCost = getUpgradeCost(card);
        const stats = cardElement.querySelector('.card-stats');
        if (stats) {
            if (withoutButtons) {
                stats.innerHTML = `
                    <div class=\"card-stat\" style=\"text-align:center;width:100%;\">
                        <div class=\"card-stat-label\">💰 Доход</div>
                        <div class=\"card-stat-value\">${formatBigNumber(mps)}</div>
                        <div class=\"card-rarity\" style=\"font-size:0.72em;color:#c7d0e0;font-weight:300;font-style:italic;font-family:'Montserrat','Inter',Arial,sans-serif;margin-top:14px;letter-spacing:0.5px;\">${this.getRarityDisplayName(card.rarity)}</div>
                    </div>
                `;
            } else {
                stats.innerHTML = `
                    <div class=\"card-stat\">
                        <div class=\"card-stat-label\">💰 Доход</div>
                        <div class=\"card-stat-value\">${formatBigNumber(mps)}</div>
                    </div>
                    <div class=\"card-stat\">
                        <div class=\"card-stat-label\">🏆 Уровень</div>
                        <div class=\"card-stat-value\">${formatBigNumber(card.level || 1)}</div>
                    </div>
                `;
            }
        }
        if (!withoutButtons) {
            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = 'card-upgrade-cost';
            upgradeDiv.style = 'font-size:0.78em;color:#888;margin:10px auto 0 auto;text-align:center;width:100%;font-weight:400;letter-spacing:0.2px;';
            upgradeDiv.innerHTML = `
              <span style="display:inline-flex;align-items:center;gap:4px;">
                <span style="font-size:1em;">📈</span>
                <span style="font-weight:700;">${formatBigNumber(upgradeCost)}</span>
              </span>
            `;
            const statsBlock = cardElement.querySelector('.card-stats');
            const rarityDiv = cardElement.querySelector('.card-rarity');
            if (statsBlock && rarityDiv) {
                rarityDiv.parentNode.insertBefore(upgradeDiv, rarityDiv);
            } else if (statsBlock) {
                statsBlock.insertAdjacentElement('afterend', upgradeDiv);
            }
        }
        const buttons = cardElement.querySelector('.card-buttons');
        if (buttons && !withoutButtons) {
            buttons.replaceWith(this.createCardButtons(card));
        }
        const countBadge = cardElement.querySelector('.card-count');
        if (countBadge && card.count > 1) {
            countBadge.textContent = `x${card.count}`;
        } else if (countBadge) {
            countBadge.remove();
        }
        if (!withoutButtons) {
            const rarityDiv = document.createElement('div');
            rarityDiv.className = 'card-rarity';
            rarityDiv.style = "font-size:0.72em;color:#c7d0e0;font-weight:300;font-style:italic;font-family:'Montserrat','Inter',Arial,sans-serif;margin:22px auto 0 auto;text-align:center;width:100%;letter-spacing:0.5px;";
            rarityDiv.textContent = this.getRarityDisplayName(card.rarity);
            const statsBlock = cardElement.querySelector('.card-stats');
            if (statsBlock) statsBlock.insertAdjacentElement('afterend', rarityDiv);
        }
        return cardElement;
    }
    updateCardElement(card) {
        const cardEl = document.querySelector(`.card[data-card-id="${card.id}"]`);
        if (!cardEl) return;
        const newCardEl = this.createCardElement(card);
        cardEl.replaceWith(newCardEl);
    }
    showCardModal(card) {
        const modalContent = document.getElementById('modal-card-content');
        const upgradeCost = getUpgradeCost(card);
        let mps = card.moneyPerSecond;
        if (card.count > 1) mps = mps * 2 * card.count;
        else mps = mps * (card.count || 1);
        modalContent.innerHTML = `
            <div class="modal-card ${card.rarity}">
                <div class="modal-card-image">${card.emoji}</div>
                <h2>${card.name}</h2>
                <div class="modal-card-stats">
                    <div class="modal-card-stat">
                        <span>💰 Доход: ${formatBigNumber(mps)}</span>
                    </div>
                    <div class="modal-card-stat">
                        <span>🏆 Уровень: ${formatBigNumber(card.level || 1)}</span>
                    </div>
                    <div class="modal-card-stat">
                        <span>⭐ Редкость: ${card.rarity}</span>
                    </div>
                    <div class="modal-card-stat">
                        <span>📈 Стоимость прокачки: ${formatBigNumber(upgradeCost)} монет</span>
                    </div>
                </div>
                <button class="btn btn-upgrade" onclick="game.upgradeCard(${card.id})">Улучшить</button>
            </div>
        `;
        document.getElementById('card-modal').classList.remove('hidden');
    }
    updateMassPanelInfo() {
        const panel = document.getElementById('mass-action-panel');
        const info = document.getElementById('mass-selected-info');
        const btn = document.getElementById('sell-selected-btn');
        const upgradeBtn = document.getElementById('upgrade-selected-btn');
        const selected = this.getSelectedCardIds();
        let totalCoins = 0;
        selected.forEach(cardId => {
            const card = this.collection.cards.find(c => c.id === cardId);
            if (card) totalCoins += (card.count || 1) * Math.floor((card.moneyPerSecond || 0) * 0.7);
        });
        info.textContent = `Выбрано: ${selected.length} из ${this.collection.cards.length} карт, ${formatBigNumber(totalCoins)} монет`;
        btn.disabled = selected.length === 0;
        if (upgradeBtn) upgradeBtn.disabled = selected.length === 0;
    }
    selectAllCards() {
        const checkboxes = Array.from(document.querySelectorAll('.card-checkbox'));
        checkboxes.slice(0, 30).forEach(cb => {
            cb.checked = true;
            cb.closest('.card').classList.add('selected');
        });
        checkboxes.slice(30).forEach(cb => {
            cb.checked = false;
            cb.closest('.card').classList.remove('selected');
        });
        this.updateMassPanelInfo();
    }
    deselectAllCards() {
        document.querySelectorAll('.card-checkbox').forEach(cb => {
            cb.checked = false;
            cb.closest('.card').classList.remove('selected');
        });
        this.updateMassPanelInfo();
    }
    showToast(msg) {
        let toast = document.getElementById('sell-success-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'sell-success-toast';
            toast.className = 'toast-success';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 2500);
    }
    upgradeCard(cardId) {
        const card = this.collection.cards.find(c => c.id === cardId);
        if (!card) return;
        const upgradeCost = getUpgradeCost(card);
        if (this.data.coins < upgradeCost) {
            this.showToast('Недостаточно монет для прокачки!');
            return;
        }
        this.data.coins -= upgradeCost;
        card.level = (card.level || 1) + 1;
        if (card.level % 5 === 0) {
            card.moneyPerSecond = Math.floor(card.moneyPerSecond * 1.1);
        } else {
            card.moneyPerSecond = Math.floor(card.moneyPerSecond * 1.5);
        }
        this.save();
        this.render();
        this.showToast(`Прокачано! Новый уровень: ${card.level}`);
    }
    upgradeSelectedCards() {
        const selected = this.getSelectedCardIds();
        if (!selected.length) return;
        const selectedCards = selected
            .map(cardId => this.collection.cards.find(c => c.id === cardId))
            .filter(Boolean)
            .sort((a, b) => getUpgradeCost(a) - getUpgradeCost(b));
        let upgradedCards = 0;
        let totalLevels = 0;
        selectedCards.forEach(card => {
            const upgradeCost = getUpgradeCost(card);
            if (this.data.coins >= upgradeCost) {
                this.data.coins -= upgradeCost;
                card.level = (card.level || 1) + 1;
                if (card.level % 5 === 0) {
                    card.moneyPerSecond = Math.floor(card.moneyPerSecond * 1.1);
                } else {
                    card.moneyPerSecond = Math.floor(card.moneyPerSecond * 1.5);
                }
                upgradedCards++;
                totalLevels++;
            }
        });
        this.save();
        this.render();
        if (upgradedCards > 0) {
            this.showToast(`Прокачано: ${upgradedCards} карт, всего уровней: ${totalLevels}`);
        } else {
            this.showToast('Недостаточно монет для прокачки!');
        }
    }
    startAutoEarning() {
        if (this._autoEarningInterval) clearInterval(this._autoEarningInterval);
        this._autoEarningInterval = setInterval(() => {
            const totalMPS = this.collection.cards.reduce((sum, card) => {
                if (card.count > 1) {
                    return sum + (card.moneyPerSecond * 2 * card.count);
                } else {
                    return sum + (card.moneyPerSecond * card.count);
                }
            }, 0);
            this.data.coins += totalMPS;
            const coinsEl = document.getElementById('coins');
            if (coinsEl) coinsEl.textContent = formatBigNumber(this.data.coins);
        }, 1000);
    }
    buyNFT(nftId) {
        const nft = NFT_CARDS.find(n => n.id === nftId);
        if (!nft) return;
        if (this.data.nftOwned.includes(nftId)) return;
        if (this.data.coins < nft.price) return;
        this.data.coins -= nft.price;
        this.data.nftOwned.push(nftId);
        this.save();
        this.renderStats();
        this.renderNFTs();
    }
    createNFTCardElement(nft, owned) {
        const template = document.getElementById('nft-card-template');
        const node = template.content.cloneNode(true);
        const el = node.querySelector('.card');
        if (owned) el.classList.add('owned');
        el.dataset.nftId = nft.id;
        const image = el.querySelector('.card-image');
        if (image) {
            image.textContent = nft.emoji;
            image.style.fontSize = '3rem';
            image.style.filter = 'drop-shadow(0 0 7px #7fd7ff55)';
        }
        const name = el.querySelector('.card-name');
        if (name) name.textContent = nft.name;
        const price = el.querySelector('.card-nft-price');
        if (price) price.innerHTML = `💰 ${formatBigNumber(nft.price)}`;
        const btn = el.querySelector('.buy-nft-btn');
        if (btn) {
            btn.dataset.nftId = nft.id;
            btn.textContent = owned ? 'Куплено' : 'Купить';
            btn.disabled = !!owned;
        }
        return el;
    }
    renderNFTs() {
        const container = document.getElementById('nft-grid');
        if (!container) return;
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const ownedSet = new Set(this.data.nftOwned);
        NFT_CARDS.forEach(nft => {
            const owned = ownedSet.has(nft.id);
            const el = this.createNFTCardElement(nft, owned);
            fragment.appendChild(el);
        });
        container.appendChild(fragment);
        if (!container._delegated) {
            container.addEventListener('click', (e) => {
                const btn = e.target.closest('.buy-nft-btn');
                if (btn && !btn.disabled) {
                    const nftId = Number(btn.dataset.nftId);
                    window.game.buyNFT(nftId);
                }
            });
            container._delegated = true;
        }
    }

}

window.game = new Game();
game.load();

setInterval(() => {
    if (window.game && typeof window.game.save === 'function') {
        window.game.save();
    }
}, 10000);

if (!localStorage.getItem('cardCollectorGame')) {
    game.data = {
        coins: 0,
        collection: [],
        clickerClicks: 0,
        clickerEarned: 0,
        nftOwned: []
    };
    game.collection = new Collection();
    game.save();
}

function animateButton(btn) {
    if (!btn) return;
    btn.classList.remove('flash');
    void btn.offsetWidth;
    btn.classList.add('flash');
}

const PROMO_CODES = [
    { code: 'RICHSTART', reward: { coins: 250000 }, message: 'Вы получили 250 000 монет!' },
    { code: 'CRINE', reward: { coins: 1000000000000 }, message: 'Вы получили 1T монет!' },
    { code: 'RESETME', reward: { reset: true }, message: 'Ваш счёт обнулён!' },
    { code: 'RESETALL', reward: { resetAll: true }, message: 'Весь прогресс сброшен!' },
    { code: 'ALTERNATIVA', reward: { nft: 15 }, message: 'Вы получили NFT ALTERNATIVA!' }
];

function applyPromoCode(inputCode) {
    const used = JSON.parse(localStorage.getItem('usedPromoCodes') || '[]');
    const codeObj = PROMO_CODES.find(c => c.code.toLowerCase() === inputCode.trim().toLowerCase());
    if (!codeObj) return { success: false, message: 'Промокод не найден!' };
    if (codeObj.code !== 'RESETME' && codeObj.code !== 'RESETALL' && used.includes(codeObj.code)) {
        const idx = used.indexOf(codeObj.code);
        if (idx !== -1) {
            used.splice(idx, 1);
            localStorage.setItem('usedPromoCodes', JSON.stringify(used));
        }
        return { success: false, message: 'Промокод уже был использован.' };
    }
    if (codeObj.reward.coins) {
        game.data.coins += codeObj.reward.coins;
    }
    if (codeObj.reward.nft) {
        if (!game.data.nftOwned.includes(codeObj.reward.nft)) {
            game.data.nftOwned.push(codeObj.reward.nft);
            game.save();
            game.renderNFTs();
        }
    }

    if (codeObj.reward.reset) {
        game.data.coins = 0;
    }
    if (codeObj.reward.resetAll) {
        localStorage.removeItem('cardCollectorGame');
        localStorage.removeItem('usedPromoCodes');
        location.reload();
        return { success: true, message: codeObj.message };
    }
    if (codeObj.code !== 'RESETME' && codeObj.code !== 'RESETALL') {
        used.push(codeObj.code);
        localStorage.setItem('usedPromoCodes', JSON.stringify(used));
    }
    game.save();
    game.renderStats && game.renderStats();
    return { success: true, message: codeObj.message };
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.pack-card').forEach(packCard => {
        const packType = packCard.dataset.pack;
        if (PACKS[packType]) {
            const priceEl = packCard.querySelector('.price');
            if (priceEl) {
                priceEl.innerHTML = `💰 ${formatBigNumber(PACKS[packType].price)}`;
            }
        }
    });
    const resetBtn = document.getElementById('reset-all-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие необратимо!')) {
                localStorage.clear();
                location.reload();
            }
        });
    }
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.section).classList.add('active');
            if (e.target.dataset.section === 'nft') {
                game.renderNFTs();
            }
        });
    });
    document.querySelectorAll('.buy-pack').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const packCard = btn.closest('.pack-card');
            if (packCard) {
                const packType = packCard.dataset.pack;
                const price = PACKS[packType].price;
                const packCards = game.generatePack(packType);
                const currentIds = new Set(game.collection.cards.map(c => c.id));
                let newUnique = 0;
                packCards.forEach(card => {
                    if (!currentIds.has(card.id)) {
                        newUnique++;
                        currentIds.add(card.id);
                    }
                });
                if (game.collection.cards.length + newUnique > 30) {
                    game.showToast('Лимит: максимум 30 уникальных карточек в инвентаре!');
                    return;
                }
                if (game.data.coins < price) {
                    alert('Недостаточно монет!');
                    return;
                }
                game.data.coins -= price;
                game.addPackToCollection(packType);
                game.save();
                game.render();
                animateButton(btn);
                const coinsEl = document.getElementById('coins');
            }
        });
    });
    document.getElementById('close-reveal').addEventListener('click', () => {
        document.getElementById('cards-reveal').classList.add('hidden');
    });
    document.querySelectorAll('.buy-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            animateButton(btn);
        });
    });
    document.getElementById('rarity-filter').addEventListener('change', () => {
        game.renderCollection();
    });
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('card-modal').classList.add('hidden');
    });
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('card-modal');
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    document.getElementById('sell-selected-btn').onclick = () => {
        animateButton(document.getElementById('sell-selected-btn'));
        game.sellSelectedCards();
    };
    document.getElementById('mass-select-all').onclick = () => {
        animateButton(document.getElementById('mass-select-all'));
        game.selectAllCards();
    };
    document.getElementById('mass-deselect-all').onclick = () => {
        animateButton(document.getElementById('mass-deselect-all'));
        game.deselectAllCards();
    };
    document.getElementById('mass-sell-all').onclick = () => {
        animateButton(document.getElementById('mass-sell-all'));
        game.sellAllCards();
    };
    document.getElementById('upgrade-selected-btn').onclick = () => {
        animateButton(document.getElementById('upgrade-selected-btn'));
        game.upgradeSelectedCards();
    };
    const clickerBtn = document.getElementById('clicker-main-btn');
    if (clickerBtn) clickerBtn.addEventListener('click', () => {
        animateButton(clickerBtn);
        game.clickerClick();
    });
    game.startAutoEarning();
    game.render();
    const promoInput = document.getElementById('promo-input');
    const promoBtn = document.getElementById('promo-apply-btn');
    const promoMsg = document.getElementById('promo-message');
    if (promoBtn && promoInput && promoMsg) {
        promoBtn.addEventListener('click', () => {
            const code = promoInput.value;
            const result = applyPromoCode(code);
            promoMsg.textContent = result.message;
            promoMsg.style.color = result.success ? '#4caf50' : '#ff5252';
            if (result.success) promoInput.value = '';
        });
        promoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') promoBtn.click();
        });
    }

    const toolsBtn = document.getElementById('tools-toggle-btn');
    const toolsMenu = document.getElementById('main-tools-menu');
    if (toolsBtn && toolsMenu) {
        toolsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (toolsMenu.style.display === 'none' || !toolsMenu.style.display) {
                toolsMenu.style.display = 'block';
                setTimeout(() => toolsMenu.classList.add('open'), 10);
            } else {
                toolsMenu.classList.remove('open');
                setTimeout(() => toolsMenu.style.display = 'none', 180);
            }
        });
        document.addEventListener('click', (e) => {
            if (toolsMenu.style.display === 'block' && !toolsMenu.contains(e.target) && e.target !== toolsBtn) {
                toolsMenu.classList.remove('open');
                setTimeout(() => toolsMenu.style.display = 'none', 180);
            }
        });
    }
});

const origSellCard = game.sellCard.bind(game);
game.sellCard = function(cardId) {
    const card = this.collection.cards.find(c => c.id === cardId);
    if (!card) return;
    const cardEl = document.querySelector(`.card input[data-card-id="${cardId}"]`)?.closest('.card');
    if (cardEl) {
        cardEl.classList.add('sold');
        setTimeout(() => {
            origSellCard(cardId);
        }, 550);
    } else {
        origSellCard(cardId);
    }
};

const origSellSelectedCards = game.sellSelectedCards.bind(game);
game.sellSelectedCards = function() {
    const selected = this.getSelectedCardIds();
    let anyAnimated = false;
    selected.forEach(cardId => {
        const cardEl = document.querySelector(`.card input[data-card-id="${cardId}"]`)?.closest('.card');
        if (cardEl) {
            cardEl.classList.add('sold');
            anyAnimated = true;
        }
    });
    if (anyAnimated) {
        setTimeout(() => origSellSelectedCards(), 550);
    } else {
        origSellSelectedCards();
    }
};

const origSellAllCards = game.sellAllCards.bind(game);
game.sellAllCards = function() {
    document.querySelectorAll('.card').forEach(cardEl => cardEl.classList.add('sold'));
    setTimeout(() => origSellAllCards(), 550);
};

function getUpgradeCost(card) {
    const lvl = card.level || 1;
    return Math.floor(5 * (card.moneyPerSecond || 1) * lvl);
}

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('lite-mode-toggle');
    if (btn) {
        btn.addEventListener('click', function() {
            document.body.classList.toggle('lite-mode');
            btn.classList.toggle('active');
            btn.textContent = document.body.classList.contains('lite-mode')
                ? '🌙'
                : '⚡';
            if (window.game && typeof window.game.save === 'function') {
                window.game.save();
            }
        });
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('lite-mode');
        if (btn) {
            btn.classList.add('active');
            btn.textContent = '🌙';
        }
    }
});

(function() {
    const nftGrid = document.getElementById('nft-grid');
    if (nftGrid) {
        nftGrid.addEventListener('click', function(e) {
            const btn = e.target.closest('.buy-nft-btn');
            if (btn) {
                const nftId = Number(btn.dataset.nftId);
                if (!game.data.nftOwned.includes(nftId) && game.data.coins >= (NFT_CARDS.find(n => n.id === nftId)?.price || 0)) {
                    game.buyNFT(nftId);
                }
                return;
            }
        });
    }
})();
