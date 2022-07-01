import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import SelectSavePath from 'components/SelectSavePath';
import SelectWebsite from 'components/SelectWebsite';
import WebView from 'components/WebView';
import Instructions from 'components/Instructions';
import WebViewNav from 'components/WebViewNav';
import SearchNamer from 'components/SearchNamer';
import './main.scss';
import configs from 'website_config';

const Main = () => {
    const [savePath, setSavePath] = useState(null);
    const [config, setConfig] = useState(null);
    const [webView, setWebView] = useState({
        canGoBack: false,
        canGoForward: false,
        getUrl: () => null,
    });
    const [isValidUrl, setIsValidUrl] = useState(false);
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        window.electron.ipcRenderer.on('get-savePath', (path) => {
            if (path) setSavePath(path);
        });
        window.electron.ipcRenderer.sendMessage('get-savePath');
    }, []);

    const validateUrl = (view) => {
        const webViewUrl = view.getUrl();

        return config.validUrls.some((url) => {
            return webViewUrl.includes(url);
        });
    };

    useEffect(() => {
        if (config) {
            setIsValidUrl(validateUrl(webView));
        }
    }, [webView]);

    const handleConfigSwitch = (config) => {
        setConfig(config);
    };

    const onRun = () => {
        const data = {
            config: config.name,
            savePath,
            searchName,
            url: webView.getUrl(),
        };

        window.electron.ipcRenderer.sendMessage('start-scrape', data);
    };

    const handleSetPath = () => {
        window.electron.ipcRenderer.once('select-folder', (response) => {
            if (!response.canceled) {
                const path = response.filePaths[0];
                setSavePath(path);
                window.electron.ipcRenderer.sendMessage('set-savePath', [path]);
            }
        });
        window.electron.ipcRenderer.sendMessage('select-folder', []);
    };

    const handleOpenPath = () => {
        window.electron.ipcRenderer.sendMessage('open-path', [savePath]);
    };

    const handleNameSearch = (value: string) => {
        setSearchName(value.trim());
    };

    const renderView = () => {
        if (config) {
            return <WebView url={config.url} setWebView={setWebView} />;
        }
        return (
            <div className="h-100 d-flex align-items-center justify-content-center">
                <div className="w-25">
                    <Instructions />
                </div>
            </div>
        );
    };

    const renderViewNav = () => {
        if (config) {
            return <WebViewNav webview={webView} url={config.url} />;
        }
        return null;
    };

    return (
        <Container fluid className="m-0 p-0 h-100">
            <div className="bg-dark p-3 border-bottom border-warning border-5 controlsContainer">
                <div className="text-white d-flex gap-3 controlls">
                    <SelectWebsite
                        websites={configs}
                        onSelect={handleConfigSwitch}
                    />
                    <SelectSavePath
                        className="selectPath"
                        savePath={savePath}
                        onSet={handleSetPath}
                        onOpen={handleOpenPath}
                    />
                    <SearchNamer onChange={handleNameSearch} />
                    <Button
                        className="float-end d-flex align-items-center runBtn"
                        variant="warning"
                        type="submit"
                        onClick={onRun}
                        disabled={!(config && savePath && isValidUrl)}
                    >
                        <FontAwesomeIcon icon={faPlay} className="me-2" />
                        Run
                    </Button>
                    <div className="browserControlls">{renderViewNav()}</div>
                </div>
            </div>
            <div className="h-100">{renderView()}</div>
        </Container>
    );
};

export default Main;
