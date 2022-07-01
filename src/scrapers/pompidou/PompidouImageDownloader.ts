import mergeImg from 'merge-img-vwv';
import Jimp from 'jimp';
import NetIO from '../../utils/NetIO';
import { sleepBetween } from '../../utils/Sleep';

const io = NetIO();

const cleanUrl = (dirty) => {
    return dirty.replace(/\w*.jpg/g, '');
};

const testQuality = async (url: string, quality = 12): string => {
    const path = `${url}dzi/uhd_files/${quality}`;
    try {
        const resp = await io.getUrl(`${path}/0_0.jpg`);
    } catch (error) {
        if (error.code === 'ERR_BAD_REQUEST') {
            if (quality > 8) {
                return testQuality(url, quality - 1);
            }
            return `${url}/thumb_large.jpg`;
        }

        if (error.code === 'ETIMEDOUT' || error.code === 'EHOSTUNREACH') {
            console.log('Timeout on: ', path);
            return testQuality(url, quality);
        }
    }

    return path;
};

const getColumn = async (url: string, col = 0, row = 0, image = null) => {
    await sleepBetween(10, 150);
    const path = `${url}/${col}_${row}.jpg`;

    try {
        let nextImage = await Jimp.read(path);

        if (image === null) {
            image = nextImage;
        } else {
            image = await mergeImg([image, nextImage], {
                direction: true,
            });
        }

        nextImage = null;
        return getColumn(url, col, row + 1, image);
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'EHOSTUNREACH') {
            console.log('Timeout on: ', path);
            return getColumn(url, col, row, image);
        }

        console.log('Got column: ', col);

        return image;
    }
};

const buildImage = async (url: string, col = 0, row = 0, image = null) => {
    if (url.includes('thumb_large')) {
        image = await Jimp.read(url);
        return image;
    }

    try {
        console.log('Getting column: ', col);
        let column = await getColumn(url, col, row);

        if (image === null) {
            image = column;
        } else {
            image = await mergeImg([image, column]);
        }

        column = null;
        return buildImage(url, col + 1, row, image);
    } catch (error) {
        console.log('Build image', error);
        return image;
    }
};

const PompidouImageDownloader = (() => {
    const run = async (
        data: object[],
        savePath: string,
        window: BrowserWindow
    ) => {
        window.webContents.send('scrape-images-isRunning', true);

        for (const artwork of data) {
            const url = cleanUrl(artwork.ImageUrl);
            const bestQualityUrl = await testQuality(url);
            let image = await buildImage(bestQualityUrl);
            const fileName = artwork["N° d'inventaire"];

            const finalSavePath = `${savePath}/${fileName}.jpg`;
            console.log('Writing to:', finalSavePath);
            await image.writeAsync(finalSavePath);

            image = null;
            window.webContents.send('scrape-image-done');
        }

        window.webContents.send('scrape-images-isRunning', false);
        window.webContents.send('scrape-images-isDone');
    };

    return { run };
})();

export default PompidouImageDownloader;
