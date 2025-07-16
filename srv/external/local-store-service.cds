using {sap.capire.bookshop as my} from '../../db/schema';

service LocalStoreService {
  action getAllBooksStartingWith(startsWith : String @mandatory );

}
