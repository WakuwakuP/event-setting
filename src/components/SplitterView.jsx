import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import { Page, List, ListItem } from 'react-onsenui';

import UserUpdate from './Pages/UserUpdate';
import EventCreate from './Pages/EventCreate';

class SplitterView extends React.Component {
  pushPageUserUpdate() {
    this.props.actions.closeSplitter();
    const pages = this.props.navigator.pages;
    if (pages[pages.length - 1].key !== 'userUpdate') {
      this.props.navigator.pushPage({
        component: UserUpdate,
        props: {
          key: 'userUpdate',
          title: 'User',
          navigator: this.props.navigator,
        },
      });
    }
  }

  pushPageEventCreate() {
    this.props.actions.closeSplitter();
    const pages = this.props.navigator.pages;
    if (pages[pages.length - 1].key !== 'eventCreate') {
      this.props.navigator.pushPage({
        component: EventCreate,
        props: {
          key: 'eventCreate',
          title: 'イベント作成',
          navigator: this.props.navigator,
        },
      });
    }
  }

  render() {
    const { displayName, photoUrl, actions } = this.props;
    return (
      <Page>
        <div style={{ height: '220px' }}>
          <img src={photoUrl} alt="UserProfileImg" height="220px" />
        </div>
        <h4>{displayName}</h4>
        <List>
          <ListItem key={UserUpdate.name} onClick={this.pushPageUserUpdate.bind(this)}>ユーザー情報更新</ListItem>
        </List>
        <h3>Event</h3>
        <List>
          <ListItem key={EventCreate.name} onClick={this.pushPageEventCreate.bind(this)}>イベント作成</ListItem>
        </List>
        <List style={{ marginTop: '20px' }}>
          <ListItem onClick={() => actions.logout()}>ログアウト</ListItem>
        </List>
      </Page >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    displayName: state.auth.displayName,
    photoUrl: state.auth.photoUrl
  };
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplitterView);