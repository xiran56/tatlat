interface ConditionalConvTable {
    [key: string]: [string, string]

}

interface ConvTable {
    [key: string]: string
}

const IOTATED_NORM: ConditionalConvTable = {
    'я': ['йа', 'йә'],
    'е': ['йы', 'йэ'],
    'ю': ['йу', 'йү'],
    'Я': ['Йа', 'Йә'],
    'Е': ['Йы', 'Йэ'],
    'Ю': ['Йу', 'Йү']
}

const IOTATED_AFTER_CONSONANTS_NORM: ConvTable = {
    'е': 'э',
    'Е': 'Э',
}

let BASIC_TRANSLIT_TABLE: ConvTable = {
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
}

const GK_CONV: ConditionalConvTable = {
    'к': ['q', 'k'],
    'г': ['ğ', 'g'],
    'К': ['Q', 'K'],
    'Г': ['Ğ', 'G']
} 
const WORD_DELIMS: string = ' ,.\n'
const HARD_VOWELS: string = 'ауоыАУОЫ'
const SOFT_VOWELS: string = 'әүөэӘҮӨЭиИ'
const IOTATED_VOWELS: string = 'яюеЯЮЕ'
const VOWELS: string = HARD_VOWELS + SOFT_VOWELS + IOTATED_VOWELS
const CONSONANTS: string = 'бвгғджҗзйклмнңпрстфхһцчшщБВГҒДЖҖЗЙКЛМНҢПРСТФХҺЦЧШЩ'
const HARD_MARK: string = 'ъЪ'
const SOFT_MARK: string = 'ьЬ'
const NO_LATIN: string = HARD_MARK + SOFT_MARK
const W_REPRESENTATIONS: string = 'уүУҮ'

const HARD_WORD: number = 0 
const SOFT_WORD: number = 1
const UNTYPED_WORD: number = 2

function test_pos_for_type(str: string, pos: number): number {
    if (HARD_VOWELS.includes(str[pos]))
        return HARD_WORD
    
    if (SOFT_VOWELS.includes(str[pos]) || SOFT_MARK.includes(str[pos]))
        return SOFT_WORD
    
    return UNTYPED_WORD
}

function word_type_by_pos(str: string, pos: number): number {
    let tmp: number = pos

    while (tmp < str.length && (!WORD_DELIMS.includes(str[tmp]))) {
        const this_test = test_pos_for_type(str, tmp)
        if (this_test != UNTYPED_WORD)
            return this_test
        tmp++
    }

    while (pos >= 0 && (!WORD_DELIMS.includes(str[pos]))) {
        const this_test = test_pos_for_type(str, pos)
        if (this_test != UNTYPED_WORD)
            return this_test
        pos--
    }

    return HARD_WORD
}

function is_word_begin(str: string, pos: number): boolean {
    return pos == 0 || WORD_DELIMS.includes(str[pos - 1])
} 

function normalize_cyrillic(
    raw_cyrillic: string
): string {
    let tmp_norm: string = ""

    for (let i = 0; i < raw_cyrillic.length; i++) {
        const is_in_a_word_begin = is_word_begin(raw_cyrillic, i)
        const is_after_consonant = !is_in_a_word_begin && CONSONANTS.includes(raw_cyrillic[i - 1])

        if (is_after_consonant && raw_cyrillic[i] in IOTATED_AFTER_CONSONANTS_NORM)
            tmp_norm += IOTATED_AFTER_CONSONANTS_NORM[raw_cyrillic[i]]
        else
            tmp_norm += raw_cyrillic[i]
    }

    let norm_result: string = ""

    for (let i = 0; i < tmp_norm.length; i++) {
        const is_in_a_word_begin = is_word_begin(tmp_norm, i)
        const is_after_consonant = !is_in_a_word_begin && CONSONANTS.includes(tmp_norm[i - 1])
        
        if ((is_in_a_word_begin || !is_after_consonant) && (tmp_norm[i] in IOTATED_NORM))
            norm_result += IOTATED_NORM[tmp_norm[i]][word_type_by_pos(tmp_norm, i)]
        else
            norm_result += tmp_norm[i]
    }

    return norm_result
}

const HAMZA: string = 'ʼ'

function corresponds_to_hamza(cyr: string, pos: number): boolean {
    if (is_word_begin(cyr, pos) || pos == cyr.length - 1)
        return false

    console.log(cyr[pos + 1])

    if (HARD_MARK.includes(cyr[pos]) && !(cyr[pos - 1] in GK_CONV) && cyr[pos + 1] != 'Й' && cyr[pos + 1] != 'й')
        return true

    if ((cyr[pos] === 'э' || cyr[pos] === 'Э') && VOWELS.includes(cyr[pos - 1]))
        return true

    return false
}

