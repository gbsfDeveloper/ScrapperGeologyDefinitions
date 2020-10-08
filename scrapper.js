const puppeteer = require('puppeteer');

async function getInformation() {
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0); 
    console.log("Abriendo pagina");
    await page.goto('http://www.ugr.es/~agcasco/personal/rac_geologia/rac.htm');
    await page.waitForXPath(`/html/body/blockquote/p/b`);
    var elements = [];
    const elhandle = await page.$x(`/html/body/blockquote/p/b`);
    for(const [key, value] of Object.entries(elhandle)){ // ECMAscript 2017
    // for(let value=0 ; value < elhandle.length; value++){ // with vanilla JS
        let element = await page.evaluate(function(el) {
            let pElement = el.closest('p');
            let pCleanHTML = pElement.innerHTML.replace(/(\r\n\t|\n|\r\t|\t|ā)/gm,"").replace(/'/gm,"\"");
            if (pElement.childNodes[pElement.childNodes.length - 1].textContent.length < 7) {
                pText = pElement.childNodes[pElement.childNodes.length - 2].textContent
                pText = pText.replace(/(\r\n\t|\n|\r\t|\t|ā)/gm,"").replace(/'/gm,"\"").trim();
            }
            else{
                pText = pElement.childNodes[pElement.childNodes.length - 1].textContent
                pText = pText.replace(/(\r\n\t|\n|\r\t|\t|ā)/gm,"").replace(/'/gm,"\"").trim();
            }

            return {
                "main_title":pElement.childNodes[0].textContent,
                "main_text":pText,
                "main_html":pCleanHTML.trim()
            }
        }, value);

        let element2 = await page.evaluate(function(el) {
            var pElement = el.closest('p');
            var iElement = pElement.getElementsByTagName('i');
            var engHTML = "";
            var engTEXT = "";

            if(typeof(iElement) !== undefined && iElement.length > 0){
                engHTML = iElement[0].outerHTML.replace(/(\r\n\t|\n|\r\t|\t|ā)/gm,"").replace(/'/gm,"\"").trim();
                var spanElement = pElement.getElementsByTagName('span');
                if (typeof(spanElement) !== undefined && spanElement.length > 0) {
                    engTEXT = spanElement[0].textContent.replace(/(\r\n\t|\n|\r\t|\t|ā)/gm,"").replace(/'/gm,"\"").trim();
                }
                else{
                    engTEXT = iElement[0].textContent.replace(/(\r\n\t|\n|\r\t|\t|ā)/gm,"").replace(/'/gm,"\"").trim();
                }
            }
            
            return {
                "eng_html" : engHTML,
                "eng_text" : engTEXT
            }
        }, value);
        
        elements[key] = Object.assign(element,element2);
    }
    
    console.log("Finalizado");
    await browser.close();
    return elements;
};

module.exports = {
    getInformation
}

// COPYRIGHT
// Reproducido de “RACEFN Glosario de Geología” por Universidad de Granada, 2020 (http://www.ugr.es/~agcasco/personal/rac_geologia/rac.htm). 