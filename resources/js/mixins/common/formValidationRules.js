export default {
	data() {
		return {
			rules: {
				required: v => !!v || this.$t('forms_validation.required'),
				email: v => (v && /.+@.+\..+/.test(v)) || this.$t('forms_validation.email_invalid'),
				passMatch: v => (v && v === this.user.password) || this.$t('auth.forgot.passwords_not_match'),

				min5char: v => !v || v.length >= 5 || this.$t('forms_validation.min_5char'),
				min6char: v => !v || v.length >= 6 || this.$t('forms_validation.min_6char'),
				min8char: v => !v || v.length >= 8 || this.$t('forms_validation.min_8char'),

				max6char: v => !v || v.length <= 6 || this.$t('forms_validation.max_6char'),
				max64char: v => !v || v.length <= 64 || this.$t('forms_validation.max_64char'),

				latinAndNumbers: v =>
					!v || (v && /^[a-zA-Z0-9-_]+$/g.test(v)) || this.$t('forms_validation.unsupported_char_latinAndNumbers'),
				numbers: v => !v || /^[0-9]+$/.test(v) || this.$t('forms_validation.unsupported_char_numbers'),
				positive: v => !v || v > 0 || this.$t('forms_validation.positive'),

				maxFileSize5MB: v => !v || v.size < 5000000 || this.$t('forms_validation.max_filesize_5MB'),
			},
		};
	},
};
