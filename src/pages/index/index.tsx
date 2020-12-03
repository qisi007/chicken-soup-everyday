import React, { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import './index.scss';
import { AtButton, AtIcon, AtFloatLayout, AtAvatar, AtMessage  } from 'taro-ui';
import { contentList } from "./date";
import wechat from "../../assets/wechat.png";
import pengyouquan from "../../assets/pengyouquan.png";
import p2 from "../../assets/p2.png";
import p3 from "../../assets/p3.png";
import Taro from "@tarojs/taro";

const wx: any = Taro;

interface Props {

}

interface State {
  content: string,
  buttonLoading: boolean,
  pickerShow: boolean
}

export default class Index extends Component<Props, State> {
  constructor(props:Props) {
    super(props);
    this.state = {
      content: '',
      buttonLoading: false,
      pickerShow: false
    }
  }
  componentDidMount () { 
    let content = this.createContent();
    this.setState({ content });
  }

  // 获取今日时间
  getTodayInfo () {
    let date: Date = new Date();
    let years: string = date.getFullYear() + '年';
    let month: string = date.getMonth()+1 + '月';
    let day: string = date.getDate() + '日';
    let today: string =  years + month + day;
    let arr: string[] = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    let week = arr[date.getDay()];
    return { today, week };
  }

  // 创建问候语
  createFirstTimeTips () {
    let hours: number = new Date().getHours();
    let timeTips: string = '';
    if ( hours >= 0 && hours < 9 ) {
      timeTips = '早安';
    } else if ( hours >=9 && hours < 11 ) {
      timeTips = '上午好';
    } else if ( hours >=11 && hours < 13 ) {
      timeTips = '中午好';
    } else if ( hours >=13 && hours < 19 ) {
      timeTips = '下午好';
    } else {
      timeTips = '晚安';
    }
    return timeTips;
  }

  // 首次创建文案
  createContent () {
    let length: number = contentList.length;
    let randomNumber = (Math.random()*length).toFixed();
    return contentList[randomNumber];
  }

  // 创建更多文案
  createContentMore () {
    this.setState({
      buttonLoading: true
    })
    
    setTimeout(() => {
      this.setState({
        buttonLoading: false,
        content: this.createContent()
      })
    }, 1000)
  }

  // 打开分享
  handleOpen () {
    this.setState({
      pickerShow: true
    })

  }

  // 关闭分享
  handleClose () {
    this.setState({
      pickerShow: false
    })
  }

  // 绘制分享朋友圈图片
  drawImageForFriendCircle () {
    const ctx = wx.createCanvasContext("shareuser");
    let imgList = [p2,p3];
    let length: number = imgList.length;
    let randomNumber = (Math.random()*length).toFixed();
    let img = imgList[randomNumber];
    ctx.drawImage(img,0,0,'100%',300)
    ctx.draw();
    let that = this;

    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'shareuser',
        success: function ( result ) {
          wx.saveImageToPhotosAlbum({
            filePath: result.tempFilePath,
            success() {
              that.handleClose();
              wx.atMessage({
                  'message': "已保存到相册，快去分享朋友圈吧!",
                  'duration': 5000
              })
            }
        })

        }
      })
    }, 500)
  }

  onShareAppMessage ( ) {
    let arrList: string[] = [
      '我正在喝毒鸡汤呢,要不你也来一碗？',
      '一天一句毒鸡汤,我先干为敬了。',
      '老司机,快上车,我们一起去毒喝鸡汤了!',
      '工作不顺心？喝了这碗汤,你会更不顺心。',
      '还在等什么,赶紧喝了这碗汤,隔壁小孩都馋哭了。'
    ]
    let content = arrList[(Math.random()*arrList.length).toFixed()];
    this.handleClose();
    return {
      title: content,
      path: "/pages/index/index"
    }
      
  }



  render () {
    let {today, week } = this.getTodayInfo();
    let timeTips = this.createFirstTimeTips();
    let { content,buttonLoading,pickerShow } = this.state;
    return (
      <View className='index'>
        <AtMessage />
        <AtIcon value='share' 
                size='24' 
                className="icon-share"
                color='#5c5c5c'
                onClick={this.handleOpen.bind(this)}></AtIcon>
        <View className="title"><Text>{timeTips},</Text> 打工人!</View>
        <View className="date">今天是 <Text>{today},{week}</Text></View>
        <View className="words">{content}</View>

        <View className="edit-button">
          <AtButton loading={buttonLoading}
                    type="primary"
                    className="more"
                    onClick={this.createContentMore.bind(this)}>再来一句</AtButton>
        </View>


        <AtFloatLayout isOpened={pickerShow} 
                       title="分享到" 
                       onClose={this.handleClose.bind(this)}>
          <View className="bottom-share">
            <View>
              <Button className="bottom-share_item"
                    openType="share"
                    onClick={this.onShareAppMessage.bind(this)}>
                <AtAvatar circle 
                          className="icon-we"  
                          image={wechat}
                          ></AtAvatar>
              </Button>
              <View className="label">微信好友</View>
            </View>
            <View>
              <Button className="bottom-share_item"
                      onClick={this.drawImageForFriendCircle.bind(this)}>
                <AtAvatar circle 
                          image={pengyouquan}
                          className="icon-we" ></AtAvatar>
              </Button>
              <View className="label">朋友圈</View>
            </View>
          </View>
        </AtFloatLayout>
        <canvas style={{width: '100%', height: '350px'}}  id="shareuser" canvas-id="shareuser" className="canvas-wrapper"></canvas>

      </View>
    )
  }
}
