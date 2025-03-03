# KG-teacher-front

该项目使用[Ant Design Pro](https://pro.ant.design)初始化

## 环境准备
安装 Node.js

```bash
npm install
```

## 启动项目

```bash
npm run start
# 或者
npm run dev
```

## 项目部署
### 项目打包
```bash
npm run build
```
可以在根目录得到`dist`文件夹

### nginx准备
```bash
docker pull nginx
```

### docker准备
项目使用`docker + nginx`部署

将项目根目录的`Dockerfile`、`default.conf`和`dist`文件夹放置在服务器的同一文件夹下，在该文件夹运行：
```bash
docker build -t xxxx .
```
即使用本文件夹下文件构建docker镜像，使用下述命令启动docker服务：
```bash
docker run -d -p 80:80 --name nginx xxxx
```

- 第一个`80`端口表示使用服务器的端口，这里采用`http`服务默认端口，更改其它端口需要自行配置`nginx.conf`（保证任意路由都可正常访问）
- `xxxx`是镜像名称，上下需保证一致

### Dockerfile
```dockerfile
#使用nginx镜像
FROM nginx

#类似注释 
MAINTAINER test
 
# 删除原有的defualt.conf，使用自己的defualt.conf
RUN rm /etc/nginx/conf.d/default.conf
 
ADD default.conf /etc/nginx/conf.d/

#上传dist文件夹
COPY dist/ /usr/share/nginx/html/
```

### defualt.conf
```javascript
server {
    listen       80;
    server_name  10.70.250.249; # 修改为docker服务宿主机的ip
    proxy_set_header Host $host:$server_port;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html =404;
    }
 
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```