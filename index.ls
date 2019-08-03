require! <[
  path
  os
]>
require! {
  \fs-extra : fs
}

class Config
  (env, homedir) ->
    @dir = process.env[env] or path.join(
      os.homedir!
      homedir
    )
  line : (name, init)!~>
    fpath = path.join(@dir, name)+'.line.txt'
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

  li: (name, init)!~>
    fpath = path.join(@dir, name)+'.li.txt'
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
