import { prepareRunChecker } from "../../../../lib/shared/util.js"

const {shouldRun: scrollShouldRun} = prepareRunChecker({timerDelay: 200})

export default class HandGestureController {
  #view
  #service
  #camera
  #lastDirection = {
    direction: '',
    y: 0
  }

  constructor({ camera, view, service }) {
    this.#view = view
    this.#service = service
    this.#camera = camera
  }

  async init() {
    return this.#loop()  
  }

  // Faz um loop 60x por segundo para detectar iteração do usuário
  async #loop() {
    await this.#service.initializeDetector()
    this.#estimateHands()
    this.#view.loop(this.#loop.bind(this))
  }

  #scrollPage(direction) {
    const pixelsPerScroll = 100
    if(this.#lastDirection.direction === direction) {
      this.#lastDirection.y = (direction === 'scroll-down' ? 
        this.#lastDirection.y + pixelsPerScroll 
        : this.#lastDirection.y - pixelsPerScroll
      )
    } else {
      this.#lastDirection.direction = direction
    }

    this.#view.scrollPage(this.#lastDirection.y)
  }

  // Retorna as informações das mãos, como dimensões e qual mão detectou
  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video)
      for await(const {event, x, y} of this.#service.detectGestures(hands)) {
        if(event.includes('scroll')) {
          if(!scrollShouldRun()) continue
          this.#scrollPage(event)
        }
        
      }

    } catch (error) {
      console.error(error);
    }
  }

  static async initialize(deps) {
    const controller = new HandGestureController(deps)
    return controller.init()
  }
}