import {CommonModule} from "@angular/common";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {NgrxSnapshotService} from "./ngrx-snapshot.service";

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [NgrxSnapshotService],
})
export class NgrxSnapshotModule {
    /**
     * Initializes Module with configuration
     * This method should be used in the root module
     *
     * @param {number} actionAmount - the amount of actions in snapshot. 0 means no limit
     * @param {string} pattern - the pattern for action tracked for snapshot
     */
    static forRoot(actionAmount: number,pattern: string = '.*'): ModuleWithProviders<NgrxSnapshotModule> {
        return {
            ngModule: NgrxSnapshotModule,
            providers: [NgrxSnapshotService,
                {provide: 'action_pattern', useValue: pattern},
                {provide: 'action_amount', useValue: actionAmount}
            ],
        };
    }
}
