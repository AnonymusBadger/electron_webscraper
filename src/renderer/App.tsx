import 'bootstrap/dist/css/bootstrap.min.css';
import Main from 'components/pages/Main';
import ScrapePage from 'components/pages/ScrapePage';
import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
    const [isScraping, setIsScraping] = useState(false);

    useEffect(() => {
        window.electron.ipcRenderer.on('isScraping', (state) => {
            setIsScraping(state);
        });
    }, []);

    if (isScraping) {
        return <ScrapePage />;
    }

    return <Main />;
}
