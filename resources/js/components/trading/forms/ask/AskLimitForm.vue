<template>
	<form class="alf" @submit.prevent="sendAskLimit">
		<input name="type" type="hidden" value="LIMIT" />
		<input name="currency" type="hidden" :value="currency" />
		<input name="market" type="hidden" :value="market" />
		<input name="side" type="hidden" value="1" />

		<div>
			<v-text-field
				v-model="form.amount"
				ref="ask_limit_amount"
				:label="$t('trading.order.direction.sell')"
				type="text"
				outlined
				dense
				hide-details
				@keydown="validateNumber($event)"
			>
				<template #append>
					<span class="button-currency-text">{{ currency.toUpperCase() }}</span>
				</template>
			</v-text-field>

			<div class="alf__percents">
				<v-btn :input-value="form.amount === '25'" text small outlined tile @click="setAmount(25)">
					<span>25 %</span>
				</v-btn>
				<v-btn :input-value="form.amount === '50'" text small outlined tile @click="setAmount(50)">
					<span>50 %</span>
				</v-btn>
				<v-btn :input-value="form.amount === '75'" text small outlined tile @click="setAmount(75)">
					<span>75 %</span>
				</v-btn>
				<v-btn :input-value="form.amount === '100'" text small outlined tile @click="setAmount(100)">
					<span>100 %</span>
				</v-btn>
			</div>

			<v-text-field
				v-model="form.rate"
				ref="ask_limit_rate"
				:label="$t('table_header.rate_per') + ' ' + currency.toUpperCase()"
				type="text"
				outlined
				dense
				hide-details
				@keydown="validateNumber($event)"
			>
				<template #append>
					<span class="button-currency-text">{{ market.toUpperCase() }}</span>
				</template>
			</v-text-field>

			<div class="alf__volume">
				<v-text-field
					v-model="volume"
					@input="debouncedUpdateAmount(fee_market)"
					ref="ask_limit_volume"
					:label="$t('table_header.volume')"
					type="text"
					outlined
					dense
					hide-details
					@keydown="validateNumber($event)"
				>
					<template #append>
						<span class="button-currency-text">{{ market.toUpperCase() }}</span>
					</template>
				</v-text-field>
				<div class="alf__text-field-hint">
					{{ $t('trading.order.pay_limit_sell', [fee_visible]) + ' ' + market.toUpperCase() }}
				</div>
			</div>

			<div class="alf__margin" v-if="useMargin && marginAvailable">
				<v-select
					v-model="form.offer"
					:items="offers_select"
					:label="$t('trading.order.offer')"
					item-text="name"
					item-value="id"
					dense
					hide-details
				/>
			</div>

			<div v-if="!useMargin && conditionalOrdersAvailable" class="alf__params">
				<CommonTooltip>
					<v-text-field
						v-model="form.sl_rate"
						ref="bid_limit_sl_rate"
						:label="$t('trading.order.sl_rate')"
						:disabled="!additionalParamsEnabled"
						type="text"
						outlined
						dense
						hide-details
						@keydown="validateNumber($event)"
					>
						<template #append>
							<span class="button-currency-text">
								{{ market.toUpperCase() }}
							</span>
						</template>
					</v-text-field>
					<template #text>
						{{ $t('trading.forms.stop_loss_info') }}
					</template>
				</CommonTooltip>

				<CommonTooltip>
					<v-text-field
						v-model="form.tp_rate"
						style="margin-top: 6px"
						ref="bid_limit_tp_rate"
						:label="$t('trading.order.tp_rate')"
						:disabled="!additionalParamsEnabled"
						type="text"
						outlined
						dense
						hide-details
						@keydown="validateNumber($event)"
					>
						<template #append>
							<span class="button-currency-text">
								{{ market.toUpperCase() }}
							</span>
						</template>
					</v-text-field>
					<template #text>
						{{ $t('trading.forms.take_profit_info') }}
					</template>
				</CommonTooltip>

				<CommonTooltip>
					<v-text-field
						v-model="form.ts_offset"
						style="margin-top: 6px"
						ref="bid_limit_ts_offset"
						:label="$t('trading.order.ts_offset')"
						:disabled="!additionalParamsEnabled"
						type="text"
						outlined
						dense
						hide-details
						@keydown="validateNumber($event)"
					>
						<template #append>
							<span class="button-currency-text">
								{{ market.toUpperCase() }}
							</span>
						</template>
					</v-text-field>
					<template #text>
						{{ $t('trading.forms.trailing_stop_info') }}
					</template>
				</CommonTooltip>
			</div>
		</div>

		<div>
			<div class="alm__switch">
				<div v-if="marginTradingAvailable && marginAvailable" class="d-flex justify-start">
					<v-switch
						v-model="useMargin"
						:label="$t('trading.order.use_margin')"
						:disabled="!useMarginEnabled"
						hide-details
						left
						dense
						inset
					/>
				</div>
				<div v-if="!useMargin && conditionalOrdersAvailable" class="d-flex justify-start">
					<v-switch
						v-model="additionalParamsEnabled"
						:label="$t('trading.order.use_additional_params')"
						hide-details
						left
						dense
						inset
					/>
				</div>
			</div>
			<div class="alf__footer mt-2">
				<TradingFormsConfirmDialog
					order-type="limit"
					action-type="sell"
					:amount="form.amount"
					:price="form.rate"
					:currency="currency"
					:market="market"
					:is-additional-params="additionalParamsEnabled"
					:stop-loss="form.sl_rate"
					:take-profit="form.tp_rate"
					:trailing-stop="form.ts_offset"
					:is-leverage="useMargin"
					:leverage-offer="selectedOffer"
					:leverage-level="leverageLevel"
					@confirm="sendAskLimit"
				>
					<v-btn color="error" height="24" block>
						{{ $t('trading.order.direction.sell') }}
					</v-btn>
				</TradingFormsConfirmDialog>

				<div class="alf__footer__available text-center">
					{{ $t('trading.order.available') }}
					<span class="alf__footer__balance" @click="setAmount(100)">
						{{ formatWithScaleInAllCurrencies(balance, currency) }}
					</span>
					{{ currency.toUpperCase() }}
				</div>
			</div>
		</div>
	</form>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import config from '../../../../configs';

