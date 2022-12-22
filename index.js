
const crypto = require('crypto')
const util = require('util')
const fs = require('fs')
const networkAddress = require('network-address')
const path = require('path')
const args = require('args')
const WebTorrent = require('webtorrent')

const client = new WebTorrent({
	// downloadLimit:1000
})
let server;
let debugMode = false

args
  .option('media', 'a magnet link to media')
  .option('debug', 'extensive logs', false)

const startServer = async (media) => 
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

const flags = args.parse(process.argv)

if(flags.debug === true) {
	debugMode = true
}

if(debugMode)
	console.info('Start With Flags', flags)

if(flags.media) 
	client.add(
		flags.media, 
		(media) => startServer(media)
	)

if(debugMode)
	console.info("Stop App")