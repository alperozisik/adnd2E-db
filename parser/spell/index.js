import { parse as htmlParse } from 'node-html-parser';

const parse = (filePath, { document, text }) => {
    let spell = {};
    let spellTitle = parseTitle(document);
    let spellSchools = { schools: parseSchool(document) };
    let stats = parseSpellStatBlock(document);
    let body = parseSpellBody(document);
    Object.assign(spell, spellTitle, spellSchools, stats, body);

    return spell;
}

const parseTitle = (document) => {
    let reSpellTitle = /^(?<spellName>(?:\w|\s|\')+)--\s*(?<spellLevel>\d)(?:st|nd|th|rd)\s*Level\s*(?<spellType>Priest|Wizard)\s*Spell\s*\((?<source>(?:\w|\s|\')+)\)$/i;
    let title = document.querySelector("title").innerText.trim();
    let { groups: { spellName, spellLevel, source, spellType } } = reSpellTitle.exec(title);
    let spellTitle = { name: spellName, level: parseInt(spellLevel), source, type: spellType.toLowerCase() };
    return spellTitle;
};

const parseSchool = (document) => {
    let reSchools = /^\(?(?<schools>[\w\s\,\/]+)\)?$/;
    let e = document.querySelector('body > font:has(b) ~ font > b:not(:has(p))') || document.querySelector('body > font:has(b) ~ font > b') || document.querySelectorAll('body b')[1];
    let schoolsText = e.innerText.trim();
    let { groups: { schools } } = reSchools.exec(schoolsText);
    let schoolsArray = schools.split(",").map(s => s.trim()).sort();
    return schoolsArray;
};

const parseSpellStatBlock = (document) => {
    let statList = Array.prototype.map.call(document.querySelectorAll("td>font"), e => e.innerText.trim());
    //(6) ['Range: 10 yds.', 'Components: V, S, M', 'Duration: 4 hrs. + ½ hr./level', 'Casting Time: 1 rd.', 'Area of Effect: Up to 20-ft. cube', 'Saving Throw: None']
    let parsers = [
        /(?:^Range:\s*)(?<range>.*)(?:$)/i,
        /(?:^Components:\s*)(?<components>.*)(?:$)/i,
        /(?:^Duration:\s*)(?<duration>.*)(?:$)/i,
        /(?:^Casting Time:\s*)(?<castingTime>.*)(?:$)/i,
        /(?:^Area of Effect:\s*)(?<areaOfEffect>.*)(?:$)/i,
        /(?:^Saving Throw:\s*)(?<savingThrow>.*)(?:$)/i
    ];
    let stats = {};
    statList.forEach(s => {
        for (let i = 0; i < parsers.length; i++) {
            let result = getSpellStat(s, parsers[i]);
            if (result) {
                Object.assign(stats, result);
                parsers.splice(i, 1);
                return;
            }
        }
    });

}

const getSpellStat = (text, regex) => {
    let result = regex.exec(text);
    return result && result.groups
};

const parseSpellBody = (document) => {
    let spellBodyElements = Array.prototype.slice.call(document.querySelectorAll("body > table ~ *"),0,-2);
    let spellBodyHTML = spellBody.innerHTML.replace(/<p>\s*<\/p>/gi, "").replace(/<a href=".*"><\/a>/gi, "").trim().replace(/\r?\n(?!\r?\n)/gi, "").replace(/\n +/gi, "\n");
    let spellBodyText = htmlParse(`<root>${spellBodyHTML}</root>`).innerText.trim();
    return {
        bodyText: spellBodyText,
        bodyHTML: spellBodyHTML
    };
};


export { parse };