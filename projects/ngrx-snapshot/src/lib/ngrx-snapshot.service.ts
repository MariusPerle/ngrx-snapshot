import {Inject, Injectable} from '@angular/core';
import {combineLatestWith, filter} from "rxjs";
import {ActionsSubject, Store} from "@ngrx/store";
import {Action} from "@ngrx/store/src/models";


export type OrderedActions = {
    [key: number]: {
        action: Action;
        timestamp: number;
        type: string;
    }
}

export type SnapShot = {
    monitorState: any;
    nextActionId: number;
    stagedActionIds: number[];
    skippedActionIds: number[];
    currentStateIndex: number;
    isLocked: boolean;
    isPaused: boolean;
    actionsById: OrderedActions;
    computedStates: object[];
}

@Injectable()
export class NgrxSnapshotService {
    log: SnapShot = {
        monitorState: null,
        nextActionId: 0,
        stagedActionIds: [],
        skippedActionIds: [],
        currentStateIndex: -1,
        isLocked: false,
        isPaused: false,
        actionsById: {},
        computedStates: [],
    };

    constructor(
        private readonly actions$: ActionsSubject,
        private readonly store: Store,
        @Inject('action_pattern') private actionPattern: string,
        @Inject('action_amount') private actionAmount: number
    ) {
        this.actions$
            .pipe(
                filter((action) => this.pattern.test(action.type)),
                combineLatestWith(this.store.select((state) => state))
            )
            .subscribe(([action, state]) => {
                const currentId = this.log.nextActionId;
                this.log = {
                    ...this.log,
                    nextActionId: currentId + 1,
                    currentStateIndex: currentId,
                    stagedActionIds: [...this.log.stagedActionIds, currentId],
                    actionsById: {
                        ...this.log.actionsById,
                        [currentId]: {
                            action,
                            timestamp: new Date().valueOf(),
                            type: 'PERFORM_ACTION',
                        },
                    },
                    computedStates: [...this.log.computedStates, {state}],
                };
            });
    }

    private get pattern(): RegExp {
        return RegExp(this.actionPattern, 'g');
    }

    /*
     * Get a snapshot of current state. Best used with https://github.com/reduxjs/redux-devtools     *
     *
     */
    currentSnapshot() {
        if (this.actionAmount === 0) {
            return this.log;
        }

        const actionAmount = Math.min(this.actionAmount, this.log.nextActionId);
        const postOfFirstRelevantActionInLog = this.log.nextActionId - actionAmount;
        const computedStates = [];

        const actionsById: OrderedActions = {};
        const stagedActionIds: number[] = [];

        for (let i = 0; i < actionAmount; i++) {
            const totalIndexInLog = postOfFirstRelevantActionInLog + i;
            actionsById[i] = this.log.actionsById[totalIndexInLog];
            computedStates.push(this.log.computedStates[totalIndexInLog]);
            stagedActionIds.push(i);
        }

        return {
            ...this.log,
            stagedActionIds,
            actionsById,
            computedStates,
            currentStateIndex: actionAmount - 1,
            nextActionId: actionAmount
        } as SnapShot;
    }
}
