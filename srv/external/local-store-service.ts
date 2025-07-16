import cds from '@sap/cds'
import { executeHttpRequest } from '@sap-cloud-sdk/http-client'
import { resilience } from "@sap-cloud-sdk/resilience";
import xpath from 'xpath';
import xmldom from '@xmldom/xmldom';
import { Books } from '#cds-models/sap/capire/bookshop';

export class LocalStoreService extends cds.ApplicationService {
    async init() {


        // Reduce stock of ordered books if available stock suffices
        this.on('getAllBooksStartingWith', async req => {
            const books = await SELECT.from(Books).where({ title: { "like" : req.data.startsWith + '%' } })
            // further service specific logic
            return books;
        })

        return super.init()
    }
}
