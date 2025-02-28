<template>
	<div class="layout-content auth ma-auto">
		<v-card>
			<v-card-title class="justify-center">
				<span class="overline mb-2" style="font-size: 1.25rem !important">
					{{ $t('auth.login.title') }}
				</span>
			</v-card-title>

			<v-card-subtitle>
				<span>{{ $t('auth.login.fill_all_to_login') }}</span>
			</v-card-subtitle>

			<v-card-text>
				<v-container class="pt-0 pb-0">
					<v-row>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.email"
								append-icon="mdi-email-outline"
								:rules="[rules.required, rules.email]"
								:hint="$t('auth.login.enter_your_email')"
								:error-messages="errors.email"
								persistent-hint
								clearable
								required
								@input="errors.email = []"
							>
								<template #label>
									{{ $t('auth.email') }} <span class="red--text"><b>*</b></span>
								</template>
							</v-text-field>
						</v-col>

						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-text-field
								v-model="user.password"
								:append-icon="show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
								:rules="[rules.required, rules.min6char]"
								:type="show ? 'text' : 'password'"
								:hint="$t('auth.password')"
								:error-messages="errors.password"
								persistent-hint
								required
								@input="errors.password = []"
								@click:append="show = !show"
							>
								<template #label>
									{{ $t('auth.password') }} <span class="red--text"><b>*</b></span>
								</template>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="12" class="pt-0 pb-0">
							<v-checkbox v-model="user.remember" :label="$t('auth.login.remember')" />
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>

			<div class="text-left pl-6 pr-6">
				<small>
					<span class="red--text">
						<b>*</b>
					</span>
					<span class="grey--text text--lighten-1">
						{{ $t('auth.indicates_required_fields') }}
					</span>
				</small>
			</div>

			<v-card-actions class="pt-4 pl-6 pr-6 pb-4">
				<v-btn color="primary" :loading="loading" :disabled="!valid" tile block @click="login">
					{{ $t('auth.signin') }}
				</v-btn>
			</v-card-actions>

			<div class="caption grey--text darken-4 pb-4 pl-6 pr-6">
				<v-btn class="text-decoration-underline" color="primary" href="/password/reset" small plain>
					{{ $t('auth.login.forgot') }}
				</v-btn>
			</div>
		</v-card>

		<v-alert v-if="verify_block" dense text type="success" class="mt-4">
			{{ $t('auth.login.verified_text') }}
		</v-alert>

		<v-alert v-if="verify_error" dense text type="error" class="mt-4">
			{{ verify_error }}
		</v-alert>

		<div class="text-center mt-6" style="position: relative; z-index: 2">
			<div class="caption grey--text darken-4">
				{{ $t('auth.login.noaccount') }}
			</div>
			<v-btn block small text tile href="/register" color="primary darken-1">
				{{ $t('auth.login.create') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import formValidationRules from '../../mixins/common/formValidationRules';
import loadingMixin from '../../mixins/common/loadingMixin';

export default {
	name: 'Login',

	mixins: [formValidationRules, loadingMixin],

	data() {
		return {
			valid: true,
			show: false,
			user: {
				email: '',
				password: '',
				remember: false,
			},
			errors: {
				email: [],
				password: [],
				remember: [],
			},

			verify_block: window.verified,
			verify_error: window.v_error,
		};
	},

	methods: {
		login() {
			this.startLoading();
			const form = this.user.remember ? this.user : _.omit(this.user, ['remember']);
			axios
				.post('/login', form)
				.then(response => {
					if (response.data.auth) window.location.href = response.data.intended;
					//else this.$store.commit('snackbars/showSnackbar',{ text: response.data.message, success: false});
				})
				.catch(error => {
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
						//this.$store.commit('snackbars/showSnackbar',{ text: error.response.data.message || error.response.statusText, success: false});
					}
				})
				.finally(() => {
					this.stopLoading();
				});
		},
	},
};
</script>
