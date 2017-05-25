"use strict"
const constants = {
    load_statuses: {
        cancelled: -1,
        on_hold: 0,
        available: 1,
        booked: 2,
        checked_in: 3,
        loading: 4,
        in_transit: 5,
        unloading: 6,
        delivered: 7,
        paid: 8,
        past_due: 9,
        claims: 10
    },
    stop_statuses: {
        not_ready: -1,
        not_started: 0,
        en_route: 1,
        at_location: 2,
        being_worked: 3,
        finished: 4
    },
    bid_statuses: {
        retracted: -1,
        inactive: 0,
        active: 1,
        accepted: 2
    },
    user_types: {
        customer: 1,
        carrier: 2,
        driver: 3
    },
    http_responses: {
        generic_success: { success: true }
    },
    stop_actions: {
        pick: 1,
        deliver: 2
    }
};

module.exports = constants;
