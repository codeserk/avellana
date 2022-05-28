const axios = require('axios')
const { chunk } = require('lodash')
const { promisify } = require('util')
const progress = require('cli-progress')

const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp');

const path = require('path')
const fs = require('fs')

const TMPDIR = '.temp/downloads'

class WordPressDownloadMedia {
    static defaultOptions () {
        return {
            downloadFolder: 'media/'
        }
    }

    constructor (api, options) {
        this.options = options
        this.fileExists = promisify(fs.exists)

        this.tmpCount = 0
        this.createDirectory(TMPDIR)
        this.createDirectory(this.options.downloadFolder)

        api.loadSource(async store => {
            const mediaType = store.getCollection('WordPressAttachment')
            const media = mediaType.findNodes()

            const bar = new progress.SingleBar({
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                linewrap: true,
                stopOnComplete: true,
            })
            bar.start(media.length)

            const pwd = path.resolve(this.options.downloadFolder).toString()
            const chunks = chunk(media, 100)
            await chunks.reduce(async (promise, chunk) => {
                await promise

                return Promise.all(
                    chunk.map(async mediaItem => {
                        const filename = mediaItem.mediaDetails.file.split('/').pop()
                        await this.downloadImage(mediaItem.sourceUrl, 'media/', filename)

                        const src = `${pwd}/min/${filename}`
                            .replace(/\.[^/.]+$/, '.webp')
                            .toString()

                        await mediaType.updateNode({
                            ...mediaItem,
                            src,
                        })

                        bar.increment()
                    })
                )
            }, Promise.resolve())

            console.log('Optimizing media...')
        })
    }

    createDirectory (dir) {
        const pwd = path.resolve(dir)
        if (!fs.existsSync(pwd)) {
            console.log(`Creating directory: ${pwd}`)
            fs.mkdirSync(pwd, { recursive: true })
        }

        return pwd
    }

    async downloadImage (url, destPath, fileName) {
        const imagePath = await path.resolve(destPath, fileName)

        try {
            if (await this.fileExists(imagePath)) {
                return
            }
        } catch (err) {
            console.log(err)
        }

        const tmpPath = path.resolve(TMPDIR, `${++this.tmpCount}.tmp`)
        const writer = fs.createWriteStream(tmpPath)
        try {
            console.log('getting from url', url)
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            })
            response.data.pipe(writer)

            await new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    writer.close()
                    fs.rename(tmpPath, imagePath, resolve)
                })
                writer.on('error', reject)
            })

            await imagemin([imagePath], {
                destination: `${this.options.downloadFolder}min/`,
                plugins: [
                    imageminWebp({ quality: 80 })
                ]
            })
        } catch (e) {
            console.log('something went wrong', e)
            fs.unlinkSync(tmpPath)
        }
    }
}

module.exports = WordPressDownloadMedia