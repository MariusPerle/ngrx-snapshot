import {fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {NgrxSnapshotService} from './ngrx-snapshot.service';
import {NgrxSnapshotModule} from "./ngrx-snapshot.module";
import {ActionsSubject, StoreModule} from "@ngrx/store";
import {provideMockStore} from "@ngrx/store/testing";
import {load, reducers} from "./mock.store";

function setup(actionAmount: number = 0, pattern: string = '.*') {
    const actionSub: ActionsSubject = new ActionsSubject();
    TestBed.configureTestingModule({
        imports: [
            NgrxSnapshotModule.forRoot(actionAmount, pattern),
            StoreModule.forRoot(reducers),
        ]
    }).overrideProvider('ActionsSubject', {useValue: actionSub});
    const snapshotService = TestBed.inject(NgrxSnapshotService);
    const actionsSubject = TestBed.inject(ActionsSubject) as ActionsSubject;
    return {snapshotService, actionsSubject};
}

describe('NgrxSnapshotService', () => {
    it('should be created', () => {
        const {snapshotService, actionsSubject} = setup();
        let snapshot = snapshotService.currentSnapshot();
        expect(snapshot.nextActionId).toEqual(1)
        expect(snapshot.actionsById[0].action.type).toEqual('@ngrx/store/init')
        actionsSubject.next(load());
        snapshot = snapshotService.currentSnapshot();
        expect(snapshot.nextActionId).toEqual(2);
    });
});
