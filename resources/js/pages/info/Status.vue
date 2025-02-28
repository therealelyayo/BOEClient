<template>
	<v-card class="info-page status-page flex-grow-1">
		<CommonPageTitle>{{ $t('status.title') }}</CommonPageTitle>

		<StatusSupportCurrencyText :user-fiat="isUserFiat" :crypto-count="cryptoCount" :fiat-count="fiatCount" />
		<v-divider />

		<v-card-text>
			<StatusDefinitionText />

			<CommonLoading v-if="!isLoaded" />
			<StatusTables
				v-else
				:fiat-data="fiatCurrencies"
				:crypto-data="cryptoCurrencies"
				:pairs-data="pairsData"
				:user-fiat="isUserFiat"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import config from '../../configs';
import CommonPageTitle from '../../components/common/CommonPageTitle';
import CommonLoading from '../../components/common/CommonLoading';

import StatusSupportCurrencyText from '../../components/info/status/StatusSupportCurrencyText';
import StatusDefinitionText from '../../components/info/status/StatusDefinitionText';
import StatusTables from '../../components/info/status/StatusTables';

export default {
	name: 'Status',

	components: {
		CommonPageTitle,
		CommonLoading,
		StatusSupportCurrencyText,
		StatusDefinitionText,
		StatusTables,
	},

	data() {
		return {
			fiatCurrencies: null,
			cryptoCurrencies: null,
			pairsData: null,
		};
	},

	computed: {
		isLoaded() {
			return Boolean(this.fiatCurrencies && this.cryptoCurrencies && this.pairsData);
		},
		cryptoCount() {
			return this.cryptoCurrencies !== null ? this.cryptoCurrencies.length : 0;
		},
		fiatCount() {
			return this.fiatCurrencies !== null ? this.fiatCurrencies.length : 0;
		},
		isUserFiat() {
			return config.product.type === 'full';
		}
	},

	created() {
		this.fetch();
	},

	methods: {
		async fetch() {
			const { data } = await axios.get('/trader/ext/health');
			this.cryptoCurrencies = data.currencies;
			this.fiatCurrencies = data.fiats;
			this.pairsData = data.pairs;
		},
	},
};
</script>
