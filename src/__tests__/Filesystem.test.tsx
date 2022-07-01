import fs from 'fs';
import FileSystem from '../utils/FileSystem';

test('Creates new directory', () => {
    const path = '/home/kajetan/.tmp/test';
    expect(FileSystem.mkdir(path)).toBe(path);

    expect(fs.existsSync(path)).toBeTruthy();
    fs.rmdirSync(path);
});

test('Creates new directory with time stamp', () => {
    const path = '/home/kajetan/.tmp/test';
    FileSystem.mkdir(path);

    const pathWithTimeStamp = FileSystem.mkdirWithTimeStamp(`${path}/`);
    expect(pathWithTimeStamp).toBeDefined();
    expect(fs.existsSync(pathWithTimeStamp)).toBeTruthy();

    fs.rmSync(path, { recursive: true, force: true });
});
