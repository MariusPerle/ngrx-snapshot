import {ActionReducerMap, createAction, createReducer, on} from "@ngrx/store";

interface ExampleStore {
    loaded: boolean;
    data: number[]
    error: string | null
}

export const initialState: ExampleStore = {
    loaded: false,
    data: [],
    error: null
}

export const load = createAction('[Example] Load')

export const loadSuccess = createAction(
    '[Example API] Load Success',
    (data: number[]) => ({data})
)

export const loadFailure = createAction(
    '[Example API] Load Failure',
    (error: string) => ({error})
)

export const reducer = createReducer(
    initialState,
    on(loadSuccess, (state, {data}) =>
        ({...state, loaded: true, data, error: null})
    ),
    on(loadFailure, (state, {error}) => ({...state, loaded: true, error})),
)

export const reducers: ActionReducerMap<{ example: ExampleStore }> = {
    example: reducer,
};