const logger = require('../core/utils/logger')

logger.transports.forEach((t) => (t.silent = true));
