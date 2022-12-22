To build and run basic testing for compat run the following command:
```
npm start
```

the output should be the following:
```
> wt-pkg@1.0.0 start
> npm run build && npm run pkg && npm run test


> wt-pkg@1.0.0 build
> tsc -p `pwd`/


> wt-pkg@1.0.0 pkg
> pkg .

> pkg@5.8.0
> Warning Failed to make bytecode node16-arm64 for file /snapshot/wt-pkg/node_modules/file-type/index.js
> Warning Failed to make bytecode node16-arm64 for file /snapshot/wt-pkg/node_modules/rusha/dist/rusha.js
> Warning Failed to make bytecode node16-arm64 for file /snapshot/wt-pkg/node_modules/file-type/core.js
> Warning Failed to make bytecode node16-arm64 for file /snapshot/wt-pkg/node_modules/file-type/supported.js
> Warning Failed to make bytecode node16-arm64 for file /snapshot/wt-pkg/node_modules/file-type/util.js

> wt-pkg@1.0.0 test
> npm run testStream


> wt-pkg@1.0.0 testStream
> ./dist/wt-pkg -m='magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4'

{
  torrentKey: undefined,
  localURL: 'http://localhost:59492',
  networkURL: 'http://192.168.1.209:59492',
  networkAddress: '192.168.1.209'
}
```
then exit with control+c and run the following commands:
```
chmod +x dist/wt-pkg
dist/wt-pkg --help
```

the output with the help will follow:
```

  Usage: index.js [options] [command]
  
  Commands:
    help     Display help
    version  Display version
  
  Options:
    -d, --debug          extensive logs
    -D, --downloadLimit  speed limit for media
    -h, --help           Output usage information
    -m, --media          a magnet link to media
    -p, --path           filesystem path to new torrent
    -s, --seed           a magnet link to media for seed
    -v, --version        Output the version number
  

```