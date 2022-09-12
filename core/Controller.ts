import fs from 'fs'

class Controller {
  public view (filename: string) {
    return fs.readFileSync(`app/views/${filename}`).toString()
  }
}

export default Controller
