const Knex = require('knex');

const defaultConfig = {
  dialect: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './db.sqlite3',
  },
};

module.exports = class SQLStrategy {
  constructor(config) {
    if (!config) {
      console.error('SQLStrategy: empty config provided');
    } else {
      console.log(`Debug: ${config.dialect}.`);
      try {
        this.knex = Knex(config);
      } catch (e) {
        console.error(`KnexError: ${e}`);
      }
    }
  }

  initialize() {
    if (!this.knex) {
      console.error('SQLStrategy: knex is undefined!');
      return false;
    }

    return this.knex.schema.createTableIfNotExists('shops', table => {
      table.increments('id');
      table.string('shopify_domain');
      table.string('access_token');
      table.unique('shopify_domain');
    });
  }

  async storeShop({ shop, accessToken }) {
    await this.knex.raw(
      `INSERT INTO shops (shopify_domain, access_token) VALUES ('${shop}', '${accessToken}') ON CONFLICT (shopify_domain) DO NOTHING;`
    );

    return {accessToken};
  }

  getShop({ shop }) {
    return this.knex('shops').where('shopify_domain', shop)
  }
};
