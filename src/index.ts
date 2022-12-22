const util = require('util')
const fs = require('fs')
const networkAddress = require('network-address')
const path = require('path')
const args = require('args')
const WebTorrent = require('webtorrent')
const createTorrent = require('create-torrent')

const client = new WebTorrent({
	// downloadLimit:1000
})
let server:any;
let debugMode = false

args
  .option('media', 'a magnet link to media')
  .option('seed', 'a magnet link to media for seed')
  .option('debug', 'extensive logs', false)
  .option('path', 'filesystem path to new torrent')

const startServer = async (media:any) => 
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
	    console.info(info)
	    resolve(info)
	  })
	})

const createMedia = async (filePath:string) => {
	createTorrent(filePath, (err:any, torrent:any) => {
	  if (!err) {
	    client.add(torrent, (media:any)=>{
	    	console.info(media)
	    })
	  }
	})
}

const flags = args.parse(process.argv)

if(flags.debug === true) {
	debugMode = true
}

if(debugMode)
	console.info('Start With Flags', flags)

if(flags.seed)
	client.seed(flags.seed, (media:any)=>{
    console.log('Client is seeding ' + media)
	})

if(flags.media) 
	client.add(
		flags.media, 
		(media:any) => startServer(media)
	)

if(flags.path) 
	createMedia(flags.path)

if(debugMode)
	console.info("Stop App")