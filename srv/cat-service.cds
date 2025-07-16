using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService {

entity Books as projection on my.Books

action getBooksForStoreStartingWithLetter(
  storeId:String @mandatory,
  startsWith:String @mandatory
) returns Books;

}
