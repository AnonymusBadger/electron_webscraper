import { useState, useEffect } from 'react';

const ImageItem = () => {
    const [imagesCount, setImagesCount] = useState(0);
    const [imagesTotal, setImagesTotal] = useState(null);

    useEffect(() => {
        window.electron.ipcRenderer.once(
            'scrape-artworks-total',
            (num: number) => {
                setImagesTotal(num);
            }
        );
        window.electron.ipcRenderer.on('scrape-image-done', () => {
            setImagesCount((state) => {
                return state + 1;
            });
        });
    }, []);

    return (
        <h3>
            Downloading images
            {imagesTotal ? `: ${imagesCount}/${imagesTotal}` : ''}
        </h3>
    );
};

export default ImageItem;
