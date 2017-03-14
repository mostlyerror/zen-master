const logger = {
  info:  (...args) => { log('INFO', args)  },
  debug: (...args) => {
    console.log(util.inspect(args))
  },
  error: (...args) => { log('ERROR', args) },
}

function log(level, ...args) {
  console.log(`[${level}]\t${new Date().toISOString()} ${args}`)
}

module.exports = logger;

