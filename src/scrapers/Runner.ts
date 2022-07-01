import path from 'path';
import { Notification } from 'electron';
import FileSystem from '../utils/FileSystem';
import configs from '../website_config';
import ScraperFactory from './ScraperFactory';

const dfd = require('danfojs');

const sortObjectByKey = (unordered: object) => {
    const ordered = Object.keys(unordered)
        .sort()
        .reduce((obj, key) => {
            const valEscaped = unordered[key].replaceAll('"', "'");
            obj[`"${key}"`] = `"${valEscaped}"`;
            return obj;
        }, {});

    return ordered;
};

const fillUnique = (scrapedData: object[]) => {
    const keys = new Set();

    for (let i = 0; i < scrapedData.length - 1; i += 1) {
        const d2Keys = Object.keys(scrapedData[i + 1]);

        d2Keys.forEach((key) => {
            if (!(key in scrapedData[i])) {
                keys.add(key);
            }
        });
    }

    scrapedData.forEach((d) => {
        keys.forEach((key) => {
            if (!(key in d)) d[key] = '-';
        });
    });

    return scrapedData;
};

const fillAndSortData = (data: object[]) => {
    const filled = fillUnique(data);
    const ordered = filled.reduce((array, oldObj) => {
        array.push(sortObjectByKey(oldObj));
        return array;
    }, []);

    return ordered;
};

const writeCSV = (data, savePath: string) => {
    const df = new dfd.DataFrame(data);
    const csv = dfd.toCSV(df);
    console.log('Writing to: ', `${savePath}/data.csv`);
    FileSystem.writeFile(`${savePath}/data.csv`, csv);
};

const createSaveDir = (savePath, searchName) => {
    FileSystem.mkdir(savePath);

    if (searchName) {
        savePath = path.join(savePath, searchName);
        savePath = `${savePath}_`;
    } else {
        savePath = `${savePath}/`;
    }

    savePath = FileSystem.mkdirWithTimeStamp(savePath);

    return savePath;
};

const Runner = (() => {
    const start = async (data: object, mainWindow: BrowserWindow) => {
        try {
            const config = configs.get(data.config);
            let savePath = path.join(data.savePath, config.saveDir);

            savePath = createSaveDir(savePath, data.searchName);

            const scraper = ScraperFactory(config.name);

            const scrapedData = await scraper.getData(data.url, mainWindow);
            const cleanData = fillAndSortData(scrapedData);

            writeCSV(cleanData, savePath);
            mainWindow.webContents.send('scraper-dir-created', savePath);

            await scraper.getImages(
                scrapedData,
                `${savePath}/images`,
                mainWindow
            );

            mainWindow.webContents.send('scraper-isDone');

            new Notification({ title: 'Scraper', body: 'Has finished' }).show();
        } catch (error) {
            new Notification({
                title: 'Scraper',
                body: 'Encountered error',
            }).show();

            mainWindow.webContents.send('scraper-error', error);
            mainWindow.webContents.send('scraper-isDone');
        }
    };

    return {
        start,
    };
})();

export default Runner;
