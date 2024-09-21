import moment from 'moment';

export const formatDate = (date) => {
    const duration = moment.duration(moment().diff(moment(date)));
    if (duration.asSeconds() < 60) {
        return 'less than a minute ago';
    }
    return moment(date).fromNow();
};

