'use strict';

module.exports = {
    cancelSubscription: require('./merchant-cancel-subscription.js').cancelSubscription,
    createSubscription: require('./merchant-create-subscription.js').createSubscription,
    createSubscriptionFromCustomerProfile: require('./merchant-create-subscription-from-profile.js').createSubscriptionFromCustomerProfile,
    getListOfSubscription: require('./merchant-list-subscription.js').getListOfSubscription,
    getSubscriptionStatus: require('./merchant-subscription-status.js').getSubscriptionStatus,
    updateSubscription: require('./merchant-update-subscription.js').updateSubscription,
    getSubscription: require('./merchant-view-subscription.js').getSubscription
};

