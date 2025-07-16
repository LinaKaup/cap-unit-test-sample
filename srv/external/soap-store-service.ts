import cds from '@sap/cds'
import { executeHttpRequest } from '@sap-cloud-sdk/http-client'
import { resilience } from "@sap-cloud-sdk/resilience";
import xpath from 'xpath';
import xmldom from '@xmldom/xmldom';

export class SoapStoreService extends cds.ApplicationService {
    async init() {

        // Service specific implementation for SOAP store service
        // this is dummy code to visualize different implementations
        this.on('getAllBooksStartingWith', async req => {
            let { startsWith } = req.data;

            // Mapping for request
            const body: string =
                `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header/>
        <soapenv:Body>
            <ses:loginRequest xmlns:ses="https://finanzonline.bmf.gv.at/fon/ws/session">
                <ses:tid>${cds.env.soapuser}</ses:tid>
                <ses:benid>${cds.env.soappswd}</ses:benid>
            </ses:loginRequest>
        </soapenv:Body>
</soapenv:Envelope>`;


            const response = await executeHttpRequest(
                {
                    destinationName: 'API_DUMMY',
                },
                {
                    method: 'POST',
                    url: 'dummy',
                    headers: {
                        'SOAPAction': 'GetBooksForStoreStartingWithLetter',
                        'Content-Type': 'text/xml; charset=utf-8'
                    },
                    data: body,
                    middleware: resilience({
                        timeout: 10000, // 10 seconds
                    })
                }

            );


            // Parse the XML response
            const parser = new xmldom.DOMParser();
            // @ts-expect-error misssing Node properties are not needed
            const doc: Document = parser.parseFromString(response.data, 'text/xml')
            const select = xpath.useNamespaces({
                soapenv: 'http://schemas.xmlsoap.org/soap/envelope/',
                soapenc: 'http://schemas.xmlsoap.org/soap/encoding/',
                xsd: 'http://www.w3.org/2001/XMLSchema',
                xsi: 'http://www.w3.org/2001/XMLSchema-instance',
                ns5: 'https://finanzonline.bmf.gv.at/fon/ws/session'
            });
            const errorCode = (select('//ns5:rc', doc) as Node[])[0]?.textContent;
            const sessionId = (select('//ns5:id', doc) as Node[])[0]?.textContent;

            // get Books array from xml
            const books = (select('//ns5:books/ns5:book', doc) as Node[]).map((bookNode) => {
                return {
                    id: (select('ns5:id', bookNode) as Node[])[0]?.textContent,
                    title: (select('ns5:title', bookNode) as Node[])[0]?.textContent,
                }
            });

            return books.filter(book => book.title?.startsWith(startsWith));

        })

        return super.init()
    }
}
