using {sap.capire.bookshop as my} from '../../db/schema';

service SoapStoreService {
  entity Books as projection on my.Books;

  action getAllBooksStartingWith(startsWith : String @mandatory ) returns Books;

}
