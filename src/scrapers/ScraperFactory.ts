import PompidouScraper from './pompidou/PompidouScraper';
import PompidouImageDownloader from './pompidou/PompidouImageDownloader';

const ScraperFactory = (scraperName) => {
    let scraper;
    let imageDownloader;

    switch (scraperName) {
        case 'Centre Pompidou':
            scraper = PompidouScraper;
            imageDownloader = PompidouImageDownloader;
            break;
        default:
            throw new Error(`No scraper found for: ${scraperName}`);
    }

    return {
        getData: scraper.run,
        getImages: imageDownloader.run,
    };
};

export default ScraperFactory;
