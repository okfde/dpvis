<template>
  <div class="treemap-constructor">
    <div class="datapackage">
      <div class="datapackage-loader container">
        <b-field label="">
          <b-input class="datapackageHash" placeholder="ID aus OpenSpending" v-model="datapackage">
          </b-input>
          <a class="blue-button constructor-ui" @click="getModel()">Datensatz laden</a>
        </b-field>
      </div>
      <h2 class="finde-id-help">Wo finde ich die ID?</h2>
      <div class="config" v-if="hasModel && !uploadTreemapDialog">
        <b-tabs v-model="activeTab" type="is-boxed">
          <b-tab-item label="Hierarchien" class="hierarchies config-group tile is-vertical is-parent">
            <p class="explanation">Wählen Sie hier nur die Klassifizierungen der Haushaltstitel (also: Administrative Functional und Economic Classification). Hier werden die verschiedenen Levels der Haushaltstitel visualisiert.</p>
            <div class="tile is-child buttons">
              <div class="button-ui" :key="hierarchy['label']" v-for="hierarchy in this.model.hierarchies">
                <a class="button constructor" :class="{'is-info': hasHierarchy(hierarchy)}" @click="selectHierarchy(hierarchy)">{{hierarchy['label']}}</a>
              </div>
            </div>
            <div class="columns tile is-child">
              <div class="column" :key="hierarchyName" v-for="(hierarchy, hierarchyName) in config.hierarchies">
                <div class="card">
                  <div clas="card-header">
                    <p class="card-header-title">
                      {{hierarchy.label}}
                    </p>
                  </div>
                  <div class="card-content">
                    <b-field label="Bezeichnung">
                      <b-input v-model="hierarchy.label" @change.native="updateURL(hierarchy)"></b-input>
                    </b-field>
                  </div>
                </div>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item label="Werte" class="measures config-group tile is-vertical is-parent">
            <p class="explanation">Wählen Sie hier das Zahlenformat, Währungssymbol und Nachkommastelle aus. Sie können auch eine Skala hinzufügen, welche z.B. die Beträge pro Person (oder pro Erwerbstätigen) anzeigt. Fügen Sie dazu die Zahl der Einwohner des Ortes hinzu – als ganze Zahl ohne Punkt oder Komma.</p>
            <div class="content tile is-child">
              <div class="tile buttons">
                <div class="button-ui" :key="aggregate['label']" v-for="aggregate in this.model.aggregates">
                  <a class="button" @click="selectMeasure(aggregate)" :class="{'is-info': hasMeasure(aggregate)}" v-if="aggregate['function'] == 'sum'">{{aggregate['label']}}</a>
                </div>
              </div>
              <div class="columns tile is-child">
                <div class="column" :key="value.label" v-for="value in this.config.value">
                  <div class="card">
                    <div clas="card-header">
                      <p class="card-header-title">
                        {{value.field}}
                      </p>
                    </div>
                    <div class="card-content">
                  <div><b-field label="Bezeichnung"><b-input v-model="value.label"></b-input></b-field></div>
                  <div class="number-format">
                    <b-input class="symbol" v-model="value.formatOptions.symbol"></b-input>
                    <span class="num">1</span>
                    <b-input class="sep" v-model="value.formatOptions.thousand"></b-input>
                    <span class="num">000</span>
                    <b-input class="sep" v-model="value.formatOptions.decimal"></b-input>
                    <span class="num">00</span><b-input v-model="value.formatOptions.postfix"></b-input>
                  </div>
                  <div><b-field label="Nachkommastellen"><b-input v-model="value.formatOptions.precision"></b-input></b-field></div>
                    </div>
                </div>
                </div>
              </div>
              <div class="tile is-child">
                <button class="button" @click="addScale()">Skala hinzufügen</button>
              <div class="columns tile is-child">
                <div class="column" :key="i" v-if="i > 0" v-for="(scale, i) in config.scale">
                  <div class="card">
                    <div class="card-content">
                      <b-field label="Bezeichnung">
                        <b-input v-model="scale.label"></b-input>
                      </b-field>
                      <b-field label="Abkürzung">
                        <b-input v-model="scale.description"></b-input>
                      </b-field>
                      <b-field label="absolute Zahl">
                        <b-input v-model="scale.number"></b-input>
                      </b-field>
                      <button class="button" @click="removeScale(scale)">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item label="Filter" class="filters config-group tile is-vertical is-parent">
            <p class="explanation">Legen Sie fest nach welchen Kategorien die Daten gefiltert werden, z.B. das Jahr, die Budget Richtung oder die Betragsart. Außerdem können Sie die Erstansicht definieren, also welches Jahr als erstes angezeigt werden soll.</p>
            <div class="content tile is-child">
              <div class="buttons">
                <div class="button-ui" :key="dimension['label']" v-for="dimension in this.model.dimensions">
                  <a class="button" @click="selectFilter(dimension)" :class="{'is-info': hasFilter(dimension)}">{{dimension['label']}}</a>
                </div>
              </div>
              <div class="columns">
                <div class="column" :key="filterName" v-for="(filter, filterName) in config.filters">
                <div class="card">
                  <div clas="card-header">
                    <p class="card-header-title">
                    {{filter.label}}
                    </p>
                  </div>
                  <div class="card-content">
                    <div class="content">
                      <b-field label="Bezeichnung">
                        <b-input v-model="filter.label"></b-input>
                      </b-field>
                      <b-field label="Standardauswahl">
                        <b-select class="btn btn-default dropdown-toggle" v-model="filter.defaultValue">
                          <option :value="filterValue.value" :key="filterValue.value" v-for="filterValue in filter.values">{{filterValue.label}}</option>
                        </b-select>
                      </b-field>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </b-tab-item>
        </b-tabs>
        <div class="content export">
          <button class="button green-button is-medium is-success" @click="downloadConfig">Konfiguration herunterladen</button>
          <button class="button blue-button is-medium is-success" @click="uploadTreemapDialog = !uploadTreemapDialog">Datensatz hinzufügen</button>
        </div>
      </div>
    </div>
    <!-- Upload dialog -->
    <div class="treemap-upload" v-if="uploadTreemapDialog">
       <b-field label="Ebene">
         <b-select class="btn btn-default dropdown-toggle" v-model="config['level']">
           <option value="bund">Bund</option>
           <option value="land">Bundesland</option>
           <option value="kommune">Kommune</option>
         </b-select>
       </b-field>
       <b-field label="Land" v-if="config['level'] == 'land' || config['level'] == 'kommune'">
         <b-select class="btn btn-default dropdown-toggle" v-model="config['state']">
           <option :value="land.code" :key="land.code" v-for="land in bundesland">{{land.name}}</option>
         </b-select>
       </b-field>
       <b-field label="Name der Kommune / des Bundeslands" v-if="config['level'] == 'kommune'">
         <b-input v-model="config['name']"></b-input>
       </b-field>
       <b-field label="Füge einen Beschreibungstext hinzu">
         <b-input type="textarea" rows=10 v-model="config['text']"></b-input>
       </b-field>
       <button class="button is-medium is-danger" @click="uploadTreemapDialog = false">Abbrechen</button>
       <button class="button is-medium is-success" @click="uploadConfig">Datensatz hinzufügen</button>
    </div>
    <!-- End upload dialog -->
    <div class="treemap-preview" v-if="showTreemap">
      <treemap @v-on:update="updateData()" :datapackage="datapackage" apiurl="https://openspending.org/api/3/cubes/" :config="config"></treemap>
    </div>
  </div>
