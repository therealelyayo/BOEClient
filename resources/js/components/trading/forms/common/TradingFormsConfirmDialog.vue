<template>
	<CommonDialog :confirm-color="getTypeColor" :header-color="getTypeColor" @confirm="confirm">
		<template #default>
			<slot></slot>
		</template>

		<template #title>
			{{ $t('trading.forms.dialog.title') }}
		</template>

		<template #content>
			<div>
				<div v-if="!isLeverage">
					<div v-if="isBuy && isLimit" v-html="buyLimitText" />
					<div v-else-if="isBuy && isMarket" v-html="buyMarketText" />
					<div v-else-if="isBuy && isLimit && isAnyAdditionalParamExist" v-html="buyLimitParamsText" />
					<div v-else-if="isBuy && isLimit && isAnyAdditionalParamExist" v-html="buyMarketParamsText" />

					<div v-if="isSell && isLimit" v-html="sellLimitText" />
					<div v-else-if="isSell && isMarket" v-html="sellMarketText" />
					<div v-else-if="isSell && isLimit && isAnyAdditionalParamExist" v-html="sellLimitParamsText" />
					<div v-else-if="isSell && isMarket && isAnyAdditionalParamExist" v-html="sellMarketParamsText" />
				</div>

				<div v-else-if="isLeverage">
					<div v-if="isBuy && isLimit" v-html="buyLimitLeverageText" />
					<div v-if="isBuy && isMarket" v-html="buyMarketLeverageText" />

					<div v-if="isSell && isLimit" v-html="sellLimitLeverageText" />
					<div v-if="isSell && isMarket" v-html="sellMarketLeverageText" />
				</div>

				<ul
					v-if="isAnyAdditionalParamExist && isAdditionalParams"
					class="trading-forms-confirm-dialog__add-params-list"
				>
					<li v-if="isBuy && stopLoss" v-html="buyStopLossText" />
					<li v-if="isBuy && takeProfit" v-html="buyTakeProfitText" />
					<li v-if="isBuy && trailingStop" v-html="buyTrailingStopText" />

					<li v-if="isSell && stopLoss" v-html="sellStopLossText" />
					<li v-if="isSell && takeProfit" v-html="sellTakeProfitText" />
					<li v-if="isSell && trailingStop" v-html="sellTrailingStopText" />
				</ul>

				<small v-if="isMultiplyAdditionalParams && isAdditionalParams" class="text--secondary pt-1">
					* {{ $t('trading.forms.dialog.only_one_conditional_orders_trigger') }}
				</small>
			</div>
		</template>
	</CommonDialog>
</template>

<script>
import CommonDialog from '../../../common/CommonDialog';

