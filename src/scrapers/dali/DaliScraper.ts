import { BrowserWindow } from 'electron';
import NetIO from '../../utils/NetIO';
import { sleepBetween } from '../../utils/Sleep';

let pageCounter = 1;
const baseUrl = 'https://www.salvador-dali.org';
const GLOBAL = {};

const io = NetIO({
    baseURL: baseUrl,
});

const getBasicData = ($, dl, data: {}) => {
    const dt = $(dl).find('dt');

    dt.each((_: number, el: HTMLElement) => {
        const dd = $(el).next();

        const fieldName = $(el)
            .text()
            .replace(/\s+/g, ' ')
            .trim()
            .replace(':', '');
        const fieldData = dd.text().replace(/\s+/g, ' ').trim();

        data[fieldName] = fieldData;
    });

    return data;
};

const parseArtwork = async (url: string) => {
    try {
        await sleepBetween(10, 150);
        const $ = await io.getHtmlFromUrl(url);
        let data = {};

        const dataContainer = $('.fitxa-obra');

        data['Numéro de catalogue'] = $(dataContainer)
            .find('p.cat')
            .text()
            .replace('Núm. cat. ', '')
            .trim();

        const h2 = $(dataContainer).find('.collapsible > h2');

        h2.each((_: number, el: JQuery) => {
            if ($(el).hasClass('descr')) {
                data = getBasicData($, $(el).next(), data);
            } else if ($(el).hasClass('contact')) {
            } else {
                const fieldName = $(el).text().replace(/\s+/g, ' ').trim();
                const fieldData = $(el)
                    .next()
                    .text()
                    .replace(/\s+/g, ' ')
                    .trim();
                data[fieldName] = fieldData;
            }
        });

        // get image url;
        const imageUrl = $('.foto-obra img').attr('src');

        // add other props
        data.Url = `${baseUrl}${url}`;
        data.ImageUrl = `${baseUrl}${imageUrl}`;

        return data;
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'EHOSTUNREACH') {
            console.log('Timeout on: ', url);
            return parseArtwork(url);
        }

        console.log(error);
    }
};

const parsePage = async (url: string, artworkUrls = []): Promise<object[]> => {
    await sleepBetween(10, 150);
    try {
        const $ = await io.getHtmlFromUrl(url);

        const artworks = $('.obra__title > a');

        if (artworks.length > 0) {
            GLOBAL.window.webContents.send('scrape-page', pageCounter);

            const nextUrl = url.replace(
                `page=${pageCounter}`,
                `page=${pageCounter + 1}`
            );
            pageCounter += 1;

            artworks.map((_: number, artwork) => {
                artworkUrls.push(artwork.attribs.href);
                return artworkUrls;
            });

            return await parsePage(nextUrl, artworkUrls);
        }
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'EHOSTUNREACH') {
            console.log('Timeout on: ', url);
            return parsePage(url, artworkUrls);
        }
    }

    return artworkUrls;
};

const DaliScraper = (() => {
    const run = async (url: string, window: BrowserWindow) => {
        GLOBAL.window = window;
        pageCounter = 1;
        const nextUrl = `${url}&page=${pageCounter}`;
        GLOBAL.window.webContents.send('scrape-page-isRunning', true);
        const artworkUrls = await parsePage(nextUrl);
        GLOBAL.window.webContents.send('scrape-page-isDone');
        GLOBAL.window.webContents.send('scrape-page-isRunning', false);

        const artworksData = [];

        GLOBAL.window.webContents.send('scrape-artwork-isRunning', true);
        GLOBAL.window.webContents.send(
            'scrape-artworks-total',
            artworkUrls.length
        );

        await Promise.all(
            await artworkUrls.map(async (artworkUrl) => {
                const data = await parseArtwork(artworkUrl);
                artworksData.push(data);
                GLOBAL.window.webContents.send('scrape-artwork-done');
            })
        );

        GLOBAL.window.webContents.send('scrape-artwork-isDone');
        GLOBAL.window.webContents.send('scrape-artwork-isRunning', false);

        return artworksData;
    };

    return { run };
})();

export default DaliScraper;
