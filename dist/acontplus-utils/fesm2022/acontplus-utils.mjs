import * as i0 from '@angular/core';
import { Injectable, Component } from '@angular/core';
import * as i1 from 'ngx-toastr';

class AcontplusUtilsService {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: AcontplusUtilsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: AcontplusUtilsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: AcontplusUtilsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

class AcontplusUtilsComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: AcontplusUtilsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.2", type: AcontplusUtilsComponent, isStandalone: true, selector: "lib-acontplus-utils", ngImport: i0, template: `
    <p>
      acontplus-utils works!
    </p>
  `, isInline: true, styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: AcontplusUtilsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-acontplus-utils', standalone: true, imports: [], template: `
    <p>
      acontplus-utils works!
    </p>
  ` }]
        }] });

class ToasterService {
    constructor(tS) {
        this.tS = tS;
    }
    toastr(props) {
        const { type, message, title } = props;
        const options = {
            closeButton: true,
            newestOnTop: true,
            progressBar: true,
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
            extendedTimeOut: 1000
        };
        if (type === "success") {
            this.tS.success(message, title, options);
        }
        if (type === "warning") {
            this.tS.warning(message, title, options);
        }
        if (type === "info") {
            this.tS.info(message, title, options);
        }
        if (type === "error") {
            this.tS.error(message, title, options);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: ToasterService, deps: [{ token: i1.ToastrService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: ToasterService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: ToasterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.ToastrService }] });

/*
 * Public API Surface of acontplus-utils
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AcontplusUtilsComponent, AcontplusUtilsService, ToasterService };
//# sourceMappingURL=acontplus-utils.mjs.map
