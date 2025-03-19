export class Pagination {
  pageIndex: number;
  pageSize: number;
  maxSize: number;
  totalRecords: number;
  pageSizeOptions: number[];

  /**
   * @param pageIndex Current page index (0-based for MatPagination compatibility)
   * @param pageSize Number of records per page
   * @param maxSize Maximum number of pages displayed in the pagination control
   * @param totalRecords Total number of records
   * @param pageSizeOptions Available page size options
   */
  constructor(
    pageIndex: number = 0, // MatPagination starts at 0
    pageSize: number = 25,
    maxSize: number = 5,
    totalRecords: number = 0,
    pageSizeOptions: number[] = [25, 50, 75, 100],
  ) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.maxSize = maxSize;
    this.totalRecords = totalRecords;
    this.pageSizeOptions = pageSizeOptions;
  }

  /**
   * Calculates the total number of pages.
   */
  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  /**
   * Updates the page size and resets the page index to the first page.
   * @param newPageSize The new page size
   */
  updatePageSize(newPageSize: number): void {
    if (this.pageSizeOptions.includes(newPageSize)) {
      this.pageSize = newPageSize;
      this.pageIndex = 0; // Reset to first page
    } else {
      throw new Error(`Invalid page size: ${newPageSize}`);
    }
  }

  /**
   * Updates pagination data based on paginator event.
   * @param event MatPaginator event
   */
  updateFromPaginatorEvent(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
