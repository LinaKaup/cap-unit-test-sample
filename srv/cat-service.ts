import cds from '@sap/cds'
import { getBooksForStoreStartingWithLetter } from '#cds-models/CatalogService'
import { Books } from '#cds-models/sap/capire/bookshop'

export class CatalogService extends cds.ApplicationService {
  async init() {

    // sample action i want to unit test
    this.on(getBooksForStoreStartingWithLetter, async req => {
      let { storeId, startsWith } = req.data;

      // dymamic service connection because every store provides the same actions
      const service = await cds.connect.to(storeId)

      // in the unit tests getAllBooksStartingWith should be mocked
      const books: Books | undefined = await service.send("getAllBooksStartingWith", { startsWith });

      if (books){
        // some further logic i want to test 
        books.forEach(book => {
          if (book.stock && book.stock > 0) {
            book.stock -= 1;
          }
        });
        // delete books with no stock
        return books.filter(book => book?.stock ?? 0 > 0);
      }
      return books;
    })

    return super.init()
  }
}