export default {
	name: 'TradingFormsConfirmDialog',

	components: { CommonDialog },

	props: {
		orderType: {
			type: String,
			validator(value) {
				return ['limit', 'market'].indexOf(value) !== -1;
			},
		},
		actionType: {
			type: String,
			validator(value) {
				return ['buy', 'sell'].indexOf(value) !== -1;
			},
		},

		amount: {
			type: [Number, String],
			required: true,
		},
		price: {
			type: [Number, String],
			required: false,
			default: 0,
		},

		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},

		isAdditionalParams: {
			type: Boolean,
			default: false,
		},
		stopLoss: {
			type: [Number, String],
			default: null,
		},
		takeProfit: {
			type: [Number, String],
			default: null,
		},
		trailingStop: {
			type: [Number, String],
			default: null,
		},

		isLeverage: {
			type: Boolean,
			required: false,
			default: false,
		},
		leverageOffer: {
			type: Object,
			required: false,
			default: null,
		},
		leverageLevel: {
			type: Number,
			default: null,
		},
	},

	computed: {
		isLimit() {
			return this.orderType === 'limit';
		},
		isMarket() {
			return this.orderType === 'market';
		},
		isBuy() {
			return this.actionType === 'buy';
		},
		isSell() {
			return this.actionType === 'sell';
		},
		isAnyAdditionalParamExist() {
			return this.stopLoss || this.takeProfit || this.trailingStop;
		},
		isMultiplyAdditionalParams() {
			const isFirstAndSecond = this.stopLoss && this.takeProfit;
			const isFirstAndThird = this.stopLoss && this.trailingStop;
			const isSecondAndThird = this.takeProfit && this.trailingStop;
			const isAll = this.stopLoss && this.takeProfit && this.trailingStop;

			return isFirstAndSecond || isFirstAndThird || isSecondAndThird || isAll;
		},

		getTypeColor() {
			if (this.isBuy) return 'success';
			else return 'error';
		},

		buyLimitText() {
			return this.$t('trading.forms.dialog.buy_limit_order', {
				amount: this.amount,
				price: this.price,
				currency: this.currency,
				market: this.market,
			});
		},
		buyMarketText() {
			return this.$t('trading.forms.dialog.buy_market_order', {
				amount: this.amount,
				currency: this.currency,
				market: this.market,
			});
		},
		buyLimitParamsText() {
			return this.$t('trading.forms.dialog.buy_limit_order_with_params', {
				amount: this.amount,
				price: this.price,
				currency: this.currency,
				market: this.market,
			});
		},
		buyMarketParamsText() {
			return this.$t('trading.forms.dialog.buy_market_order_with_params', {
				amount: this.amount,
				currency: this.currency,
				market: this.market,
			});
		},

		buyStopLossText() {
			return this.$t('trading.forms.dialog.buy_stop_loss_text', {
				stopLoss: this.stopLoss,
				market: this.market,
			});
		},
		buyTakeProfitText() {
			return this.$t('trading.forms.dialog.buy_take_profit_text', {
				takeProfit: this.takeProfit,
				market: this.market,
			});
		},
		buyTrailingStopText() {
			return this.$t('trading.forms.dialog.buy_trailing_stop_text', {
				trailingStop: this.trailingStop,
				market: this.market,
			});
		},

		buyLimitLeverageText() {
			return this.$t('trading.forms.dialog.buy_limit_leverage', {
				amount: this.amount,
				price: this.price,
				currency: this.currency,
				market: this.market,
				leverageLevel: this.leverageLevel,
				offerPercent: this.leverageOffer?.percent || 0,
				offerDays: this.leverageOffer?.days || 0,
			});
		},
		buyMarketLeverageText() {
			return this.$t('trading.forms.dialog.buy_market_leverage', {
				amount: this.amount,
				currency: this.currency,
				leverageLevel: this.leverageLevel,
				offerPercent: this.leverageOffer?.percent || 0,
				offerDays: this.leverageOffer?.days || 0,
			});
		},
		sellLimitLeverageText() {
			return this.$t('trading.forms.dialog.sell_limit_leverage', {
				amount: this.amount,
				price: this.price,
				currency: this.currency,
				market: this.market,
				leverageLevel: this.leverageLevel,
				offerPercent: this.leverageOffer?.percent || 0,
				offerDays: this.leverageOffer?.days || 0,
			});
		},
		sellMarketLeverageText() {
			return this.$t('trading.forms.dialog.sell_market_leverage', {
				amount: this.amount,
				currency: this.currency,
				leverageLevel: this.leverageLevel,
				offerPercent: this.leverageOffer?.percent,
				offerDays: this.leverageOffer?.days,
			});
		},

		sellLimitText() {
			return this.$t('trading.forms.dialog.sell_limit_order', {
				amount: this.amount,
				price: this.price,
				currency: this.currency,
				market: this.market,
			});
		},
		sellMarketText() {
			return this.$t('trading.forms.dialog.sell_market_order', {
				amount: this.amount,
				currency: this.currency,
				market: this.market,
			});
		},
		sellLimitParamsText() {
			return this.$t('trading.forms.dialog.sell_limit_order_with_params', {
				amount: this.amount,
				price: this.price,
				currency: this.currency,
				market: this.market,
			});
		},
		sellMarketParamsText() {
			return this.$t('trading.forms.dialog.sell_market_order_with_params', {
				amount: this.amount,
				currency: this.currency,
				market: this.market,
			});
		},

		sellStopLossText() {
			return this.$t('trading.forms.dialog.sell_stop_loss_text', {
				stopLoss: this.stopLoss,
				market: this.market,
			});
		},
		sellTakeProfitText() {
			return this.$t('trading.forms.dialog.sell_take_profit_text', {
				takeProfit: this.takeProfit,
				market: this.market,
			});
		},
		sellTrailingStopText() {
			return this.$t('trading.forms.dialog.sell_trailing_stop_text', {
				trailingStop: this.trailingStop,
				market: this.market,
			});
		},
	},

	methods: {
		confirm() {
			this.$emit('confirm');
		},
	},
};
</script>

<style scoped lang="sass">
.trading-forms-confirm-dialog
	&__add-params-list
		padding-top: 8px
		padding-left: 16px !important
</style>
