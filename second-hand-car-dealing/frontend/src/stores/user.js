import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => ({
		userDetails: {},
	}),
	actions: {
		setUserDetails(details) {
			this.userDetails = details;
		},
		clearUserDetails() {
			this.userDetails = {};
		},
	},
	getters: {
		userID: state => state.userDetails.userID
	},
});
