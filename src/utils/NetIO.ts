import axios, { AxiosRequestConfig } from 'axios';

const cheerio = require('cheerio');

const NetIO = (config: AxiosRequestConfig = {}) => {
    const instance = axios.create(config);

    const newInstance = (conf: AxiosRequestConfig) => {
        return NetIO(conf);
    };

    const getUrl = (url: string, conf = {}) => {
        console.log(`Requesting: ${url}`);
        return instance.get(url, conf);
    };

    const parseHtml = (data: string) => {
        return cheerio.load(data);
    };

    const getHtmlFromUrl = async (url: string) => {
        const resp = await getUrl(url);
        return parseHtml(resp.data);
    };

    return {
        createInstance: newInstance,
        getUrl,
        parseHtml,
        getHtmlFromUrl,
    };
};

export default NetIO;
