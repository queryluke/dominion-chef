class Playset {
  constructor() {
    this.cards = [];
    this.types = {
      attack: 0,
      duration: 0,
      reaction: 0,
      treasure: 0,
      victory: 0
    };
    this.adds = {
      buy: 0,
      action: 0,
      draw: 0,
      coin: 0
    };
    this.curse = 0;
    this.cost = 0;
    this.requiredCards = {
      supply: {},
      other: {}
    };
    this.id = '';
  }

  importPlayset(cardString, cardInventory) {
    this.parseCardString(cardString, cardInventory);
    this.setRequiredCards(cardInventory);
    this.setPlaysetValues();
    this.getPlaysetId();
    return this;
  }

  parseCardString(cardString, cardInventory) {
    const cardIds = cardString.split(/(?=[A-Z])/);
    this.cards = cardInventory.filter(card => cardIds.indexOf(card.id) > -1);
  }

  setPlaysetValues() {
    for (const card of this.cards) {
      // Types
      for (const type in this.types) {
        if (card.types.includes(type)) {
          this.types[type] += 1;
        }
      }
      // Adds
      for (const add in this.adds) {
        if ({}.hasOwnProperty.call(this.adds, add)) {
          this.adds[add] += parseInt(card.adds[add], 10);
        }
      }
      // Curse
      this.curse += card.requires.includes('Curse') ? 1 : 0;
      // Cost
      this.cost += card.cost.coin ? parseInt(card.cost.coin.replace(/[\D]/gi, ''), 10) : 1;
    }
  }

  addCard(card) {
    // Push card
    this.cards.push(card);
    // Inc Cost
    this.cost += card.cost.coin ? parseInt(card.cost.coin.replace(/[\D]/gi, ''), 10) : 1;
    // Inc Curse
    this.curse += card.requires.includes('Curse') ? 1 : 0;
    // Inc Types
    for (const type in this.types) {
      if (card.types.includes(type)) {
        this.types[type] += 1;
      }
    }
    // Increment Adds
    for (const add in this.adds) {
      if ({}.hasOwnProperty.call(this.adds, add)) {
        this.adds[add] += parseInt(card.adds[add], 10);
      }
    }
  }

  removeCard(card) {
    // Splice card
    this.cards.splice(this.cards.indexOf(card), 1);
    // Inc Cost
    this.cost -= card.cost.coin ? parseInt(card.cost.coin.replace(/[\D]/gi, ''), 10) : 1;
    // Inc Curse
    this.curse -= card.requires.includes('Curse') ? 1 : 0;
    // Inc Types
    for (const type in this.types) {
      if (card.types.includes(type)) {
        this.types[type] -= 1;
      }
    }
    // Decrement Adds
    for (const add in this.adds) {
      if ({}.hasOwnProperty.call(this.adds, add)) {
        this.adds[add] -= parseInt(card.adds[add], 10);
      }
    }
  }

  setRequiredCards(cardInventory) {
    let prosperityCount = 0;

    let supplyCards = new Set(['Copper', 'Silver', 'Gold', 'Estate', 'Duchy', 'Province']);
    const supply = new Set();
    const other = new Set();

    for (const card of this.cards) {
      if (card.set === 'Prosperity') {
        prosperityCount++;
      }
      const requiredCards = new Set(card.requires);
      supplyCards = new Set([...supplyCards, ...requiredCards]);
    }

    if (prosperityCount >= 5) {
      const prosperity = new Set(['Colony', 'Platinum']);
      supplyCards = new Set([...supplyCards, ...prosperity]);
    }

    for (const cardName of supplyCards) {
      const card = cardInventory.filter(card => cardName === card.name);
      if (card[0]) {
        if (card[0].types.includes('supply')) {
          supply.add(card[0]);
        } else {
          other.add(card[0]);
        }
      } else {
        this.errors.push(`Cannot find required card ${cardName}`);
      }
    }

    this.requiredCards = {
      supply: [...supply],
      other: [...other]
    };
  }

  sortCards() {
    // Sort the cards
    this.cards.sort((a, b) => {
      const aCost = a.cost.coin ? parseInt(a.cost.coin.replace(/[\D]/gi, ''), 10) : 1;
      const bCost = b.cost.coin ? parseInt(b.cost.coin.replace(/[\D]/gi, ''), 10) : 1;

      if (aCost < bCost) {
        return -1;
      }
      if (aCost > bCost) {
        return 1;
      }
      return 0;
    });
  }

  getPlaysetId() {
    let playsetId = '';
    for (const card of this.cards) {
      playsetId = playsetId.concat(card.id);
    }
    this.id = playsetId;
    return playsetId;
  }
}

export default Playset;
