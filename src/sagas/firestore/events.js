import firebase from 'firebase/app';
import '@firebase/firestore';
import { reduxSagaFirebase, db } from "../../firebase";
import { call, put, take, takeEvery, select } from "@redux-saga/core/effects";

import { getUserId } from '../selecter';
import * as Actions from '../../actions';
import * as types from '../../constants/ActionTypes';

// イベントコレクションが更新されたら取得
export function* syncEventsSaga() {
  const channel = reduxSagaFirebase.firestore.channel(db.collection("events").orderBy('created_at', 'desc'));
  while (true) {
    try {
      const snapshot = yield take(channel);
      const events = [];
      snapshot.forEach(doc => {
        events.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      yield put(Actions.syncEvents(events));
    } catch (error) {

    }
  }
}

// イベント情報を作成する
function* createEventSaga(action) {
  const { event } = action.payload;
  event.created_by = yield select(getUserId);
  event.created_at = firebase.firestore.FieldValue.serverTimestamp();
  try {
    yield call(reduxSagaFirebase.firestore.addDocument, 'events', event);
  } catch (error) {
    console.error(error);
  }
}

// イベント情報を更新する
function* updateEventSaga(action) {
  const { id, event } = action.payload;
  const uid = yield select(getUserId);
  if (event.created_by === uid && id === event.id) {
    delete event.id;
    try {
      yield call(reduxSagaFirebase.firestore.updateDocument, `events/${id}`, event);
    } catch (error) {
      console.error(error);
    }
  }
}

// イベント情報を削除する
function* deleteEventSaga(action) {
  const { id, event } = action.payload;
  const uid = yield select(getUserId);
  if (event.created_by === uid) {
    try {
      yield call(reduxSagaFirebase.firestore.deleteDocument, `events/${id}`);
    } catch (error) {
      console.error(error);
    }
  }
}

export default [
  takeEvery(types.FIRESTORE.CREATE_EVENT, createEventSaga),
  takeEvery(types.FIRESTORE.UPDATE_EVENT, updateEventSaga),
  takeEvery(types.FIRESTORE.DELETE_EVENT, deleteEventSaga),
];