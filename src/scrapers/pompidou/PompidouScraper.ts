import NetIO from '../../utils/NetIO';
import { sleepBetween } from '../../utils/Sleep';

let pageCounter = 1;
const baseUrl = 'https://www.centrepompidou.fr';
const GLOBAL = {};

const io = NetIO({
    baseURL: baseUrl,
});

const parseArtwork = async (url: string) => {
    try {
        await sleepBetween(10, 150);
        const $ = await io.getHtmlFromUrl(url);

        const infoTableRows = $('#cartel-collapse tr');

        const data = {};

        infoTableRows.each((_: number, row: HTMLElement) => {
            const tr = $(row).find('th');
            const td = $(row).find('td');

            const fieldName = tr.text().replace(/\s+/g, ' ').trim();
            const fieldData = td.text().replace(/\s+/g, ' ').trim();
            data[fieldName] = fieldData;
        });

        // get image url;
        const imageUrl = $("meta[property='og:image']").attr('content');

        // add other props
        data.Url = `${baseUrl}${url}`;
        data.ImageUrl = imageUrl;

        return data;
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'EHOSTUNREACH') {
            console.log('Timeout on: ', url);
            return parseArtwork(url);
        }
    }
};

const parsePage = async (url: string, artworkUrls = []): Promise<object[]> => {
    await sleepBetween(10, 150);
    try {
        const $ = await io.getHtmlFromUrl(url);

        const artworks = $('.art-card > a');

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

const PompidouScraper = (() => {
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

    return {
        run,
    };
})();

export default PompidouScraper;
