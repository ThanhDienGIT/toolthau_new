class TokenStorage {
    constructor() {
        this.botIdPrivate = '6500184315:AAFDpDzHBE1AJmo9lut3AWtNJzvH35UJXfE';
        this.userIdPrivate = '6073926430';
        this.botIdGroupThau = '1935152100:AAEauOpcjdoDJujAK2da3zj-D1GCpPHISGM'
        this.IdGroupThau = '-449294338'

    }

    getBotIdToken_private() {
        return this.botIdToken;
    }

    getUserIdToken_private() {
        return this.userIdToken;
    }


    getBotIdToken_GroupThau() {
        return this.botIdGroupThau;
    }

    getUserIdToken_GroupThau() {
        return this.IdGroupThau;
    }
}


module.exports = TokenStorage;