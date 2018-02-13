import Vue from 'vue';
import moment from 'moment';

const dateFilter = value => {
  console.log('date filter', value);
  return moment(value).format('DD-MM-YYYY H:m');
};

Vue.filter('date', dateFilter)
