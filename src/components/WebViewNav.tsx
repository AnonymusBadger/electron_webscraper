import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const WebViewNav = ({ webview, url }) => {
    const [initialUrl, setInitialUrl] = useState(url);
    const [canGoBack, setCanGoBack] = useState(false);
    const [isReloading, setIsReloading] = useState(false);

    const goBack = () => {
        webview.goBack();
    };

    const reload = () => {
        setIsReloading(true);
        webview.loadUrl(initialUrl);
    };

    useEffect(() => {
        if (url !== initialUrl) {
            webview.clearHistory();
            setCanGoBack(false);
            setInitialUrl(url);
            return;
        }

        if (isReloading) {
            webview.clearHistory();
            setCanGoBack(false);
            setIsReloading(false);
            return;
        }

        setCanGoBack(webview.canGoBack);
    }, [webview]);

    return (
        <ButtonGroup>
            <Button variant="secondary" onClick={goBack} disabled={!canGoBack}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <Button variant="danger" onClick={reload} disabled={!canGoBack}>
                <FontAwesomeIcon icon={faArrowsRotate} />
            </Button>
        </ButtonGroup>
    );
};

export default WebViewNav;
