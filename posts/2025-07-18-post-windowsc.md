---
title: "电脑 C 盘用户名频繁报错？从中文改成英文的保守教程"
categories:
  - Blog
tags:
  - windows
  - 电脑
---

本文转自我的小红书。

有些软件在安装或运行时会频繁报错，原因可能是 Windows 用户文件夹使用了中文路径。部分国外软件无法正确识别中文目录，导致找不到路径。下面介绍一种相对保守的改名方法，步骤会比网上一些教程复杂，但更重视数据安全。



1️⃣ 创建一个新的管理员账户。按 `Win + X`，打开 Windows PowerShell，输入 `netplwiz`。在弹出的窗口中选择“添加”，点击“不使用 Microsoft 账户登录”，再选择“本地账户”，输入你想创建的账户名。创建完成后，选中新账户，进入“属性”，把它设置为管理员账户。  
![IMG_6147.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788411789_IMG_6147.jpeg)

![IMG_6148.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788406896_IMG_6148.jpeg)

![IMG_6149.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788410271_IMG_6149.jpeg)

![IMG_6150.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788410629_IMG_6150.jpeg)

![IMG_6151.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788412970_IMG_6151.jpeg)

![IMG_6152.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788414018_IMG_6152.jpeg)

![IMG_6153.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788411266_IMG_6153.jpeg)

![IMG_6154.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788416445_IMG_6154.jpeg)


2️⃣ 修改用户文件夹名称。先切换到刚刚创建的新账户。进入系统后，不要立刻改名，先按 `Win + X` 打开任务管理器，在“用户”中结束原账户的相关进程，否则文件夹可能无法重命名。随后打开 C 盘的“用户”目录，把需要修改的用户文件夹改成英文名称。  

![IMG_6155.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788418065_IMG_6155.jpeg)

![IMG_6158.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788415438_IMG_6158.jpeg)

![IMG_6159.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788416141_IMG_6159.jpeg)


3️⃣ 修改注册表。按 `Win + R`，输入 `regedit` 打开注册表。请务必谨慎操作，改错可能导致系统异常。依次进入：

```text
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList
```
  
在 `ProfileList` 中找到对应原账户的项，打开 `ProfileImagePath`，把里面的路径从 `C:\Users\旧用户名` 改为 `C:\Users\新用户名`。这里的新用户名必须和第二步中改好的文件夹名称一致。  
![IMG_6160.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788411215_IMG_6160.jpeg)

![IMG_6161.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788416573_IMG_6161.jpeg)

![IMG_6162.jpeg](https://drive.panghu.bond/file/public/小红书/windowsc/1786788415033_IMG_6162.jpeg)


4️⃣ 切回原账户。完成后切回原账户，正常情况下不会再出现路径相关弹窗。如果不需要临时创建的小号，可以再次打开 `netplwiz` 删除；如果想保留，也可以继续放着。

补充：最后修改注册表时填写的名称，就是第二步最后改好的文件夹名。

原文链接：http://xhslink.com/o/2Nev9jtLuA7
