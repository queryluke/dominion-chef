import buildConfig from '../constants/buildConfig';
import Playset from '../models/playset';

class DomEngineController {
  /** @ngInject */
  constructor($localStorage, $state, DomEngineService, $log) {
    this._ds = DomEngineService;
    this.$storage = $localStorage;
    this.$state = $state;
    this.$log = $log;
  }

  $onInit() {
    this.baseConfig = JSON.parse(JSON.stringify(buildConfig));
    this.errors = [];
    this.warning = [];
    this.supplyCards = [];
    this.expansions = [];
    this.cardTypes = {};
    this.inventory = [];
    this.shareOpen = false;

    this._ds.bootstrapDomEngine().then(response => {
      this.baseConfig.expansions = response[0];
      this.$storage.expansions = response[0];
      this.expansions = response[0];
      this.cards = response[1];
      this.supplyCards = response[2];
      this.inventory = response[1].concat(response[2]);
      this.cardTypes = this.getTypes(this.inventory);

      if (this.$state.params.p) {
        console.log('params');
        const playset = new Playset();
        this.$storage.playset = playset.importPlayset(this.$state.params.p, this.inventory);
        this.$state.transitionTo('playset');
      }
    });

    if (this.$storage.config === undefined) {
      this.$storage.config = this.baseConfig;
    }
  }

