import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import * as myActions from '../actions/my'
import Profile from './profile'
import { Skeleton, List, Icon, Button } from 'antd'
import { entryListSelector, fetchedEntrySelector } from '../reducers/me'
import ShowMore from '../components/show_more'

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text > 0 ? text : null}
  </span>
)

const LoadMore = (props) =>
  !props.hide ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px'
      }}
    >
      <Button onClick={() => props.onLoadMore()}>Daha Fazla Göster</Button>
    </div>
  ) : null

class MyEntrys extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadmore: false,
      page: 1
    }
  }

  componentWillMount() {
    const { getEntrys } = this.props.myActions

    getEntrys().then(() => {})
  }

  loadmore = () => {
    const { getEntrys } = this.props.myActions
    const { pageSize } = this.props.entrys

    if (this.state.page != pageSize) {
      let page = this.state.page + 1
      getEntrys({ p: page }).then(() => {
        this.setState({
          page: page,
          loadmore: (this.props.entrys.pageSize = page ? true : false)
        })
      })
    }
  }

  render() {
    return (
      <Profile>
        <div className="entry-normal">
          {!this.props.isFetched && <Skeleton loading={true} active avatar />}

          {this.props.isFetched && (
            <List
              dataSource={this.props.list}
              itemLayout="vertical"
              loadMore={
                <LoadMore
                  onLoadMore={this.loadmore}
                  hide={this.state.loadmore}
                />
              }
              renderItem={(item) => (
                <List.Item
                  key={item.Entry.Id}
                  actions={[
                    <IconText type="star-o" text={item.Entry.FavoriteCount} />
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Link to={`/topic/${item.TopicId.Id}`}>
                        {item.TopicId.Title}
                      </Link>
                    }
                    description={<ShowMore text={item.Entry.Content} />}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Profile>
    )
  }
}

const mapStateToProps = (state) => ({
  entrys: state.me.entrys,
  list: entryListSelector(state),
  isFetched: fetchedEntrySelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  myActions: bindActionCreators(myActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyEntrys)
