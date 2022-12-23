let debugMode = false
import args from 'args'
import networkAddress from 'network-address'

args
  .option('media', 'a magnet link to media')
  .option('binary', 'a binary of media file to stream')
  .option('seed', 'a magnet link to media for seed')
  .option('debug', 'extensive logs')
  .option('path', 'filesystem path to new media')
  .option('downloadLimit', "speed limit for media")
  .option('hybrid', "enable webrtc hybrid mode")

const flags = args.parse(process.argv)

if(flags.debug) {
	process.stdout.write("debugMode")
	debugMode = true
}
else {
	console = {
		...console,
		log:()=>{},
		info:()=>{},
		warn:()=>{},
		error:()=>{}
	}
}

import * as webT from 'webtorrent'

let WebTorrent = webT;

let server:any;
let client:any;


export const startServer = async (media:any, print?:boolean) => 
	new Promise((resolve,reject)=>{
		try {
			console.log('startServer for media', media.magnetURI)

		  if (server) return

		  server = media.createServer()
		  server.listen(0, () => {
		    const port = server.address().port
		    const urlSuffix = ':' + port
			  

		    const info = {
		    	files:media.files.map(f=>f.name),
		    	port,
		      localURL: 'http://localhost' + urlSuffix,
		      networkURL: 'http://' + networkAddress() + urlSuffix,
		      networkAddress: networkAddress()
		    }
		    const json = 
		    		JSON.stringify(info)
		    if(debugMode) {
			    console.log(json)
		    }
		    if(print) {
		    	process.stdout.write(json)
		    }

		    resolve(info)
		  })

  	} catch(err){
	  	console.error("startServer error", err)
	  	reject(err)
  	}
	})

export const createMedia = async (filePath:string) => {
	try {
		client.seed(filePath, async (media:any) => {
    	// await startServer(media)
    	console.log(media.torrentFile)

    	const mediaFile = media.torrentFile.toString("base64")
    	process.stdout.write(mediaFile)
    	// console.info(mediaFile)
		})
	} catch(err){
  	console.error("createMedia error", err)
	}
}

export const addMedia = async (media, isBuffer = false) => {

	if(media.search("magnet") === -1) {
		console.log('no magnet', media)
		media = Buffer.from(media, 'base64')

		if(!isBuffer) {
			media = media.toString("utf8");
		}

		console.log('no magnet', media)
	}

	client.add(
		media, 
		(nMedia:any) => startServer(nMedia, true)
	)
}

export const addMediaBuffer = async (media) => addMedia(media, true)

const start = () => {
	try {
		console.info('start client')
		client = new WebTorrent.default({
			downloadLimit:flags.downloadLimit
		})

		console.log('did start client', client)

		if(flags.media) {
			console.log("client add media")
			addMedia(flags.media)
		}

		if(flags.binary) {
			console.log("client add binary")
			addMediaBuffer(flags.binary)
		}

		if(flags.path) 
			createMedia(flags.path)

		console.log("Wait For App")

	} catch(err) {
		console.error('app start error', err)
	}
}

export const setup = async () => {
	console.info('Start With Flags', flags)
	console.info('start setup hybrid')
	if(flags.hybrid) {
		try {
			const obj = await import('webtorrent-hybrid')
			WebTorrent = obj
			console.log('import hybrid', WebTorrent)
		} catch(err) {
			console.error("import hybrid error", err)
		}
	}

	console.log('after setup hybrid')
	await start()
}

setup()