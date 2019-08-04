require! <[
  path
  os
]>
require! {
  \fs-extra : fs
}

class File
  (@path)->

  set: (data)->
    fs.outputFile(@path, data)

  get: (encoding)!->
    if fs.exists(@path)
      return fs.readFile(@path, encoding)

  utf8: ->
    @get('utf8')

class Config
  (env, homedir) ->
    @dir = process.env[env] or path.join(
      os.homedir!
      homedir
    )

  file : (name)->
    new File(path.join(@dir, name))

  line : (name, init, write=false)!~>
    fpath = path.join(@dir, name)+'.line.txt'
    if write
      await fs.outputFile(fpath, init)
      return init
    if not await fs.exists(fpath)
      if init
        await fs.outputFile(fpath, init)
      return init
    li = await fs.readFile(fpath, 'utf8')
    for i in li.split("\n")
      i = i.trim()
      if i
        if i.charAt(0) != "#"
          return i
    return init

  li: (name, init, write=false)!~>
    fpath = path.join(@dir, name)+'.li.txt'
    if write
      await fs.outputFile(fpath, init.join('\n'))
      return init
    if not await fs.exists(fpath)
      if init.length
        await fs.outputFile(fpath, init.join('\n'))
      return init
    li = await fs.readFile(fpath, 'utf8')
    r = []
    for i in li.split("\n")
      i = i.trim()
      if i
        if i.charAt(0) != "#"
          r.push i
    if r.length
      return r
    return init

module.exports = Config
