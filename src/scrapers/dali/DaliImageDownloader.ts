import { BrowserWindow } from 'electron';
import Jimp from 'jimp';
import { sleepBetween } from '../../utils/Sleep';

const downloadImage = async (url: string, path: string) => {
    try {
        const image = await Jimp.read(url);
        await image.writeAsync(path);
    } catch (error) {
        if (
            error.code === 'ETIMEDOUT' ||
            error.code === 'EHOSTUNREACH' ||
            error.code === 'ECONNRESET'
        ) {
            console.log('Timeout on: ', path);
            return downloadImage(url, path);
        }

        console.log(error);
    }
};

const DaliImageDownloader = (() => {
    const run = async (
        data: object[],
        savePath: string,
        window: BrowserWindow
    ) => {
        window.webContents.send('scrape-images-isRunning', true);

        const iterator = data.values();

        const workers = new Array(5).fill(iterator).map(async (iterator) => {
            for (const artwork of iterator) {
                const fileName = artwork['Numéro de catalogue'];
                const fileSavePath = `${savePath}/${fileName}.jpg`;

                await sleepBetween(10, 150);
                await downloadImage(artwork.ImageUrl, fileSavePath);

                window.webContents.send('scrape-image-done');
            }
        });

        await Promise.allSettled(workers);

        // await Promise.all(
        //     data.map(async (artwork) => {
        //         const fileName = artwork['Numéro de catalogue'];
        //         const fileSavePath = `${savePath}/${fileName}.jpg`;

        //         await sleepBetween(10, 150);
        //         await downloadImage(artwork.ImageUrl, fileSavePath);

        //         window.webContents.send('scrape-image-done');
        //     })
        // );

        window.webContents.send('scrape-images-isRunning', false);
        window.webContents.send('scrape-images-isDone');
    };

    return { run };
})();

export default DaliImageDownloader;
