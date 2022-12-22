To build and run basic testing for compat run the following command:
```
npm i
npm start
```

then exit with control+c and run the following commands:

```
chmod +x dist/wt-pkg
dist/wt-pkg-macos --help
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