<template>
	<div class="bid-list-table-absolute-wrapper">
		<v-simple-table class="bid-list__content__table" dense fixed-header>
			<template #default>
				<BidListTableHeader :currency="currency" :market="market" />

				<BidListTableBody
					v-if="ordersData && ordersData.length"
					:orders-data="ordersData"
					:amount-depth="amountDepth"
					:volume-depth="volumeDepth"
					:best="best"
					:currency="currency"
					:market="market"
				/>

				<tbody v-else-if="ordersData && !ordersData.length" />
				<tbody v-else>
					<tr>
						<td colspan="3">
							<CommonLoading />
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
import BidListTableBody from './BidListTableBody';
import BidListTableHeader from './BidListTableHeader';
import CommonLoading from '../../../../common/CommonLoading';

export default {
	name: 'BidListTableWrapper',

	components: { BidListTableHeader, BidListTableBody, CommonLoading },

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
		ordersData: {
			required: true,
		},
		amountDepth: {
			type: Number,
			required: true,
		},
		volumeDepth: {
			type: Number,
			required: true,
		},
		best: {
			type: Number,
			required: true,
		},
	},
};
</script>

<style scoped lang="sass">
.bid-list-table-absolute-wrapper
	position: absolute
	top: 0
	right: 0
	left: 0
	bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 18)
	overflow: hidden

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.bid-list-table-absolute-wrapper
		bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 12)
@media screen and (min-width: 960px) and (max-width: 1382px)
	.bid-list-table-absolute-wrapper
		bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 12)
@media screen and (max-width: 959px)
	.bid-list-table-absolute-wrapper
		bottom: calc(var(--negative-table-header-height) - var(--table-row-height) * 12)
</style>
