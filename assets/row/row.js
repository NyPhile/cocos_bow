// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    lineWidth: 120,
    rowLeftWidth: 200,
    ballWrapPositionY: 520,
    ballWrapPositionX: -20,
  },

  onLoad () {
    let touchPoint;
    let rowLeft = this.rowLeft = this.node.getChildByName("rowLeft")
    let rowRight = this.rowRight = this.node.getChildByName("rowRight")
    let lineLeft = this.lineLeft = cc.find("rowLeft/lineLeft", this.node)
    let lineRight = this.lineRight = cc.find("rowRight/lineRight", this.node)
    let ballWrap = this.ballWrap = cc.find("ballWrap", this.node)

    this.node.on('touchstart', e => {
      touchPoint = e.getLocation()
      this.ballWrapPositionY = 520
    })

    this.node.on('touchmove', e => {
      let deltaX = e.getLocation().x - touchPoint.x
      let deltaY = e.getLocation().y - touchPoint.y

      deltaX = deltaX > 300 ? 300 : (deltaX < -300 ? -300 : deltaX)
      deltaY = deltaY < -400 ? -400 : (deltaY > 200 ? 200 : deltaY)
      let moveX = this.ballWrapPositionX + deltaX / 4
      let rowRotation = - deltaY / 80
      let lineRotation = rowRotation * 8

      rowRight.rotation = rowRotation
      rowLeft.rotation = -rowRotation

      lineRight.rotation = -lineRotation

      let lineRightWidth = this.lineWidth / Math.cos(lineRotation / 180 * Math.PI) + this.rowLeftWidth * Math.cos((53 - rowRotation) / 180 * Math.PI) - this.lineWidth
      let lineLeftWidth = this.lineWidth / Math.cos(lineRotation / 180 * Math.PI) + this.rowLeftWidth * Math.cos((53 - rowRotation) / 180 * Math.PI) - this.lineWidth
      let ballDeltaY = lineLeftWidth * Math.sin(lineRotation / 180 * Math.PI)
      let ballWrapY = this.ballWrapPositionY - ballDeltaY
      let lineLeftHorizon = Math.cos(lineRotation / 180 * Math.PI) * lineLeftWidth + moveX
      let lineRightHorizon = Math.cos(-lineRotation / 180 * Math.PI) * lineRightWidth - moveX

      lineLeft.width = Math.sqrt(lineLeftHorizon * lineLeftHorizon + ballDeltaY * ballDeltaY * .9)
      lineRight.width = Math.sqrt(lineRightHorizon * lineRightHorizon + ballDeltaY * ballDeltaY * .86)
      let sign = rowRotation > 0 ? 1 : -1
      lineLeft.rotation = sign * (Math.acos(lineLeftHorizon / lineLeft.width)) / Math.PI * 180
      lineRight.rotation = -sign * (Math.acos(lineRightHorizon / lineRight.width)) / Math.PI * 180 * 1.25

      ballWrap.y = ballWrapY
      ballWrap.x = moveX

      // 球的角度
      let ballRotation = -Math.atan(moveX / ballWrapY) / Math.PI * 180 * 1.5
      ballWrap.rotation = ballRotation
    })
    this.node.on('touchend', e => {
      this.resetRow(e)
    })
    this.node.on('touchcancel', e => {
      this.resetRow(e)
    }, this)
  },

  resetRow (e) {
    this.rowRight.rotation = 0
    this.rowLeft.rotation = 0
    this.lineLeft.width = this.lineWidth - 20
    this.lineLeft.rotation = 0
    this.lineRight.width = this.lineWidth - 20
    this.lineRight.rotation = 0

    this.ballWrap.y = this.ballWrapPositionY
    this.ballWrap.x = this.ballWrapPositionX
    this.ballWrap.rotation = 0
  },

  start () {

  },

  // update (dt) {},
});
