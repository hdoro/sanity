import documentStore from 'part:@sanity/base/datastore/document'
import {toObservable, useObservable} from './utils/use-observable'
import {distinctUntilChanged, map, share, switchMap} from 'rxjs/operators'
import {Observable} from 'rxjs'

interface SyncState {
  isConnected: boolean
}

const DISCONNECTED = {isConnected: false}

export function useConnectionState(publishedId, typeName): SyncState {
  return useObservable<SyncState>(
    toObservable([publishedId, typeName], props$ =>
      props$.pipe(
        switchMap(
          ([publishedId, typeName]): Observable<SyncState> => {
            return documentStore.local.documentEventsFor(publishedId, typeName).pipe(
              map((ev: {type: string}) => ev.type),
              map(eventType => eventType !== 'reconnect'),
              distinctUntilChanged(),
              map(isConnected => ({isConnected})),
              share()
            )
          }
        ),
        distinctUntilChanged()
      )
    ),
    DISCONNECTED
  )
}
