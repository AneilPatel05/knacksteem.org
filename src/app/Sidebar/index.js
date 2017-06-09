import _ from 'lodash';
import React from 'react';
import { FormattedDate } from 'react-intl';
// import { Route } from 'react-router-dom';
// import User from '../../components/Sidebar/User';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import api from '../../steemAPI';
import Topics from '../../components/Sidebar/Topics';
import Sidenav from '../../components/Navigation/Sidenav';
import Action from '../../components/Button/Action';
import { jsonParse } from '../../helpers/formatter';

class SidebarWithTopics extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      isLoaded: false,
      categories: [],
      props: {},
      menu: 'categories'
    };
  }

  componentWillMount() {
    api.getState('trending/busy', (err, result) => {
      let categories =
        (result.category_idx && result.category_idx.trending) ||
        (result.tag_idx && result.tag_idx.trending);
      categories = categories.filter(Boolean);
      this.setState({
        isFetching: false,
        isLoaded: true,
        categories,
        props: result.props
      });
    });
  }

  render() {
    return <Topics title="Trending topics" topics={this.state.categories} />;
  }
}
const SidebarWrapper = ({ children }) =>
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    }}
  >
    {children}
  </div>;

export const LeftSidebar = connect(({ auth }) => ({ auth }))(({ auth }) =>
  <Switch>
    <Route
      path="/@:name"
      render={() =>
        <SidebarWrapper>
          {auth.user.name &&
            <div>
              {_.get(jsonParse(auth.user.json_metadata), 'profile.about')}<br />
              Joined
              {' '}
              <FormattedDate value={auth.user.created} year="numeric" month="long" day="numeric" />
            </div>}
          <Action text="Transfer" />
          <Action text="Message" />
        </SidebarWrapper>}
    />
    <Route
      path="/"
      render={() =>
        <SidebarWrapper>
          <Sidenav username={auth.user.name} />
          <SidebarWithTopics />
        </SidebarWrapper>}
    />
  </Switch>
);

export const RightSidebar = props =>
  <Switch>
    <Route exact path="/" render={() => <div>RightPage</div>} />
    <Route path="/trending/:category?" render={() => <div>RightTrending</div>} />
    <Route path="/hot/:category?" render={() => <div>RightHot</div>} />
    <Route path="/cashout/:category?" render={() => <div>RightCashout</div>} />
    <Route path="/created/:category?" render={() => <div>RightCreated</div>} />
    <Route path="/active/:category?" render={() => <div>RightActive</div>} />
    <Route path="/responses/:category?" render={() => <div>RightResponses</div>} />
    <Route path="/votes/:category?" render={() => <div>RightVotes</div>} />
  </Switch>;
