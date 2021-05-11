const ActiveRecord = require('./ActiveRecord');

class GameDeckCard extends ActiveRecord {
    static table_name = "Game Deck";
    static fields = ['game','user', 'card', 'order'];

    static LAST_PLAYED = -1;
    static DRAWN = -2;
    static PLAYED = -3;

    static LAST_PLAYED_RED = -6;
    static LAST_PLAYED_GREEN = -7;
    static LAST_PLAYED_YELLOW = -8;
    static LAST_PLAYED_BLUE = -9;
    static LAST_PLAYED_BLACK = -10;

    game = undefined;
    user = undefined;
    card = undefined;
    order = undefined;

    constructor(game, user, card, order) {
        super();
        this.game = game;
        this.user = user;
        this.card = card;
        this.order = order;
    }

    get game() {
        return this.game;
    }

    get user() {
        return this.user;
    }

    get card() {
        return this.card;
    }

    get order() {
        return this.order;
    }


    // Inserts a game deck into the database
    // gameDeck: Array of GameDeckCard objects
    static createGameDeck(gameDeck) {

        // Need to save each GameDeckCard object individually, so use Promise.all
        var promises = [];

        gameDeck.forEach((gameCard) => {
            promises.push(gameCard.save());
        });

        // Run all promises and return gameDeck for further use
        return new Promise((resolve, reject) => {
            Promise.all(promises)
            .then(() => {
                resolve(gameDeck);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    
    static getGameDeck(game) {
        return new Promise((resolve, reject) => {
            GameDeckCard.findAll('game', game)
                .then((gameDeckData) => {
                    
                    let gameDeck = [];

                    // This should always return a JSON array of 108 GameDeck rows

                    // For each row in JSON array, create GameDeckCard objects
                    for(let gameCardData of gameDeckData) {
                        let gameCard = new GameDeckCard(gameCardData.game, gameCardData.user, gameCardData.card, gameCardData.order);

                        gameDeck.push(gameCard);
                    }

                    resolve(gameDeck);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static getUserHand(game, user) {
        return new Promise((resolve, reject) => {
            GameDeckCard.findAll('game', game)
                .then((gameDeckData) => {
                    let userGameDeck = [];

                    for(let gameCardData of gameDeckData) {
                        if(gameCardData.user === user) {
                            let gameCard = new GameDeckCard(gameCardData.game, gameCardData.user, gameCardData.card, gameCardData.order);
                            userGameDeck.push(gameCard);                        
                        }
                    }

                    return resolve(userGameDeck);
                })
                .catch((err) => {
                    return reject(err);
                })
        })

    }

    static getLastPlayedCard(game) {
        const data = {
            game: game,
            order: -5
        }

        const comparator = ["=", "<"]

        return new Promise((resolve, reject) => {
            GameDeckCard.findOne(data, comparator, true, "order")
                .then((card) => {
                    console.log(card);
                    resolve(card);
                })
                .catch((err) => {
                    return reject(err);
                })
        })
    }

    static getTopCard(game) {
        const data = {
            game: game,
            order: 0
        }

        const comparator = ["=", ">"]

        return new Promise((resolve, reject) => {
            GameDeckCard.findOne(data, comparator, true, "order")
                .then((gameCardData) => {
                    // Create GameDeckCard object
                    let gameCard = new GameDeckCard(gameCardData.game, gameCardData.user, gameCardData.card, gameCardData.order);
                    return resolve(gameCard);
                })
                .catch((err) => {
                    console.log(err);
                    return reject(err);
                });
        });
    }

    static getLastPlayedCardOrder(color) {
        switch(color) {
            case "red":
                return GameDeckCard.LAST_PLAYED_RED;
            case "green":
                return GameDeckCard.LAST_PLAYED_GREEN;
            case "blue":
                return GameDeckCard.LAST_PLAYED_BLUE;
            case "yellow":
                return GameDeckCard.LAST_PLAYED_YELLOW;
            case "black":
                return GameDeckCard.LAST_PLAYED_BLACK;
        }
    }


    // Save GameDeckCard into Game Deck table in database with the values from the instance data fields
    save() {
        const data = {
            game: this.game,
            user: this.user,
            card: this.card,
            order: this.order
        }

        return new Promise((resolve, reject) => {
            GameDeckCard.create(data)
                .then((gameDeckCard) => {
                    if (!gameDeckCard) {
                        resolve(null);
                    }
                    resolve(this);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = GameDeckCard;




    

