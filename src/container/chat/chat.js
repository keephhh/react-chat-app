import React, {Component} from 'react';
import { NavBar, Icon, List, InputItem, Button, Toast} from 'antd-mobile';
import {connect} from 'react-redux';
import moment from 'moment';
//渐变效果动画
import QueueAnim from 'rc-queue-anim';
import {handleSubmit, updateReadMsg} from '../../redux/chat.redux';
import './chat.css';

@connect(state => state, {handleSubmit, updateReadMsg})
class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderChatContent = this.renderChatContent.bind(this);
        this.handleEnter  = this.handleEnter.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.chat.msgs.length !== this.props.chat.msgs.length) {
            console.log('更新已读消息')
            this.props.updateReadMsg(this.props.match.params.userid);
        }
    }
    handleInput(v) {
        this.setState({
            msg: v
        })
        console.log('this.state.msg', this.state.msg)
    }
    handleEnter(event) {
        event.preventDefault();
        this.handleSubmit();
    }
    handleSubmit() {
        console.log(' msgs', this.props.chat.msgs)
        const from = this.props.user._id;
        const to = this.props.match.params.userid;
        const msg = this.state.msg;
        const isNull = /\s+/gi;
        if(isNull.test(msg) || msg == '') {
            return Toast.info('请输入消息', 2);
        }
        this.props.handleSubmit({from, to, msg});
        this.setState({msg:''});
    }
    renderChatContent() {
        if(!this.props.chat.msgs.length) {return null};
        const userid = this.props.user._id;
        const to_id = this.props.match.params.userid;
        const usersBook = this.props.userList.usersBook;
        const chatid = [userid, to_id].sort().join('');
        const msgs = this.props.chat.msgs.filter(v => v.chatid == chatid);
        if(!msgs.length) {return null};
        msgs.forEach( v => {
            v.avatar = userid == v.from ? this.props.user.avatar : usersBook[to_id].avatar;
        }) ; 
        let time1 = null;
        let time2 = null;
       return  (<div>
           <QueueAnim duration={800} type='scale'>
              {msgs.map((item, index) => {
                    let showTime = false;
                    const isSelf =  item.from == userid;
                    const avatar = require(`../../component/avatarSelector/img/${item.avatar}.png`);
                    if(index == 0) {
                        showTime = true;
                    }
                    if(index > 0) {
                         time1 = item.date;
                         time2 = msgs[index - 1].date;
                         moment(time1).subtract(3, 'minutes').isBefore(time2) ? (showTime = false) : (showTime = true);
                    };
                    return (
                        <div
                            style={{
                                textAlign: isSelf ? 'right' : 'left',
                                marginBottom: 12,
                                position:'relative'
                            }}
                            key={index} 
                        >  
                        { showTime ? 
                            <div style={{textAlign:'center'}}>
                                <div className="Chat-time-remindner">
                                    {moment(item.date).calendar()}
                                </div>
                            </div> : null }
                            <div style= {{float:' right', width:'100%'}}>
                               <div className={`Chat-sender${isSelf ? ' self' : ''}`}>
                                    <img style={{width:'32px'}}alt='头像' src={avatar}></img>
                                </div>
                                <div className={`Chat-message${isSelf ? ' self' : ''}`}>
                                    {item.msg}
                                </div>
                            </div>
                        </div>
                    );
                })
            }
            <br />
           </QueueAnim>
        </div>)
    }
    render() {
        const to_id = this.props.match.params.userid;
        const users = this.props.userList.usersBook;
        const Item = List.Item;
        if(!users || Object.keys(users).length === 0) {
            return null;
        };
        return (<div>    
        <div className='chat-head'>
            <NavBar
            icon={<Icon type="left" />}   
            onLeftClick={() => {this.props.history.goBack()}}
            >{`正在与 ${users[to_id].user } 聊天`}
            </NavBar>
        </div>   
        <div className='chat-body'>
            {this.renderChatContent()}
        </div>
        <div className="chat-footer">
            <List>
                <Item 
                    extra={<Button type='primary' inline size='small' onClick={this.handleSubmit}>发送</Button>}
                >
                <form onSubmit={ event => this.handleEnter(event)}>
                    <InputItem
                        value={this.state.msg}
                        placeholder="请输入"
                        type='text'
                        onChange={v => this.handleInput(v)}
                    ></InputItem>
                </form>
                </Item>
            </List>
        </div>
    </div>)
    }
}
export default Chat;