function corresponds_aw_like(cyr: string, pos: number): boolean {
    return (pos != cyr.length - 1) && VOWELS.includes(cyr[pos]) && W_REPRESENTATIONS.includes(cyr[pos + 1])
}

function transliterate_aw_like(cyr: string, pos: number): string {
    let result: string = BASIC_TRANSLIT_TABLE[cyr[pos]]

    if (W_REPRESENTATIONS.substring(2).includes(cyr[pos + 1]))
        result += 'W'
    else
        result += 'w'

    return result
}

const IE_LIKE_SECOND_VOWELS: string = 'әүэӘҮЭ'

function corresponds_ie_like(cyr: string, pos: number): boolean {
    if (pos >= cyr.length - 3)
        return false

    if (cyr[pos] != 'и' && cyr[pos] != 'И')
        return false

    if (cyr[pos + 1] != 'Й' && cyr[pos + 1] != 'й')
        return false

    if (IE_LIKE_SECOND_VOWELS.includes(cyr[pos + 2]))
        return true
    
    return false
}

function transliterate_ie_like(cyr: string, pos: number): string {
    return BASIC_TRANSLIT_TABLE[cyr[pos]] + BASIC_TRANSLIT_TABLE[cyr[pos + 2]]
}

function transliterate_gk(cyr: string, pos: number): string {
    const word_type: number = (pos != cyr.length - 1 && HARD_MARK.includes(cyr[pos + 1])) ? HARD_WORD : word_type_by_pos(cyr, pos)
    return GK_CONV[cyr[pos]][word_type]
}

const IY_CONV_TABLE: ConvTable = {
    'ы': 'и',
    'Ы': 'И'
}

// Для слов типа Сагыйть -> saghit
function is_gk_iy_like(cyr: string, pos: number): boolean {
    if (!(cyr[pos] in IY_CONV_TABLE))
        return false

    if (pos < cyr.length - 4 || pos == 0)
        return false

    if (cyr[pos + 1] != "й" && cyr[pos + 1] != "Й")
        return false

    return SOFT_MARK.includes(cyr[pos + 3])
}

function is_saghat_like(cyr: string, pos: number): boolean {
    if (pos < cyr.length - 3 || pos == 0)
        return false

    return SOFT_MARK.includes(cyr[pos + 2])
}

function is_qadar_like(cyr: string, pos: number): boolean {
    return word_type_by_pos(cyr, pos + 1) == SOFT_WORD 
}

function transliterate_cyrillic(
    cyrillic: string, 
    optJanalifA: boolean,
    optTraditionalYa: boolean,
    optZamanalifIa: boolean,
    optInitalGaFix: boolean,
    optIotatedUppercaseFix: boolean
): string {
    let normalized: string = normalize_cyrillic(cyrillic)

    BASIC_TRANSLIT_TABLE['ә'] = optJanalifA ? 'ə' : 'ä'
    BASIC_TRANSLIT_TABLE['Ә'] = optJanalifA ? 'Ə' : 'Ä'
    BASIC_TRANSLIT_TABLE['я'] = optTraditionalYa ? 'â' : BASIC_TRANSLIT_TABLE['ә']
    BASIC_TRANSLIT_TABLE['Я'] = optTraditionalYa ? 'Â' : BASIC_TRANSLIT_TABLE['Ә']

    let skip: boolean = false
    let result: string = ""

    for (let i = 0; i < normalized.length; i++) {
        if (skip) {
            skip = false
            continue
        }

        if (NO_LATIN.includes(normalized[i]))
            continue

        if (corresponds_to_hamza(normalized, i)) {
            result += HAMZA
            continue
        }

        if (corresponds_aw_like(normalized, i)) {
            result += transliterate_aw_like(normalized, i)
            skip = true
            continue
        }

        if (optZamanalifIa && corresponds_ie_like(normalized, i)) {
            result += transliterate_ie_like(normalized, i)
            skip = true
            continue
        }

        if (normalized[i] in GK_CONV) {
            result += transliterate_gk(normalized, i)
            continue
        }

        if (HARD_VOWELS.includes(normalized[i]) && i != 0 && normalized[i] in GK_CONV) {
            if (is_gk_iy_like(normalized, i) || (optInitalGaFix && is_qadar_like(normalized, i))) {
                result += IY_CONV_TABLE[normalized[i]]
                skip = true
            }
            else if (is_saghat_like(normalized, i) || (optInitalGaFix && is_qadar_like(normalized, i))) {
                result += SOFT_VOWELS[HARD_VOWELS.indexOf(normalized[i])]
            }

            continue
        }


    }

    return result
}
