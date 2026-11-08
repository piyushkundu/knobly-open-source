import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const FIREBASE_CLI_VERSION = '15.35.0';
const cache = path.join(os.homedir(), '.cache', 'knobly-emulators');

function javaVersion(executable) {
  const result = spawnSync(executable, ['-version'], { encoding: 'utf8', windowsHide: true });
  const version = (result.stderr ?? '') + (result.stdout ?? '');
  return result.status === 0 && Number(version.match(/version "(\d+)/)?.[1]) >= 21;
}

export async function prepareEmulatorTools() {
  await mkdir(cache, { recursive: true });
  let java = 'java';
  if (!javaVersion(java)) {
    let saved;
    try { saved = JSON.parse(await readFile(path.join(cache, 'java.json'), 'utf8')); } catch { /* first setup */ }
    if (saved?.java && path.relative(cache, saved.java).startsWith('java-') && javaVersion(saved.java)) {
      java = saved.java;
    } else {
      if (process.platform !== 'win32' || process.arch !== 'x64') throw new Error('Install Java 21+ on PATH before running the emulator tests.');
      const response = await fetch('https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jre&os=windows&vendor=eclipse', { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error('Unable to obtain official Java metadata');
      const [release] = await response.json();
      const binary = release.binary.package;
      const download = new URL(binary.link);
      if (download.protocol !== 'https:' || download.hostname !== 'github.com' || !download.pathname.startsWith('/adoptium/temurin21-binaries/releases/') || !/^[a-f0-9]{64}$/.test(binary.checksum)) throw new Error('Unexpected Java download metadata');
      console.error('Downloading and verifying a portable Java 21 runtime...');
      const archive = await fetch(download, { signal: AbortSignal.timeout(180000) });
      if (!archive.ok) throw new Error('Java download failed');
      const bytes = Buffer.from(await archive.arrayBuffer());
      if (createHash('sha256').update(bytes).digest('hex') !== binary.checksum) throw new Error('Java checksum mismatch');
      const directory = path.join(cache, 'java-' + release.release_name.replace(/[^\w.-]/g, '_'));
      const zip = directory + '.zip';
      await mkdir(directory, { recursive: true });
      await writeFile(zip, bytes);
      const quote = value => "'" + value.replaceAll("'", "''") + "'";
      const extraction = spawnSync('powershell', [ '-NoProfile', '-Command',
        `Expand-Archive -LiteralPath ${quote(zip)} -DestinationPath ${quote(directory)} -Force`], { encoding: 'utf8', windowsHide: true });
      if (extraction.status !== 0) throw new Error('Portable Java extraction failed: ' + extraction.stderr);
      const folders = await readdir(directory, { withFileTypes: true });
      const root = folders.find(entry => entry.isDirectory());
      if (!root) throw new Error('Missing Java runtime folder');
      java = path.join(directory, root.name, 'bin', 'java.exe');
      if (!javaVersion(java)) throw new Error('Portable Java 21 verification failed');
      await writeFile(path.join(cache, 'java.json'), JSON.stringify({ java, release: release.release_name, sha256: binary.checksum }, null, 2));
    }
  }
  return { java, firebaseCliVersion: FIREBASE_CLI_VERSION, cache };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await prepareEmulatorTools()));
}
