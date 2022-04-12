### Quick start

1. Compile installation
```
git clone https://github.com/wl4g/xcloud-dopaas-view.git # 上游最新(推荐)
# or: git clone https://gitee.com/wl4g/xcloud-dopaas-view.git # CN大陆最快(可能延迟)
npm install
# Development environment startup
npm run dev
# Production environment packaging
npm run build
```

2. Hosts configuration
C:\Windows\System32\drivers\etc or vim /etc/hosts
```
127.0.0.1  wl4g.debug
```

3. Browser access
http://wl4g.debug


### Project structure:
- /src Main logic source code directory
- /build Package configuration code directory
- /node_modules Dependent package directory
- /static Rely on static files

Corresponded backend project [XCloud DoPaaS](../../../xcloud-dopaas)
