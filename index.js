const {builder} = require('./builder')

const {ClickHouse} = require('clickhouse')

module.exports = {
    db: (config) => {
        const client = new ClickHouse(config)
        const builderWithClient = builder.bind(null, client)

        return {
            client,
            builder: builderWithClient
        }
    }
}