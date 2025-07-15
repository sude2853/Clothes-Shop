const categoryData = {
    KADIN: [
        { name: 'elbise', value: 'Elbise' },
        { name: 'etek', value: 'Etek' },
        { name: 'jean', value: 'Jean' },
        { name: 'body', value: 'Body' },
    ],
    ERKEK: [
        { name: 'thirt', value: 'Tshirt' },
        { name: 'jean', value: 'Jean' },
        { name: 'ceket', value: 'Ceket' },
        { name: 'gomlek', value: 'Gömlek' },
    ],
    BEBEK: [
        { name: 'kiz_bebek', value: 'Kız Bebek' },
        { name: 'erkek_bebek', value: 'Erkek Bebek' },
        { name: 'zibin', value: 'Zıbın' },
    ],
    AKSESUAR: [
        { name: 'kolye', value: 'Kolye' },
        { name: 'kupe', value: 'Küpe' },
        { name: 'bileklik', value: 'Bileklik' },
        { name: 'yuzuk', value: 'Yüzük' },
    ],
};

const categoryUpperCase = {
    kadin: 'Kadın',
    erkek: 'Erkek',
    bebek: 'Bebek',
    aksesuar: 'Akesesuar',
};

const categoryFilterData = [
    { name: 'Kadın', value: 'kadin' },
    { name: 'Erkek', value: 'erkek' },
    { name: 'Bebek', value: 'bebek' },
    { name: 'Aksesuar', value: 'Aksesuar' },
];

const filterConfig = {
    kadin: { color: true, size: true },
    erkek: { color: true, size: true },
    bebek: { color: true, size: true },
    aksesuar: { color: true, size: false },
};

const COLORS = [
    { name: 'siyah', value: 'Siyah' },
    { name: 'beyaz', value: 'Beyaz' },
    { name: 'kirmizi', value: 'Kırmızı' },
    { name: 'bej', value: 'Bej' },
    { name: 'mavi', value: 'Mavi' },
    { name: 'lacivert', value: 'Lacivert' },
    { name: 'gri', value: 'Gri' },
    { name: 'yesil', value: 'Yeşil' },
    { name: 'haki', value: 'Haki' },
    { name: 'pembe', value: 'Pembe' },
    { name: 'mor', value: 'Mor' },
    { name: 'turuncu', value: 'Turuncu' },
    { name: 'kahverengi', value: 'Kahverengi' },
    { name: 'sari', value: 'Sarı' },
    { name: 'bordo', value: 'Bordo' },
    { name: 'altin', value: 'Altın' },
    { name: 'gumus', value: 'Gümüş' },
    { name: 'krem', value: 'Krem' },
    { name: 'fume', value: 'Füme' },
    { name: 'mint', value: 'Mint' },
    { name: 'tas', value: 'Taş' },
    { name: 'antrasit', value: 'Antrasit' },
    { name: 'kobalt_mavi', value: 'Kobalt Mavi' },
    { name: 'sarap_kirmizisi', value: 'Şarap Kırmızısı' },
    { name: 'nil_yesili', value: 'Nil Yeşili' },
];

const SIZES = ['s', 'm', 'l', 'xl'];

export {
    categoryData,
    filterConfig,
    COLORS,
    SIZES,
    categoryUpperCase,
    categoryFilterData,
};
