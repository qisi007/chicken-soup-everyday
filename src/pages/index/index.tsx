import React, { Component } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import './index.scss';
import { AtButton, AtIcon, AtFloatLayout, AtAvatar, AtMessage, AtModal, AtModalHeader, AtModalContent, AtModalAction  } from 'taro-ui';
import { contentList } from "./date";
import p2 from "../../assets/images/p2.png";
import p3 from "../../assets/images/p3.png";
import Taro from "@tarojs/taro";
import { getTodayInfo, getTodayTimeTip } from "../../utils/index";

const wx: any = Taro;

interface Props {

}

interface State {
  content: string,
  buttonLoading: boolean,
  pickerShow: boolean,
  isOpened: boolean,
  path: string
}

export default class Index extends Component<Props, State> {
  constructor(props:Props) {
    super(props);
    this.state = {
      content: '',
      buttonLoading: false,
      pickerShow: false,
      isOpened: false,
      path: ''
    }
  }
  componentDidMount () { 
    let content = this.createContent();
    this.setState({ content });
  }

  // 获取今日时间
  getTodayInfo () {
    return getTodayInfo();
  }

  // 创建问候语
  createFirstTimeTips () {
    return getTodayTimeTip();
  }

  // 首次创建文案
  createContent () {
    let length: number = contentList.length;
    let randomNumber = (Math.random()*length).toFixed();
    return contentList[randomNumber];
  }

  // 创建更多文案
  createContentMore () {
    let reset = document.getElementById('reset-btn')
    let button = document.getElementById('edit-button')
    reset?.classList.add('reset_active');
    button?.classList.add('edit-button_active');
    setTimeout(() => {
      this.setState({ content: this.createContent() })
      reset?.classList.remove('reset_active');
      button?.classList.remove('edit-button_active');

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

   // 分享给好友
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

  // 绘制分享朋友圈图片
  drawImageForFriendCircle () {
    const ctx = wx.createCanvasContext("shareuser");
    let imgList = [p2,p3];
    let img = imgList[1];
    console.log(img)
    ctx.drawImage(img,0,0,'100%',300);
    ctx.draw();
    let that = this;
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'shareuser',
        success: function ( result ) {
          console.log(result.tempFilePath)
          that.setState({
            isOpened: true,
            path: result.tempFilePath,
            pickerShow: false
          })
        }
      })
    }, 500)
  }

  // 关闭弹窗
  closeDialog () {
    this.setState({
      isOpened: false
    })
    
  }

  // 保存到本地
  saveToAblum () {
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: this.state.path,
      success() {
        that.closeDialog();
        wx.atMessage({
            'message': "已保存到相册，快去分享朋友圈吧!",
            'duration': 5000,
            'type': 'success'
        })
      }
  })
  }

 



  render () {
    let {today, week } = this.getTodayInfo();
    let timeTips = this.createFirstTimeTips();
    let { content,buttonLoading,pickerShow,isOpened, path } = this.state;
    return (
      <View className='index'>
        <View className="index-main">
          <AtMessage />
          <AtIcon value='share' 
                  size='30' 
                  className="iconfont icon-fenxiang1 fenxiang"
                  color='#5c5c5c'
                  onClick={this.handleOpen.bind(this)}></AtIcon>
          <View className="title"><Text>{timeTips},</Text> 打工人!</View>
          <View className="date">今天是 <Text>{today},{week}</Text></View>
          <View className="words">{content}</View>

          <View className="edit-button" id="edit-button" onClick={this.createContentMore.bind(this)}>
            <View className="iconfont icon-shuaxin reset-btn" id="reset-btn"></View>
            <View className="more-words">再来一句</View>
          </View>
          <canvas style={{width: '100%', height: '350px'}}  id="shareuser" canvas-id="shareuser" className="canvas-wrapper"></canvas>

        </View>


        <AtFloatLayout isOpened={pickerShow} 
                       title="分享到" 
                       onClose={this.handleClose.bind(this)}>
          <View className="bottom-share">
              <Button className="bottom-share_item"
                    openType="share"
                    onClick={this.onShareAppMessage.bind(this)}>
                <Text className="iconfont icon-iconfontzhizuobiaozhunbduan32 weixin-share-1"></Text>
              </Button>
              <Button className="bottom-share_item"
                      onClick={this.drawImageForFriendCircle.bind(this)}>
                <Text className="iconfont icon-pengyouquan weixin-share-2"></Text>
              </Button>
          </View>
        </AtFloatLayout>
        

        <AtModal isOpened={isOpened}>
          <AtModalHeader>保存图片</AtModalHeader>
          <AtModalContent>

            <Image src={path} style={{width: "100%"}}/>
          </AtModalContent>
          <AtModalAction><Button onClick={this.saveToAblum.bind(this)}>保存到相册</Button> </AtModalAction>
        </AtModal>

      </View>
    )
  }
}
