import cds from '@sap/cds'
import { Books } from '#cds-models/sap/capire/bookshop';

export class LocalStoreService extends cds.ApplicationService {
    async init() {
        this.on('getAllBooksStartingWith', async req => {
            // only sample to visulize different implementations
            // in my real world application I would use a different service with cloud sdk / no sql table
            const books = await SELECT.from(Books).where({ title: { "like" : req.data.startsWith + '%' } })
            // further service specific logic
            return books;
        })

        return super.init()
    }
}