  getTypes(cards) {
    const typeSet = new Set();
    const types = {};

    for (const card of cards) {
      for (const type of card.types) {
        typeSet.add(type);
      }
    }

    const typeArray = [...typeSet];
    typeArray.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });

    for (const type of typeArray) {
      types[type] = false;
    }

    return types;
  }

  onBuild() {
    const useSets = [];
    this.errors = [];
    this.warning = [];

    for (const set of this.$storage.config.expansions) {
      if (set.use) {
        useSets.push(set.name);
      }
    }

    this.$log.debug(useSets);

    if (useSets.length === 0) {
      return;
    }

    const useCards = [];

    for (const card of this.cards) {
      if (useSets.indexOf(card.set) !== -1) {
        useCards.push(card);
      }
    }

    this.createPlayset(useCards, this.$storage.config);

    if (this.errors.length) {
      this.playset = new Playset();
    } else {
      this.playset.setRequiredCards(this.supplyCards);
      this.playset.sortCards();
      this.playset.getPlaysetId();
      this.$state.transitionTo('playset');
      this.$storage.playset = this.playset;
    }
  }

  createPlayset(useCards, config) {
    this.$log.debug('generating playset');
    this.playset = new Playset();

    // minimum attribute cards
    this.getMinimumNeededCards(useCards, config);
    this.$log.debug(`--------> MINIMUM REQUIRED CARDS COMPLETE, PLAYSET HAS ${this.playset.cards.length} CARDS`);
    if (this.errors.length > 0) {
      return;
    }

    // all other cards
    this.getRemainingCards(useCards, config);
    if (this.errors.length > 0) {
      return;
    }

    this.$log.debug('playset built');
    this.$log.debug(this.playset);
  }

  getRemainingCards(useCards, config) {
    let attempts = 1;
    while (attempts < 6) {
      this.$log.debug(`ATTEMPT #${attempts} FOR REMAINING CARDS`);
      // reset the added array
      const addedSet = [];
      // reset the match card subset
      const cardSet = Object.assign([], useCards);

      while (this.playset.cards.length < 10) {
        // If we've run out of cards to try
        if (cardSet.length === 0) {
          this.$log.debug(`ATTEMPT #${attempts} FAILED`);
          // remove the cards that have been added to start again
          for (const card of addedSet) {
            this.playset.removeCard(card);
          }
          break;
        } else {
          const num = this.randomNumber(cardSet.length);
          const card = cardSet.splice(num, 1)[0];
          this.$log.debug(`trying ${card.name}`);

          if (this.checkValidCard(card, config)) {
            addedSet.push(card);
            this.playset.addCard(card);
            this.$log.debug(`PLAYSET LENGTH IS NOW ${this.playset.cards.length}. NEED ${10 - this.playset.cards.length} MORE CARDS`);
          }
        }
      }

      if (this.playset.cards.length < 10) {
        attempts++;
        // If this is the final attempt, make the cost infinite
        // this could be expanded to check where the build is failing and remedy
        if (attempts === 5) {
          config.cost = 100;
          this.warning.push(`Increased Max Cost`);
        }
      } else {
        attempts = 10;
      }
    }

    // If the build hits this point and the playset is not full, the entire build has failed
    if (this.playset.cards.length < 10) {
      this.errors.push('could not complete the playset with these options');
    }
  }

  getMinimumNeededCards(cards, config) {
    for (const req in config.adds) {
      if (config.adds[req].min !== 0 && config.adds[req].max !== 0) {
        let attempts = 1;
        this.$log.debug(`${req.toUpperCase()} - Minimum:${config.adds[req].min} | Current:${this.playset.adds[req]}`);

        while (attempts < 6) {
          this.$log.debug(`ATTEMPT #${attempts} FOR ${req.toUpperCase()}`);
          // reset the added array
          const addedSet = [];
          // reset the match card subset
          const subset = cards.filter(card => card.adds[req] > 0);

          while (this.playset.adds[req] < config.adds[req].min) {
            this.$log.debug(`LENGTH OF THE ${req.toUpperCase()} SUBSET: ${subset.length}`);

            // If we've run out of cards to try to add OR the playset has more than 10 cards, reset and try again
            if (subset.length === 0 || this.playset.length > 10) {
              this.$log.debug(`CANNOT FIND SET FOR ${req.toUpperCase()} ON ATTEMPT ${attempts}`);
              // remove the cards that have been added to start again
              for (const card of addedSet) {
                this.playset.removeCard(card);
              }
              break;
            } else {
              const random = this.randomNumber(subset.length);

              const neededCard = subset.splice(random, 1)[0];
              this.$log.debug(`trying ${neededCard.name}`);

              if (this.checkValidCard(neededCard, config)) {
                addedSet.push(neededCard);
                this.playset.addCard(neededCard);
              }

              this.$log.debug(`TOTAL ${req.toUpperCase()} IS NOW ${this.playset.adds[req]}. NEED ${config.adds[req].min - this.playset.adds[req]} MORE ${req.toUpperCase()}s`);
            }
          }

          if (this.playset.adds[req] >= config.adds[req].min) {
            attempts = 10;
          } else {
            attempts++;
          }
        }

        if (attempts === 10) {
          this.$log.debug(`!!!! FINISHED - ${req.toUpperCase()}: Total ${req} is ${this.playset.adds[req]}, required was ${config.adds[req].min} !!!!`);
          // this.playset.cards = this.playset.cards.concat(requiredSet);
        } else {
          this.$log.debug(`!!!! TOO MANY ATTEMPTS FOR ${req.toUpperCase()} requirement`);
          this.errors.push(`Too many attempts to match the ${req} requirement`);
          return;
        }
      }
    }

    for (const attr in config.adds) {
      if (this.playset.adds[attr] > config.adds[attr].max) {
        config.adds[attr].max = this.playset.adds[attr];
        this.warning.push(`Had to increase ${attr} max limit`);
      }
    }

    this.$log.debug(`!!!! FINISHED - ATTRMIN - Current playset cards is ${this.playset.cards.length} !!!!`);
  }

  checkValidCard(card, config) {
    // Adds
    const max = {};
    max.buy = config.adds.buy.max === 0 ? 100 : config.adds.buy.max;
    max.draw = config.adds.draw.max === 0 ? 100 : config.adds.draw.max;
    max.action = config.adds.action.max === 0 ? 100 : config.adds.action.max;
    max.coin = config.adds.coin.max === 0 ? 100 : config.adds.coin.max;

    // In Set
    if (this.playset.cards.indexOf(card) === -1) {
      this.$log.debug(`${card.name} NOT in the playset`);
    } else {
      this.$log.debug(`${card.name} IN the playset`);
      return false;
    }

    // Cost
    const cost = card.cost.coin ? parseInt(card.cost.coin.replace(/[\D]/gi, ''), 10) : 1;
    if (this.playset.cost + cost <= config.cost) {
      this.$log.debug(`Add ${card.name}: cost -> ${cost} + ${this.playset.cost} < ${config.cost}`);
    } else {
      this.$log.debug(`Skip ${card.name}: cost -> ${cost}, + ${this.playset.cost} > ${config.cost}`);
      return false;
    }

    // Curse
    const curse = card.requires.includes('Curse') ? 1 : 0;
    if (this.playset.curse + curse <= config.limits.curse) {
      this.$log.debug(`Add ${card.name}: curse -> ${curse} + ${this.playset.curse} < ${config.limits.curse}`);
    } else {
      this.$log.debug(`Skip ${card.name}: curse -> ${curse}, + ${this.playset.curse} > ${config.limits.curse}`);
      return false;
    }

    // Types
    for (const type in this.playset.types) {
      if ({}.hasOwnProperty.call(this.playset.types, type)) {
        const typeTest = card.types.includes(type) ? 1 : 0;
        if (this.playset.types[type] + typeTest <= config.limits[type]) {
          this.$log.debug(`Add ${card.name}: ${type} -> ${typeTest} + ${this.playset.types[type]} < ${config.limits[type]}`);
        } else {
          this.$log.debug(`Skip ${card.name}: ${type} -> ${typeTest}, + ${this.playset.types[type]} > ${config.limits[type]}`);
          return false;
        }
      }
    }

    // Adds
    for (const add in this.playset.adds) {
      if ({}.hasOwnProperty.call(this.playset.adds, add)) {
        const addTest = card.adds[add];
        if (this.playset.adds[add] + addTest <= max[add]) {
          this.$log.debug(`Add ${card.name}: ${add} -> ${addTest} + ${this.playset.adds[add]} < ${max[add]}`);
        } else {
          this.$log.debug(`Skip ${card.name}: ${add} -> ${addTest} + ${this.playset.adds[add]} > ${max[add]}`);
          return false;
        }
      }
    }

    this.$log.debug(`Adding ${card.name}, passes all requirements`);
    return true;
  }

  randomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  resetOptions() {
    this._ds.getSets().then(response => {
      const newConfig = JSON.parse(JSON.stringify(buildConfig));
      newConfig.expansions = response;
      this.$storage.config = newConfig;
    });
  }

  toggleShare() {
    this.shareOpen = !this.shareOpen;
  }
}

export const DomEngine = {
  templateUrl: 'app/containers/DomEngine.html',
  controller: DomEngineController
};
