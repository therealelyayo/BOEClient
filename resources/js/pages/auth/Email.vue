<template>
	<div class="layout-content auth ma-auto">
		<v-card>
			<v-card-title class="justify-center">
				<span class="overline mb-2" style="font-size: 1.25rem !important">
					{{ this.$t('auth.forgot.title') }}
				</span>
			</v-card-title>

			<v-card-subtitle>
				<span>{{ this.$t('auth.forgot.subtitle') }}</span>
			</v-card-subtitle>

			<v-card-text>
				<v-container class="pt-0 pb-0">
					<v-row>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.email"
								append-icon="mdi-email-outline"
								:rules="[rules.required, rules.email]"
								:error-messages="errors.email"
								@input="errors.email = []"
								required
							>
								<template #label>
									{{ $t('auth.email') }} <span class="red--text"><b>*</b></span>
								</template>
							</v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>

			<v-card-actions class="pt-4 pl-6 pr-6 pb-4">
				<v-btn color="primary" :loading="loading" :disabled="!valid" block tile @click="resend">
					{{  this.$t('common.send') }}
				</v-btn>
			</v-card-actions>
		</v-card>

		<v-alert v-if="send_alert" dense text type="warning" class="mt-4">
			{{ send_text }}
		</v-alert>
	</div>
</template>

<script>
import formValidationRules from '../../mixins/common/formValidationRules';
import loadingMixin from '../../mixins/common/loadingMixin';

export default {
	name: 'Email',

	mixins: [formValidationRules, loadingMixin],

	data() {
		return {
			valid: true,
			loading: false,

			user: {
				email: '',
			},
			errors: {
				email: [],
			},
			send_alert: false,
			send_text: null
		};
	},

	methods: {
		resend() {
			this.startLoading();
			axios
				.post('/password/email', this.user)
				.then(response => {
					if (response.data.success) {
						this.send_text = response.data.message;
						this.send_alert = true;
					}
					//else this.$store.commit('snackbars/showSnackbar',{ text: response.data.message, success: false});
				})
				.catch(error => {
					this.resend_alert = false;
					if (error.response.status === 422) {
						let errors = error.response.data.errors;
						if (errors) {
							for (let field in errors) {
								if (errors.hasOwnProperty(field)) {
									this.errors[field] = errors[field];
								}
							}
						}
					} else {
						this.$store.commit('snackbars/showSnackbar',{ text: error.response.data.message || error.response.statusText, success: false});
					}
				})
				.finally(() => {
					this.stopLoading();
				});
		},
	},
};
</script>
