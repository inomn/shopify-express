const PropTypes = require('prop-types');
const Raven = require('raven');
const createRouter = require('./routes');
const createMiddleware = require('./middleware');
const {MemoryStrategy} = require('./strategies');

const ShopifyConfigTypes = {
  apiKey: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  secret: PropTypes.string.isRequired,
  scope: PropTypes.arrayOf(PropTypes.string).isRequired,
  afterAuth: PropTypes.func.isRequired,
  shopStore: PropTypes.object,
  accessMode: PropTypes.oneOf(['offline', 'online']),
};

const defaults = {
  shopStore: new MemoryStrategy(),
  accessMode: 'offline'
};

module.exports = function shopify(shopifyConfig) {
  PropTypes.checkPropTypes(ShopifyConfigTypes, shopifyConfig, 'option', 'ShopifyExpress');
  Raven.config('http://57242a9253b247c9b08d67c29b6503ec@sentry.swiftgift.me/23').install();
  const config = Object.assign({}, defaults, shopifyConfig);

  try {
    return {
      middleware: createMiddleware(config),
      routes: createRouter(config),
    };
  } catch (e) {
    Raven.captureException(e);
  }
};
