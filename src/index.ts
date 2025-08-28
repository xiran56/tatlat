import { transliterate_cyrillic } from "./transliterator";

document.getElementById('rulesToggle').addEventListener('click', function() {
    const content = document.getElementById('rulesContent');
    const arrow = this.querySelector('.arrow');
    
    content.classList.toggle('show');
    arrow.classList.toggle('rotated');
});


// Обработчик кнопки транслитерации
document.getElementById('transliterateBtn').addEventListener('click', function() {
    const getOpt = (n: string) => (document.getElementById(n) as HTMLInputElement).checked;

    const inputText = (document.getElementById('inputText') as HTMLInputElement).value;
    const outputText = transliterate_cyrillic(inputText, getOpt('optJanalifA'), getOpt('optTraditionalYa'), getOpt('optZamanalifIa'), getOpt('optInitalGaFix'), getOpt('optIotatedUppercaseFix'));

    (document.getElementById('outputText') as HTMLTextAreaElement).value = outputText;
});
