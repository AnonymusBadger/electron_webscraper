import { useState, useEffect } from 'react';

const PageItem = () => {
    const [artworksCount, setArtworksCount] = useState(0);
    const [artworksTotal, setArtworksTotal] = useState(null);

    useEffect(() => {
        window.electron.ipcRenderer.once(
            'scrape-artworks-total',
            (num: number) => {
                setArtworksTotal(num);
            }
        );
        window.electron.ipcRenderer.on('scrape-artwork-done', () => {
            setArtworksCount((state) => {
                return state + 1;
            });
        });
    }, []);

    return (
        <h3>
            Scraping artworks
            {artworksTotal ? `: ${artworksCount}/${artworksTotal}` : ''}
        </h3>
    );
};

export default PageItem;
