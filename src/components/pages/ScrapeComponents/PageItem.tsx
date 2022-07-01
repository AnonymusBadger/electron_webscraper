import { useState, useEffect } from 'react';

const PageItem = () => {
    const [pageCount, setPageCount] = useState(null);

    useEffect(() => {
        window.electron.ipcRenderer.on('scrape-page', (pageNum: number) => {
            setPageCount(pageNum);
        });
    }, []);

    return <h3>Scraping pages{pageCount ? `: ${pageCount}` : ''}</h3>;
};

export default PageItem;
