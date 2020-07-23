const  canvas=wx.createCanvas();
const ctx=canvas.getContext("2d");

const{windowWidth,windowHeight}=wx.getSystemInfoSync()//获取系统信息

// 全局变量
var heroImg=newImage("./images/hero.png")//我方飞机
var bgImg=newImage("./images/bg.jpg")//背景图片
var enemyImg=newImage("./images/enemy.png")//敌机
var bulletImg=newImage("./images/bullet.png")//子弹
var clearGame;//定时器
var hero={x:windowWidth/2-60,y:windowHeight-80,w:120,h:80}//我方飞机参数
var bulletArr=new Array()//用于存放子弹数据
var enemyArr=new Array()//用于存放敌机数组
let flivverlog=0;//敌机计算
let bynums=0;//背景计算值

// 敌机爆炸
let boo=newImage("./images/explosion13.png") 
let boo2=newImage("./images/explosion19.png") 



function Update(){
    setBg()

    setHero()
    setbullet()
    setEnemy()
}
// 子弹对象
function BulletObj(x,y){
    this.x=x;
    this.y=y;
    

}

// 子弹
function setbullet(){
      
    if(bynums%5==0){
        bulletArr.push(new BulletObj((hero.x+hero.w/2)-5,hero.y))
        
    }
    for(let b in bulletArr){
        ctx.drawImage(bulletImg,bulletArr[b].x,bulletArr[b].y,10,20)
        // ctx.drawImage(bulletImg,bulletArr[b].x+10,bulletArr[b].y,10,20)
        // ctx.drawImage(bulletImg,bulletArr[b].x-10,bulletArr[b].y,10,20)
        if(bulletArr[b].y<0){
            bulletArr.splice(b,1)
            continue//结束循环
        }
        // 子弹移动
        bulletArr[b].y-=30;

        // 1循环敌机数据
        for(let j in enemyArr){
            // 1敌机血量负值飞机消失
            if(enemyArr[j].over>0){
                // enemyArr.splice(j,1)
                continue;
            }
            // 2.判断敌机是否碰撞
            if(
                bulletArr[b].x>enemyArr[j].x&&
                bulletArr[b].x<enemyArr[j].x+enemyArr[j].width&&
                bulletArr[b].y>enemyArr[j].y&&
                bulletArr[b].y<enemyArr[j].y+enemyArr[j].height
            ){
                // 3计算敌机血量
                if(enemyArr[j].hp>1){
                    enemyArr[j].hp-=80;
                }else{
                    enemyArr[j].over=40;
                }
                //4如果子弹碰撞敌机消失
                bulletArr.splice(b,1)
            }
        }
    }
}

// 敌机对象
function flivverObj(hp,width,height,img,sudu){
    this.x=parseInt(Math.random()*windowWidth+10)
    this.y=0;
    // 血量
    this.hp=hp;
    // 死亡
    this.over=0;
    this.width=width;
    this.height=height;
    this.img=img;

    // 速度
    this.sudu=sudu
}

// 设置飞机速度
function getsudu(){
    var number=parseInt(Math.random()*10);
    if(number<5&&number>0){
        return number;
    }
    return 2
}

function newImage(src){
    var image=wx.createImage()//图片对象
    image.src=src;
    return image
}

//我方飞机
function setHero(){
   ctx.drawImage(heroImg,hero.x,hero.y,hero.w,hero.h) 
}

//绘制背景图片
function setBg(){
    bynums++;
    if(bynums==windowHeight){
        bynums=0
    } 
    ctx.drawImage(bgImg, 0 ,bynums,windowWidth,windowHeight);
    ctx.drawImage(bgImg, 0 ,bynums-windowHeight,windowWidth,windowHeight);
}
function getfivver(type){
    switch(type){
        case 1:
            return new flivverObj(100,60,40,enemyImg,getsudu());
            break;
        case 2:
            return  new flivverObj(500,90,60,enemyImg,getsudu())
            break;
         case 3:
            return  new flivverObj(1000,120,80,enemyImg,getsudu())
            break;
    }
}
// 敌机
function setEnemy(){
   flivverlog++;
   if(bynums%33==0){
       if(flivverlog%6==0){
           enemyArr.push(getfivver(2));
       }else if(flivverlog%13==0){
            enemyArr.push(getfivver(3))
       }else{
           enemyArr.push(getfivver(1))
       }
   }

//    绘制所有飞机
   for(let a in  enemyArr){
        if(enemyArr[a].y>windowHeight){
            enemyArr.splice(a,1)
            continue//结束循环
        }
        enemyArr[a].y+=enemyArr[a].sudu;
        ctx.drawImage(enemyArr[a].img,enemyArr[a].x,enemyArr[a].y,enemyArr[a].width,enemyArr[a].height)
        if(enemyArr[a].over>0){
            enemyArr[a].over--
            if(enemyArr[0].over>20){
                ctx.drawImage(
                    boo,
                    enemyArr[a].x+enemyArr[a].width/2-30,
                    enemyArr[a].y+enemyArr[a].height/2-30,
                    60,
                    60
                )
                // 第二个阶段爆炸效果
            }else if(enemyArr[0].over>2){
                ctx.drawImage(
                    boo,
                    enemyArr[a].x+enemyArr[a].width/2-30,
                    enemyArr[a].y+enemyArr[a].height/2-30,
                    60,
                    60
                )
                // 结束效果
            }else{
                enemyArr.splice(a,1)
            }
        }else{
            if(rectangleCol(hero.x,hero.y,hero.w,hero.h, enemyArr[a].x, enemyArr[a].y, enemyArr[a].width, enemyArr[a].height)){
                gameover();
            }
        }
    }
}
// 矩形碰撞公式
function rectangleCol(x1,y1,w1,h1,x2,y2,w2,h2){
    maxX=x1+w1>=x2+w2?x1+w1:x2+w2;
    minX=x1<=x2?x1:x2;
    maxY=y1+h1>=y2+h2?y1+h1:y2+h2;
    minxY=y1<=y2?y1:y2;

    if(maxX-minX<=w1+w2&&maxY-minY<h1+h2){
        return true
    }else{
        return false;
    }
}

// 定时器
clearGame=setInterval(Update,30)

wx.onTouchMove((e) => {
    var {clientX,clientY}=e.changedTouches[0];


    hero.x=clientX-hero.w/2;
    hero.y=clientY-hero.h/2;
})