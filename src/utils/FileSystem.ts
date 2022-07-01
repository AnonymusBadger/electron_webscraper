import fs, { PathLike } from 'fs';

const mkdir = (path: PathLike) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        return path;
    }

    return path;
};

const mkdirWithTimeStamp = (path: PathLike) => {
    const date = new Date();
    const pathWithTimeStamp = `${path}${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}:${date.getMinutes()}`;
    return mkdir(pathWithTimeStamp);
};

const rm = (path: PathLike) => {
    fs.rmSync(path, { recursive: true, force: true });
};

const writeFile = (path, data, options = {}) => {
    fs.writeFileSync(path, data, options);
};

const FileSystem = (() => {
    return {
        mkdir,
        mkdirWithTimeStamp,
        rm,
        writeFile,
    };
})();

export default FileSystem;