import { mapState } from 'vuex';
import CommonTooltip from '../../../common/CommonTooltip';
import TradingFormsConfirmDialog from '../common/TradingFormsConfirmDialog';

import formatWithScaleInAllCurrencies from '../../../../mixins/format/formatWithScaleInAllCurrencies';
import showNotificationMixin from '../../../../mixins/common/showNotificationMixin';

export default {
	name: 'AskLimitForm',

	components: { CommonTooltip, TradingFormsConfirmDialog },

	mixins: [formatWithScaleInAllCurrencies, showNotificationMixin],

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			form: {
				type: 'LIMIT',
				currency: this.currency.toUpperCase(),
				market: this.market.toUpperCase(),
				side: 1,
				amount: 0,
				rate: 0,
				sl_rate: null,
				tp_rate: null,
				ts_offset: null,
				offer: null,
			},
			additionalParamsEnabled: false,
			volume: 0,
			useMargin: false,
			offers: [],
			leverageLevel: 5
		};
	},

	computed: {
		...mapState('trading', ['best_ask', 'best_bid']),
		isAuth() {
			return this.$store.getters['app/isLogged'];
		},
		conditionalOrdersAvailable() {
			return config.product.type === 'startPlus' || config.product.type === 'full';
		},
		marginAvailable() {
			return config.product.type === 'full';
		},
		balances() {
			return this.$store.state.user.balances;
		},
		own_fees() {
			return this.$store.state.user.fees && this.selectedMarket !== null
					? _.find(this.$store.state.user.fees,
							item => item.currency.toUpperCase() === this.currency.toUpperCase() &&
									item.market.toUpperCase() === this.market.toUpperCase()
					)
					: null;
		},
		offers_select() {
			return _.map(this.offers, value => {
				return {
					id: value.id,
					name: this.$t('trading.order.offer_option', [
						BigNumber(value.percent).toString(),
						BigNumber(value.days).toString(),
						BigNumber(value.amount).toString(),
						this.currency.toUpperCase(),
					]),
				};
			});
		},
		activeTicker() {
			return this.$store.getters.activeTicker;
		},
		markets() {
			return _.get(this.$store.state.tickers.markets, this.market.toUpperCase(), null);
		},
		selectedMarket() {
			if (this.markets === null) {
				return null;
			}
			let market = _.find(this.markets, item => item.currency.toUpperCase() === this.currency.toUpperCase());
			return market === undefined ? null : market;
		},
		amountScale() {
			return this.selectedMarket === null ? 2 : parseInt(this.selectedMarket.amountScale);
		},
		rateScale() {
			return this.selectedMarket === null ? 2 : parseInt(this.selectedMarket.rateScale);
		},
		minAmount() {
			return this.selectedMarket === null ? 0 : parseInt(this.selectedMarket.minAmount);
		},
		marginTradingAvailable() {
			return this.selectedMarket === null ? false : this.selectedMarket.margin;
		},
		fee_market() {
			if(this.selectedMarket !== null)
			{
				if (this.isAuth) {
					if(this.form.rate > this.best_bid) {
						if(this.own_fees !== null && this.own_fees !== undefined)
						{
							return BigNumber(this.own_fees.maker_fee).div(100);
						}
						else return BigNumber(this.selectedMarket.makerFee).div(100);
					}
					else {
						if(this.own_fees !== null && this.own_fees !== undefined)
						{
							return BigNumber(this.own_fees.taker_fee).div(100);
						}
						else return BigNumber(this.selectedMarket.takerFee).div(100);
					}
				}
				else
				{
					if(this.form.rate > this.best_bid) {
						return BigNumber(this.selectedMarket.makerFee).div(100);
					}
					else return BigNumber(this.selectedMarket.takerFee).div(100);
				}
			}
			else return BigNumber(0);
		},
		fee_visible() {
			return this.fee_market.times(BigNumber(100)).toString();
		},
		balance() {
			if (this.isAuth) {
				let scale = 8;
				let amount = _.get(this.balances, this.currency.toUpperCase(), 0);
				if (amount.available !== undefined) {
					return BigNumber(amount.available).dp(scale, 1);
				}
				return BigNumber(0).dp(scale, 1);
			} else return BigNumber(0);
		},

		isAdditionalParams() {
			return this.additionalParamsEnabled;
		},
		useMarginEnabled() {
			return Number(this.form.amount);
		},

		selectedOffer() {
			const selectedOfferID = this.form.offer;
			return this.offers?.find(item => item.id === selectedOfferID)
		}
	},

	watch: {
		useMargin(val) {
			if (val) {
				this.getOffers();
				this.additionalParamsEnabled = false;
			}
		},
		currency(val) {
			this.$set(this.form, 'currency', val.toUpperCase());
			this.$set(this.form, 'amount', '');
			this.getRateFromTicker();
			this.resetForm();
		},
		market(val) {
			this.$set(this.form, 'market', val.toUpperCase());
			this.$set(this.form, 'amount', '');
			this.getRateFromTicker();
		},
		volume(newVolume, oldVolume) {
			if (this.isNumeric(newVolume) || newVolume === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.amountScale + this.rateScale + 4) + ',}', 'i');
				if (rl.test(newVolume)) {
					this.volume = oldVolume;
					this.$refs.ask_limit_volume.lazyValue = oldVolume;
				}
			} else {
				this.volume = 0;
			}
		},
		fee_market(newFee, oldFee) {
			if (newFee.toString() !== oldFee.toString())
				this.debouncedUpdateVolumeByFee(newFee.toString());
		},
		'form.amount'(newAmount, oldAmount) {
			if (!this.useMarginEnabled) this.useMargin = false;

			if (this.isNumeric(newAmount) || newAmount === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.amountScale + 1) + ',}', 'i');
				if (rl.test(newAmount)) {
					this.form.amount = oldAmount;
					this.$refs.ask_limit_amount.lazyValue = oldAmount;
				} else if (newAmount === '' || newAmount === 0) {
					this.form.amount = newAmount;
				} else {
					this.form.amount = newAmount;
				}
			} else {
				this.form.amount = 0;
			}
			this.debouncedUpdateVolume();
			this.debouncedUpdateOffers();
		},
		'form.rate'(newRate, oldRate) {
			if (this.isNumeric(newRate) || newRate === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.rateScale + 1) + ',}', 'i');
				if (rl.test(newRate)) {
					this.form.rate = oldRate;
					this.$refs.ask_limit_rate.lazyValue = oldRate;
				} else if (newRate === '' || newRate === 0) {
					this.form.rate = newRate;
				} else {
					this.form.rate = newRate;
					if (this.form.rate !== '' && this.form.amount !== '' && this.form.rate !== 0 && this.form.amount !== 0) {
						this.debouncedUpdateVolume();
					}
				}
			} else {
				this.form.rate = 0;
			}
		},
		'form.sl_rate'(newSlRate, oldSlRate) {
			if (this.isNumeric(newSlRate) || newSlRate === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.rateScale + 1) + ',}', 'i');
				if (rl.test(newSlRate)) {
					this.form.sl_rate = oldSlRate;
					this.$refs.ask_limit_sl_rate.lazyValue = oldSlRate;
				} else {
					this.form.sl_rate = newSlRate;
				}
			} else {
				this.form.sl_rate = 0;
			}
		},
		'form.tp_rate'(newTpRate, oldTpRate) {
			if (this.isNumeric(newTpRate) || newTpRate === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.rateScale + 1) + ',}', 'i');
				if (rl.test(newTpRate)) {
					this.form.tp_rate = oldTpRate;
					this.$refs.ask_limit_tp_rate.lazyValue = oldTpRate;
				} else {
					this.form.tp_rate = newTpRate;
				}
			} else {
				this.form.tp_rate = 0;
			}
		},
		'form.ts_offset'(newTsOffset, oldTsOffset) {
			if (this.isNumeric(newTsOffset) || newTsOffset === '') {
				let rl = new RegExp('\\d+\\.\\d{' + (this.rateScale + 1) + ',}', 'i');
				if (rl.test(newTsOffset)) {
					this.form.ts_offset = oldTsOffset;
					this.$refs.ask_limit_ts_offset.lazyValue = oldTsOffset;
				} else {
					this.form.ts_offset = newTsOffset;
				}
			} else {
				this.form.ts_offset = 0;
			}
		},
	},

	mounted() {
		this.debouncedUpdateAmount = _.debounce(this.updateAmount, 50);
		this.debouncedUpdateVolume = _.debounce(this.updateVolume, 50);
		this.debouncedUpdateVolumeByFee = _.debounce(this.updateVolumeByFee, 50);
		this.debouncedUpdateOffers = _.debounce(this.updateOffers, 1000);
	},

	created() {
		this.$eventHub.$on('set-sell-price', this.setFormRate);
	},

	beforeDestroy() {
		this.$eventHub.$off('set-sell-price', this.setFormRate);
	},

	activated() {
		this.$eventHub.$on('set-sell-price', this.setFormRate);
	},

	deactivated() {
		this.$eventHub.$off('set-sell-price', this.setFormRate);
	},

	methods: {
		BigNumber(item) {
			return BigNumber(item).toString();
		},
		isNumeric(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		updateVolume() {
			this.volume = BigNumber(this.form.amount)
				.times(BigNumber(this.form.rate).times(BigNumber(1).minus(BigNumber(this.fee_market))))
				.toString();
		},
		updateVolumeByFee(fee) {
			this.volume = BigNumber(this.form.amount)
					.times(BigNumber(this.form.rate).times(BigNumber(1).minus(BigNumber(fee))))
					.toString();
		},
		updateOffers() {
			if (this.useMargin) {
				this.getOffers();
			}
		},
		updateAmount(fee) {
			let oldAmount = this.form.amount;
			let newAmount = BigNumber(this.volume).div(BigNumber(this.form.rate).times(BigNumber(BigNumber(1).minus(BigNumber(fee))))).decimalPlaces(this.amountScale, 1).toString();

			let prevHasDot = /\.$/.test(oldAmount);
			let newHasDot = /\./.test(newAmount);
			let prevEndsWithDotWithZeroes = /\.0+$/.test(oldAmount);

			// BigNumber конвертация отрезает точки и нули.
			if (!newHasDot) {
				if (prevHasDot) {
					// старое заканчивается на точку без нулей, но в новом нет точки: добавляем точку
					newAmount += '.';
				} else if (prevEndsWithDotWithZeroes) {
					// старое заканчивается на точку и нули, но в новом нет точки (и нулей тоже нет): добавляем точку и потерянное количество нулей
					let matches = oldAmount.match(/\.0+$/);
					if (matches !== null) {
						newAmount += matches[0];
					}
				}
			}

			this.form.amount = newAmount;
		},
		setAmount(percents = 100) {
			this.form.amount = this.balance
				.div(100)
				.times(percents)
				.decimalPlaces(this.amountScale, 1)
				.toString();
		},
		getOffers() {
			if (!this.marginTradingAvailable) return;

			const queryParams = {
				params: {
					currency: this.currency.toUpperCase(),
					amount: this.form.amount === '' ? 0 : BigNumber(this.form.amount).toString(),
					side: 1,
					type: 'LIMIT',
				},
			};
			axios.get('/trader/ext/get_offer_list', queryParams).then(response => {
				console.log(response.data);
				this.offers = response.data.offers;
			});
		},
		sendAskLimit() {
			if (!this.form.amount) {
				this.pushErrorNotification(_, 'incorrect');
				return;
			}

			let form = this.additionalParamsEnabled ? this.form : _.omit(this.form, ['sl_rate', 'tp_rate', 'ts_offset']);
			if (this.marginTradingAvailable) {
				form.margin = this.useMargin ? 1 : 0;
			} else form.margin = 0;
			axios.post('/trader/ext/order/limit', form).then(response => {
				if (response.data.success === true) {
					console.log(response.data);
				}
			});
		},
		validateNumber(evt) {
			evt = evt ? evt : window.event;
			let charCode = evt.which ? evt.which : evt.keyCode;
			if (
				charCode > 31 &&
				(charCode < 48 || charCode > 57) &&
				(charCode < 96 || charCode > 105) &&
				charCode !== 46 &&
				charCode !== 35 &&
				charCode !== 36 &&
				charCode !== 37 &&
				charCode !== 39 &&
				evt.key != '.'
			) {
				evt.preventDefault();
			} else {
				return true;
			}
		},
		setFormRate({ price }) {
			this.form.rate = price;
		},
		getRateFromTicker() {
			if (!this.activeTicker) {
				return;
			}
			this.form.rate = BigNumber(this.activeTicker.bid)
				.dp(this.rateScale, 1)
				.toString();
		},

		resetForm() {
			this.useMargin = false;
			this.additionalParamsEnabled = false;
			this.rate = 0;
			this.sl_rate = null;
			this.tp_rate = null;
			this.ts_offset = null;
		},
	},
};
</script>

<style scoped lang="scss">
.alf {
	display: flex;
	flex-flow: column;
	flex-grow: 1;
	justify-content: space-between;

	&__volume {
		height: 60px;
		margin: 6px 0;
	}

	&__percents {
		display: grid;
		grid-gap: 2px;
		grid-template-columns: repeat(4, 1fr);
		margin: -6px 0 16px;
	}

	&__text-field-hint {
		line-height: 1;
		font-size: 0.75rem;
		padding: 0 12px;
		margin-top: -6px;
		opacity: 0.6;
	}

	&__margin {
		padding: 0 4px;
	}

	&__footer {
		&__available {
			font-size: 11px;
		}
		&__balance {
			cursor: pointer;
		}
	}
}
</style>