</template>

<script>
import treemap from './TreemapComponent'
import { snakeCase } from 'lodash'
import * as axios from 'axios'
// import 'dpvis/dist/lib/dpvis.min.css'
import { bundesland } from './bundesland'
import { stringify } from 'querystring'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'treemap-constructor',
  components: { treemap },
  data () {
    return {
      apiurl: 'https://openspending.org/api/3/cubes/',
      datapackage: '',
      hasModel: false,
      showTreemap: false,
     // config: {'datapackage': '', 'hierarchies': [], 'value': [], 'scale': [], 'filters': {}},
      model: {},
      // Paramters to Staticman
      land: '',
      bundesland: bundesland,
      kommune: '',
      text: '',

      update: false,
      uploadTreemapDialog: false,
      formatOptionsDefault: { 'symbol': '', 'decimal': '.', 'thousand': ',', 'precision': 2, format: '%s%v', postfix: '€' },
      activeTab: 0
    }
  },
  created: function () {
    if (this.$treemapconfig !== undefined) {
      // this.config = this.$treemapconfig
      this.setConfig(this.$treemapconfig)
      this.datapackage = this.config['datapackage']
      this.getModel()
      this.showTreemap = true
    }
  },
  mounted () {
  },
  methods: {
    emptyConfig: function () {
      return Object.keys(this.config).length === 0
    },

    uploadConfig: function () {
      if (!this.config['name']) {
        this.config['name'] = this.config['state']
      }
      if (!this.config['text']) {
        this.config['text'] = 'Haushalt'
      }
      var configToSite = {
        'fields[state]': this.config['state'],
        'fields[name]': this.config['name'],
        'fields[text]': this.config['text'],
        'fields[level]': this.config['level'],
        'fields[config]': this.configString
      }
      axios.post('https://staticman.vaz.io/v2/entry/okfde/offenerhaushalt.de/gh-pages/budget',
        stringify(configToSite),
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
          this.$dialog.alert({
            title: 'Vielen Dank für Ihre Mitwirkung!',
            type: 'is-success',
            message: 'Sie haben ihren Datensatz erfolgreich auf Offenerhaushalt.de hinzugefügt.<p/> Die Daten werden jetzt nochmal überprüft und zeitnah auf die Webseite gestellt.<p/> Bei Fragen oder Anmerkungen schreiben Sie uns unter <a href="mailto:info@offenerhaushalt.de?Subject=Datensatz%20hinzufügen">info@offenerhaushalt.de</a>.'
          })
        })
    },

    addScale: function () {
      if (this.config.scale.length === 0) {
        this.config.scale.push({'label': 'Total', 'number': 1, 'description': ''})
      }
      var newScale = {'label': '', 'number': 1, 'description': ''}
      this.config.scale.push(newScale)
    },

    removeScale: function (scale) {
      var index = this.config.scale.indexOf(scale)
      this.config.scale.splice(index, 1)
    },

    updateURL: function (hierarchy) {
      hierarchy.url = snakeCase(hierarchy.label)
    },

    selectHierarchy: function (hierarchy) {
      var hasHierarchy = this.config['hierarchies'].findIndex(h => h['datapackageHierarchy'] === hierarchy['ref'])
      if (hasHierarchy === -1) {
        this.addConfigHierarchy({
          'datapackageHierarchy': hierarchy['ref'],
          'url': hierarchy['ref'],
          'label': hierarchy['label']
        })
      } else {
        if (this.config['hierarchies'].length === 1) {
          this.showTreemap = false
        }
        // this.config['hierarchies'].splice(hasHierarchy, 1)
        this.removeConfigHierarchy(hasHierarchy)
      }

      this.showTreemap = true
    },

    hasHierarchy: function (hierarchy) {
      var hasHierarchy = this.config['hierarchies'].findIndex(h => h['datapackageHierarchy'] === hierarchy['ref'])
      return (hasHierarchy > -1)
    },

    hasMeasure: function (measure) {
      var hasMeasure = this.config['value'].findIndex(h => h['label'] === measure['label'])
      return (hasMeasure > -1)
    },

    hasFilter: function (filter) {
      var hasFilter = this.config['filters'].hasOwnProperty(filter['label'])
      return hasFilter
    },

    showConfig: function () {
      this.$dialog.alert({'datapackage': this.datapackage,
        message: '<pre>' + this.configString + '</pre>'
      })
    },

    downloadConfig: function () {
      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(this.configString))
      element.setAttribute('download', 'config.json')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },

    selectMeasure: function (measure) {
      var hasMeasure = this.config['value'].findIndex(h => h['label'] === measure['label'])
      if (hasMeasure === -1) {
        this.addConfigMeasure({
          'field': measure['ref'],
          'formatOptions': this.formatOptionsDefault,
          'label': measure['label']
        })
      } else {
        if (this.config['value'].length > 1) {
          // this.config['value'].splice(hasMeasure, 1)
          this.removeConfigMeasure(hasMeasure)
        }
      }
    },

    selectFilter: function (dimension) {
      if (this.config.filters.hasOwnProperty(dimension['label'])) {
        // this.$delete(this.config.filters, dimension['label'])
        this.removeConfigFilter(dimension['label'])
        return
      }
      var newFilter = {}
      newFilter['name'] = dimension['key_ref']
      newFilter['label_ref'] = dimension['label_ref']
      newFilter['ref'] = dimension['ref']
      newFilter['type'] = dimension.attributes[dimension['key_attribute']].datatype
      newFilter['default'] = true
      newFilter['defaultValue'] = ''
      newFilter['defaultLabel'] = 'All'
      newFilter['label'] = dimension.attributes[dimension['label_attribute']].label
      newFilter['values'] = [{'value': '', 'label': 'All'}]

      var apiRequestUrl = `${this.apiurl}${this.datapackage}/members/${newFilter['ref']}/`
      axios.get(apiRequestUrl).then(response => {
        var responseData = response.data.data
        for (var i in responseData) {
          var newOption = {
            'value': responseData[i][newFilter['name']],
            'label': responseData[i][newFilter['label_ref']]
          }
          newFilter['values'].push(newOption)
        }

        // this.$set(this.config.filters, dimension['label'], newFilter)
        console.log(newFilter)
        this.addConfigFilter({name: dimension['label'], params: newFilter})
      }).catch(e => {
        console.log(e)
      })
    },

    getModel: function () {
      if (this.datapackage) {
        var apiRequestUrl = `${this.apiurl}${this.datapackage}/model/`
        axios.get(apiRequestUrl).then(response => {
          this.model = response.data.model
          this.hasModel = true

          // Find aggregate of type 'sum'
          var sumAggregate = {}
          var aggregateKeys = Object.keys(this.model.aggregates)
          for (var i in aggregateKeys) {
            var key = aggregateKeys[i]
            if (this.model.aggregates[key]['function'] === 'sum') {
              sumAggregate = this.model.aggregates[key]
              break
            }
          }

          if (sumAggregate || !this.config['value']) {
            // this.$set(this.config, 'value', [])
            // this.$set(this.config, 'datapackage', this.datapackage)
            this.setConfigDatapackage(this.datapackage)
            // this.config['value'].push({ 'field': sumAggregate['ref'], 'formatOptions': this.formatOptionsDefault, 'label': sumAggregate['label'] })
            this.addConfigMeasure({ 'field': sumAggregate['ref'], 'formatOptions': this.formatOptionsDefault, 'label': sumAggregate['label'] })
          } else {
            // this.$set(this.config, 'value', [])
            // this.$set(this.config, 'datapackage', this.datapackage)
            this.setConfigDatapackage(this.datapackage)
          }
        })
      }
    },
    ...mapMutations([
      'setHierarchy',
      'setLevelsParams',
      'addFilter',
      'setConfig',
      'setModel',
      'setConfigDatapackage',
      'setHierarchyColors',
      'addConfigHierarchy',
      'removeConfigHierarchy',
      'addConfigMeasure',
      'removeConfigMeasure',
      'addConfigFilter',
      'removeConfigFilter' ])
  },
  computed: {
    configString: function () {
      return JSON.stringify(this.config, null, 2)
    },
    ...mapGetters(['config'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.datapackage {
  background-color: #f6f6f6;
  padding: 20px;

  .datapackage-loader.container {
    .field.has-addons {
      justify-content: center;
      padding-bottom: 30px;

      label {
         padding: 5px;
      }

      .datapackageHash {

        input {
          min-width: 600px;
        }

      }
    }
  }

  .config {
    .b-tabs {
      margin: auto;
    }

   }

}

.config-group {
  min-height: 100px;
}

.content {
  width: 100%;
}

.panel:not(:last-child) {
  margin-bottom: 0;
}

.columns {
  margin-top: 10px;
}
.column {
  h1 {
    font-weight: bold;
  }

  max-width: 500px;
}

.dialog .modal-card {
  max-width: none;
}

#treemap {
   width: 1200px;

}

.number-format {
  .control {
    float: left;
    input {
      border: 0;
      background-color: rgba(0,0,0,0.1);
    }
  }
  .symbol {
    width: 8ch;
  }
  .sep {
     width: 3ch;
  }
  .num {
     float: left;
     font-size: 18px;
  }

  &::after {
    clear: both;
    content: '';
    display: block;
  }
}

.export {
   padding-top: 20px;
}

.filters-buttons {
   min-height: 100px;
}

.filter {
  float: left;
}

.filters {
  float: right;
}

.scales {
  float: left;
}

.button-ui {
  margin-right: 5px;
  margin-top: 5px;
  float: left;
}

.buttons {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.explanation {
  max-width: 80ch;
  margin-bottom: 1em;
}

</style>
