import {setupTestModule} from "./setup-test-module";
import {initialState, load, loadFailure, loadSuccess} from "./mock.store";
import {SnapShot} from "../types";
import {Action} from "@ngrx/store/src/models";


function checkActions(snapshot: SnapShot, actionWithStore: {action: Action, store: Object}[]) {
    expect(snapshot.computedStates.length).toEqual(actionWithStore.length)
    actionWithStore.forEach(({action, store}, i) => {
        expect(snapshot.actionsById[i].action.type).toEqual(action.type)
        expect(snapshot.computedStates[i].state).toEqual(store)
    })
}

describe('filtering actions', () => {

    it('should filter actions by pattern as whitelist', () => {
        const {snapshotService, actionsSubject} = setupTestModule(0,
            new RegExp("Example API", "g"), 'whitelist');
        actionsSubject.next(load());
        actionsSubject.next(loadFailure('timeout'));
        actionsSubject.next(load());
        actionsSubject.next(loadSuccess([1, 2, 3]));
        const snapshot = snapshotService.getSnapshot();
        checkActions(snapshot,[
            {action: loadFailure('timeout'), store: {example: {loaded: true, data: [], error: 'timeout'}}},
            {action: loadSuccess([1, 2, 3]), store: {example: {loaded: true, data: [1, 2, 3], error: null}}},
        ])
    })

    it('should filter actions by pattern as blacklist', () => {
        const {snapshotService, actionsSubject} = setupTestModule(0,
            new RegExp("Example API", "g"), 'blacklist');
        actionsSubject.next(load());
        actionsSubject.next(loadFailure('timeout'));
        actionsSubject.next(load());
        actionsSubject.next(loadSuccess([1, 2, 3]));
        const snapshot = snapshotService.getSnapshot();
        checkActions(snapshot,[
            {action: {type: '@ngrx/effects/init'}, store: {example: initialState}},
            {action: load(), store: {example: initialState}},
            {action: load(), store: {example: {loaded: true, data: [], error: 'timeout'}}},
        ])
    })

    it('should filter actions by amount', () => {
        const {snapshotService, actionsSubject} = setupTestModule(2);
        actionsSubject.next(load());
        actionsSubject.next(loadFailure('timeout'));
        actionsSubject.next(load());
        actionsSubject.next(loadFailure('other error'));
        actionsSubject.next(load());
        actionsSubject.next(loadSuccess([1, 2, 3]));
        const snapshot = snapshotService.getSnapshot();
        checkActions(snapshot,[
            {action: load(), store: {example: {loaded: true, data: [], error: 'other error'}}},
            {action: loadSuccess([1, 2, 3]), store: {example: {loaded: true, data: [1, 2, 3], error: null}}}
        ])
    })

    it('should filter actions by amount and pattern', () => {
        const {snapshotService, actionsSubject} = setupTestModule(2, new RegExp("Example API", "g"));
        actionsSubject.next(load());
        actionsSubject.next(loadFailure('timeout'));
        actionsSubject.next(load());
        actionsSubject.next(loadFailure('other error'));
        actionsSubject.next(load());
        actionsSubject.next(loadSuccess([1, 2]));
        const snapshot = snapshotService.getSnapshot();
        checkActions(snapshot,[
            {action: loadFailure('other error'), store: {example: {loaded: true, data: [], error: 'other error'}}},
            {action: loadSuccess([1, 2]), store: {example: {loaded: true, data: [1, 2], error: null}}}
        ])
    })
})