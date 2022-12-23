let debugMode = false
import args from 'args'
import * as fs from 'fs'
import networkAddress from 'network-address'

args
  .option('media', 'a link to media')
  .option('binary', 'a binary of media file to stream')
  .option('outputBinary', 'add binary output for the media file')
  .option('seed', 'a magnet link to media for seed')
  .option('debug', 'extensive logs')
  .option('path', 'filesystem path to new media')
  .option('downloadLimit', "speed limit for media")
  .option('hybrid', "enable webrtc hybrid mode")

const flags = args.parse(process.argv)

if(flags.debug) {
	console.log("debugMode")
	console.log(__dirname)
	console.log(fs.readdirSync(__dirname), fs.readdirSync(__dirname.replace('src', "")))
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
		      networkAddress: networkAddress(),
		      "isWTPKGInfoJSON":true
		    }
		    const json = 
		    		JSON.stringify(info)
		    if(debugMode) {
		    	console.info(json)
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
    	console.log("createMedia res", media)

    	const mediaFile = media.torrentFile.toString("base64")
    	const json = {
    		files:[media.files.map(f=>f.name)],
    		magnetURI:media.magnetURI,
    		infoHash:media.infoHash,
    		length:media.length,
    		created:media.created,
    		createdBy:media.createdBy,
    		mediaFile:null,
    	}

    	if(flags.outputBinary)
    		json.mediaFile = mediaFile

    	process.stdout.write(JSON.stringify(json))
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

		console.info("no magnet buffer", media.toString("utf8"))
		
		if(!isBuffer) {
			media = media.toString("utf8");
		}

		console.log('no magnet', media)
	}
	try {
		client.add(
			media, 
			(nMedia:any) => startServer(nMedia, true)
		)
	} catch(err){
		console.error("addMedia error", err)
	}
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
			return addMedia(flags.media)
		}

		if(flags.binary) {
			console.log("client add binary")
			return addMediaBuffer(flags.binary)
		}

		if(flags.path) {
			console.log("client create media")
			return createMedia(flags.path)
		}

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