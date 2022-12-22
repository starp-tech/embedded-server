let debugMode = false
const args = require('args')
args
  .option('media', 'a magnet link to media')
  .option('seed', 'a magnet link to media for seed')
  .option('debug', 'extensive logs')
  .option('path', 'filesystem path to new torrent')
  .option('downloadLimit', "speed limit for media")

const flags = args.parse(process.argv)

if(flags.debug) {
	console.info("debugMode", flags.debug)
	debugMode = true
}
else {
	console = {
		...console,
		log:()=>{},
		warn:()=>{},
		error:()=>{}
	}
}

const util = require('util')
const fs = require('fs')
const networkAddress = require('network-address')
const path = require('path')
const WebTorrent = require('webtorrent')
const createTorrent = require('create-torrent')

let server:any;


const startServer = async (media:any, print?:boolean) => 
	new Promise(resolve=>{
		
		if(debugMode)
			console.info('startServer for media', media)

	  if (server) return

	  server = media.createServer()
	  server.listen(0, () => {
	    const port = server.address().port
	    const urlSuffix = ':' + port
	    const info = {
	      torrentKey: media.key,
	      localURL: 'http://localhost' + urlSuffix,
	      networkURL: 'http://' + networkAddress() + urlSuffix,
	      networkAddress: networkAddress()
	    }
	    
	    if(debugMode || print)
	    	console.info(info)

	    resolve(info)
	  })
	})

const createMedia = async (filePath:string) => {
	createTorrent(filePath, (err:any, torrent:any) => {
	  if (!err) {
	    client.add(torrent, async (media:any)=>{
	    	await startServer(media)
	    	console.info(media.magnetURI)
	    })
	  }
	})
}

const client = new WebTorrent({
	downloadLimit:flags.downloadLimit
})

if(debugMode)
	console.info('Start With Flags', flags)

if(flags.media) {
	
	if(debugMode)
		console.info("client add media")

	client.add(
		flags.media, 
		(media:any) => startServer(media, true)
	)
}

if(flags.path) 
	createMedia(flags.path)

if(debugMode)
	console.info("Stop App")