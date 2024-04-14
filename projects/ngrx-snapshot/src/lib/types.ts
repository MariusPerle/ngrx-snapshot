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
    computedStates: { state:object }[];
}