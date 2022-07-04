import PompidouScraper from './pompidou/PompidouScraper';
import PompidouImageDownloader from './pompidou/PompidouImageDownloader';
import DaliScraper from './dali/DaliScraper';
import DaliImageDownloader from './dali/DaliImageDownloader';

const ScraperFactory = (scraperName: string) => {
    let scraper;
    let imageDownloader;

    switch (scraperName) {
        case 'Centre Pompidou':
            scraper = PompidouScraper;
            imageDownloader = PompidouImageDownloader;
            break;
        case 'Salvador Dalí':
            scraper = DaliScraper;
            imageDownloader = DaliImageDownloader;
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
