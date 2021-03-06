'use strict'

const routes = require('meinfernbus').trips
const source = require('db-prices')
const sortby = require('lodash.sortby')
const filter = require('lodash.filter')
const moment = require('moment-timezone')
const timezone = require('config').timezone

// format results
const adapter = (result) => {
	const connections = []
	for(let connection of result){
		const start = connection.departure.toDate()
		const end = connection.arrival.toDate()
		const duration = +end - (+start)
		const price = +connection.price
		
		const trips = []
		trips.push({
			from: connection.from,
			to: connection.to,
			start,
			end,
			duration,
			type: 'Bus'
		})

		const transfers = +connection.transfers || 0

		connections.push({start, end, duration, price, trips, transfers})
	}

	return sortby(filter(connections, (o) => o.price), ['price', 'duration'])
}

// send request
const route = (params, day) =>
	routes(
		params.from.id,
		params.to.id,
		day
	).then(adapter)

module.exports = route