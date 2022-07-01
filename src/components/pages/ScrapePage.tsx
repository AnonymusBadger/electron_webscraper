import ListGroup from 'react-bootstrap/ListGroup';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ListItem from './ScrapeComponents/ListItem';
import PageItem from './ScrapeComponents/PageItem';
import ArtworkItem from './ScrapeComponents/ArtworkItem';
import ImageItem from './ScrapeComponents/ImageItem';

const ScrapePage = () => {
    const [pageIsRunning, setPageIsRunning] = useState(false);
    const [pageIsDone, setPageIsDone] = useState(false);
    const [artworkIsRunning, setArtworkIsRunning] = useState(false);
    const [artworkIsDone, setArtworkIsDone] = useState(false);
    const [imagesIsRunning, setImagesIsRunning] = useState(false);
    const [imagesIsDone, setImagesIsDone] = useState(false);
    const [scraperIsDone, setScraperIsDone] = useState(false);
    const [saveDir, setSaveDir] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        window.electron.ipcRenderer.on(
            'scrape-page-isRunning',
            (state: boolean) => {
                setPageIsRunning(state);
            }
        );
        window.electron.ipcRenderer.once('scrape-page-isDone', () => {
            setPageIsDone(true);
        });
        window.electron.ipcRenderer.on(
            'scrape-artwork-isRunning',
            (state: boolean) => {
                setArtworkIsRunning(state);
            }
        );
        window.electron.ipcRenderer.once('scrape-artwork-isDone', () => {
            setArtworkIsDone(true);
        });
        window.electron.ipcRenderer.on(
            'scrape-images-isRunning',
            (state: boolean) => {
                setImagesIsRunning(state);
            }
        );
        window.electron.ipcRenderer.once('scrape-images-isDone', () => {
            setImagesIsDone(true);
        });
        window.electron.ipcRenderer.once('scraper-dir-created', (path) => {
            setSaveDir(path);
        });
        window.electron.ipcRenderer.once('scraper-isDone', () => {
            setScraperIsDone(true);
        });
        window.electron.ipcRenderer.on('scraper-error', (error) => {
            setErrorMessage(error);
        });
    }, []);

    const handleOpenDirectory = () => {
        window.electron.ipcRenderer.sendMessage('open-path', [saveDir]);
    };

    const handleCloseScraper = () => {
        window.electron.ipcRenderer.sendMessage('close-scraper', null);
    };

    const renderError = () => {
        if (errorMessage) {
            return (
                <Alert variant="danger" className="overflow-auto h-100 m-0">
                    {errorMessage}
                </Alert>
            );
        }

        return <div className="h-100" />;
    };

    return (
        <div className="d-flex flex-column vh-100">
            <ListGroup as="ul">
                <ListItem
                    child={<PageItem />}
                    isRunning={pageIsRunning}
                    isDone={pageIsDone}
                />
                <ListItem
                    child={<ArtworkItem />}
                    isRunning={artworkIsRunning}
                    isDone={artworkIsDone}
                />
                <ListItem
                    child={<ImageItem />}
                    isRunning={imagesIsRunning}
                    isDone={imagesIsDone}
                />
            </ListGroup>
            {renderError()}
            <div className="bg-dark p-3 border-top border-warning border-5 controlsContainer">
                <div className="text-white d-flex gap-3 controlls">
                    <Button
                        variant="light"
                        disabled={!saveDir}
                        onClick={handleOpenDirectory}
                    >
                        Browse files
                    </Button>
                    <Button
                        variant="danger"
                        disabled={!scraperIsDone}
                        onClick={handleCloseScraper}
                    >
                        Finish
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ScrapePage;
