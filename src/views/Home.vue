<template>
  <v-container fluid>
    <v-row align="center">
      <highcharts :options="chartOptions"></highcharts>
    </v-row>
  <v-row align="center">
    <v-col class="d-flex" cols="12" sm="3">
      <v-slider v-model="hrSlider" :max="hrMax" :min="hrMin" label="HR Value">
        <template v-slot:append>
          <v-text-field
            v-model="hrSlider"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            ></v-text-field>
        </template>
      </v-slider>
    </v-col>
  </v-row>
  <v-row align="center">
    <v-col class="d-flex" cols="12" sm="2">
      <v-autocomplete
        :items="diseases" v-model="selectedDisease" label="Disease"></v-autocomplete>
    </v-col>
    <v-col class="d-flex" cols="12" sm="2">
      <v-autocomplete
        :items="mutations" v-model="selectedMutation" label="Mutation"></v-autocomplete>
    </v-col>
    <v-col class="d-flex" cols="12" sm="2">
      <v-autocomplete
        :items="regulators" v-model="selectedRegulator" label="Regulator"></v-autocomplete>
    </v-col>
    <v-col class="d-flex" cols="12" sm="2">
      <v-autocomplete
        :items="regulons" v-model="selectedRegulon"  label="Regulon"></v-autocomplete>
    </v-col>
    <v-col class="d-flex" cols="12" sm="2">
      <v-autocomplete
        :items="drugs" v-model="selectedDrug"  label="Drug"></v-autocomplete>
    </v-col>
  </v-row>
  <v-row align="center">
    <v-col class="d-flex" cols="12" sm="2">
      <v-text-field v-model="searchTerm" label="Search"></v-text-field>
    </v-col>
    <v-col class="d-flex" cols="12" sm="2">
      <v-btn @click="doSearch">Submit</v-btn>
    </v-col>
  </v-row>
  <v-row align="center">
    <v-col class="d-flex" cols="12" sm="12">
      <v-data-table :headers="tableHeaders" :items="tableItems"
                    :disable-pagination="true"
                    :hide-default-footer="true"
                    class="elevation-1">
        <template v-slot:item="{item}">
          <td><v-btn :color="diseaseMutationColor" @click="loadDiseaseMutation">{{item.diseaseMutation}}</v-btn></td>
          <td><v-btn :color="diseaseRegulatorColor" @click="loadDiseaseRegulator">{{item.diseaseRegulator}}</v-btn></td>
          <td><v-btn :color="diseaseRegulonColor" @click="loadDiseaseRegulon">{{item.diseaseRegulon}}</v-btn></td>
          <td><v-btn :color="mutationRegulatorColor" @click="loadMutationRegulator">{{item.mutationRegulator}}</v-btn></td>
          <td><v-btn :color="mutationDrugColor" @click="loadMutationDrug">{{item.mutationDrugs}}</v-btn></td>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <v-row align="center">
    <v-col class="d-flex" cols="12" sm="12">
      <h2 v-if="displayedTable=='diseaseMutation'">Disease-&gt;Mutation (HR: {{hrSlider}} Disease: {{selectedDisease}} Mutation: {{selectedMutation}})</h2>
      <h2 v-if="displayedTable=='diseaseRegulator'">Disease-&gt;Regulator (HR: {{hrSlider}} Disease: {{selectedDisease}} Regulator: {{selectedRegulator}})</h2>
      <h2 v-if="displayedTable=='diseaseRegulon'">Disease-&gt;Regulon (HR: {{hrSlider}} Disease: {{selectedDisease}} Regulon: {{selectedRegulon}})</h2>
      <h2 v-if="displayedTable=='mutationRegulator'">Mutation-&gt;Regulator (HR: {{hrSlider}} Mutation: {{selectedMutation}} Regulator: {{selectedRegulator}})</h2>
      <h2 v-if="displayedTable=='mutationDrug'">Mutation-&gt;Drug (HR: {{hrSlider}} Mutation: {{selectedMutation}} Drug: {{selectedDrug}})</h2>

    </v-col>
  </v-row>
    <v-row align="center">
      <v-col class="d-flex" cols="12" sm="12">
        <v-data-table
          :headers="tableHeaders2" :items="tableItems2"
          :items-per-page.sync="itemsPerPage" :loading="loading"
          :server-items-length="totalItems"
          :page.sync="page"
          class="elevation-1">
        <template v-slot:item="{item}">
          <tr>
          <td><a v-bind:href="'https://www.ncbi.nlm.nih.gov/pubmed/' + item.pmid" target="_blank">{{item.pmid}}</a></td>
          <td>{{item.title}}</td>
          <td>{{item.pubdate}}</td>
          <td><span v-html="item.abstract"></span></td>
          <td>{{item.assocs}}</td>
          </tr>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>

