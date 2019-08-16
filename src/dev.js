// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import Buefy from 'buefy'
import router from './router'
import 'buefy/lib/buefy.css'
import store from './store'

Vue.config.productionTip = false
Vue.use(Buefy, { defaultIconPack: 'fa' })
Vue.use(Vuex)

var config = {
  'colors': [
    '#DFCE21',
    '#BCD631', '#95C93D', '#48B85C', '#00833D', '#00B48D',
    '#60C4B1', '#27C4F4', '#478DCB', '#3E67B1', '#4251A3',
    '#59449B', '#6E3F7C', '#6A246D', '#8A4873', '#EB0080',
    '#EF58A0', '#C05A89' ],
  'datapackage': 'a6a16b964a7e784f99adecc47f26318a:rp_hh_16_17_18',
  'hierarchies': [
    {
      'datapackageHierarchy': 'administrative_classification',
      'url': 'einzelplaene',
      'label': 'Einzelpläne'
    },
    {
      'datapackageHierarchy': 'economic_classification',
      'url': 'funktionen',
      'label': 'Politikfelder'
    },
    {
      'datapackageHierarchy': 'functional_classification',
      'url': 'gruppen',
      'label': 'Gruppen'
    }
  ],
  'value': [
    {
      'field': 'Ansatz_2018.sum',
      'formatOptions': {
        'symbol': '',
        'decimal': ',',
        'thousand': '.',
        'precision': '0',
        'format': '%s%v ',
        'postfix': '\u20ac',
        'grouping': 3
      },
      'label': 'Betrag'
    }
  ],
  'scale': [
  ],
  'filters': {
    'EinnahmeAusgabe': {
      'name': 'direction_2.EinnahmeAusgabe',
      'label_ref': 'direction_2.EinnahmeAusgabe',
      'ref': 'direction_2',
      'type': 'string',
      'default': true,
      'defaultValue': 'Ausgabe',
      'defaultLabel': 'All',
      'label': 'Budget Richtung',
      'values': [
        {
          'value': 'Ausgabe',
          'label': 'Ausgabe'
        },
        {
          'value': 'Einnahme',
          'label': 'Einnahme'
        }
      ]
    },
    'year': {
      'name': 'date_2.year',
      'label_ref': 'date_2.year',
      'ref': 'date_2',
      'type': 'integer',
      'default': true,
      'defaultValue': 2018,
      'defaultLabel': '2018',
      'label': 'Jahr',
      'values': [
        {
          'value': 2016,
          'label': 2016
        },
        {
          'value': 2017,
          'label': 2017
        },
        {
          'value': 2018,
          'label': 2018
        }
      ]
    }
  },
  'name': 'Rheinland Pfalz',
  'state': 'RP',
  'level': 'land',
  'text': '\n'
}

Vue.prototype.$treemapconfig = config

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
