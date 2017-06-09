class InventoryController {
  /** @ngInject */
  constructor($localStorage) {
    this.$storage = $localStorage;
    this.searchParams = {
      name: '',
      types: this.cardTypes,
      costL: 0,
      costG: 8,
      expansions: this.expansions,
      adds: {
        action: false,
        buy: false,
        coin: false,
        draw: false
      }
    };
    this.results = [];
    console.log(this.searchParams.types);
  }

  $onInit() {
    // console.log(this.searchParams);
    this.search();
  }

  $onChanges(changes) {
    if (changes.cardTypes) {
      this.searchParams.types = Object.assign({}, this.cardTypes);
    }

    if (changes.expansions) {
      this.searchParams.expansions = Object.assign([], this.expansions);
    }

    if (changes.inventory) {
      this.inventory = Object.assign([], this.inventory);
    }
  }

  search() {
    let results = this.inventory;

    // Filter by string
    if (this.searchParams.name) {
      const REGEX = new RegExp(this.searchParams.name, "gi");
      results = results.filter(card => REGEX.test(card.name.concat(card.text.join())) === true);
    }

    // Filter by types
    const filterByTypes = [];
    for (const type in this.searchParams.types) {
      if (this.searchParams.types[type]) {
        filterByTypes.push(type);
      }
    }
    if (filterByTypes.length > 0) {
      results = results.filter(card => {
        let match = 0;
        for (const type of filterByTypes) {
          match = card.types.includes(type) ? match + 1 : match;
        }
        return match > 0;
      });
    }

    // Filter by adds
    const filterByAdds = [];
    for (const type in this.searchParams.adds) {
      if (this.searchParams.adds[type]) {
        filterByAdds.push(type);
      }
    }
    if (filterByAdds.length > 0) {
      results = results.filter(card => {
        let match = 0;
        for (const type of filterByAdds) {
          if (card.adds) {
            match = card.adds[type] > 0 ? match + 1 : match;
          }
        }
        return match > 0;
      });
    }

    // Filter by expansions
    const filterByExpansions = [];
    for (const expac of this.searchParams.expansions) {
      if (expac.use) {
        filterByExpansions.push(expac.name);
      }
    }
    if (filterByExpansions.length > 0) {
      results = results.filter(card => {
        let match = 0;
        for (const expac of filterByExpansions) {
          match = card.set === expac ? match + 1 : match;
        }
        return match > 0;
      });
    }

    // Filter by cost
    results = results.filter(card => parseInt(card.cost.coin, 10) >= this.searchParams.costL);
    results = results.filter(card => parseInt(card.cost.coin, 10) <= this.searchParams.costG);

    this.results = results;
  }
}

InventoryController.$inject = ['$localStorage'];

export const Inventory = {
  templateUrl: 'app/components/Inventory.html',
  controller: InventoryController,
  bindings: {
    expansions: '<',
    inventory: '<',
    cardTypes: '<'
  }
};
