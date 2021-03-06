import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {NavBar, WingBlank, WhiteSpace, InputItem, TextareaItem, List, Button} from 'antd-mobile';
import {update} from '../../redux/user.redux';
import WrapForm from '../../component/wrapForm/wrapForm';
import AvatarSelector from '../../component/avatarSelector/avatarSelector';
import './userInfo.css';
//合并 boss与genius的信息完成页面
@WrapForm
@connect( state => state, {update})
class UserInfo extends Component { 
    constructor(props) {
        super(props);
    }        
    handleUpdate = () => {
        const isBoss = this.props.user.type == 'boss' ;
        const {avatar, company, job, money, desc} = this.props.state;
        isBoss ? this.props.update({avatar, company, job, money, desc}) : this.props.update({avatar, job, desc});
    }
    componentWillMount() {
        //初始化state
        const {avatar, company, job, money, desc} = this.props.user;
        const info = {avatar, company, job, money, desc};
        Object.keys(info).forEach(key => { 
           key ? this.props.handleChange(key, info[key]) : null;
           });
    }
    render() {
        const user = this.props.user;
        const isBoss = user.type == 'boss' ;
        const redirectTo = user.redirectTo;
        const state = this.props.state;
        return (<div>
                <List>
            {redirectTo && redirectTo !== '/bossinfo' && redirectTo !== '/geniusinfo' ? <Redirect to={redirectTo}></Redirect> : null}
                    <NavBar
                        mode="dark"
                        >{isBoss ? 'BOSS信息完善页' : '牛人信息完善页'}
                    </NavBar>
                <AvatarSelector selectAvatar = { v => this.props.handleChange('avatar', v) } /> 
                {isBoss ?
                    <InputItem 
                        onChange={v => this.props.handleChange('company', v)}
                        value={state.company}>公司名称</InputItem> :
                    null}
                <InputItem 
                        onChange={v => this.props.handleChange('job', v)}
                        value={state.job}
                        >{isBoss ? '招聘职位' : '应聘职位'}</InputItem>
                {isBoss ?
                    <InputItem 
                        onChange={v => this.props.handleChange('money', v)}
                        value={state.money}
                        >职位薪资</InputItem> :
                    null}
                 <div className='UserIno-textarea'>
                <List>
                <TextareaItem
                    onChange={ v => this.props.handleChange('desc', v)}
                    title={isBoss ? "职位要求" : "个人简介"}
                    value={state.desc}
                    rows={6}
                    autoHeight
                />
                </List>
                </div>
                 <WhiteSpace/>
                 <WingBlank> 
                        <Button 
                                onClick={this.handleUpdate} 
                                type="primary">保存</Button>
                </WingBlank>
                
                </List>
            </div>)
    }
};
export default UserInfo;