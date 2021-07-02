let cart = null

module.exports = class Cart {
    static save(manga){
        if(cart === null){
            cart = {mangas: [], totalPrice: 0}

            manga.quantity = 1
            cart.mangas.push(manga)
            cart.totalPrice = manga.price
        }
        else if(cart){
            const existingMangaIndex = cart.mangas.findIndex(p => p.id = manga.id)
            console.log('existingMangaIndex:', existingMangaIndex)
            if(existingMangaIndex > 0){//Manga existing
                const existingManga = cart.mangas[existingMangaIndex]
                existingManga.quantity += 1
                cart.totalPrice += manga.price
            }
            else{//Manga not existing
                manga.quantity = 1
                cart.mangas.push(manga)
                cart.totalPrice += manga.price
            }
        }

        
    }

    static getCard(){
        return cart
    }
}