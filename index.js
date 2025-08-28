// Правила
document.getElementById('rulesToggle').addEventListener('click', function() {
    const content = document.getElementById('rulesContent');
    const arrow = this.querySelector('.arrow');
    
    content.classList.toggle('show');
    arrow.classList.toggle('rotated');
});


// Обработчик кнопки транслитерации
document.getElementById('transliterateBtn').addEventListener('click', function() {
    const getOpt = (n) => document.getElementById(n).checked;

    const inputText = document.getElementById('inputText').value;
    const outputText = translit(inputText, getOpt('optJanalifA'), getOpt('optTraditionalYa'), getOpt('optZamanalifIa'), getOpt('optInitalGaFix'), getOpt('optIotatedUppercaseFix'));

    document.getElementById('outputText').value = outputText;
});

const IOTATED_NORM = {
    'я': ['йа', 'йә'],
    'е': ['йы', 'йэ'],
    'ю': ['йу', 'йү'],
    'Я': ['Йа', 'Йә'],
    'Е': ['Йы', 'Йэ'],
    'Ю': ['Йу', 'Йү']
};
const IOTATED_AFTER_CONSONANTS_NORM = {
    'е': 'э',
    'Е': 'Э',
};
let BASIC_TRANSLIT_TABLE = {
    'А': 'A', 'а': 'a',
    'Ә': 'Ä', 'ә': 'ä',
    'Б': 'B', 'б': 'b',
    'В': 'V', 'в': 'v',
    'Д': 'D', 'д': 'd',
    'Ж': 'J', 'ж': 'j',
    'Җ': 'C', 'җ': 'c',
    'З': 'Z', 'з': 'z',
    'И': 'İ', 'и': 'i',
    'Й': 'Y', 'й': 'y',
    'Л': 'L', 'л': 'l',
    'М': 'M', 'м': 'm',
    'Н': 'N', 'н': 'n',
    'Ң': 'Ñ', 'ң': 'ñ',
    'О': 'O', 'о': 'o',
    'Ө': 'Ö', 'ө': 'ö',
    'П': 'P', 'п': 'p',
    'Р': 'R', 'р': 'r',
    'С': 'S', 'с': 's',
    'Т': 'T', 'т': 't',
    'У': 'U', 'у': 'u',
    'Ү': 'Ü', 'ү': 'ü',
    'Ф': 'F', 'ф': 'f',
    'Х': 'X', 'х': 'x',
    'Һ': 'H', 'һ': 'h',
    'Ц': 'S', 'ц': 's',
    'Ч': 'Ç', 'ч': 'ç',
    'Ш': 'Ş', 'ш': 'ş',
    'Ғ': 'Ğ', 'ғ': 'ğ',
    'Щ': 'Şç', 'щ': 'şç',
    'Ы': 'I', 'ы': 'ı',
    'Э': 'E', 'э': 'e',
    'Я': 'Â', 'я': 'â'
};
const GK_CONV = {
    'к': ['q', 'k'],
    'г': ['ğ', 'g'],
    'К': ['Q', 'K'],
    'Г': ['Ğ', 'G']
};
const WORD_DELIMS = ' ,.\n';
const HARD_VOWELS = 'ауоыАУОЫ';
const SOFT_VOWELS = 'әүөэӘҮӨЭиИ';
const IOTATED_VOWELS = 'яюеЯЮЕ';
const VOWELS = HARD_VOWELS + SOFT_VOWELS + IOTATED_VOWELS;
const CONSONANTS = 'бвгғджҗзйклмнңпрстфхһцчшщБВГҒДЖҖЗЙКЛМНҢПРСТФХҺЦЧШЩ';
const HARD_MARK = 'ъЪ';
const SOFT_MARK = 'ьЬ';
const NO_LATIN = HARD_MARK + SOFT_MARK;
const W_REPRESENTATIONS = 'уүУҮ';
const HARD_WORD = 0;
const SOFT_WORD = 1;
const UNTYPED_WORD = 2;
function test_pos_for_type(str, pos) {
    if (HARD_VOWELS.includes(str[pos]))
        return HARD_WORD;
    if (SOFT_VOWELS.includes(str[pos]) || SOFT_MARK.includes(str[pos]))
        return SOFT_WORD;
    return UNTYPED_WORD;
}
function word_type_by_pos(str, pos) {
    let tmp = pos;
    while (tmp < str.length && (!WORD_DELIMS.includes(str[tmp]))) {
        const this_test = test_pos_for_type(str, tmp);
        if (this_test != UNTYPED_WORD)
            return this_test;
        tmp++;
    }
    while (pos >= 0 && (!WORD_DELIMS.includes(str[pos]))) {
        const this_test = test_pos_for_type(str, pos);
        if (this_test != UNTYPED_WORD)
            return this_test;
        pos--;
    }
    return HARD_WORD;
}
function is_word_begin(str, pos) {
    return pos == 0 || WORD_DELIMS.includes(str[pos - 1]);
}
function normalize_cyrillic(raw_cyrillic) {
    let tmp_norm = "";
    for (let i = 0; i < raw_cyrillic.length; i++) {
        const is_in_a_word_begin = is_word_begin(raw_cyrillic, i);
        const is_after_consonant = !is_in_a_word_begin && CONSONANTS.includes(raw_cyrillic[i - 1]);
        if (is_after_consonant && raw_cyrillic[i] in IOTATED_AFTER_CONSONANTS_NORM)
            tmp_norm += IOTATED_AFTER_CONSONANTS_NORM[raw_cyrillic[i]];
        else
            tmp_norm += raw_cyrillic[i];
    }
    let norm_result = "";
    for (let i = 0; i < tmp_norm.length; i++) {
        const is_in_a_word_begin = is_word_begin(tmp_norm, i);
        const is_after_consonant = !is_in_a_word_begin && CONSONANTS.includes(tmp_norm[i - 1]);
        if ((is_in_a_word_begin || !is_after_consonant) && (tmp_norm[i] in IOTATED_NORM))
            norm_result += IOTATED_NORM[tmp_norm[i]][word_type_by_pos(tmp_norm, i)];
        else
            norm_result += tmp_norm[i];
    }
    return norm_result;
}
const HAMZA = 'ʼ';
function corresponds_to_hamza(cyr, pos) {
    if (is_word_begin(cyr, pos) || pos == cyr.length - 1)
        return false;
    console.log(cyr[pos + 1]);
    if (HARD_MARK.includes(cyr[pos]) && !(cyr[pos - 1] in GK_CONV) && cyr[pos + 1] != 'Й' && cyr[pos + 1] != 'й')
        return true;
    if ((cyr[pos] === 'э' || cyr[pos] === 'Э') && VOWELS.includes(cyr[pos - 1]))
        return true;
    return false;
}
function corresponds_aw_like(cyr, pos) {
    return (pos != cyr.length - 1) && VOWELS.includes(cyr[pos]) && W_REPRESENTATIONS.includes(cyr[pos + 1]);
}
function transliterate_aw_like(cyr, pos) {
    let result = BASIC_TRANSLIT_TABLE[cyr[pos]];
    if (W_REPRESENTATIONS.substring(2).includes(cyr[pos + 1]))
        result += 'W';
    else
        result += 'w';
    return result;
}
const IE_LIKE_SECOND_VOWELS = 'әүэӘҮЭ';
function corresponds_ie_like(cyr, pos) {
    if (pos >= cyr.length - 3)
        return false;
    if (cyr[pos] != 'и' && cyr[pos] != 'И')
        return false;
    if (cyr[pos + 1] != 'Й' && cyr[pos + 1] != 'й')
        return false;
    if (IE_LIKE_SECOND_VOWELS.includes(cyr[pos + 2]))
        return true;
    return false;
}
function transliterate_ie_like(cyr, pos) {
    return BASIC_TRANSLIT_TABLE[cyr[pos]] + BASIC_TRANSLIT_TABLE[cyr[pos + 2]];
}
function transliterate_gk(cyr, pos) {
    const word_type = (pos != cyr.length - 1 && HARD_MARK.includes(cyr[pos + 1])) ? HARD_WORD : word_type_by_pos(cyr, pos);
    return GK_CONV[cyr[pos]][word_type];
}
function translit(cyrillic, optJanalifA, optTraditionalYa, optZamanalifIa, optInitalGaFix, optIotatedUppercaseFix) {
    let normalized = normalize_cyrillic(cyrillic);
    if (optJanalifA) {
        BASIC_TRANSLIT_TABLE['ә'] = 'ə';
        BASIC_TRANSLIT_TABLE['Ә'] = 'Ə';
    }
    if (!optTraditionalYa) {
        BASIC_TRANSLIT_TABLE['я'] = BASIC_TRANSLIT_TABLE['ә'];
        BASIC_TRANSLIT_TABLE['Я'] = BASIC_TRANSLIT_TABLE['Ә'];
    }
    let skip = false;
    let result = "";
    for (let i = 0; i < normalized.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }
        if (NO_LATIN.includes(normalized[i]))
            continue;
        if (corresponds_to_hamza(normalized, i)) {
            result += HAMZA;
            continue;
        }
        if (corresponds_aw_like(normalized, i)) {
            result += transliterate_aw_like(normalized, i);
            continue;
        }
        if (optZamanalifIa && corresponds_ie_like(normalized, i)) {
            result += transliterate_ie_like(normalized, i);
            continue;
        }
        if (normalized[i] in GK_CONV) {
            result += transliterate_gk(normalized, i);
            continue;
        }
        if (normalized[i] in BASIC_TRANSLIT_TABLE) {
            result += BASIC_TRANSLIT_TABLE[normalized[i]]
            continue;
        }

        result += normalized[i];
    }
    return result;
}

