

export default class Controller {
  #view
  #worker
  #blinkCounter
  #camera
  constructor({view, worker, camera}) {
    this.#view = view
    this.#camera = camera
    this.#worker = this.#configureWorker(worker)

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('not yet detecting')
    return controller.init()
  }

  #configureWorker(worker) {
    let ready = false
    worker.onmessage = ({data}) => {
      if('READY' === data) {
        console.log('worker is ready');
        this.#view.enableButton()
        ready = true
        return
      }
      const blinked = data.blinked
      this.#blinkCounter += blinked
      this.#view.togglePlayVideo()
      console.log('blinked', blinked);
    }

    return {
      send(msg) {
        if(!ready) return
        worker.postMessage(msg)
      }
    }
    return worker
  }

  async init() {
    console.log('init!!');
  }
  log(text) {
    const times = `        - blinked times: ${this.#blinkCounter}`
    this.#view.log(`logger: ${text}`.concat(this.#blinkCounter ? times : ''))
  }

  onBtnStart() {
    this.log('initalizing detection...')
    this.#blinkCounter = 0
    this.loop()
  }

  loop() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)
    this.#worker.send(img)
    this.log('detectinh eye blink...')

    setTimeout(() => this.loop(), 100)
  }
}