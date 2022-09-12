type Action = string | [string, string] | ((...args: string[]) => string)

class Route {
  method: string
  url: string
  action: Action

  private static routes: Route[] = []

  private constructor (method: string, url: string, action: Action) {
    this.method = method
    this.url = url
    this.action = action
  }
  static custom (method: string, url: string, action: Action) {
    this.routes.push(new Route(method, url, action))
  }
  static get (url: string, action: Action) {
    this.custom('get', url, action)
  }
  static post (url: string, action: Action) {
    this.custom('post', url, action)
  }
  static any (url: string, action: Action) {
    this.custom('any', url, action)
  }

  static async run (method: string, url: string) {
    const trimmedUrl = '/' + url
      .replace(/^(\/)*/, '')
      .replace(/(\/)*$/, '')

    const [route, args] = this.routes.reduce((acc, r) => {
      const match = new RegExp('^' + r.url.replace(/{([\w]+)}/g, '([^/]+)') + '$').exec(trimmedUrl)
      if (
        r.method.toLowerCase() === method.toLowerCase()
        && match !== null
      ) {
        return [r, match.slice(1)]
      }
      return acc
    }, undefined as [Route, RegExpExecArray]) ?? [undefined, undefined]

    console.log(args)
    if (route === undefined) return undefined
    if (typeof route.action === 'function') return route.action(...args)
    if (typeof route.action === 'string') {
      const [controller, func] = route.action.split('@')
      return (new (await import(`@app/controllers/${controller}.ts`)).default)[func](...args)
    }
  }
}

export default Route
