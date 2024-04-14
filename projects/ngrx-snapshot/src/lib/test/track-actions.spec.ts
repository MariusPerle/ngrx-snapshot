import {fakeAsync, flush} from '@angular/core/testing';
import {initialState, load, loadSuccess} from "./mock.store";
import {setupTestModule, TestData} from "./setup-test-module";

describe('tracking actions', () => {
    let testData: TestData;
    beforeEach(() => {
        testData = setupTestModule();
    })

    it('should get init action', fakeAsync(() => {
        const snapshot = testData.snapshotService.getSnapshot();
        expect(snapshot.nextActionId).toEqual(1)
        expect(snapshot.actionsById[0].action.type).toEqual('@ngrx/effects/init')
        expect(snapshot.computedStates[0].state).toEqual({example: initialState});
        expect(snapshot.computedStates.length).toEqual(1);
    }));

    it('should track action', fakeAsync(() => {
        testData.actionsSubject.next(load());
        flush();
        const snapshot = testData.snapshotService.getSnapshot();
        expect(snapshot.computedStates.length).toEqual(2);
        expect(snapshot.actionsById[1].action.type).toEqual(load().type)
        expect(snapshot.computedStates[1].state).toEqual({example: initialState});
    }));

    it('should track action with state changes', fakeAsync(() => {
        testData.actionsSubject.next(loadSuccess([1]));
        flush();
        const snapshot = testData.snapshotService.getSnapshot();
        expect(snapshot.actionsById[1].action.type).toEqual(loadSuccess([1]).type)
        expect(snapshot.computedStates[1].state).toEqual({example: {loaded: true, data: [1], error: null}});
    }))

    it('should track multiple actions', fakeAsync(() => {
        for (let i = 1; i < 5; i++) {
            testData.actionsSubject.next(loadSuccess([i]));
            flush();
        }
        const snapshot = testData.snapshotService.getSnapshot();
        for (let i = 1; i < 5; i++) {
            expect(snapshot.actionsById[i].action.type).toEqual(loadSuccess([i]).type)
            expect(snapshot.computedStates[i].state).toEqual({example: {loaded: true, data: [i], error: null}});
        }
    }))

    it('should track mixed actions', fakeAsync(() => {
        testData.actionsSubject.next(load());
        testData.actionsSubject.next(loadSuccess([1]));
        const snapshot = testData.snapshotService.getSnapshot();
        expect(snapshot.actionsById[1].action.type).toEqual(load().type)
        expect(snapshot.computedStates[1].state).toEqual({example: initialState});
        expect(snapshot.actionsById[2].action.type).toEqual(loadSuccess([1]).type)
        expect(snapshot.computedStates[2].state).toEqual({example: {loaded: true, data: [1], error: null}});
    }))
});