.marked {
    font-weight: bold;
    background-color: #bfc2f4;
}
</style>

<script>
  import {Chart} from 'highcharts-vue'

var diseaseMutationColor = '#e0ed30';
var diseaseRegulatorColor = '#90ed7d';
var diseaseRegulonColor = '#f7a35c';
var mutationRegulatorColor = '#bfc2f4';
var mutationDrugColor = '#f15c80';

export default {
    data: () => ({
        chartOptions: {
            chart: { type: 'bar'},
            tooltip: { headerFormat: '' },
            title: { text: 'PMID counts'},
            xAxis: {
                title: { text: '' }
            },
            yAxis: {
                title: { text: 'PMIDs' }
            },
            series: [
                { name: 'Disease->Mutation', data: [12], color: diseaseMutationColor },
                { name: 'Disease->Regulator', data: [13], color: diseaseRegulatorColor },
                { name: 'Disease->Regulon', data: [13], color: diseaseRegulonColor },
                { name: 'Mutation->Regulator', data: [13], color: mutationRegulatorColor },
                { name: 'Mutation->Drugs', data: [13], color: mutationDrugColor },
            ]
        },
        diseaseMutationColor: diseaseMutationColor,
        diseaseRegulatorColor: diseaseRegulatorColor,
        diseaseRegulonColor: diseaseRegulonColor,
        mutationRegulatorColor: mutationRegulatorColor,
        mutationDrugColor: mutationDrugColor,

        selectedDisease: 'All myelomas',
        selectedMutation: 'All',
        selectedRegulator: 'All',
        selectedRegulon: 'All',
        selectedDrug: 'All',
        searchTerm: '',

        items: [],
        diseases: ['All Cancers', 'All myelomas'],
        mutations: ['All'],
        regulators: ['All'],
        regulons: ['All'],
        drugs: ['All'],

        hrMin: 2, hrMax: 6, hrSlider: 6,

        tableHeaders: [
            {text: 'Myeloma->Mutation', value: 'diseaseMutation'},
            {text: 'Myeloma->Regulator', value: 'diseaseRegulator'},
            {text: 'Myeloma->Regulon', value: 'diseaseRegulon'},
            {text: 'Mutation->Regulator', value: 'mutationRegulator'},
            {text: 'Mutation->Drugs', value: 'mutationDrugs'},
        ],
        tableItems: [
            { cancerMutation: 0, diseaseMutation: 0, diseaseRegulator: 0,
              diseaseRegulon: 0, mutationRegulator: 0, mutationDrugs: 0 }
        ],
        tableHeaders2: [
            {text: 'PMID',  value: 'pmid'},
            {text: 'Title', value: 'title'},
            {text: 'Published', value: 'pubdate'},
            {text: 'Abstract', value: 'abstract'},
            {text: 'Associations', value: 'assocs'}
        ],
        displayedTable: '',
        tableItems2: [],
        loading: false,
        totalItems: 0,
        itemsPerPage: 5,
        page: 1
    }),
    components: {
        highcharts: Chart
    },
    watch: {
        selectedDisease: function(disease) {
            this.searchTerm = '';
            this.reloadTable(this.hrSlider,
                             disease,
                             this.selectedMutation, this.selectedRegulator,
                             this.selectedRegulon, this.selectedDrug);
        },
        selectedMutation: function(mutation) {
            this.searchTerm = '';
            this.reloadTable(this.hrSlider,
                             this.selectedDisease,
                             mutation, this.selectedRegulator,
                             this.selectedRegulon, this.selectedDrug);
        },
        selectedRegulator: function(regulator) {
            this.searchTerm = '';
            this.reloadTable(this.hrSlider,
                             this.selectedDisease,
                             this.selectedMutation, regulator,
                             this.selectedRegulon, this.selectedDrug);
        },
        selectedRegulon: function(regulon) {
            this.searchTerm = '';
            this.reloadTable(this.hrSlider,
                             this.selectedDisease,
                             this.selectedMutation, this.selectedRegulator,
                             regulon, this.selectedDrug);
        },
        selectedDrug: function(drug) {
            this.searchTerm = '';
            this.reloadTable(this.hrSlider,
                             this.selectedDisease,
                             this.selectedMutation, this.selectedRegulator,
                             this.selectedRegulon, drug);
        },
        hrSlider: function(hr) {
            this.searchTerm = '';
            this.reloadSelects();
            this.reloadTable(hr,
                             this.selectedDisease,
                             this.selectedMutation, this.selectedRegulator,
                             this.selectedRegulon, this.selectedDrug);
        },
        page: function(page) {
            if (this.displayedTable == 'diseaseMutation') {
                this.loadDiseaseMutation();
            } else if (this.displayedTable == 'diseaseRegulator') {
                this.loadDiseaseRegulator();
            } else if (this.displayedTable == 'diseaseRegulon') {
                this.loadDiseaseRegulon();
            } else if (this.displayedTable == 'mutationRegulator') {
                this.loadMutationRegulator();
            } else if (this.displayedTable == 'mutationDrug') {
                this.loadMutationDrug();
            }
        }
    },
    methods: {
        // generic function to send a POST request
        postJSON: function(url, data) {
            return fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                referrer: 'no-referrer',
                body: JSON.stringify(data),
            }).then(response => response.json());
        },

        doSearch: function() {
            if (this.searchTerm === '') return;

            this.selectedDisease = 'All myelomas';
            this.selectedMutation = 'All';
            this.selectedRegulator = 'All';
            this.selectedRegulon = 'All';
            this.selectedDrug = 'All';
            this.displayedTable = '';
            this.tableItems2 = [];

            var self = this;
            const apiURL = process.env.VUE_APP_API_URL;
            const url = apiURL + "/search_pmid_counts/" + this.hrSlider;
            this.postJSON(url, {search: this.searchTerm}).then(function(result) {
                self.tableItems[0].diseaseMutation = result.num_disease_mutation_pmids;
                self.tableItems[0].diseaseRegulator = result.num_disease_regulator_pmids;
                self.tableItems[0].diseaseRegulon = result.num_disease_regulon_pmids;
                self.tableItems[0].mutationRegulator = result.num_mutation_regulator_pmids;
                self.tableItems[0].mutationDrugs = result.num_mutation_drug_pmids;

                self.chartOptions.series[0].data = [result.num_disease_mutation_pmids];
                self.chartOptions.series[1].data = [result.num_disease_regulator_pmids];
                self.chartOptions.series[2].data = [result.num_disease_regulon_pmids];
                self.chartOptions.series[3].data = [result.num_mutation_regulator_pmids];
                self.chartOptions.series[4].data = [result.num_mutation_drug_pmids];
            });
        },
        loadTable2: function(url) {
            this.loading = true;
            return this.postJSON(url, {page: this.page, itemsPerPage: this.itemsPerPage});
        },
        reloadTable2: function(url) {
            var self = this;
            this.loadTable2(url).then(result => {
                self.totalItems = result.total;
                self.tableItems2 = result.data;
                self.loading = false;
            });
        },
        loadDiseaseMutation: function() {
            this.displayedTable = 'diseaseMutation';
            if (this.searchTerm === '') {
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/disease_mutation_docs/' + this.hrSlider + '/' +
                      this.selectedDisease + '/' + this.selectedMutation;
                this.reloadTable2(url);
            } else {
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/disease_mutation_search/' + this.hrSlider + '/' +
                      this.searchTerm;
                this.reloadTable2(url);
            }
        },
        loadDiseaseRegulator: function() {
            this.displayedTable = 'diseaseRegulator';
            if (this.searchTerm === '') {
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/disease_regulator_docs/' + this.hrSlider + '/' +
                      this.selectedDisease + '/' + this.selectedRegulator;
                this.reloadTable2(url);
            } else {
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/disease_regulator_search/' + this.hrSlider + '/' +
                      this.searchTerm;
                this.reloadTable2(url);
            }
        },
        loadDiseaseRegulon: function() {
            this.displayedTable = 'diseaseRegulon';
            if (this.searchTerm === '') {
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/disease_regulon_docs/' + this.hrSlider + '/' +
                      this.selectedDisease + '/' + this.selectedRegulon;
                this.reloadTable2(url);
            } else {
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/disease_regulon_search/' + this.hrSlider + '/' +
                      this.searchTerm;
                this.reloadTable2(url);
            }
        },
        loadMutationRegulator: function() {
            if (this.searchTerm === '') {
                this.displayedTable = 'mutationRegulator';
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/mutation_regulator_docs/' + this.hrSlider + '/' +
                      this.selectedMutation + '/' + this.selectedRegulator;
                this.reloadTable2(url);
            } else {
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/mutation_regulator_search/' + this.hrSlider + '/' +
                      this.searchTerm;
                this.reloadTable2(url);
            }
        },
        loadMutationDrug: function() {
            if (this.searchTerm === '') {
                this.displayedTable = 'mutationDrug';
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/mutation_drug_docs/' + this.hrSlider + '/' +
                      this.selectedMutation + '/' + this.selectedDrug;
                this.reloadTable2(url);
            } else {
                const apiURL = process.env.VUE_APP_API_URL;
                const url = apiURL + '/mutation_drug_search/' + this.hrSlider + '/' +
                      this.searchTerm;
                this.reloadTable2(url);
            }
        },
        reloadTable: function(hr, disease, mutation, regulator, regulon, drug) {
            const apiURL = process.env.VUE_APP_API_URL;
            const pmidCountURL = apiURL + '/pmid_counts/' + hr + '/' +
                  disease + '/' + mutation + '/' + regulator + '/' + regulon + '/' + drug;
            var self = this;
            fetch(pmidCountURL).then(function(response) { return response.json();
                                                     }).then(function(result) {
                self.tableItems[0].diseaseMutation = result.num_disease_mutation_pmids;
                self.tableItems[0].diseaseRegulator = result.num_disease_regulator_pmids;
                self.tableItems[0].diseaseRegulon = result.num_disease_regulon_pmids;
                self.tableItems[0].mutationRegulator = result.num_mutation_regulator_pmids;
                self.tableItems[0].mutationDrugs = result.num_mutation_drug_pmids;

                self.chartOptions.series[0].data = [result.num_disease_mutation_pmids];
                self.chartOptions.series[1].data = [result.num_disease_regulator_pmids];
                self.chartOptions.series[2].data = [result.num_disease_regulon_pmids];
                self.chartOptions.series[3].data = [result.num_mutation_regulator_pmids];
                self.chartOptions.series[4].data = [result.num_mutation_drug_pmids];
                                                     });
        },
        reloadSelects: function() {
            var self = this;
            const apiURL = process.env.VUE_APP_API_URL;

            const diseaseURL = apiURL + '/diseases';
            const mutationURL = apiURL + '/mutations';
            const regulatorURL = apiURL + '/regulators';
            const regulonURL = apiURL + '/regulons';
            const drugURL = apiURL + '/drugs';
            self.selectedDisease = 'All myelomas';
            self.selectedMutation = 'All';
            self.selectedRegulator = 'All';
            self.selectedRegulon = 'All';
            self.selectedDrug = 'All';

            self.postJSON(diseaseURL, {hr: self.hrSlider}).then(function(result) {
                  self.diseases = result.diseases;
                  self.diseases.unshift('All myelomas');
                  self.diseases.unshift('All Cancers');
              self.postJSON(mutationURL, {hr: self.hrSlider}).then(function(result) {
                self.mutations = result.mutations;
                self.mutations.unshift('All');
                self.postJSON(regulatorURL, {hr: self.hrSlider}).then(function(result) {
                  self.regulators = result.regulators;
                  self.regulators.unshift('All');
                  self.postJSON(regulonURL, {hr: self.hrSlider}).then(function(result) {
                    self.regulons = result.regulons;
                    self.regulons.unshift('All');
                    self.postJSON(drugURL, {hr: self.hrSlider}).then(function(result) {
                      self.drugs = result.drugs;
                      self.drugs.unshift('All');
                      self.reloadTable(self.hrSlider, self.selectedDisease,
                                       self.selectedMutation, self.selectedRegulator,
                                       self.selectedRegulon, self.selectedDrug);
                    });
                  });
                });
              });
            });
        },
    },
    mounted: function() {
        this.reloadSelects();
    }
};
</script>
