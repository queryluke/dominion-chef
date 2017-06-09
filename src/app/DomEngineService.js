export class DomEngineService {
  /** @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getCards() {
    return this.$http.get('data/cards.json')
      .then(getCardsComplete)
      .catch(getCardsFailed);

    function getCardsComplete(response) {
      return response.data;
    }

    function getCardsFailed(error) {
      console.log('XHR Failed for getCards.');
      console.log(error.data);
    }
  }

  getSets() {
    return this.$http.get('data/sets.json')
      .then(getSetsComplete)
      .catch(getSetsFailed);

    function getSetsComplete(response) {
      return response.data;
    }

    function getSetsFailed(error) {
      console.log('XHR Failed for getSets.');
      console.log(error.data);
    }
  }

  getSupplyCards() {
    return this.$http.get('data/supplyCards.json')
      .then(getSupplyCardsComplete)
      .catch(getSupplyCardsFailed);

    function getSupplyCardsComplete(response) {
      return response.data;
    }

    function getSupplyCardsFailed(error) {
      console.log('XHR Failed for getSets.');
      console.log(error.data);
    }
  }

  bootstrapDomEngine() {
    return Promise.all([this.getSets(), this.getCards(), this.getSupplyCards()])
      .then(bootstrapDomEngineComplete)
      .catch(bootstrapDomEngineFail);

    function bootstrapDomEngineComplete(response) {
      return response;
    }

    function bootstrapDomEngineFail(error) {
      console.log('XHR Failed for bootstrapDomEngine.');
      console.log(error);
    }
  }
}
