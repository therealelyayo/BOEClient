<template>
	<div class="fees-trading-tab">
		<v-data-table :headers="headers" :items="pairs" :search="search" dense>
			<template #top>
				<v-toolbar flat dense>
					<div class="component-title">{{ $t('fees.trading_fee') }}</div>

					<v-text-field
						v-model="search"
						class="fees-page__search"
						:label="$t('trading.search')"
						append-icon="mdi-magnify"
						single-line
						hide-details
					/>
				</v-toolbar>
			</template>
		</v-data-table>
	</div>
</template>

<script>
export default {
	name: 'FeesTradingTab',

	data() {
		return {
			search: '',
		};
	},

	computed: {
		headers() {
			return [
				{
					text: this.$t('table_header.pair'),
					align: 'center',
					sortable: true,
					filterable: true,
					value: 'pair',
				},
				{
					text: this.$t('table_header.deal_fee_maker'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'makerFee',
				},
				{
					text: this.$t('table_header.deal_fee_taker'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'takerFee',
				},
				{
					text: this.$t('table_header.min_order_size'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'minAmount',
				},
				{
					text: this.$t('table_header.min_order_volume'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'minReverseAmount',
				},
			]
		},

		markets() {
			return this.$store.state.tickers.markets;
		},
		pairs() {
			let result = [];
			_.forEach(this.markets, value => {
				_.forEach(value, item => {
					result.push({
						id: item.id,
						currency: item.currency,
						market: item.market,
						pair: item.currency + '/' + item.market,
						makerFee: item.makerFee,
						takerFee: item.takerFee,
						minAmount: item.minAmount,
						minReverseAmount: item.minReverseAmount,
					});
				});
			});
			return result;
		},
	},
	created() {
		this.$store.dispatch('tickers/getMarketDataFromServer');
	},
};
</script>
