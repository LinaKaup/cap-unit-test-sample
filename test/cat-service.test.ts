import cds from '@sap/cds'

describe('Test CatalogService', () => {
    const { GET, POST, DELETE, PATCH, expect } = cds.test(__dirname + '../../')

    describe('Test getBooksForStoreStartingWithLetter', () => {
        it('should return books starting with A', async () => {
            // Mocking the getAllBooksStartingWith action for the store
            //???

            const response = await POST('/odata/v4/catalog/getBooksForStoreStartingWithLetter', {
                storeId: 'SOAP',
                startsWith: 'A'
            })

            expect(response.status).to.equal(200)
            expect(response.data).to.be.an('array')
            response.data.forEach(book => {
                expect(book.title).to.match(/^A/)
            })
        })

        it('should return empty array for non-existing store', async () => {
            // Mocking the getAllBooksStartingWith action for the store
            
            const response = await POST('/odata/v4/catalog/getBooksForStoreStartingWithLetter', {
                storeId: 'SOAP',
                startsWith: 'A'
            })

            expect(response.status).to.equal(200)
            expect(response.data).to.be.an('array').that.is.empty
        })
    })
})