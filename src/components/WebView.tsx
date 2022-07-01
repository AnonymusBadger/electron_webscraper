import { useRef, useEffect } from 'react';

const WebView = ({
    url,
    setWebView,
}: {
    url: string;
    setWebView: () => void;
}) => {
    const ref = useRef(null);

    const updateState = () => {
        setWebView({
            canGoBack: ref.current.canGoBack(),
            canGoForward: ref.current.canGoForward(),
            goBack: () => ref.current.goBack(),
            goForward: () => ref.current.goForward(),
            clearHistory: () => ref.current.clearHistory(),
            loadUrl: (url) => ref.current.loadURL(url),
            getUrl: () => ref.current.getURL(),
        });
    };

    useEffect(() => {
        ref.current.addEventListener('did-navigate', updateState);
        ref.current.addEventListener('did-navigate-in-page', updateState);
    }, []);

    return (
        <webview
            ref={ref}
            src={url}
            style={{
                width: '100vw',
                height: '100%',
            }}
        />
    );
};

export default WebView;
