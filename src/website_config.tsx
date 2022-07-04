const configs = new Map([
    [
        'Centre Pompidou',
        {
            name: 'Centre Pompidou',
            saveDir: 'Centre Pompidou',
            url: 'https://www.centrepompidou.fr/fr/recherche/oeuvres?withImage=oui',
            validUrls: ['www.centrepompidou.fr/fr/recherche/oeuvres'],
        },
    ],
    [
        'Salvador Dalí',
        {
            name: 'Salvador Dalí',
            saveDir: 'Salvador Dalí',
            url: 'https://www.salvador-dali.org/fr/oeuvre/catalogue-raisonne-peinture/',
            validUrls: [
                'https://www.salvador-dali.org/fr/oeuvre/catalogue-raisonne-peinture/obres/',
            ],
        },
    ],
]);

export default configs;
