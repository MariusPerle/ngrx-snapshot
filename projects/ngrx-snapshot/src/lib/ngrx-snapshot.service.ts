import {Inject, Injectable} from '@angular/core';
import {OrderedActions, SnapShot} from "./types";
import {Action} from "@ngrx/store/src/models";

@Injectable({providedIn: 'root'})
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
        @Inject('action_amount') private actionAmount: number
    ) {
    }

    updateLog([action, state]: [Action, Object]) {
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
    }

    /*
     * Get a snapshot of current state. Best used with https://github.com/reduxjs/redux-devtools     *
     *
     */
    getSnapshot() {
        if (this.actionAmount === 0) {
            return this.log;
        }

        const numActions = Math.min(this.actionAmount, this.log.nextActionId);
        const startActionIndex = this.log.nextActionId - numActions;
        const computedStates = [];

        const actionsById: OrderedActions = {};
        const stagedActionIds: number[] = [];

        for (let i = 0; i < numActions; i++) {
            const totalIndex = startActionIndex + i;
            actionsById[i] = this.log.actionsById[totalIndex];
            computedStates.push(this.log.computedStates[totalIndex]);
            stagedActionIds.push(i);
        }

        return {
            ...this.log,
            stagedActionIds,
            actionsById,
            computedStates,
            currentStateIndex: numActions - 1,
            nextActionId: numActions
        } as SnapShot;
    }
}
