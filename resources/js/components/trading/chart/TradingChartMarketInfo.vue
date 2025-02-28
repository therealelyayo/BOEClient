<template>
	<div class="market-info px-2 pt-1">
		<div class="market-info__last-price market-info__item">
			<span class="info-value">
				<span>{{ lastPrice }}</span>
				<span class="currency">{{ selectedMarket }}</span>
			</span>
			<span class="info-title">
				{{ $t('trading.last_price') }}
			</span>
		</div>

		<div class="market-info__daily market-info__item">
			<span
				class="info-value"
				:class="{
					'success--text': dailyChange > 0,
					'error--text': dailyChange < 0,
				}"
			>
				<span>{{ dailyChangePercent }}%</span>
			</span>
			<span class="info-title">
				{{ $t('trading.daily_change') }}
			</span>
		</div>

		<div class="market-info__daily-high market-info__item">
			<span class="info-value">
				{{ dailyHigh }}
				<span class="currency">{{ selectedMarket }}</span>
			</span>
			<span class="info-title">{{ $t('trading.daily_high') }}</span>
		</div>

		<div class="market-info__daily-low market-info__item">
			<span class="info-value">
				{{ dailyLow }}
				<span class="currency">{{ selectedMarket }}</span>
			</span>
			<span class="info-title">{{ $t('trading.daily_low') }}</span>
		</div>

		<div class="market-info__daily-volume market-info__item">
			<span class="info-value">
				<span>{{ formatWithScaleInAllCurrencies(dailyVolume, market) }} </span>
				<span class="currency">{{ selectedMarket }}</span>
			</span>
			<span class="info-title">
				{{ $t('trading.daily_volume') }}
			</span>
		</div>
	</div>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import formatWithScaleInAllCurrencies from '../../../mixins/format/formatWithScaleInAllCurrencies';

export default {
	name: 'MarketInfo',

	mixins: [formatWithScaleInAllCurrencies],

	props: {
		market: {
			type: String,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
	},

	computed: {
		selectedMarket() {
			return this.$store.state.trading.selectedMarket === null
				? ''
				: this.$store.state.trading.selectedMarket.toUpperCase();
		},
		selectedCurrency() {
			return this.$store.state.trading.selectedCurrency === null
				? ''
				: this.$store.state.trading.selectedCurrency.toUpperCase();
		},
		selectedPair() {
			return this.$store.getters['trading/selectedPair'];
		},
		ticker() {
			return this.$store.getters['trading/activeTicker'];
			//return this.$store.getters.activeTicker;
		},
		lastPrice() {
			return this.ticker
				? BigNumber(this.ticker.latest)
						.dp(this.ticker.scale)
						.toString()
				: 0.0;
		},
		dailyChange() {
			if (this.ticker === null) {
				return BigNumber(0);
			}
			return BigNumber(this.ticker.latest).minus(BigNumber(this.ticker.previous_day));
		},
		dailyChangeAbsolute() {
			if (this.ticker === null) {
				return 0;
			}
			return this.dailyChange
				.abs()
				.dp(this.ticker.scale)
				.toString();
		},
		dailyChangePercent() {
			let changePercent = 0;
			if (!this.dailyChange.isZero()) {
				if (BigNumber(this.ticker.previous_day).isZero()) {
					changePercent = 100;
				} else {
					changePercent = this.dailyChange
						.multipliedBy(100)
						.div(BigNumber(this.ticker.previous_day))
						.toString();
				}
			}
			return BigNumber(changePercent)
				.dp(2)
				.toString();
		},
		dailyHigh() {
			return this.ticker
				? BigNumber(this.ticker.max)
						.dp(this.ticker.scale)
						.toString()
				: 0;
		},
		dailyLow() {
			return this.ticker
				? BigNumber(this.ticker.min)
						.dp(this.ticker.scale)
						.toString()
				: 0;
		},
		dailyVolume() {
			return this.ticker ? this.ticker.volume : 0;
		},
	},

	methods: {
		BigNumber(item) {
			return BigNumber(item);
		},
	},
};
</script>

<style scoped lang="sass">
.market-info
	display: flex
	flex-flow: row
	height: 33px

	&__item
		display: flex
		align-items: center
		justify-content: center
		flex-wrap: wrap
		padding-right: 12px

	.info-value
		font-weight: bold
		font-size: 1.1rem
		padding-right: 4px
	.info-title
		font-weight: normal
		font-size: 11px

@media screen and (min-width: 1500px) and (max-width: 1900px)
	.market-info
		.info-value
			font-size: 14px
		.info-title
			font-size: 10px

@media screen and (min-width: 1382px) and (max-width: 1500px)
	.market-info
		line-height: 15px

		.info-value
			font-size: 12px
		.info-title
			font-size: 9px

		&__item
			padding-right: 2px

@media screen and (min-width: 960px) and (max-width: 1382px)
	.market-info
		.info-value
			font-size: 15px
		.info-title
			font-size: 11px

		&__item
			padding-right: 16px

@media screen and (max-width: 959px)
	.market-info
		line-height: 15px

		.info-value
			font-size: 15px
		.info-title
			font-size: 10px

		&__item
			padding-right: 8px

@media screen and (max-width: 700px)
	.market-info
		line-height: 15px

		.info-value
			font-size: 10px
		.info-title
			font-size: 9px

		&__item
			padding-right: 2px

.v-application--is-rtl
	.market-info
		&__item
			padding-left: 12px
			padding-right: 0
		.info-value
			padding-left: 4px
			padding-right: 0

		@media screen and (min-width: 1382px) and (max-width: 1500px)
			padding-left: 2px
			padding-right: 0
		@media screen and (min-width: 960px) and (max-width: 1382px)
			padding-left: 16px
			padding-right: 0
		@media screen and (max-width: 959px)
			padding-left: 8px
			padding-right: 0
		@media screen and (max-width: 700px)
			padding-left: 2px
			padding-right: 0
</style>
