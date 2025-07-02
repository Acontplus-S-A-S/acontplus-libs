// Example concrete implementation
import {HttpClient} from "@angular/common/http";


export class ExampleRepository extends BaseRepository<any> {
    constructor(http: HttpClient) {
        super(http, '/api/examples');
    }

    getAll(
        pagination: PaginationParams,
        filters?: FilterParams,
    ): Observable<PaginatedResult<any>> {
        const params = this.buildQueryParams(pagination, filters);
        return this.get<PaginatedResult<any>>(this.buildUrl(''), params);
    }

    getById(id: number): Observable<any> {
        return this.get<any>(this.buildUrl(id.toString()));
    }

    create(entity: Omit<any, 'id'>): Observable<any> {
        return this.post<any>(this.buildUrl(''), entity);
    }

    update(id: number, entity: Partial<any>): Observable<any> {
        return this.put<any>(this.buildUrl(id.toString()), entity);
    }

    delete(id: number): Observable<boolean> {
        return this.deleteHttp<boolean>(this.buildUrl(id.toString()));
    }

    search(
        query: string,
        pagination: PaginationParams,
    ): Observable<PaginatedResult<any>> {
        const params = {
            ...this.buildQueryParams(pagination),
            search: query,
        };
        return this.get<PaginatedResult<any>>(this.buildUrl('search'), params);
    }
}
