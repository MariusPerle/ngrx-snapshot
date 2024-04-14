import {CommonModule} from "@angular/common";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {NgrxSnapshotService} from "./ngrx-snapshot.service";
import {EffectsModule} from "@ngrx/effects";
import {NgrxSnapshotEffect} from "./ngrx-snapshot.effect";

export type UsePattersAs = 'whitelist' | 'blacklist';

@NgModule({
    imports: [
        CommonModule,
        EffectsModule.forFeature([NgrxSnapshotEffect])
    ],
    providers: [NgrxSnapshotService],
})
export class NgrxSnapshotModule {
    /**
     * Initializes Module with configuration
     * This method should be used in the root module
     *
     * @param {number} actionAmount - the amount of actions in snapshot. 0 means no limit
     * @param {RegExp} pattern - the pattern for action tracked for snapshot
     * @param usePattersAs - how pattern should be used as whitelist or blacklist (default: 'whitelist')
     */
    static forRoot(actionAmount: number,pattern: RegExp = new RegExp('.*'), usePattersAs: UsePattersAs = 'whitelist'): ModuleWithProviders<NgrxSnapshotModule> {
        return {
            ngModule: NgrxSnapshotModule,
            providers: [
                {provide: 'action_pattern', useValue: pattern},
                {provide: 'use_patters_as', useValue: usePattersAs},
                {provide: 'action_amount', useValue: actionAmount}
            ],
        };
    }
}
