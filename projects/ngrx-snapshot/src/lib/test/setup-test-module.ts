import {ActionsSubject, StoreModule} from "@ngrx/store";
import {TestBed} from "@angular/core/testing";
import {NgrxSnapshotModule, UsePattersAs} from "../ngrx-snapshot.module";
import {reducers} from "./mock.store";
import {EffectsModule} from "@ngrx/effects";
import {NgrxSnapshotService} from "../ngrx-snapshot.service";

export type TestData = { actionsSubject: ActionsSubject, snapshotService: NgrxSnapshotService }

export function setupTestModule(actionAmount: number = 0, pattern: RegExp = new RegExp('.*'), usePattersAs: UsePattersAs = 'whitelist'): TestData {
    const actionSub: ActionsSubject = new ActionsSubject();
    TestBed.configureTestingModule({
        imports: [
            NgrxSnapshotModule.forRoot(actionAmount, pattern, usePattersAs),
            StoreModule.forRoot(reducers),
            EffectsModule.forRoot()
        ]
    }).overrideProvider('ActionsSubject', {useValue: actionSub});
    const snapshotService = TestBed.inject(NgrxSnapshotService);
    const actionsSubject = TestBed.inject(ActionsSubject) as ActionsSubject;
    return {snapshotService, actionsSubject};
}