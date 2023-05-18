const detectParser = (filePath, {document, text}) => {
    //check for spell
    if(isSpell(document)) {
        return "spell";
    }

    return ""; //unknown or invalid
};

const reSpell = /^(?<spellName>(?:\w|\s|\')+)--\s*(?<spellLevel>\d)(?:st|nd|th|rd)\s*Level\s*(?:Priest|Wizard)\s*Spell\s*\((?<source>(?:\w|\s|\')+)\)$/i;
const isSpell = (document) => {
    reSpell.lastIndex = 0;
    let title = document.querySelector("title").innerText.trim();
    return reSpell.test(title);
}

export default detectParser;