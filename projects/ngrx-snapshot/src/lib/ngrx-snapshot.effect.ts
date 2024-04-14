import {Inject, Injectable} from '@angular/core';
import {filter, tap, withLatestFrom} from "rxjs";
import {ActionsSubject, Store} from "@ngrx/store";
import {createEffect} from "@ngrx/effects";
import {NgrxSnapshotService} from "./ngrx-snapshot.service";

@Injectable()
export class NgrxSnapshotEffect {
    loggingEffect = createEffect(() =>
        this.actions$.pipe(
            filter((action) => {
                const inPattern = this.pattern.test(action.type)
                if (this.usePattersAs === 'whitelist') {
                    return inPattern
                } else {
                    return !inPattern
                }
            }),
            withLatestFrom(this.store),
            tap((args) =>
                this.ngrxSnapshotService.updateLog(args)
            )
        ), {dispatch: false}
    );

    constructor(
        private readonly actions$: ActionsSubject,
        private readonly store: Store,
        private readonly ngrxSnapshotService: NgrxSnapshotService,
        @Inject('action_pattern') private pattern: RegExp,
        @Inject('use_patters_as') private usePattersAs: 'whitelist' | 'blacklist',
    ) {
    }
}
