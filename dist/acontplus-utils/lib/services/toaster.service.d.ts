import { ToastrService } from 'ngx-toastr';
import * as i0 from "@angular/core";
type ToastrProps = {
    type: "success" | "warning" | "info" | "error";
    message: string;
    title?: string;
};
export declare class ToasterService {
    private tS;
    constructor(tS: ToastrService);
    toastr(props: ToastrProps): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToasterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ToasterService>;
}
export {};
