import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "ngx-toastr";
export class ToasterService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3Rlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYWNvbnRwbHVzLXV0aWxzL3NyYy9saWIvc2VydmljZXMvdG9hc3Rlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQVkzQyxNQUFNLE9BQU8sY0FBYztJQUV6QixZQUFvQixFQUFpQjtRQUFqQixPQUFFLEdBQUYsRUFBRSxDQUFlO0lBQUksQ0FBQztJQUUxQyxNQUFNLENBQUMsS0FBa0I7UUFDdkIsTUFBTSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLEdBQUcsS0FBSyxDQUFBO1FBQ3BDLE1BQU0sT0FBTyxHQUFHO1lBQ2QsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLElBQUk7WUFDakIsYUFBYSxFQUFFLHFCQUFxQjtZQUNwQyxPQUFPLEVBQUUsSUFBSTtZQUNiLGVBQWUsRUFBRSxJQUFJO1NBQ3RCLENBQUE7UUFDRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQzFDLENBQUM7UUFDRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQzFDLENBQUM7UUFDRCxJQUFJLElBQUksS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZDLENBQUM7UUFDRCxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3hDLENBQUM7SUFDSCxDQUFDOzhHQTFCVSxjQUFjO2tIQUFkLGNBQWMsY0FGYixNQUFNOzsyRkFFUCxjQUFjO2tCQUgxQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgVG9hc3RyU2VydmljZSB9IGZyb20gJ25neC10b2FzdHInO1xyXG5cclxudHlwZSBUb2FzdHJQcm9wcyA9IHtcclxuICB0eXBlOiBcInN1Y2Nlc3NcIiB8IFwid2FybmluZ1wiIHwgXCJpbmZvXCIgfCBcImVycm9yXCJcclxuICBtZXNzYWdlOiBzdHJpbmdcclxuICB0aXRsZT86IHN0cmluZ1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUb2FzdGVyU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdFM6IFRvYXN0clNlcnZpY2UpIHsgfVxyXG5cclxuICB0b2FzdHIocHJvcHM6IFRvYXN0clByb3BzKSB7XHJcbiAgICBjb25zdCB7dHlwZSwgbWVzc2FnZSwgdGl0bGV9ID0gcHJvcHNcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGNsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgICBuZXdlc3RPblRvcDogdHJ1ZSxcclxuICAgICAgcHJvZ3Jlc3NCYXI6IHRydWUsXHJcbiAgICAgIHBvc2l0aW9uQ2xhc3M6ICd0b2FzdC1ib3R0b20tY2VudGVyJyxcclxuICAgICAgdGltZU91dDogNTAwMCxcclxuICAgICAgZXh0ZW5kZWRUaW1lT3V0OiAxMDAwXHJcbiAgICB9XHJcbiAgICBpZiAodHlwZSA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgdGhpcy50Uy5zdWNjZXNzKG1lc3NhZ2UsIHRpdGxlLCBvcHRpb25zKVxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGUgPT09IFwid2FybmluZ1wiKSB7XHJcbiAgICAgIHRoaXMudFMud2FybmluZyhtZXNzYWdlLCB0aXRsZSwgb3B0aW9ucylcclxuICAgIH1cclxuICAgIGlmICh0eXBlID09PSBcImluZm9cIikge1xyXG4gICAgICB0aGlzLnRTLmluZm8obWVzc2FnZSwgdGl0bGUsIG9wdGlvbnMpXHJcbiAgICB9XHJcbiAgICBpZiAodHlwZSA9PT0gXCJlcnJvclwiKSB7XHJcbiAgICAgIHRoaXMudFMuZXJyb3IobWVzc2FnZSwgdGl0bGUsIG9wdGlvbnMpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbn1cclxuIl19