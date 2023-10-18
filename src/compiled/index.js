(function () {

    /**
   * 转义HTML标签的方法
   * @param  {String} str 需要转义的HTML字符串
   * @return {String}     转义后的字符串
   */
    var funEncodeHTML = function (str) {
        if (typeof str == 'string')
        {
            return str.replace(/<|&|>/g, function (matches) {
                return ({
                    '<': '&lt;',
                    '>': '&gt;',
                    '&': '&amp;'
                })[matches];
            });
        }

        return '';
    };

    let vscode = {};
    if (window.isVscode)
    {
        vscode = acquireVsCodeApi();
    }

    const vscodeController = {
        init() {
            this.subscription();
            this.bindEvent();
        },

        bindEvent() {
            this.searchInput /** @type {HTMLElement} */ = document.querySelector('#search');
            const containerEle = document.querySelector('#container');

            this.searchInput.onclick = () => {
                this.includeInput = document.querySelector('#includePath');
                this.excludeInput = document.querySelector('#excludePath');
                this.$exportInput = $('#exportPath');
                containerEle.innerHTML = '正在解析文件...'
                $('#statistics').html('');
                vscode.postMessage({
                    command: 'search',
                    content: {
                        include: this.includeInput.value,
                        exclude: this.excludeInput.value,
                        exportPath: this.$exportInput.val()
                    }
                });
            }
        },

        subscription() {
            const containerEle = document.querySelector('#container');

            $('#container').on('click', '.row-item', function () {
                const index = $(this);
                const fileIndex = $(index.parent().parent()).index();
                const rowIndex = index.index();
                vscode.postMessage({
                    command: 'click',
                    content: {
                        fileIndex,
                        rowIndex
                    }
                });
                return false
            })

            window.addEventListener('message', event => {
                const message = event.data; // The json data that the extension sent
                containerEle.innerHTML = JSON.stringify(message.command)

                if (message.command === 'files')
                {
                    this.createHtmlNode(message.content || []);
                } else if (message.command === 'error')
                {
                    const $container = $('#container');
                    const error = message.content;
                    $container.html(`
                    <div class="error">
                <div>
                  <font color="#fff">位置:</font>
                  <span>${error.fileName}(${error.lineNumber}:${error.columnNumber})</span>
                </div>
                <div>
                  <font color="#fff">错误原因:</font>
                  <span>${error.cause}</span>
                </div>
                <div>
                <font color="#fff">名称:</font>
                  <span>${error.name}</span>
                </div>
                <div>
                <font color="#fff">堆栈:</font>
                  <span>${error.stack}</span>
                </div>
                </div>
            `);
                }
            });
        },

        // 创建
        createHtmlNode(content) {
            const containerEle = document.querySelector('#container');
            const { result, length, total } = content;

            const innerHtml = result.map((file, index) => {
                return `
<div class="container-item">
   <div class="container-fileName">${index}:${file.fileName} <span>${file.filePath}</span></div>
      <div class="container-rows">
        ${file.rows.map(item => {
                    return `<div class="row-item">
          <span class='lineNum'>(${item.rowNumber})</span> ${funEncodeHTML(item.content)}
        </div>`
                }).join('\n')
                    }
      </div>
  </div>
</div>
        `;
            }).join('\n');

            $('#statistics').html(`<div>搜索到<font color='red'>${length}</font>文件中包含中文，共计<font color='red'>${total}</font>个</div>`);

            containerEle.innerHTML = innerHtml;
        }

    };


    vscodeController.init();

    // 非vscode 开发调试
    if (!window.isVscode)
    {
        vscodeController.createHtmlNode([
            {
                "fileName": "urlUtils.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/utils/src/urlUtils.ts",
                "rows": [
                    {
                        "content": "console.warn(`url参数解码失败，key为${k}`);",
                        "rowNumber": 24,
                        "text": "url参数解码失败，key为",
                        "colNumber": 24
                    },
                    {
                        "content": "console.warn(`url参数解码失败，value值为${v}`);",
                        "rowNumber": 30,
                        "text": "url参数解码失败，value值为",
                        "colNumber": 24
                    }
                ]
            },
            {
                "fileName": "loadElement.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/utils/src/loadElement.ts",
                "rows": [
                    {
                        "content": "return Promise.reject(new Error('src不存在'));",
                        "rowNumber": 54,
                        "text": "src不存在",
                        "colNumber": 36
                    },
                    {
                        "content": "return Promise.reject(new Error('src不存在'));",
                        "rowNumber": 137,
                        "text": "src不存在",
                        "colNumber": 36
                    }
                ]
            },
            {
                "fileName": "fetch.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/test/src/mockService/fetch.ts",
                "rows": [
                    {
                        "content": "throw new Error(`${url}: 暂未模拟该接口`);",
                        "rowNumber": 28,
                        "text": ": 暂未模拟该接口",
                        "colNumber": 25
                    }
                ]
            },
            {
                "fileName": "define.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/test/src/mockService/define.ts",
                "rows": [
                    {
                        "content": "throw new Error(`已mock${url}，请勿重复添加`);",
                        "rowNumber": 14,
                        "text": "已mock",
                        "colNumber": 21
                    },
                    {
                        "content": "throw new Error(`已mock${url}，请勿重复添加`);",
                        "rowNumber": 14,
                        "text": "，请勿重复添加",
                        "colNumber": 32
                    }
                ]
            },
            {
                "fileName": "baiduMap.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/utils/baiduMap.ts",
                "rows": [
                    {
                        "content": "errorCallBask('坐标转换失败！');",
                        "rowNumber": 32,
                        "text": "坐标转换失败！",
                        "colNumber": 20
                    },
                    {
                        "content": "errorCallBask('定位失败');",
                        "rowNumber": 78,
                        "text": "定位失败",
                        "colNumber": 22
                    }
                ]
            },
            {
                "fileName": "checkValue.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/condexec/checkValue.ts",
                "rows": [
                    {
                        "content": "console.warn(`不支持的checkValue条件操作符：${cond.options.operate}，尝试进行Sandbox`);",
                        "rowNumber": 75,
                        "text": "不支持的checkValue条件操作符：",
                        "colNumber": 20
                    },
                    {
                        "content": "console.warn(`不支持的checkValue条件操作符：${cond.options.operate}，尝试进行Sandbox`);",
                        "rowNumber": 75,
                        "text": "，尝试进行Sandbox",
                        "colNumber": 63
                    }
                ]
            },
            {
                "fileName": "checkState.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/condexec/checkState.ts",
                "rows": [
                    {
                        "content": "console.warn(`不支持的checkState条件操作符：${cond.options.operate}`);",
                        "rowNumber": 40,
                        "text": "不支持的checkState条件操作符：",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "checkSearchParams.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/condexec/checkSearchParams.ts",
                "rows": [
                    {
                        "content": "console.warn(`不支持的checkState条件操作符：${cond.options.operate}`);",
                        "rowNumber": 39,
                        "text": "不支持的checkState条件操作符：",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "checkNowTab.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/condexec/checkNowTab.ts",
                "rows": [
                    {
                        "content": "console.warn(`不支持的checkState条件操作符：${cond.options.operate}`);",
                        "rowNumber": 39,
                        "text": "不支持的checkState条件操作符：",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "checkContextValue.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/condexec/checkContextValue.ts",
                "rows": [
                    {
                        "content": "console.warn(`不支持的checkValue条件操作符：${cond.options.operate}，尝试进行Sandbox`);",
                        "rowNumber": 120,
                        "text": "不支持的checkValue条件操作符：",
                        "colNumber": 20
                    },
                    {
                        "content": "console.warn(`不支持的checkValue条件操作符：${cond.options.operate}，尝试进行Sandbox`);",
                        "rowNumber": 120,
                        "text": "，尝试进行Sandbox",
                        "colNumber": 63
                    }
                ]
            },
            {
                "fileName": "sysSetVisible.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/sysSetVisible.ts",
                "rows": [
                    {
                        "content": "console.warn(`当前组件ID=${comid}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 38,
                        "text": "当前组件ID=",
                        "colNumber": 20
                    },
                    {
                        "content": "console.warn(`当前组件ID=${comid}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 38,
                        "text": "不存在或者未进行初始化先进行事件缓存，组件初始化后执行",
                        "colNumber": 35
                    }
                ]
            },
            {
                "fileName": "sysSetValue.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/sysSetValue.ts",
                "rows": [
                    {
                        "content": "const errobj: any = new Error('没有配置赋值关系，无法赋值！');",
                        "rowNumber": 7,
                        "text": "没有配置赋值关系，无法赋值！",
                        "colNumber": 34
                    },
                    {
                        "content": "msg: `指令警告：${errobj.message}`,",
                        "rowNumber": 16,
                        "text": "指令警告：",
                        "colNumber": 12
                    },
                    {
                        "content": "console.warn(`当前组件ID=${cmd.options.compId}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 43,
                        "text": "当前组件ID=",
                        "colNumber": 20
                    },
                    {
                        "content": "console.warn(`当前组件ID=${cmd.options.compId}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 43,
                        "text": "不存在或者未进行初始化先进行事件缓存，组件初始化后执行",
                        "colNumber": 48
                    }
                ]
            },
            {
                "fileName": "sysSetState.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/sysSetState.ts",
                "rows": [
                    {
                        "content": "console.warn(`当前组件ID=${compId}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 44,
                        "text": "当前组件ID=",
                        "colNumber": 22
                    },
                    {
                        "content": "console.warn(`当前组件ID=${compId}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 44,
                        "text": "不存在或者未进行初始化先进行事件缓存，组件初始化后执行",
                        "colNumber": 38
                    },
                    {
                        "content": "console.warn(`当前组件ID=${compId}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 50,
                        "text": "当前组件ID=",
                        "colNumber": 22
                    },
                    {
                        "content": "console.warn(`当前组件ID=${compId}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 50,
                        "text": "不存在或者未进行初始化先进行事件缓存，组件初始化后执行",
                        "colNumber": 38
                    },
                    {
                        "content": "console.warn(`当前组件ID=${compId}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 56,
                        "text": "当前组件ID=",
                        "colNumber": 22
                    },
                    {
                        "content": "console.warn(`当前组件ID=${compId}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 56,
                        "text": "不存在或者未进行初始化先进行事件缓存，组件初始化后执行",
                        "colNumber": 38
                    }
                ]
            },
            {
                "fileName": "sysSetRequired.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/sysSetRequired.ts",
                "rows": [
                    {
                        "content": "console.warn(`当前组件ID=${comid}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 36,
                        "text": "当前组件ID=",
                        "colNumber": 22
                    },
                    {
                        "content": "console.warn(`当前组件ID=${comid}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 36,
                        "text": "不存在或者未进行初始化先进行事件缓存，组件初始化后执行",
                        "colNumber": 37
                    }
                ]
            },
            {
                "fileName": "sysSetFormItemStatus.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/sysSetFormItemStatus.ts",
                "rows": [
                    {
                        "content": "'设置的状态值不符合规范，请检查选项值字段的配置， 默认为status节点'",
                        "rowNumber": 80,
                        "text": "设置的状态值不符合规范，请检查选项值字段的配置， 默认为status节点",
                        "colNumber": 22
                    },
                    {
                        "content": "`当前组件ID=${subComid}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`",
                        "rowNumber": 91,
                        "text": "当前组件ID=",
                        "colNumber": 25
                    },
                    {
                        "content": "`当前组件ID=${subComid}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`",
                        "rowNumber": 91,
                        "text": "不存在或者未进行初始化先进行事件缓存，组件初始化后执行",
                        "colNumber": 43
                    },
                    {
                        "content": "'接收的组件编码不符合规范，请检查选内容字段的配置, 默认attrCode节点'",
                        "rowNumber": 98,
                        "text": "接收的组件编码不符合规范，请检查选内容字段的配置, 默认attrCode节点",
                        "colNumber": 20
                    },
                    {
                        "content": "'接收的组件编码不符合规范，请检查选内容字段的配置, 默认为attrCode节点'",
                        "rowNumber": 104,
                        "text": "接收的组件编码不符合规范，请检查选内容字段的配置, 默认为attrCode节点",
                        "colNumber": 18
                    },
                    {
                        "content": "console.error(`组件Id不存在：${compid}`);",
                        "rowNumber": 110,
                        "text": "组件Id不存在：",
                        "colNumber": 25
                    }
                ]
            },
            {
                "fileName": "sysSetDisable.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/sysSetDisable.ts",
                "rows": [
                    {
                        "content": "console.warn(`当前组件ID=${comid}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 37,
                        "text": "当前组件ID=",
                        "colNumber": 24
                    },
                    {
                        "content": "console.warn(`当前组件ID=${comid}不存在或者未进行初始化先进行事件缓存，组件初始化后执行`);",
                        "rowNumber": 37,
                        "text": "不存在或者未进行初始化先进行事件缓存，组件初始化后执行",
                        "colNumber": 39
                    },
                    {
                        "content": "console.log('当前sysSetDisable指令出现异常====', error);",
                        "rowNumber": 42,
                        "text": "当前sysSetDisable指令出现异常====",
                        "colNumber": 16
                    }
                ]
            },
            {
                "fileName": "showModal.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/showModal.ts",
                "rows": [
                    {
                        "content": "okText: cmd.options.okText || '知道了',",
                        "rowNumber": 26,
                        "text": "知道了",
                        "colNumber": 36
                    },
                    {
                        "content": "cancelText: cmd.options.cancelText || '取消',",
                        "rowNumber": 27,
                        "text": "取消",
                        "colNumber": 44
                    }
                ]
            },
            {
                "fileName": "setSrc.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/setSrc.ts",
                "rows": [
                    {
                        "content": "console.error(`当前控件${cmd.options.compName},ID=${cmd.options.compId}, 不支持ref设置setSrc`);",
                        "rowNumber": 19,
                        "text": "当前控件",
                        "colNumber": 19
                    },
                    {
                        "content": "console.error(`当前控件${cmd.options.compName},ID=${cmd.options.compId}, 不支持ref设置setSrc`);",
                        "rowNumber": 19,
                        "text": ", 不支持ref设置setSrc",
                        "colNumber": 71
                    }
                ]
            },
            {
                "fileName": "setEditor.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/setEditor.ts",
                "rows": [
                    {
                        "content": "`当前控件${cmd.options.compName},ID=${compId}, 不支持通过ref设置为编辑状态`",
                        "rowNumber": 16,
                        "text": "当前控件",
                        "colNumber": 7
                    },
                    {
                        "content": "`当前控件${cmd.options.compName},ID=${compId}, 不支持通过ref设置为编辑状态`",
                        "rowNumber": 16,
                        "text": ", 不支持通过ref设置为编辑状态",
                        "colNumber": 47
                    }
                ]
            },
            {
                "fileName": "setDownloadResponse.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/setDownloadResponse.ts",
                "rows": [
                    {
                        "content": "msg: `指令警告：${errobj.message}`,",
                        "rowNumber": 15,
                        "text": "指令警告：",
                        "colNumber": 12
                    },
                    {
                        "content": "openErrorModal('downloadUrl配置有误');",
                        "rowNumber": 34,
                        "text": "downloadUrl配置有误",
                        "colNumber": 21
                    },
                    {
                        "content": "openErrorModal('没有配置下载地址，操作失败！');",
                        "rowNumber": 44,
                        "text": "没有配置下载地址，操作失败！",
                        "colNumber": 19
                    }
                ]
            },
            {
                "fileName": "setDataSource.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/setDataSource.ts",
                "rows": [
                    {
                        "content": "return Promise.reject(new Error('params参数不存在'));",
                        "rowNumber": 128,
                        "text": "params参数不存在",
                        "colNumber": 38
                    }
                ]
            },
            {
                "fileName": "reloadDataSource.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/reloadDataSource.ts",
                "rows": [
                    {
                        "content": "msg: `刷新数据源动作异常${e.message}`,",
                        "rowNumber": 103,
                        "text": "刷新数据源动作异常",
                        "colNumber": 14
                    }
                ]
            },
            {
                "fileName": "getLocalLocation.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/getLocalLocation.ts",
                "rows": [
                    {
                        "content": "CMDParse(cmd.callback2)({ [`location_err_${cmd.options.id}`]: '百度地图注册失败' }, context, true);",
                        "rowNumber": 50,
                        "text": "百度地图注册失败",
                        "colNumber": 68
                    }
                ]
            },
            {
                "fileName": "exportCustomData.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/exportCustomData.ts",
                "rows": [
                    {
                        "content": "hide = messageApi?.loading('正在导出中，请稍候...,', 0);",
                        "rowNumber": 462,
                        "text": "正在导出中，请稍候...,",
                        "colNumber": 31
                    },
                    {
                        "content": "messageApi?.error(error ? '导出错误，请检查' : '网络繁忙，请稍后再试');",
                        "rowNumber": 501,
                        "text": "导出错误，请检查",
                        "colNumber": 30
                    },
                    {
                        "content": "messageApi?.error(error ? '导出错误，请检查' : '网络繁忙，请稍后再试');",
                        "rowNumber": 501,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 43
                    }
                ]
            },
            {
                "fileName": "customPrintOrExport.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/customPrintOrExport.ts",
                "rows": [
                    {
                        "content": "messageApi.loading(cmd.options.type === 'export' ? '导出中' : '打印中', 0);",
                        "rowNumber": 12,
                        "text": "导出中",
                        "colNumber": 55
                    },
                    {
                        "content": "messageApi.loading(cmd.options.type === 'export' ? '导出中' : '打印中', 0);",
                        "rowNumber": 12,
                        "text": "打印中",
                        "colNumber": 63
                    }
                ]
            },
            {
                "fileName": "customActionCode.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/customActionCode.ts",
                "rows": [
                    {
                        "content": "msg: `超过指定超时时间${timeout}ms`,",
                        "rowNumber": 40,
                        "text": "超过指定超时时间",
                        "colNumber": 16
                    }
                ]
            },
            {
                "fileName": "console.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/console.ts",
                "rows": [
                    {
                        "content": "console.error(`组件名：${$$compDefine.name}（${$$compDefine.id}）的 ${EventName} 事件中，打印日志动作解析错误，原因：`, e.message);",
                        "rowNumber": 33,
                        "text": "组件名：",
                        "colNumber": 21
                    },
                    {
                        "content": "console.error(`组件名：${$$compDefine.name}（${$$compDefine.id}）的 ${EventName} 事件中，打印日志动作解析错误，原因：`, e.message);",
                        "rowNumber": 33,
                        "text": "）的 ",
                        "colNumber": 64
                    },
                    {
                        "content": "console.error(`组件名：${$$compDefine.name}（${$$compDefine.id}）的 ${EventName} 事件中，打印日志动作解析错误，原因：`, e.message);",
                        "rowNumber": 33,
                        "text": " 事件中，打印日志动作解析错误，原因：",
                        "colNumber": 79
                    }
                ]
            },
            {
                "fileName": "clearValue.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/clearValue.ts",
                "rows": [
                    {
                        "content": "console.error(`当前组件ID=${cmd.options.compId}的clearValue方法不存在`);",
                        "rowNumber": 20,
                        "text": "当前组件ID=",
                        "colNumber": 23
                    },
                    {
                        "content": "console.error(`当前组件ID=${cmd.options.compId}的clearValue方法不存在`);",
                        "rowNumber": 20,
                        "text": "的clearValue方法不存在",
                        "colNumber": 51
                    },
                    {
                        "content": "console.warn(`当前组件ID=${cmd.options.compId}不存在，有可能已经删除或未初始化`);",
                        "rowNumber": 24,
                        "text": "当前组件ID=",
                        "colNumber": 18
                    },
                    {
                        "content": "console.warn(`当前组件ID=${cmd.options.compId}不存在，有可能已经删除或未初始化`);",
                        "rowNumber": 24,
                        "text": "不存在，有可能已经删除或未初始化",
                        "colNumber": 46
                    }
                ]
            },
            {
                "fileName": "callSelfFunc.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/callSelfFunc.ts",
                "rows": [
                    {
                        "content": "msg: `没有找到自定义事件[${customFuncName}]方法`,",
                        "rowNumber": 63,
                        "text": "没有找到自定义事件[",
                        "colNumber": 14
                    },
                    {
                        "content": "msg: `没有找到自定义事件[${customFuncName}]方法`,",
                        "rowNumber": 63,
                        "text": "]方法",
                        "colNumber": 41
                    },
                    {
                        "content": "console.log('在callSelFunc中发生错误：', callSelFuncError);",
                        "rowNumber": 69,
                        "text": "在callSelFunc中发生错误：",
                        "colNumber": 16
                    },
                    {
                        "content": "msg: `在调用自定义事件中发生错误：${callSelFuncError}`,",
                        "rowNumber": 74,
                        "text": "在调用自定义事件中发生错误：",
                        "colNumber": 12
                    }
                ]
            },
            {
                "fileName": "callParentCustomFunc.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/callParentCustomFunc.ts",
                "rows": [
                    {
                        "content": "msg: '当前不存在父页面事件',",
                        "rowNumber": 25,
                        "text": "当前不存在父页面事件",
                        "colNumber": 13
                    },
                    {
                        "content": "msg: `调用父页面事件失败：没有找到指定的方法${customFuncName}`,",
                        "rowNumber": 41,
                        "text": "调用父页面事件失败：没有找到指定的方法",
                        "colNumber": 14
                    },
                    {
                        "content": "msg: `在调用父页面事件中发生错误：${callParentCustomFuncError}`,",
                        "rowNumber": 112,
                        "text": "在调用父页面事件中发生错误：",
                        "colNumber": 12
                    }
                ]
            },
            {
                "fileName": "callFuncComp.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/callFuncComp.ts",
                "rows": [
                    {
                        "content": "msg: `没有找到指定的方法${functionCode}`,",
                        "rowNumber": 19,
                        "text": "没有找到指定的方法",
                        "colNumber": 14
                    }
                ]
            },
            {
                "fileName": "callCustomPageFunc.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/callCustomPageFunc.ts",
                "rows": [
                    {
                        "content": "msg: `执行调用任意页面事件错误，当前页面未找到自定义事件:${customFuncName}，请排查该页面是否缓存或是否配置了该自定义事件！`,",
                        "rowNumber": 22,
                        "text": "执行调用任意页面事件错误，当前页面未找到自定义事件:",
                        "colNumber": 14
                    },
                    {
                        "content": "msg: `执行调用任意页面事件错误，当前页面未找到自定义事件:${customFuncName}，请排查该页面是否缓存或是否配置了该自定义事件！`,",
                        "rowNumber": 22,
                        "text": "，请排查该页面是否缓存或是否配置了该自定义事件！",
                        "colNumber": 57
                    },
                    {
                        "content": "console.log('在callParentCustomFunc中发生错误：', callParentCustomFuncError);",
                        "rowNumber": 75,
                        "text": "在callParentCustomFunc中发生错误：",
                        "colNumber": 16
                    },
                    {
                        "content": "msg: `执行调用任意页面事件:${customFuncName}发生错误: ${callParentCustomFuncError}`,",
                        "rowNumber": 79,
                        "text": "执行调用任意页面事件:",
                        "colNumber": 12
                    },
                    {
                        "content": "msg: `执行调用任意页面事件:${customFuncName}发生错误: ${callParentCustomFuncError}`,",
                        "rowNumber": 79,
                        "text": "发生错误: ",
                        "colNumber": 40
                    }
                ]
            },
            {
                "fileName": "callCurrentFunc.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/callCurrentFunc.ts",
                "rows": [
                    {
                        "content": "msg: `执行调用自定义事件错误，当前页面未找到自定义事件:${customFuncName}，请排查该页面是否缓存或是否配置了该自定义事件！`,",
                        "rowNumber": 22,
                        "text": "执行调用自定义事件错误，当前页面未找到自定义事件:",
                        "colNumber": 14
                    },
                    {
                        "content": "msg: `执行调用自定义事件错误，当前页面未找到自定义事件:${customFuncName}，请排查该页面是否缓存或是否配置了该自定义事件！`,",
                        "rowNumber": 22,
                        "text": "，请排查该页面是否缓存或是否配置了该自定义事件！",
                        "colNumber": 56
                    },
                    {
                        "content": "console.log('在callCurrentFunc中发生错误：', callParentCustomFuncError);",
                        "rowNumber": 73,
                        "text": "在callCurrentFunc中发生错误：",
                        "colNumber": 16
                    },
                    {
                        "content": "msg: `执行调用自定义事件:${customFuncName}发生错误: ${callParentCustomFuncError}`,",
                        "rowNumber": 77,
                        "text": "执行调用自定义事件:",
                        "colNumber": 12
                    },
                    {
                        "content": "msg: `执行调用自定义事件:${customFuncName}发生错误: ${callParentCustomFuncError}`,",
                        "rowNumber": 77,
                        "text": "发生错误: ",
                        "colNumber": 39
                    }
                ]
            },
            {
                "fileName": "apiRequest.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/sys-action/src/cmdexec/apiRequest.ts",
                "rows": [
                    {
                        "content": "const errobj: any = new Error(`找不到指定服务${cmd.options.service}，无法发起请求！`);",
                        "rowNumber": 38,
                        "text": "找不到指定服务",
                        "colNumber": 37
                    },
                    {
                        "content": "const errobj: any = new Error(`找不到指定服务${cmd.options.service}，无法发起请求！`);",
                        "rowNumber": 38,
                        "text": "，无法发起请求！",
                        "colNumber": 66
                    },
                    {
                        "content": "msg: `发送请求错误：${e?.resultMsg || e?.message}`,",
                        "rowNumber": 273,
                        "text": "发送请求错误：",
                        "colNumber": 16
                    },
                    {
                        "content": "msg: `发送请求错误：${e?.resultMsg || e?.message}`,",
                        "rowNumber": 299,
                        "text": "发送请求错误：",
                        "colNumber": 12
                    }
                ]
            },
            {
                "fileName": "RendererCore.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/render-core/src/RendererCore.tsx",
                "rows": [
                    {
                        "content": "throw new Error(`组件${comId}不存在`);",
                        "rowNumber": 446,
                        "text": "组件",
                        "colNumber": 29
                    },
                    {
                        "content": "throw new Error(`组件${comId}不存在`);",
                        "rowNumber": 446,
                        "text": "不存在",
                        "colNumber": 39
                    }
                ]
            },
            {
                "fileName": "LoopComponent.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/render-core/src/LoopComponent.tsx",
                "rows": [
                    {
                        "content": "throw '[MemoLoopItem]渲染容器的compId为字符串类型';",
                        "rowNumber": 9,
                        "text": "[MemoLoopItem]渲染容器的compId为字符串类型",
                        "colNumber": 10
                    }
                ]
            },
            {
                "fileName": "common.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/render-core/src/utils/common.ts",
                "rows": [
                    {
                        "content": "`${compName}: 配置了不可使用的${key}引擎能力, 请检查engineApi字段`",
                        "rowNumber": 47,
                        "text": ": 配置了不可使用的",
                        "colNumber": 22
                    },
                    {
                        "content": "`${compName}: 配置了不可使用的${key}引擎能力, 请检查engineApi字段`",
                        "rowNumber": 47,
                        "text": "引擎能力, 请检查engineApi字段",
                        "colNumber": 38
                    },
                    {
                        "content": "`${compName}: 配置了不可使用的${methodName}引擎能力, 请检查engineApi字段`",
                        "rowNumber": 60,
                        "text": ": 配置了不可使用的",
                        "colNumber": 20
                    },
                    {
                        "content": "`${compName}: 配置了不可使用的${methodName}引擎能力, 请检查engineApi字段`",
                        "rowNumber": 60,
                        "text": "引擎能力, 请检查engineApi字段",
                        "colNumber": 43
                    },
                    {
                        "content": "console.warn(`属性表达式执行沙箱出错: 执行属性值:${val}, 错误：${e}`);",
                        "rowNumber": 86,
                        "text": "属性表达式执行沙箱出错: 执行属性值:",
                        "colNumber": 20
                    },
                    {
                        "content": "console.warn(`属性表达式执行沙箱出错: 执行属性值:${val}, 错误：${e}`);",
                        "rowNumber": 86,
                        "text": ", 错误：",
                        "colNumber": 45
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/render-core/src/NotFound/index.tsx",
                "rows": [
                    {
                        "content": "return <div className={prefix}>{compName}组件未注册</div>;",
                        "rowNumber": 14,
                        "text": "组件未注册",
                        "colNumber": 45
                    }
                ]
            },
            {
                "fileName": "parseExpr.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/render/src/utils/parseExpr.ts",
                "rows": [
                    {
                        "content": "msg: `执行页面自定义函数错误：${error}`,",
                        "rowNumber": 27,
                        "text": "执行页面自定义函数错误：",
                        "colNumber": 12
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/render/src/renderer/index.tsx",
                "rows": [
                    {
                        "content": "console.log('即将渲染');",
                        "rowNumber": 47,
                        "text": "即将渲染",
                        "colNumber": 16
                    },
                    {
                        "content": "console.log('渲染完成');",
                        "rowNumber": 52,
                        "text": "渲染完成",
                        "colNumber": 16
                    },
                    {
                        "content": "console.error('执行pageDidMount/页面加载完成事件出错', e.message);",
                        "rowNumber": 81,
                        "text": "执行pageDidMount/页面加载完成事件出错",
                        "colNumber": 24
                    },
                    {
                        "content": "console.error('执行pageWillUnmount/离开页面前事件出错', e.message);",
                        "rowNumber": 166,
                        "text": "执行pageWillUnmount/离开页面前事件出错",
                        "colNumber": 24
                    }
                ]
            },
            {
                "fileName": "BaseRenderer.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/render/src/renderer/BaseRenderer.tsx",
                "rows": [
                    {
                        "content": "return Promise.reject(new Error(`数据加载失败${error}`));",
                        "rowNumber": 141,
                        "text": "数据加载失败",
                        "colNumber": 39
                    },
                    {
                        "content": "console.log('执行componentWillMount/组件挂载前事件出错', error?.message);",
                        "rowNumber": 508,
                        "text": "执行componentWillMount/组件挂载前事件出错",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/render/src/components/ErrorBoundary/index.tsx",
                "rows": [
                    {
                        "content": "<div style={{ color: 'red' }} onClick={resetError}>\n      渲染错误 {'>>>'} UI待补充",
                        "rowNumber": 11,
                        "text": "渲染错误 ",
                        "colNumber": 55
                    },
                    {
                        "content": "渲染错误 {'>>>'} UI待补充\n      <div>{error.stack}</div>",
                        "rowNumber": 12,
                        "text": " UI待补充",
                        "colNumber": 18
                    }
                ]
            },
            {
                "fileName": "Monitor.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/plog/src/monitt/Monitor.ts",
                "rows": [
                    {
                        "content": "console.log('====创建埋点');",
                        "rowNumber": 51,
                        "text": "====创建埋点",
                        "colNumber": 16
                    },
                    {
                        "content": "console.error(`${p as string} 方法未定义`);",
                        "rowNumber": 71,
                        "text": " 方法未定义",
                        "colNumber": 41
                    }
                ]
            },
            {
                "fileName": "ShowErrorPlugin.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/plog/src/monitt/plugins/ShowErrorPlugin.ts",
                "rows": [
                    {
                        "content": "console.log('=====启动');",
                        "rowNumber": 66,
                        "text": "=====启动",
                        "colNumber": 18
                    }
                ]
            },
            {
                "fileName": "init.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/plog/src/LogManagerInst/init.ts",
                "rows": [
                    {
                        "content": "console.warn('plog警告：在cmdplayer.engineMsg内接收到非法type信息，本次信息将不被处理，请检查。');",
                        "rowNumber": 31,
                        "text": "plog警告：在cmdplayer.engineMsg内接收到非法type信息，本次信息将不被处理，请检查。",
                        "colNumber": 21
                    }
                ]
            },
            {
                "fileName": "index.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/plog/src/LogManagerInst/index.ts",
                "rows": [
                    {
                        "content": "'plog错误：off的时候接收到null。如果你是期望解绑这个topic下的所有事件，请传入undefined'",
                        "rowNumber": 67,
                        "text": "plog错误：off的时候接收到null。如果你是期望解绑这个topic下的所有事件，请传入undefined",
                        "colNumber": 10
                    }
                ]
            },
            {
                "fileName": "gatherCustomFunctions.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/utils/gatherCustomFunctions.ts",
                "rows": [
                    {
                        "content": "const STR_REPLACE = `/**\n * @description STR_REPLACE 用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。\n * @param {String} str 原字符串\n * @param {RegExp} reg 匹配规则\n * @param {String} tar 被替换的字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_REPLACE = (str, reg, tar) => {\n  return str.replace(reg, tar);\n};\n`;",
                        "rowNumber": 2,
                        "text": "/**\n * @description STR_REPLACE 用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。\n * @param {String} str 原字符串\n * @param {RegExp} reg 匹配规则\n * @param {String} tar 被替换的字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_REPLACE = (str, reg, tar) => {\n  return str.replace(reg, tar);\n};\n",
                        "colNumber": 21
                    },
                    {
                        "content": "const STRARR_JOIN = `/**\n * @description STRARR_JOIN 用于把数组中的所有元素放入一个字符串。\n * @param {Array} strArr 字符串数组\n * @param {String} splicer 拼接符\n * @returns {*} 自定义函数必须return一个值\n */\nconst STRARR_JOIN = (strArr, splicer) => {\n  return strArr.join(splicer);\n};\n`;",
                        "rowNumber": 15,
                        "text": "/**\n * @description STRARR_JOIN 用于把数组中的所有元素放入一个字符串。\n * @param {Array} strArr 字符串数组\n * @param {String} splicer 拼接符\n * @returns {*} 自定义函数必须return一个值\n */\nconst STRARR_JOIN = (strArr, splicer) => {\n  return strArr.join(splicer);\n};\n",
                        "colNumber": 21
                    },
                    {
                        "content": "const STR_SPLIT = `/**\n * @description STR_SPLIT 用于把一个字符串分割成字符串数组。第二个可选参数是返回的数组的最大长度。\n * @param {String} str 字符串\n * @param {String} delimiter 分割符号\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_SPLIT = (str, delimiter) => {\n  return str.split(delimiter);\n};\n`;",
                        "rowNumber": 27,
                        "text": "/**\n * @description STR_SPLIT 用于把一个字符串分割成字符串数组。第二个可选参数是返回的数组的最大长度。\n * @param {String} str 字符串\n * @param {String} delimiter 分割符号\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_SPLIT = (str, delimiter) => {\n  return str.split(delimiter);\n};\n",
                        "colNumber": 19
                    },
                    {
                        "content": "const STR_INCLUDES = `/**\n * @description STR_INCLUDES 用于判断字符串是否包含指定的子字符串。\n * @param {String} str 字符串\n * @param {String} childStr 自字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_INCLUDES = (str, childStr) => {\n  return str.includes(childStr);\n};\n`;",
                        "rowNumber": 39,
                        "text": "/**\n * @description STR_INCLUDES 用于判断字符串是否包含指定的子字符串。\n * @param {String} str 字符串\n * @param {String} childStr 自字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_INCLUDES = (str, childStr) => {\n  return str.includes(childStr);\n};\n",
                        "colNumber": 22
                    },
                    {
                        "content": "const STR_TRIM = `/**\n * @description STR_TRIM 用于删除字符串的头尾空格。\n * @param {String} str 字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_TRIM = (str) => {\n  return str.trim();\n};\n`;",
                        "rowNumber": 51,
                        "text": "/**\n * @description STR_TRIM 用于删除字符串的头尾空格。\n * @param {String} str 字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_TRIM = (str) => {\n  return str.trim();\n};\n",
                        "colNumber": 18
                    },
                    {
                        "content": "const STR_SUBSTRING = `/**\n * @description STR_SUBSTRING 用于提取字符串中介于两个指定下标之间的字符。\n * @param {String} str 字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_SUBSTRING = (str, start, stop) => {\n  return str.substring(start, stop);\n};\n`;",
                        "rowNumber": 62,
                        "text": "/**\n * @description STR_SUBSTRING 用于提取字符串中介于两个指定下标之间的字符。\n * @param {String} str 字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_SUBSTRING = (str, start, stop) => {\n  return str.substring(start, stop);\n};\n",
                        "colNumber": 23
                    },
                    {
                        "content": "const STR_STRINGIFY = `/**\n * @description STR_STRINGIFY 用于将JavaScript对象转换为字符串。\n * @param {String} jsonObj json对象\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_STRINGIFY = (jsonObj) => {\n  return JSON.stringify(jsonObj);\n};\n`;",
                        "rowNumber": 73,
                        "text": "/**\n * @description STR_STRINGIFY 用于将JavaScript对象转换为字符串。\n * @param {String} jsonObj json对象\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_STRINGIFY = (jsonObj) => {\n  return JSON.stringify(jsonObj);\n};\n",
                        "colNumber": 23
                    },
                    {
                        "content": "const STR_PARSE = `/**\n * @description STR_PARSE 用于将字符串转换为JavaScript对象。\n * @param {String} jsonStr json字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_PARSE = (jsonStr) => {\n  return JSON.parse(jsonStr);\n};\n`;",
                        "rowNumber": 84,
                        "text": "/**\n * @description STR_PARSE 用于将字符串转换为JavaScript对象。\n * @param {String} jsonStr json字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_PARSE = (jsonStr) => {\n  return JSON.parse(jsonStr);\n};\n",
                        "colNumber": 19
                    },
                    {
                        "content": "const STR_TO_UPPER = `/**\n * @description STR_TO_UPPER 将传入的字符串第一个单词首字母变成大写\n * @param {String} str 字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_TO_UPPER = (str) => {\n  const strArr = str.split('');\n  const [first, ...rest] = strArr;\n  return first.toUpperCase() + rest.join('');\n};\n`;",
                        "rowNumber": 95,
                        "text": "/**\n * @description STR_TO_UPPER 将传入的字符串第一个单词首字母变成大写\n * @param {String} str 字符串\n * @returns {*} 自定义函数必须return一个值\n */\nconst STR_TO_UPPER = (str) => {\n  const strArr = str.split('');\n  const [first, ...rest] = strArr;\n  return first.toUpperCase() + rest.join('');\n};\n",
                        "colNumber": 22
                    },
                    {
                        "content": "const STR_TO_UPPER_EVERY_WORD = `/**\n * @description STR_TO_UPPER_EVERY_WORD 将传入的字符串每一个单词首字母变成大写\n * @param {String} str 字符串\n * @returns {*} 自定义函数必须return一个值\n */\n${STR_TO_UPPER_EVERY_WORD_FUNC.toString()}",
                        "rowNumber": 110,
                        "text": "/**\n * @description STR_TO_UPPER_EVERY_WORD 将传入的字符串每一个单词首字母变成大写\n * @param {String} str 字符串\n * @returns {*} 自定义函数必须return一个值\n */\n",
                        "colNumber": 33
                    },
                    {
                        "content": "const NUM_PREFIX = `/**\n * @description NUM_PREFIX JavaScript实现按照指定长度为数字前面补零输出的方法\n * @param {Number} num 数字\n * @param {Number} len 指定长度\n * @returns {*} 自定义函数必须return一个值\n */\nconst NUM_PREFIX = (num, len) => {\n  return (num / Math.pow(10, length)).toFixed(length).substr(2);\n};\n`;",
                        "rowNumber": 119,
                        "text": "/**\n * @description NUM_PREFIX JavaScript实现按照指定长度为数字前面补零输出的方法\n * @param {Number} num 数字\n * @param {Number} len 指定长度\n * @returns {*} 自定义函数必须return一个值\n */\nconst NUM_PREFIX = (num, len) => {\n  return (num / Math.pow(10, length)).toFixed(length).substr(2);\n};\n",
                        "colNumber": 20
                    },
                    {
                        "content": "const RANDOM_CODE = `/**\n * @description RANDOM_CODE 生成任意位随机码\n * @param {Number} num 数字\n * @returns {*} 自定义函数必须return一个值\n */\nconst RANDOM_CODE = (num) => {\n  const arr = [];\n  for (let i = 0; i < num; i += 1) {\n    const type = parseInt(Math.random() * 122);\n    if (type >= 0 && type <= 9) {// 判断是否数字\n      arr.push(type);\n    } else if (type >= 65 && type <= 90 || type >= 97 && type <= 122) { // 判断是否大写或小写字母\n      arr.push(String.fromCharCode(type));\n    } else { // 不是数字也不是大小写字母，再循环一次\n      i -= 1;\n    }\n  }\n\n  return arr.join('');\n};\n`;",
                        "rowNumber": 131,
                        "text": "/**\n * @description RANDOM_CODE 生成任意位随机码\n * @param {Number} num 数字\n * @returns {*} 自定义函数必须return一个值\n */\nconst RANDOM_CODE = (num) => {\n  const arr = [];\n  for (let i = 0; i < num; i += 1) {\n    const type = parseInt(Math.random() * 122);\n    if (type >= 0 && type <= 9) {// 判断是否数字\n      arr.push(type);\n    } else if (type >= 65 && type <= 90 || type >= 97 && type <= 122) { // 判断是否大写或小写字母\n      arr.push(String.fromCharCode(type));\n    } else { // 不是数字也不是大小写字母，再循环一次\n      i -= 1;\n    }\n  }\n\n  return arr.join('');\n};\n",
                        "colNumber": 21
                    },
                    {
                        "content": "const NUM_AVERAGE = `/**\n * @description NUM_AVERAGE 取平均数\n * @param\n */\nconst NUM_AVERAGE = (...params) => {\n  if (!params || !Array.isArray(params)) {\n    return 0;\n  }\n\n  return params.reduce((p, c) => c += p) / params.length;\n};\n`;",
                        "rowNumber": 154,
                        "text": "/**\n * @description NUM_AVERAGE 取平均数\n * @param\n */\nconst NUM_AVERAGE = (...params) => {\n  if (!params || !Array.isArray(params)) {\n    return 0;\n  }\n\n  return params.reduce((p, c) => c += p) / params.length;\n};\n",
                        "colNumber": 21
                    },
                    {
                        "content": "catalogItemName: '文本函数',",
                        "rowNumber": 171,
                        "text": "文本函数",
                        "colNumber": 21
                    },
                    {
                        "content": "catalogItemName: '数学函数',",
                        "rowNumber": 250,
                        "text": "数学函数",
                        "colNumber": 21
                    }
                ]
            },
            {
                "fileName": "fileUtils.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/utils/fileUtils.ts",
                "rows": [
                    {
                        "content": "'下载'",
                        "rowNumber": 131,
                        "text": "下载",
                        "colNumber": 12
                    },
                    {
                        "content": "errorMessage = JSON.parse(errMessage)?.message || '下载失败';",
                        "rowNumber": 151,
                        "text": "下载失败",
                        "colNumber": 60
                    },
                    {
                        "content": "title: fileName ? `导出-${fileName}` : undefined,",
                        "rowNumber": 208,
                        "text": "导出-",
                        "colNumber": 23
                    },
                    {
                        "content": "message: showLoading ? undefined : `总记录${total}条，已生成数据${currentCount}条，剩余${total - currentCount}条完成到处。`,",
                        "rowNumber": 250,
                        "text": "总记录",
                        "colNumber": 46
                    },
                    {
                        "content": "message: showLoading ? undefined : `总记录${total}条，已生成数据${currentCount}条，剩余${total - currentCount}条完成到处。`,",
                        "rowNumber": 250,
                        "text": "条，已生成数据",
                        "colNumber": 57
                    },
                    {
                        "content": "message: showLoading ? undefined : `总记录${total}条，已生成数据${currentCount}条，剩余${total - currentCount}条完成到处。`,",
                        "rowNumber": 250,
                        "text": "条，剩余",
                        "colNumber": 79
                    },
                    {
                        "content": "message: showLoading ? undefined : `总记录${total}条，已生成数据${currentCount}条，剩余${total - currentCount}条完成到处。`,",
                        "rowNumber": 250,
                        "text": "条完成到处。",
                        "colNumber": 106
                    },
                    {
                        "content": "loadingText: percent === 100 ? '正在等待下载，请稍后...' : '正在处理中，请稍后...',",
                        "rowNumber": 253,
                        "text": "正在等待下载，请稍后...",
                        "colNumber": 41
                    },
                    {
                        "content": "loadingText: percent === 100 ? '正在等待下载，请稍后...' : '正在处理中，请稍后...',",
                        "rowNumber": 253,
                        "text": "正在处理中，请稍后...",
                        "colNumber": 59
                    },
                    {
                        "content": "message: failReason || '导出失败，稍后请重试。',",
                        "rowNumber": 286,
                        "text": "导出失败，稍后请重试。",
                        "colNumber": 33
                    },
                    {
                        "content": "'导出'",
                        "rowNumber": 367,
                        "text": "导出",
                        "colNumber": 10
                    },
                    {
                        "content": "messageApi?.error?.('导出失败');",
                        "rowNumber": 387,
                        "text": "导出失败",
                        "colNumber": 28
                    },
                    {
                        "content": "console.error('传入的手机号为空！');",
                        "rowNumber": 427,
                        "text": "传入的手机号为空！",
                        "colNumber": 18
                    },
                    {
                        "content": "console.error('传入的文件url为空！');",
                        "rowNumber": 435,
                        "text": "传入的文件url为空！",
                        "colNumber": 18
                    },
                    {
                        "content": "console.error('传入的文件名称为空！');",
                        "rowNumber": 439,
                        "text": "传入的文件名称为空！",
                        "colNumber": 18
                    }
                ]
            },
            {
                "fileName": "errorMsgTool.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/utils/errorMsgTool.ts",
                "rows": [
                    {
                        "content": "return `的事件${element.label}(${cmdType})出现异常：`;",
                        "rowNumber": 11,
                        "text": "的事件",
                        "colNumber": 18
                    },
                    {
                        "content": "return `的事件${element.label}(${cmdType})出现异常：`;",
                        "rowNumber": 11,
                        "text": ")出现异常：",
                        "colNumber": 48
                    },
                    {
                        "content": "return `在(${pageInfo?.pageName})页面,组件名${name}(${id})`;",
                        "rowNumber": 76,
                        "text": "在(",
                        "colNumber": 14
                    },
                    {
                        "content": "return `在(${pageInfo?.pageName})页面,组件名${name}(${id})`;",
                        "rowNumber": 76,
                        "text": ")页面,组件名",
                        "colNumber": 37
                    },
                    {
                        "content": "return `在(${pageInfo?.pageName})上,(页面类型:${comConfig.label},id:${id})`;",
                        "rowNumber": 86,
                        "text": "在(",
                        "colNumber": 16
                    },
                    {
                        "content": "return `在(${pageInfo?.pageName})上,(页面类型:${comConfig.label},id:${id})`;",
                        "rowNumber": 86,
                        "text": ")上,(页面类型:",
                        "colNumber": 39
                    },
                    {
                        "content": "return `在(${pageInfo?.pageName})页面,组件类型${comConfig.label}(${id})`;",
                        "rowNumber": 88,
                        "text": "在(",
                        "colNumber": 14
                    },
                    {
                        "content": "return `在(${pageInfo?.pageName})页面,组件类型${comConfig.label}(${id})`;",
                        "rowNumber": 88,
                        "text": ")页面,组件类型",
                        "colNumber": 37
                    },
                    {
                        "content": "return `在${pageInfo?.pageName}页面`;",
                        "rowNumber": 91,
                        "text": "在",
                        "colNumber": 10
                    },
                    {
                        "content": "return `在${pageInfo?.pageName}页面`;",
                        "rowNumber": 91,
                        "text": "页面",
                        "colNumber": 32
                    },
                    {
                        "content": "const lineNumberText = lineNumber ? `第${lineNumber}个动作${cmdActionName}` : '';",
                        "rowNumber": 106,
                        "text": "第",
                        "colNumber": 39
                    },
                    {
                        "content": "const lineNumberText = lineNumber ? `第${lineNumber}个动作${cmdActionName}` : '';",
                        "rowNumber": 106,
                        "text": "个动作",
                        "colNumber": 53
                    },
                    {
                        "content": "const customEventNameText = customEventName ? `的页面自定义事件${customEventName}（编码:${customEventCode}）事件中` : '';",
                        "rowNumber": 107,
                        "text": "的页面自定义事件",
                        "colNumber": 49
                    },
                    {
                        "content": "const customEventNameText = customEventName ? `的页面自定义事件${customEventName}（编码:${customEventCode}）事件中` : '';",
                        "rowNumber": 107,
                        "text": "（编码:",
                        "colNumber": 75
                    },
                    {
                        "content": "const customEventNameText = customEventName ? `的页面自定义事件${customEventName}（编码:${customEventCode}）事件中` : '';",
                        "rowNumber": 107,
                        "text": "）事件中",
                        "colNumber": 97
                    },
                    {
                        "content": "const showEventName = eventName ? `的${getRealEventName(eventName, compDefine?.type, compDefine?.platform)}事件中` : customEventNameText;",
                        "rowNumber": 108,
                        "text": "的",
                        "colNumber": 37
                    },
                    {
                        "content": "const showEventName = eventName ? `的${getRealEventName(eventName, compDefine?.type, compDefine?.platform)}事件中` : customEventNameText;",
                        "rowNumber": 108,
                        "text": "事件中",
                        "colNumber": 108
                    }
                ]
            },
            {
                "fileName": "RouterChangeTools.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/utils/RouterChangeTools.ts",
                "rows": [
                    {
                        "content": "console.log('执行routerChange路由切换事件出错', e.message);",
                        "rowNumber": 65,
                        "text": "执行routerChange路由切换事件出错",
                        "colNumber": 22
                    }
                ]
            },
            {
                "fileName": "useGetPageDSL.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/services/useGetPageDSL.ts",
                "rows": [
                    {
                        "content": "msg: `没有查询到ID：${pageId}的页面实例数据，该页面将不会渲染！请检查配置或者确认该页面是否有权限访问`,",
                        "rowNumber": 21,
                        "text": "没有查询到ID：",
                        "colNumber": 18
                    },
                    {
                        "content": "msg: `没有查询到ID：${pageId}的页面实例数据，该页面将不会渲染！请检查配置或者确认该页面是否有权限访问`,",
                        "rowNumber": 21,
                        "text": "的页面实例数据，该页面将不会渲染！请检查配置或者确认该页面是否有权限访问",
                        "colNumber": 35
                    },
                    {
                        "content": "msg: `该页面没有对应的${pageId}配置，将不会渲染！, 请检查配置或者确认该页面是否有权限访问`,",
                        "rowNumber": 32,
                        "text": "该页面没有对应的",
                        "colNumber": 14
                    },
                    {
                        "content": "msg: `该页面没有对应的${pageId}配置，将不会渲染！, 请检查配置或者确认该页面是否有权限访问`,",
                        "rowNumber": 32,
                        "text": "配置，将不会渲染！, 请检查配置或者确认该页面是否有权限访问",
                        "colNumber": 31
                    }
                ]
            },
            {
                "fileName": "urlHelper.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/request/urlHelper.ts",
                "rows": [
                    {
                        "content": "console.log('TODO: 后续实现');",
                        "rowNumber": 44,
                        "text": "TODO: 后续实现",
                        "colNumber": 16
                    }
                ]
            },
            {
                "fileName": "hooks.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/request/hooks.ts",
                "rows": [
                    {
                        "content": "msg: `执行fetchSendBefore/请求发送前事件出错:${message}`,",
                        "rowNumber": 54,
                        "text": "执行fetchSendBefore/请求发送前事件出错:",
                        "colNumber": 16
                    },
                    {
                        "content": "throw new Error(`执行fetchSendBefore/请求发送前事件出错:${message}`);",
                        "rowNumber": 58,
                        "text": "执行fetchSendBefore/请求发送前事件出错:",
                        "colNumber": 25
                    },
                    {
                        "content": "throw new Error(`执行fetchResponse/请求响应事件出错:${message}`);",
                        "rowNumber": 102,
                        "text": "执行fetchResponse/请求响应事件出错:",
                        "colNumber": 27
                    },
                    {
                        "content": "throw new Error(`执行fetchSuccess/请求成功事件出错:${message}`);",
                        "rowNumber": 131,
                        "text": "执行fetchSuccess/请求成功事件出错:",
                        "colNumber": 25
                    },
                    {
                        "content": "throw new Error(`执行fetchFail/请求失败事件出错${eMessage}`);",
                        "rowNumber": 157,
                        "text": "执行fetchFail/请求失败事件出错",
                        "colNumber": 25
                    },
                    {
                        "content": "const errMsg = '请重新登录';",
                        "rowNumber": 164,
                        "text": "请重新登录",
                        "colNumber": 19
                    }
                ]
            },
            {
                "fileName": "errorHandler.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/request/errorHandler.ts",
                "rows": [
                    {
                        "content": "newError.resultMsg = `'当前请求错误错误:错误编码${error.response.status}请请求提供商处理'`;",
                        "rowNumber": 25,
                        "text": "'当前请求错误错误:错误编码",
                        "colNumber": 28
                    },
                    {
                        "content": "newError.resultMsg = `'当前请求错误错误:错误编码${error.response.status}请请求提供商处理'`;",
                        "rowNumber": 25,
                        "text": "请请求提供商处理'",
                        "colNumber": 66
                    },
                    {
                        "content": "newError.resultMsg = `当前请求无权限:错误编码${error.response.status}，请确认是否有权限或联系管理员！`;",
                        "rowNumber": 29,
                        "text": "当前请求无权限:错误编码",
                        "colNumber": 28
                    },
                    {
                        "content": "newError.resultMsg = `当前请求无权限:错误编码${error.response.status}，请确认是否有权限或联系管理员！`;",
                        "rowNumber": 29,
                        "text": "，请确认是否有权限或联系管理员！",
                        "colNumber": 64
                    },
                    {
                        "content": "newError.resultMsg = `请求服务器被拒绝:错误编码${error.response.status}，通常是权限问题，请确保有权限访问！`;",
                        "rowNumber": 33,
                        "text": "请求服务器被拒绝:错误编码",
                        "colNumber": 28
                    },
                    {
                        "content": "newError.resultMsg = `请求服务器被拒绝:错误编码${error.response.status}，通常是权限问题，请确保有权限访问！`;",
                        "rowNumber": 33,
                        "text": "，通常是权限问题，请确保有权限访问！",
                        "colNumber": 65
                    },
                    {
                        "content": "newError.resultMsg = `请求的资源不存在:错误编码${error.response.status}，请排查环境地址和对应资源是否存在 `;",
                        "rowNumber": 37,
                        "text": "请求的资源不存在:错误编码",
                        "colNumber": 28
                    },
                    {
                        "content": "newError.resultMsg = `请求的资源不存在:错误编码${error.response.status}，请排查环境地址和对应资源是否存在 `;",
                        "rowNumber": 37,
                        "text": "，请排查环境地址和对应资源是否存在 ",
                        "colNumber": 65
                    },
                    {
                        "content": "newError.resultMsg += `，请求地址：${error.response.path}`;",
                        "rowNumber": 41,
                        "text": "，请求地址：",
                        "colNumber": 31
                    },
                    {
                        "content": "newError.resultMsg = `服务器内部错误:错误编码${error.response.status}，请联系服务提供商处理！`;",
                        "rowNumber": 46,
                        "text": "服务器内部错误:错误编码",
                        "colNumber": 28
                    },
                    {
                        "content": "newError.resultMsg = `服务器内部错误:错误编码${error.response.status}，请联系服务提供商处理！`;",
                        "rowNumber": 46,
                        "text": "，请联系服务提供商处理！",
                        "colNumber": 64
                    },
                    {
                        "content": "newError.resultMsg = `请求服务器不支持的请求功能:错误编码${error.response.status}, 请联系服务提供商处理！ `;",
                        "rowNumber": 50,
                        "text": "请求服务器不支持的请求功能:错误编码",
                        "colNumber": 28
                    },
                    {
                        "content": "newError.resultMsg = `请求服务器不支持的请求功能:错误编码${error.response.status}, 请联系服务提供商处理！ `;",
                        "rowNumber": 50,
                        "text": ", 请联系服务提供商处理！ ",
                        "colNumber": 70
                    },
                    {
                        "content": "newError.resultMsg = `服务器作为网关或代理，从上游服务器收到无效的响应:错误编码${error.response.status}, 请联系服务提供商处理！ `;",
                        "rowNumber": 54,
                        "text": "服务器作为网关或代理，从上游服务器收到无效的响应:错误编码",
                        "colNumber": 28
                    },
                    {
                        "content": "newError.resultMsg = `服务器作为网关或代理，从上游服务器收到无效的响应:错误编码${error.response.status}, 请联系服务提供商处理！ `;",
                        "rowNumber": 54,
                        "text": ", 请联系服务提供商处理！ ",
                        "colNumber": 81
                    },
                    {
                        "content": "newError.resultMsg = `服务器暂时不可用，通常是由于过载或维护:错误编码${error.response.status}, 请联系服务提供商处理！ `;",
                        "rowNumber": 58,
                        "text": "服务器暂时不可用，通常是由于过载或维护:错误编码",
                        "colNumber": 28
                    },
                    {
                        "content": "newError.resultMsg = `服务器暂时不可用，通常是由于过载或维护:错误编码${error.response.status}, 请联系服务提供商处理！ `;",
                        "rowNumber": 58,
                        "text": ", 请联系服务提供商处理！ ",
                        "colNumber": 76
                    }
                ]
            },
            {
                "fileName": "defaultInterceptors.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/request/defaultInterceptors.ts",
                "rows": [
                    {
                        "content": "'请重新登录';",
                        "rowNumber": 51,
                        "text": "请重新登录",
                        "colNumber": 10
                    }
                ]
            },
            {
                "fileName": "config.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/request/config.ts",
                "rows": [
                    {
                        "content": "timeoutMessage: '请求失败，请求超时未响应',",
                        "rowNumber": 13,
                        "text": "请求失败，请求超时未响应",
                        "colNumber": 18
                    }
                ]
            },
            {
                "fileName": "lcdpBaseApi.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/lcdpApi/lcdpBaseApi.ts",
                "rows": [
                    {
                        "content": "console.warn('当前页面未配置自定义事件');",
                        "rowNumber": 88,
                        "text": "当前页面未配置自定义事件",
                        "colNumber": 21
                    },
                    {
                        "content": "console.warn(`当前页面未找到自定义事件:${func}`);",
                        "rowNumber": 93,
                        "text": "当前页面未找到自定义事件:",
                        "colNumber": 22
                    }
                ]
            },
            {
                "fileName": "lcdpApi.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/lcdpApi/lcdpApi.ts",
                "rows": [
                    {
                        "content": "message?.warning('页面跳转地址缺失，请检查');",
                        "rowNumber": 46,
                        "text": "页面跳转地址缺失，请检查",
                        "colNumber": 23
                    },
                    {
                        "content": "message?.warning('打开新页面失败，缺失Modal');",
                        "rowNumber": 86,
                        "text": "打开新页面失败，缺失Modal",
                        "colNumber": 31
                    },
                    {
                        "content": "message?.warning('打开新页面失败，缺失Modal');",
                        "rowNumber": 98,
                        "text": "打开新页面失败，缺失Modal",
                        "colNumber": 31
                    },
                    {
                        "content": "message?.warning(`不支持的页面类型: ${pageData.pageContainerType}`);",
                        "rowNumber": 103,
                        "text": "不支持的页面类型: ",
                        "colNumber": 30
                    },
                    {
                        "content": "message?.warning('找不到跳转页面的数据');",
                        "rowNumber": 108,
                        "text": "找不到跳转页面的数据",
                        "colNumber": 25
                    }
                ]
            },
            {
                "fileName": "mobileLcdpApi.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/lcdpApi/mobile/mobileLcdpApi.tsx",
                "rows": [
                    {
                        "content": "console.log('上传接口');",
                        "rowNumber": 107,
                        "text": "上传接口",
                        "colNumber": 18
                    }
                ]
            },
            {
                "fileName": "log.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/hotUpdate/log.ts",
                "rows": [
                    {
                        "content": "pkg.isremote ? '远程' : '本地',",
                        "rowNumber": 12,
                        "text": "远程",
                        "colNumber": 21
                    },
                    {
                        "content": "pkg.isremote ? '远程' : '本地',",
                        "rowNumber": 12,
                        "text": "本地",
                        "colNumber": 28
                    }
                ]
            },
            {
                "fileName": "pagePointUtil.js",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/dataCollector/pagePointUtil.js",
                "rows": [
                    {
                        "content": "console.log('埋点工具初始化失败！原因：缺少参数。');",
                        "rowNumber": 10,
                        "text": "埋点工具初始化失败！原因：缺少参数。",
                        "colNumber": 18
                    },
                    {
                        "content": "const extData = '扩展数据，请忽略';",
                        "rowNumber": 113,
                        "text": "扩展数据，请忽略",
                        "colNumber": 20
                    },
                    {
                        "content": "console.log(`请求失败，状态码：${status}`);",
                        "rowNumber": 146,
                        "text": "请求失败，状态码：",
                        "colNumber": 19
                    }
                ]
            },
            {
                "fileName": "index.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/appManager/index.ts",
                "rows": [
                    {
                        "content": "console.log(e, '执行beforeCreateApp失败！');",
                        "rowNumber": 83,
                        "text": "执行beforeCreateApp失败！",
                        "colNumber": 23
                    },
                    {
                        "content": "console.log('执行appDidInit/应用初始化完成事件出错', e.message);",
                        "rowNumber": 102,
                        "text": "执行appDidInit/应用初始化完成事件出错",
                        "colNumber": 26
                    },
                    {
                        "content": "return Promise.reject({ code: '-1', message: '未创建/获取成功，如需创建，请传入createOnAbsent: true' });",
                        "rowNumber": 131,
                        "text": "未创建/获取成功，如需创建，请传入createOnAbsent: true",
                        "colNumber": 49
                    },
                    {
                        "content": "console.error(`未找到appId为${appId}的应用`);",
                        "rowNumber": 174,
                        "text": "未找到appId为",
                        "colNumber": 21
                    },
                    {
                        "content": "console.error(`未找到appId为${appId}的应用`);",
                        "rowNumber": 174,
                        "text": "的应用",
                        "colNumber": 38
                    }
                ]
            },
            {
                "fileName": "action.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/appManager/action.ts",
                "rows": [
                    {
                        "content": "`%c[应用信息]： ${appInst.appName}(${appInst.appId})`,",
                        "rowNumber": 29,
                        "text": "%c[应用信息]： ",
                        "colNumber": 5
                    },
                    {
                        "content": "appName: 'mocky应用',",
                        "rowNumber": 44,
                        "text": "mocky应用",
                        "colNumber": 13
                    },
                    {
                        "content": "console.error('=====findAppPolymerizationInfo 初始化应用信息失败', e);",
                        "rowNumber": 75,
                        "text": "=====findAppPolymerizationInfo 初始化应用信息失败",
                        "colNumber": 20
                    },
                    {
                        "content": "console.error('=====findAppPolymerizationInfo 初始化应用信息失败', e);",
                        "rowNumber": 95,
                        "text": "=====findAppPolymerizationInfo 初始化应用信息失败",
                        "colNumber": 20
                    },
                    {
                        "content": "console.error('=====checkUsedOldFlow 调用旧流程接口失败', e);",
                        "rowNumber": 111,
                        "text": "=====checkUsedOldFlow 调用旧流程接口失败",
                        "colNumber": 18
                    },
                    {
                        "content": "console.error('=====qryAppFrontendFileTree 获取自定义函数失败', e);",
                        "rowNumber": 133,
                        "text": "=====qryAppFrontendFileTree 获取自定义函数失败",
                        "colNumber": 18
                    },
                    {
                        "content": "console.error('=====getWaterMarkByAppId 获取水印信息失败', e);",
                        "rowNumber": 150,
                        "text": "=====getWaterMarkByAppId 获取水印信息失败",
                        "colNumber": 18
                    },
                    {
                        "content": "console.error('=====getUserGrantedPageUrls 获取用户应用页面权限失败', e);",
                        "rowNumber": 170,
                        "text": "=====getUserGrantedPageUrls 获取用户应用页面权限失败",
                        "colNumber": 18
                    }
                ]
            },
            {
                "fileName": "App.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/platform/src/appManager/App.ts",
                "rows": [
                    {
                        "content": "console.warn('请检查app主题配置json字符串格式');",
                        "rowNumber": 130,
                        "text": "请检查app主题配置json字符串格式",
                        "colNumber": 21
                    },
                    {
                        "content": "console.warn('调用mock服务失败');",
                        "rowNumber": 157,
                        "text": "调用mock服务失败",
                        "colNumber": 21
                    },
                    {
                        "content": "console.log(error, '挂载函数库失败');",
                        "rowNumber": 233,
                        "text": "挂载函数库失败",
                        "colNumber": 25
                    },
                    {
                        "content": "console.log(`平台自定义组件订阅成功（${row.compCode}-${row.compName}）`);",
                        "rowNumber": 258,
                        "text": "平台自定义组件订阅成功（",
                        "colNumber": 25
                    },
                    {
                        "content": "console.log(`平台存量自定义组件注册配置表失败（${row.compCode}-${row.compName}）`, error);",
                        "rowNumber": 280,
                        "text": "平台存量自定义组件注册配置表失败（",
                        "colNumber": 29
                    },
                    {
                        "content": "console.log(`平台自定义组件订阅失败（${row.compCode}-${row.compName}）`, error);",
                        "rowNumber": 284,
                        "text": "平台自定义组件订阅失败（",
                        "colNumber": 25
                    },
                    {
                        "content": "console.log('平台自定义组件加载失败：', error);",
                        "rowNumber": 288,
                        "text": "平台自定义组件加载失败：",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "ArrayUtil.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/meta/src/utils/dataSource/ArrayUtil.ts",
                "rows": [
                    {
                        "content": "throw new Error('替换数据不是数组');",
                        "rowNumber": 349,
                        "text": "替换数据不是数组",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "ProvideData.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/meta/src/scope/ProvideData.ts",
                "rows": [
                    {
                        "content": "const errMsg = `provide数据不能使用以下key: ${sameKeys.join(',')}`;",
                        "rowNumber": 88,
                        "text": "provide数据不能使用以下key: ",
                        "colNumber": 22
                    },
                    {
                        "content": "const errMsg = `provide数据不能使用: ${key}`;",
                        "rowNumber": 107,
                        "text": "provide数据不能使用: ",
                        "colNumber": 26
                    }
                ]
            },
            {
                "fileName": "GlobalDataSource.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/meta/src/scope/GlobalDataSource.ts",
                "rows": [
                    {
                        "content": "msg: `初始化全局数据源(${opts.dataSourceName})失败: ${err.resultMsg || err.message || ''}`,",
                        "rowNumber": 87,
                        "text": "初始化全局数据源(",
                        "colNumber": 16
                    },
                    {
                        "content": "msg: `初始化全局数据源(${opts.dataSourceName})失败: ${err.resultMsg || err.message || ''}`,",
                        "rowNumber": 87,
                        "text": ")失败: ",
                        "colNumber": 47
                    },
                    {
                        "content": "msg: '设置全局数据源失败',",
                        "rowNumber": 176,
                        "text": "设置全局数据源失败",
                        "colNumber": 13
                    },
                    {
                        "content": "err: new Error(`数据源${options.name}不存在`),",
                        "rowNumber": 179,
                        "text": "数据源",
                        "colNumber": 24
                    },
                    {
                        "content": "err: new Error(`数据源${options.name}不存在`),",
                        "rowNumber": 179,
                        "text": "不存在",
                        "colNumber": 42
                    },
                    {
                        "content": "msg: `'刷新全局数据源失败(${name})':${err.resultMsg}`,",
                        "rowNumber": 217,
                        "text": "'刷新全局数据源失败(",
                        "colNumber": 18
                    },
                    {
                        "content": "msg: `'刷新全局数据源失败(${name})':${err?.message || ''}`,",
                        "rowNumber": 226,
                        "text": "'刷新全局数据源失败(",
                        "colNumber": 18
                    },
                    {
                        "content": "msg: '清空页面数据源失败',",
                        "rowNumber": 248,
                        "text": "清空页面数据源失败",
                        "colNumber": 13
                    },
                    {
                        "content": "err: new Error(`数据源${options.dataSourceName}不存在`),",
                        "rowNumber": 251,
                        "text": "数据源",
                        "colNumber": 24
                    },
                    {
                        "content": "err: new Error(`数据源${options.dataSourceName}不存在`),",
                        "rowNumber": 251,
                        "text": "不存在",
                        "colNumber": 52
                    }
                ]
            },
            {
                "fileName": "DataSource.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/meta/src/scope/DataSource.ts",
                "rows": [
                    {
                        "content": "msg: `初始化数据源(${dataSourceName})失败: ${err.resultMsg || err.message || ''}`,",
                        "rowNumber": 99,
                        "text": "初始化数据源(",
                        "colNumber": 14
                    },
                    {
                        "content": "msg: `初始化数据源(${dataSourceName})失败: ${err.resultMsg || err.message || ''}`,",
                        "rowNumber": 99,
                        "text": ")失败: ",
                        "colNumber": 38
                    },
                    {
                        "content": "msg: '设置页面数据源失败',",
                        "rowNumber": 124,
                        "text": "设置页面数据源失败",
                        "colNumber": 13
                    },
                    {
                        "content": "err: new Error(`数据源${options.name}不存在`),",
                        "rowNumber": 125,
                        "text": "数据源",
                        "colNumber": 24
                    },
                    {
                        "content": "err: new Error(`数据源${options.name}不存在`),",
                        "rowNumber": 125,
                        "text": "不存在",
                        "colNumber": 42
                    },
                    {
                        "content": "console.error('刷新页面数据源失败，数据源dataSourceName为空,请检查配置');",
                        "rowNumber": 143,
                        "text": "刷新页面数据源失败，数据源dataSourceName为空,请检查配置",
                        "colNumber": 20
                    },
                    {
                        "content": "msg: `刷新页面数据源失败：数据源${name}不存在`,",
                        "rowNumber": 150,
                        "text": "刷新页面数据源失败：数据源",
                        "colNumber": 14
                    },
                    {
                        "content": "msg: `刷新页面数据源失败：数据源${name}不存在`,",
                        "rowNumber": 150,
                        "text": "不存在",
                        "colNumber": 34
                    },
                    {
                        "content": "err: new Error(`数据源${name}不存在`),",
                        "rowNumber": 153,
                        "text": "数据源",
                        "colNumber": 24
                    },
                    {
                        "content": "err: new Error(`数据源${name}不存在`),",
                        "rowNumber": 153,
                        "text": "不存在",
                        "colNumber": 34
                    },
                    {
                        "content": "msg: `'页面数据源刷新失败(${name})':${err.resultMsg}`,",
                        "rowNumber": 170,
                        "text": "'页面数据源刷新失败(",
                        "colNumber": 16
                    },
                    {
                        "content": "msg: `'页面数据源刷新失败(${name})':${err?.message || ''}`,",
                        "rowNumber": 179,
                        "text": "'页面数据源刷新失败(",
                        "colNumber": 16
                    },
                    {
                        "content": "msg: '清空页面数据源失败',",
                        "rowNumber": 199,
                        "text": "清空页面数据源失败",
                        "colNumber": 13
                    },
                    {
                        "content": "err: new Error(`数据源${name}不存在`),",
                        "rowNumber": 202,
                        "text": "数据源",
                        "colNumber": 24
                    },
                    {
                        "content": "err: new Error(`数据源${name}不存在`),",
                        "rowNumber": 202,
                        "text": "不存在",
                        "colNumber": 34
                    }
                ]
            },
            {
                "fileName": "BaseReactive.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/meta/src/scope/BaseReactive.ts",
                "rows": [
                    {
                        "content": "throw new Error('请调用init方法，并返回数据');",
                        "rowNumber": 29,
                        "text": "请调用init方法，并返回数据",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "debugUtils.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/utils/debugUtils.ts",
                "rows": [
                    {
                        "content": "label: '组件类型',",
                        "rowNumber": 3,
                        "text": "组件类型",
                        "colNumber": 9
                    },
                    {
                        "content": "props: '配置属性',",
                        "rowNumber": 5,
                        "text": "配置属性",
                        "colNumber": 9
                    },
                    {
                        "content": "style: '样式',",
                        "rowNumber": 6,
                        "text": "样式",
                        "colNumber": 9
                    },
                    {
                        "content": "title: '名称',",
                        "rowNumber": 7,
                        "text": "名称",
                        "colNumber": 9
                    },
                    {
                        "content": "children: '子组件',",
                        "rowNumber": 8,
                        "text": "子组件",
                        "colNumber": 12
                    },
                    {
                        "content": "pagePath: '页面路径',",
                        "rowNumber": 9,
                        "text": "页面路径",
                        "colNumber": 12
                    },
                    {
                        "content": "pageContainerType: '页面类型',",
                        "rowNumber": 10,
                        "text": "页面类型",
                        "colNumber": 21
                    },
                    {
                        "content": "createdEditorVersion: '创建编辑器版本',",
                        "rowNumber": 11,
                        "text": "创建编辑器版本",
                        "colNumber": 24
                    },
                    {
                        "content": "editorVersion: '编辑器版本',",
                        "rowNumber": 12,
                        "text": "编辑器版本",
                        "colNumber": 17
                    },
                    {
                        "content": "Page: '【页面】',",
                        "rowNumber": 13,
                        "text": "【页面】",
                        "colNumber": 8
                    },
                    {
                        "content": "Modal: '【弹窗】',",
                        "rowNumber": 14,
                        "text": "【弹窗】",
                        "colNumber": 9
                    },
                    {
                        "content": "Drawer: '【推拉门】',",
                        "rowNumber": 15,
                        "text": "【推拉门】",
                        "colNumber": 10
                    },
                    {
                        "content": "BusiComp: '【业务组件】',",
                        "rowNumber": 16,
                        "text": "【业务组件】",
                        "colNumber": 12
                    },
                    {
                        "content": "pageName: '页面名称',",
                        "rowNumber": 17,
                        "text": "页面名称",
                        "colNumber": 12
                    }
                ]
            },
            {
                "fileName": "debugShared.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/utils/debugShared.ts",
                "rows": [
                    {
                        "content": "0: '新增元素',",
                        "rowNumber": 8,
                        "text": "新增元素",
                        "colNumber": 5
                    },
                    {
                        "content": "1: '修改元素',",
                        "rowNumber": 9,
                        "text": "修改元素",
                        "colNumber": 5
                    },
                    {
                        "content": "2: '删除元素',",
                        "rowNumber": 10,
                        "text": "删除元素",
                        "colNumber": 5
                    },
                    {
                        "content": "3: '替换数据',",
                        "rowNumber": 11,
                        "text": "替换数据",
                        "colNumber": 5
                    },
                    {
                        "content": "(val.indexOf('开始执行') > -1 || val.indexOf(') => {') > -1);",
                        "rowNumber": 54,
                        "text": "开始执行",
                        "colNumber": 21
                    },
                    {
                        "content": "DATA_SOURCE_LOGS.push(['------------ 数据源最新数据 ------------']);",
                        "rowNumber": 116,
                        "text": "------------ 数据源最新数据 ------------",
                        "colNumber": 25
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/ProgressComp/index.tsx",
                "rows": [
                    {
                        "content": "icon: `${fileName} 正在${text}：`,\r",
                        "rowNumber": 12,
                        "text": " 正在",
                        "colNumber": 22
                    },
                    {
                        "content": "const { key, title = '导出', percent, onCancel, message, btn, type, showLoading = false, loadingText, ...restConfig } = config || {};\r",
                        "rowNumber": 47,
                        "text": "导出",
                        "colNumber": 23
                    },
                    {
                        "content": "title=\"取消将无法获得下载结果，请确认是否需要取消\"\r",
                        "rowNumber": 57,
                        "text": "取消将无法获得下载结果，请确认是否需要取消",
                        "colNumber": 14
                    },
                    {
                        "content": "<Button>取消</Button>\r",
                        "rowNumber": 64,
                        "text": "取消",
                        "colNumber": 16
                    }
                ]
            },
            {
                "fileName": "ModalManager.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/ModalManager/ModalManager.tsx",
                "rows": [
                    {
                        "content": "message.error('弹窗操作失败：缺少页面实例ID或页面路径');",
                        "rowNumber": 41,
                        "text": "弹窗操作失败：缺少页面实例ID或页面路径",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "DynamicModal.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/ModalManager/DynamicModal/DynamicModal.tsx",
                "rows": [
                    {
                        "content": "okText: pageInst.okText || '确定',",
                        "rowNumber": 31,
                        "text": "确定",
                        "colNumber": 35
                    },
                    {
                        "content": "cancelText: pageInst.cancelText || '取消',",
                        "rowNumber": 32,
                        "text": "取消",
                        "colNumber": 43
                    }
                ]
            },
            {
                "fileName": "DynamicDrawer.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/ModalManager/DynamicDrawer/DynamicDrawer.tsx",
                "rows": [
                    {
                        "content": "<Button onClick={handleClose}>{mProps.cancelText || '取消'}</Button>",
                        "rowNumber": 43,
                        "text": "取消",
                        "colNumber": 62
                    },
                    {
                        "content": "<Button onClick={handleOk} type=\"primary\">{mProps.okText || '确定'}</Button>",
                        "rowNumber": 44,
                        "text": "确定",
                        "colNumber": 70
                    },
                    {
                        "content": "okText: pageInst.okText || '确定',",
                        "rowNumber": 57,
                        "text": "确定",
                        "colNumber": 35
                    },
                    {
                        "content": "cancelText: pageInst.cancelText || '取消',",
                        "rowNumber": 58,
                        "text": "取消",
                        "colNumber": 43
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/LoaderHelper/index.tsx",
                "rows": [
                    {
                        "content": "throw '请传入参数，格式： import(\"xxx\")';",
                        "rowNumber": 18,
                        "text": "请传入参数，格式： import(\"xxx\")",
                        "colNumber": 10
                    }
                ]
            },
            {
                "fileName": "ImportBusiObjModal.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/ImportBusiObjModal/ImportBusiObjModal.tsx",
                "rows": [
                    {
                        "content": "title: '部分数据导入失败',\r",
                        "rowNumber": 30,
                        "text": "部分数据导入失败",
                        "colNumber": 11
                    },
                    {
                        "content": "title: '导入成功',\r",
                        "rowNumber": 34,
                        "text": "导入成功",
                        "colNumber": 11
                    },
                    {
                        "content": "tips: '数据导入成功，请选择前往列表查看',\r",
                        "rowNumber": 36,
                        "text": "数据导入成功，请选择前往列表查看",
                        "colNumber": 10
                    },
                    {
                        "content": "title: '导入失败',\r",
                        "rowNumber": 39,
                        "text": "导入失败",
                        "colNumber": 11
                    },
                    {
                        "content": "tips: '数据导入失败，请核对以下信息后，再重新提交。',\r",
                        "rowNumber": 41,
                        "text": "数据导入失败，请核对以下信息后，再重新提交。",
                        "colNumber": 10
                    },
                    {
                        "content": "message.error('网络繁忙，请稍后再试');\r",
                        "rowNumber": 173,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 20
                    },
                    {
                        "content": "message.error('网络繁忙，请稍后再试');\r",
                        "rowNumber": 186,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 20
                    },
                    {
                        "content": "newFileName: `导入失败列表-${new Date().getTime()}.xlsx`,\r",
                        "rowNumber": 197,
                        "text": "导入失败列表-",
                        "colNumber": 22
                    },
                    {
                        "content": "name = `导入失败列表-${new Date().getTime()}.xlsx`;\r",
                        "rowNumber": 233,
                        "text": "导入失败列表-",
                        "colNumber": 18
                    },
                    {
                        "content": "message.error('网络繁忙，请稍后再试');\r",
                        "rowNumber": 247,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 20
                    },
                    {
                        "content": "setImportInfo({ ...responseParams?.resultObject, msg: resultMsg || '上传文件处理失败!', status: Status.fail, fail, success });\r",
                        "rowNumber": 399,
                        "text": "上传文件处理失败!",
                        "colNumber": 71
                    },
                    {
                        "content": "handleFail({ ...responseParams, resultMsg: '上传文件处理失败!' });\r",
                        "rowNumber": 417,
                        "text": "上传文件处理失败!",
                        "colNumber": 49
                    },
                    {
                        "content": "message.warn('无上传文件，请先选择文件');\r",
                        "rowNumber": 517,
                        "text": "无上传文件，请先选择文件",
                        "colNumber": 19
                    },
                    {
                        "content": "<div className=\"text\">\r\n          文件大小：\r\n          {((file?.size || 0) / (1024 * 1024)).toFixed(3)}MB\r",
                        "rowNumber": 630,
                        "text": "文件大小：",
                        "colNumber": 30
                    },
                    {
                        "content": "message.error(`${info.file.name} 文件上传失败，请重试！`);\r",
                        "rowNumber": 660,
                        "text": " 文件上传失败，请重试！",
                        "colNumber": 40
                    },
                    {
                        "content": "message.warn('请上传合法的表格');\r",
                        "rowNumber": 667,
                        "text": "请上传合法的表格",
                        "colNumber": 21
                    },
                    {
                        "content": "<Spin spinning={progress.upload >= 100 || true} tip=\"数据处理中...\">\r",
                        "rowNumber": 734,
                        "text": "数据处理中...",
                        "colNumber": 60
                    },
                    {
                        "content": "<div className=\"progress-item\">\r\n              文件上传\r\n              <Progress percent={progress.upload || 0} />\r",
                        "rowNumber": 737,
                        "text": "文件上传",
                        "colNumber": 43
                    },
                    {
                        "content": "{params.exception?.partialImport === 'T' && successLength !== 0 && renderResultIcon('warn', { tips: `导入总记录数${successLength + failLength}条，其中${successLength}条成功，${failLength}条失败` })}\r",
                        "rowNumber": 772,
                        "text": "导入总记录数",
                        "colNumber": 111
                    },
                    {
                        "content": "{params.exception?.partialImport === 'T' && successLength !== 0 && renderResultIcon('warn', { tips: `导入总记录数${successLength + failLength}条，其中${successLength}条成功，${failLength}条失败` })}\r",
                        "rowNumber": 772,
                        "text": "条，其中",
                        "colNumber": 146
                    },
                    {
                        "content": "{params.exception?.partialImport === 'T' && successLength !== 0 && renderResultIcon('warn', { tips: `导入总记录数${successLength + failLength}条，其中${successLength}条成功，${failLength}条失败` })}\r",
                        "rowNumber": 772,
                        "text": "条成功，",
                        "colNumber": 166
                    },
                    {
                        "content": "{params.exception?.partialImport === 'T' && successLength !== 0 && renderResultIcon('warn', { tips: `导入总记录数${successLength + failLength}条，其中${successLength}条成功，${failLength}条失败` })}\r",
                        "rowNumber": 772,
                        "text": "条失败",
                        "colNumber": 183
                    },
                    {
                        "content": "<div className=\"content\">\r\n              下载导入失败数据，查看失败原因\r\n            </div>\r",
                        "rowNumber": 784,
                        "text": "下载导入失败数据，查看失败原因",
                        "colNumber": 37
                    },
                    {
                        "content": ">点击下载\r\n            </a>\r",
                        "rowNumber": 793,
                        "text": "点击下载",
                        "colNumber": 13
                    },
                    {
                        "content": "<span>指定导入的有效字段</span>\r",
                        "rowNumber": 828,
                        "text": "指定导入的有效字段",
                        "colNumber": 24
                    },
                    {
                        "content": "message.error('请先选择要导出的字段');\r",
                        "rowNumber": 841,
                        "text": "请先选择要导出的字段",
                        "colNumber": 34
                    },
                    {
                        "content": ">\r\n                下载批量导入模版\r\n              </Button>\r",
                        "rowNumber": 845,
                        "text": "下载批量导入模版",
                        "colNumber": 15
                    },
                    {
                        "content": "title={isCustom || isCustomService ? '' : '上传文件'}\r",
                        "rowNumber": 863,
                        "text": "上传文件",
                        "colNumber": 52
                    },
                    {
                        "content": "<div className=\"title\">上传文件</div>\r",
                        "rowNumber": 873,
                        "text": "上传文件",
                        "colNumber": 35
                    },
                    {
                        "content": "<p className={`${importBusiObjModal}-text`}>\r\n              点击选择文件或拖动文件到此区域进行上传\r\n            </p>\r",
                        "rowNumber": 888,
                        "text": "点击选择文件或拖动文件到此区域进行上传",
                        "colNumber": 56
                    },
                    {
                        "content": "<p className={`${importBusiObjModal}-hint`}>仅支持单个文件上传</p>\r",
                        "rowNumber": 891,
                        "text": "仅支持单个文件上传",
                        "colNumber": 56
                    },
                    {
                        "content": "message.error('请先选择要导入的字段');\r",
                        "rowNumber": 908,
                        "text": "请先选择要导入的字段",
                        "colNumber": 30
                    },
                    {
                        "content": ">\r\n          下载批量导入模版\r\n        </Button>\r",
                        "rowNumber": 913,
                        "text": "下载批量导入模版",
                        "colNumber": 9
                    },
                    {
                        "content": ">\r\n          下载导入模版\r\n        </Button>\r",
                        "rowNumber": 953,
                        "text": "下载导入模版",
                        "colNumber": 9
                    },
                    {
                        "content": "<span className=\"title\">导入数据</span>\r",
                        "rowNumber": 966,
                        "text": "导入数据",
                        "colNumber": 34
                    },
                    {
                        "content": "{uploading ? '取消上传' : '关闭'}\r",
                        "rowNumber": 990,
                        "text": "取消上传",
                        "colNumber": 25
                    },
                    {
                        "content": "{uploading ? '取消上传' : '关闭'}\r",
                        "rowNumber": 990,
                        "text": "关闭",
                        "colNumber": 34
                    },
                    {
                        "content": ">\r\n              重新上传\r\n            </Button>\r",
                        "rowNumber": 1003,
                        "text": "重新上传",
                        "colNumber": 13
                    },
                    {
                        "content": "{importInfo?.status === Status.fail || (failLen || 0) > 0 ? '重新上传' : '上传'}\r",
                        "rowNumber": 1023,
                        "text": "重新上传",
                        "colNumber": 74
                    },
                    {
                        "content": "{importInfo?.status === Status.fail || (failLen || 0) > 0 ? '重新上传' : '上传'}\r",
                        "rowNumber": 1023,
                        "text": "上传",
                        "colNumber": 83
                    }
                ]
            },
            {
                "fileName": "ExpSQLServiceModal.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/ExpSQLServiceModal/ExpSQLServiceModal.tsx",
                "rows": [
                    {
                        "content": "message.error('网络繁忙，请稍后再试');\r",
                        "rowNumber": 53,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 20
                    },
                    {
                        "content": "hide = message.loading('处理中..', 0);\r",
                        "rowNumber": 62,
                        "text": "处理中..",
                        "colNumber": 29
                    },
                    {
                        "content": "message.error('网络繁忙，请稍后再试');\r",
                        "rowNumber": 96,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 20
                    },
                    {
                        "content": "message.error('网络繁忙，请稍后再试');\r",
                        "rowNumber": 131,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 20
                    },
                    {
                        "content": "title=\"按字段导出SQL查询服务数据\"\r",
                        "rowNumber": 171,
                        "text": "按字段导出SQL查询服务数据",
                        "colNumber": 12
                    },
                    {
                        "content": "message.error('请先选择要导出的字段');\r",
                        "rowNumber": 178,
                        "text": "请先选择要导出的字段",
                        "colNumber": 24
                    },
                    {
                        "content": ">\r\n            全选\r\n          </Checkbox>\r",
                        "rowNumber": 191,
                        "text": "全选",
                        "colNumber": 11
                    }
                ]
            },
            {
                "fileName": "ExpBusiObjModal.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/ExpBusiObjModal/ExpBusiObjModal.tsx",
                "rows": [
                    {
                        "content": "message.error('网络繁忙，请稍后再试');\r",
                        "rowNumber": 66,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 20
                    },
                    {
                        "content": "hide = message.loading('处理中..', 0);\r",
                        "rowNumber": 75,
                        "text": "处理中..",
                        "colNumber": 29
                    },
                    {
                        "content": "message.error('网络繁忙，请稍后再试');\r",
                        "rowNumber": 107,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 20
                    },
                    {
                        "content": "message.error('网络繁忙，请稍后再试');\r",
                        "rowNumber": 145,
                        "text": "网络繁忙，请稍后再试",
                        "colNumber": 20
                    },
                    {
                        "content": "title=\"按字段导出业务对象数据\"\r",
                        "rowNumber": 194,
                        "text": "按字段导出业务对象数据",
                        "colNumber": 12
                    },
                    {
                        "content": "message.error('请先选择要导出的字段');\r",
                        "rowNumber": 201,
                        "text": "请先选择要导出的字段",
                        "colNumber": 24
                    },
                    {
                        "content": ">\r\n          全选\r\n        </Checkbox>\r",
                        "rowNumber": 213,
                        "text": "全选",
                        "colNumber": 9
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/ErrorBoundary/index.tsx",
                "rows": [
                    {
                        "content": "<div style={{ fontSize: '16px', fontWeight: 600, color: '#000' }}>\n          组件渲染错误\n        </div>",
                        "rowNumber": 16,
                        "text": "组件渲染错误",
                        "colNumber": 74
                    },
                    {
                        "content": "<span style={{ fontWeight: 500, color: '#000' }}>组件名称</span>：",
                        "rowNumber": 23,
                        "text": "组件名称",
                        "colNumber": 61
                    },
                    {
                        "content": "<span style={{ fontWeight: 500, color: '#000' }}>组件标识</span>：",
                        "rowNumber": 27,
                        "text": "组件标识",
                        "colNumber": 61
                    },
                    {
                        "content": "<span style={{ fontWeight: 500, color: '#000' }}>错误信息</span>：",
                        "rowNumber": 31,
                        "text": "错误信息",
                        "colNumber": 61
                    },
                    {
                        "content": "<span style={{ fontWeight: 500, color: '#000' }}>错误堆栈</span>:{' '}",
                        "rowNumber": 35,
                        "text": "错误堆栈",
                        "colNumber": 61
                    },
                    {
                        "content": "组件加载失败，点击<span onClick={openDetailModal}>查看详情</span>",
                        "rowNumber": 47,
                        "text": "查看详情",
                        "colNumber": 49
                    },
                    {
                        "content": "<div className=\"engine-error-boundary-text\">\n        组件加载失败，点击<span onClick={openDetailModal}>查看详情</span>",
                        "rowNumber": 46,
                        "text": "组件加载失败，点击",
                        "colNumber": 50
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/index.tsx",
                "rows": [
                    {
                        "content": "<span className={`${debuggerCls}-cell-tit`}>当前调试页面：</span>",
                        "rowNumber": 75,
                        "text": "当前调试页面：",
                        "colNumber": 58
                    },
                    {
                        "content": "label: '页面元素',",
                        "rowNumber": 89,
                        "text": "页面元素",
                        "colNumber": 27
                    },
                    {
                        "content": "label: '日志打印',",
                        "rowNumber": 94,
                        "text": "日志打印",
                        "colNumber": 27
                    },
                    {
                        "content": "label: '网络调试',",
                        "rowNumber": 99,
                        "text": "网络调试",
                        "colNumber": 27
                    },
                    {
                        "content": "label: '系统信息',",
                        "rowNumber": 104,
                        "text": "系统信息",
                        "colNumber": 27
                    },
                    {
                        "content": "<Tag color=\"green\">\n            调试工具2.1\n          </Tag>",
                        "rowNumber": 123,
                        "text": "调试工具2.1",
                        "colNumber": 29
                    }
                ]
            },
            {
                "fileName": "DataConvertTools.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/utils/DataConvertTools.ts",
                "rows": [
                    {
                        "content": "o[k] = '<DOM元素>';",
                        "rowNumber": 9,
                        "text": "<DOM元素>",
                        "colNumber": 15
                    },
                    {
                        "content": "o[k] = '<React对象>';",
                        "rowNumber": 11,
                        "text": "<React对象>",
                        "colNumber": 15
                    }
                ]
            },
            {
                "fileName": "CompPropEditSnippet.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/utils/CompPropEditSnippet.ts",
                "rows": [
                    {
                        "content": "label: '设置远程组件地址',",
                        "rowNumber": 15,
                        "text": "设置远程组件地址",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '设置远程组件编码',",
                        "rowNumber": 18,
                        "text": "设置远程组件编码",
                        "colNumber": 11
                    }
                ]
            },
            {
                "fileName": "CompEventProvider.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/utils/CompEventProvider.tsx",
                "rows": [
                    {
                        "content": "console.error('======调试工具解析失败', e);",
                        "rowNumber": 110,
                        "text": "======调试工具解析失败",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "RemoteCompUrlModal.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/utils/SnippetComps/RemoteCompUrlModal.tsx",
                "rows": [
                    {
                        "content": "title=\"便捷修改远程组件地址\"",
                        "rowNumber": 10,
                        "text": "便捷修改远程组件地址",
                        "colNumber": 12
                    },
                    {
                        "content": "<p>请输入新的远程组件地址：<Input value={inputVal} onChange={e => setInputVal(e.target.value)} /></p>",
                        "rowNumber": 25,
                        "text": "请输入新的远程组件地址：",
                        "colNumber": 9
                    }
                ]
            },
            {
                "fileName": "RemoteCompCodeModal.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/utils/SnippetComps/RemoteCompCodeModal.tsx",
                "rows": [
                    {
                        "content": "title=\"便捷修改远程组件编码\"",
                        "rowNumber": 10,
                        "text": "便捷修改远程组件编码",
                        "colNumber": 12
                    },
                    {
                        "content": "<p>请输入新的远程组件编码：<Input value={inputVal} onChange={e => setInputVal(e.target.value)} /></p>",
                        "rowNumber": 25,
                        "text": "请输入新的远程组件编码：",
                        "colNumber": 9
                    }
                ]
            },
            {
                "fileName": "NowSkipPoints.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/ViewerPanel/NowSkipPoints.tsx",
                "rows": [
                    {
                        "content": "title=\"屏蔽列表\"",
                        "rowNumber": 20,
                        "text": "屏蔽列表",
                        "colNumber": 12
                    },
                    {
                        "content": "title=\"确定清除所有屏蔽配置？\"",
                        "rowNumber": 26,
                        "text": "确定清除所有屏蔽配置？",
                        "colNumber": 18
                    },
                    {
                        "content": "debugSkipDatas.length === 0 && '没有配置屏蔽动作'",
                        "rowNumber": 36,
                        "text": "没有配置屏蔽动作",
                        "colNumber": 41
                    },
                    {
                        "content": "<div className={`${debuggerCls}-record-dt-cell`}>{o.shielding ? '屏蔽该动作' : '不屏蔽该动作'}</div>",
                        "rowNumber": 47,
                        "text": "屏蔽该动作",
                        "colNumber": 80
                    },
                    {
                        "content": "<div className={`${debuggerCls}-record-dt-cell`}>{o.shielding ? '屏蔽该动作' : '不屏蔽该动作'}</div>",
                        "rowNumber": 47,
                        "text": "不屏蔽该动作",
                        "colNumber": 90
                    }
                ]
            },
            {
                "fileName": "NowBreakpoints.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/ViewerPanel/NowBreakpoints.tsx",
                "rows": [
                    {
                        "content": "title=\"断点列表\"",
                        "rowNumber": 26,
                        "text": "断点列表",
                        "colNumber": 12
                    },
                    {
                        "content": "title=\"确定清除所有断点？\"",
                        "rowNumber": 33,
                        "text": "确定清除所有断点？",
                        "colNumber": 18
                    },
                    {
                        "content": "debugDatas.length === 0 && '没有配置断点'",
                        "rowNumber": 43,
                        "text": "没有配置断点",
                        "colNumber": 37
                    },
                    {
                        "content": "<Tooltip overlayStyle={{ zIndex: 1202 }} title={`条件表达式：${o?.expression}`}>",
                        "rowNumber": 53,
                        "text": "条件表达式：",
                        "colNumber": 69
                    },
                    {
                        "content": "<Tag color=\"#ff7474\">条件</Tag>",
                        "rowNumber": 54,
                        "text": "条件",
                        "colNumber": 43
                    }
                ]
            },
            {
                "fileName": "ExprWatch.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/ViewerPanel/ExprWatch.tsx",
                "rows": [
                    {
                        "content": "exp.valueSlim = '沙盒执行错误！展开可查看原因';",
                        "rowNumber": 21,
                        "text": "沙盒执行错误！展开可查看原因",
                        "colNumber": 20
                    },
                    {
                        "content": "exp.valueSlim = '不可用（不在断点内）';",
                        "rowNumber": 54,
                        "text": "不可用（不在断点内）",
                        "colNumber": 28
                    },
                    {
                        "content": "exp.value = '不可用（不在断点内）';",
                        "rowNumber": 55,
                        "text": "不可用（不在断点内）",
                        "colNumber": 24
                    },
                    {
                        "content": "valueSlim: '不可用（不在断点内）',",
                        "rowNumber": 68,
                        "text": "不可用（不在断点内）",
                        "colNumber": 17
                    },
                    {
                        "content": "value: '不可用（不在断点内）',",
                        "rowNumber": 69,
                        "text": "不可用（不在断点内）",
                        "colNumber": 13
                    },
                    {
                        "content": "title=\"监视表达式\"",
                        "rowNumber": 84,
                        "text": "监视表达式",
                        "colNumber": 12
                    },
                    {
                        "content": "<div className={`${debuggerCls}-exprwatch-tit`}>添加监听表达式</div>",
                        "rowNumber": 94,
                        "text": "添加监听表达式",
                        "colNumber": 64
                    },
                    {
                        "content": "placeholder=\"请输入表达式，不需要$$包裹\"",
                        "rowNumber": 100,
                        "text": "请输入表达式，不需要$$包裹",
                        "colNumber": 30
                    },
                    {
                        "content": "<Button size=\"small\" type=\"primary\" onClick={onConfirm}>\n                  确定\n                </Button>",
                        "rowNumber": 102,
                        "text": "确定",
                        "colNumber": 72
                    }
                ]
            },
            {
                "fileName": "EventViewerPanel.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/ViewerPanel/EventViewerPanel.tsx",
                "rows": [
                    {
                        "content": "<div className={`${debuggerCls}-info-head-tit`}>\n          动作信息\n          {/* <span className={`${debuggerCls}-info-head-count`}>(1/6)</span> */}",
                        "rowNumber": 24,
                        "text": "动作信息",
                        "colNumber": 56
                    },
                    {
                        "content": ">下一步\n          </a>",
                        "rowNumber": 32,
                        "text": "下一步",
                        "colNumber": 11
                    },
                    {
                        "content": ">继续执行\n          </a>",
                        "rowNumber": 38,
                        "text": "继续执行",
                        "colNumber": 11
                    }
                ]
            },
            {
                "fileName": "DataSourceViewer.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/ViewerPanel/DataSourceViewer.tsx",
                "rows": [
                    {
                        "content": "<WrapCard title=\"数据源\">",
                        "rowNumber": 10,
                        "text": "数据源",
                        "colNumber": 20
                    },
                    {
                        "content": "nowBreakPoint ? JSON.stringify(nowBreakPoint?.methods.data, null, 2) : '不可用（不在断点内）'",
                        "rowNumber": 14,
                        "text": "不可用（不在断点内）",
                        "colNumber": 83
                    }
                ]
            },
            {
                "fileName": "CompPropEditer.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/ViewerPanel/CompPropEditer.tsx",
                "rows": [
                    {
                        "content": "message.success('当前组件的属性覆写成功，刷新页面后生效');",
                        "rowNumber": 45,
                        "text": "当前组件的属性覆写成功，刷新页面后生效",
                        "colNumber": 20
                    },
                    {
                        "content": "message.success('当前组件的属性覆写已清除，刷新页面后生效');",
                        "rowNumber": 55,
                        "text": "当前组件的属性覆写已清除，刷新页面后生效",
                        "colNumber": 20
                    },
                    {
                        "content": "message.success('当前组件的属性覆写成功，刷新页面后生效');",
                        "rowNumber": 62,
                        "text": "当前组件的属性覆写成功，刷新页面后生效",
                        "colNumber": 22
                    },
                    {
                        "content": "<Menu.Item disabled icon={<MehOutlined />}>\n            这个组件暂未支持便捷操作属性\n          </Menu.Item>",
                        "rowNumber": 88,
                        "text": "这个组件暂未支持便捷操作属性",
                        "colNumber": 53
                    },
                    {
                        "content": "<div className={`${debuggerCls}-info-head-tit`}>\n          组件属性\n        </div>",
                        "rowNumber": 101,
                        "text": "组件属性",
                        "colNumber": 56
                    },
                    {
                        "content": "<Switch checked={enableCompOverride} onChange={onChangeEnable} checkedChildren=\"开启覆写\" unCheckedChildren=\"关闭覆写\" />",
                        "rowNumber": 106,
                        "text": "开启覆写",
                        "colNumber": 91
                    },
                    {
                        "content": "<Switch checked={enableCompOverride} onChange={onChangeEnable} checkedChildren=\"开启覆写\" unCheckedChildren=\"关闭覆写\" />",
                        "rowNumber": 106,
                        "text": "关闭覆写",
                        "colNumber": 116
                    },
                    {
                        "content": "<Button size=\"small\" onClick={e => e.preventDefault()}>\n                便捷操作\n                <DownOutlined />",
                        "rowNumber": 108,
                        "text": "便捷操作",
                        "colNumber": 69
                    },
                    {
                        "content": ">\n                  清除修改数据\n                </Button>",
                        "rowNumber": 128,
                        "text": "清除修改数据",
                        "colNumber": 17
                    },
                    {
                        "content": "<div>\n                这个组件的属性已被修改\n                <Button",
                        "rowNumber": 122,
                        "text": "这个组件的属性已被修改",
                        "colNumber": 19
                    }
                ]
            },
            {
                "fileName": "CMDTopparam.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/ViewerPanel/CMDTopparam.tsx",
                "rows": [
                    {
                        "content": "<WrapCard title=\"上下文\" defaultExpanded>",
                        "rowNumber": 34,
                        "text": "上下文",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "CMDOptions.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/ViewerPanel/CMDOptions.tsx",
                "rows": [
                    {
                        "content": "checkValue: '判断当前的值',",
                        "rowNumber": 15,
                        "text": "判断当前的值",
                        "colNumber": 14
                    },
                    {
                        "content": "checkContextValue: '判断上下文的值',",
                        "rowNumber": 16,
                        "text": "判断上下文的值",
                        "colNumber": 21
                    },
                    {
                        "content": "isVisible: '处于可见状态',",
                        "rowNumber": 17,
                        "text": "处于可见状态",
                        "colNumber": 13
                    },
                    {
                        "content": "notVisible: '处于隐藏状态',",
                        "rowNumber": 18,
                        "text": "处于隐藏状态",
                        "colNumber": 14
                    },
                    {
                        "content": "notEmpty: '不为空',",
                        "rowNumber": 22,
                        "text": "不为空",
                        "colNumber": 12
                    },
                    {
                        "content": "empty: '为空',",
                        "rowNumber": 23,
                        "text": "为空",
                        "colNumber": 9
                    },
                    {
                        "content": "contains: '包含',",
                        "rowNumber": 24,
                        "text": "包含",
                        "colNumber": 12
                    },
                    {
                        "content": "notContains: '不包含',",
                        "rowNumber": 25,
                        "text": "不包含",
                        "colNumber": 15
                    },
                    {
                        "content": "'>': '大于',",
                        "rowNumber": 26,
                        "text": "大于",
                        "colNumber": 7
                    },
                    {
                        "content": "'>=': '大于等于',",
                        "rowNumber": 27,
                        "text": "大于等于",
                        "colNumber": 8
                    },
                    {
                        "content": "'==': '等于',",
                        "rowNumber": 28,
                        "text": "等于",
                        "colNumber": 8
                    },
                    {
                        "content": "'!=': '不等于',",
                        "rowNumber": 29,
                        "text": "不等于",
                        "colNumber": 8
                    },
                    {
                        "content": "'<': '小于',",
                        "rowNumber": 30,
                        "text": "小于",
                        "colNumber": 7
                    },
                    {
                        "content": "'<=': '小于等于',",
                        "rowNumber": 31,
                        "text": "小于等于",
                        "colNumber": 8
                    },
                    {
                        "content": "'&&': '且',",
                        "rowNumber": 32,
                        "text": "且",
                        "colNumber": 8
                    },
                    {
                        "content": "'||': '或',",
                        "rowNumber": 33,
                        "text": "或",
                        "colNumber": 8
                    },
                    {
                        "content": "'== true': '为真',",
                        "rowNumber": 34,
                        "text": "为真",
                        "colNumber": 13
                    },
                    {
                        "content": "'== false': '为假',",
                        "rowNumber": 35,
                        "text": "为假",
                        "colNumber": 14
                    },
                    {
                        "content": "{cond?.options?.context && `上下文表达式：${cond?.options?.context}`}",
                        "rowNumber": 94,
                        "text": "上下文表达式：",
                        "colNumber": 40
                    },
                    {
                        "content": "{rightComp ? '当前的值' : ''}",
                        "rowNumber": 97,
                        "text": "当前的值",
                        "colNumber": 25
                    },
                    {
                        "content": "{cond?.options?.stateVal && `自定义表达式：${cond?.options?.stateVal}`}",
                        "rowNumber": 99,
                        "text": "自定义表达式：",
                        "colNumber": 41
                    },
                    {
                        "content": "<WrapCard title={props?.cmd.dataName === 'condition' ? '条件配置' : '指令配置'} defaultExpanded>",
                        "rowNumber": 107,
                        "text": "条件配置",
                        "colNumber": 59
                    },
                    {
                        "content": "<WrapCard title={props?.cmd.dataName === 'condition' ? '条件配置' : '指令配置'} defaultExpanded>",
                        "rowNumber": 107,
                        "text": "指令配置",
                        "colNumber": 68
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/SystemAboutView/index.tsx",
                "rows": [
                    {
                        "content": "<Descriptions title=\"系统信息\" bordered size=\"small\">",
                        "rowNumber": 15,
                        "text": "系统信息",
                        "colNumber": 28
                    },
                    {
                        "content": "<Descriptions.Item label=\"渲染引擎版本\">{window.LCDP_ENGINE_APP?.__VERSION}</Descriptions.Item>",
                        "rowNumber": 17,
                        "text": "渲染引擎版本",
                        "colNumber": 35
                    },
                    {
                        "content": "<Descriptions.Item label=\"编译日期\">{window.LCDP_ENGINE_APP?.__BUILD_DATE}</Descriptions.Item>",
                        "rowNumber": 19,
                        "text": "编译日期",
                        "colNumber": 35
                    },
                    {
                        "content": "<Descriptions.Item label=\"平台\">PC</Descriptions.Item>",
                        "rowNumber": 20,
                        "text": "平台",
                        "colNumber": 35
                    },
                    {
                        "content": "<Descriptions.Item label=\"调试工具版本\" span={3}>",
                        "rowNumber": 21,
                        "text": "调试工具版本",
                        "colNumber": 35
                    },
                    {
                        "content": "<Descriptions title=\"当前页面信息\" bordered column={2} size=\"small\">",
                        "rowNumber": 27,
                        "text": "当前页面信息",
                        "colNumber": 28
                    },
                    {
                        "content": "<Descriptions.Item label=\"应用ID\">{pageData?.appId}</Descriptions.Item>",
                        "rowNumber": 28,
                        "text": "应用ID",
                        "colNumber": 35
                    },
                    {
                        "content": "<Descriptions.Item label=\"应用名称\">{pageData?.appName}</Descriptions.Item>",
                        "rowNumber": 29,
                        "text": "应用名称",
                        "colNumber": 35
                    },
                    {
                        "content": "pageData?.pageInstDTO?.busiCompId && <Descriptions.Item label=\"业务组件ID\">{pageData?.pageInstDTO?.busiCompId}</Descriptions.Item>",
                        "rowNumber": 31,
                        "text": "业务组件ID",
                        "colNumber": 74
                    },
                    {
                        "content": "!pageData?.pageInstDTO?.busiCompId && <Descriptions.Item label=\"页面ID\">{pageData?.pageId}</Descriptions.Item>",
                        "rowNumber": 34,
                        "text": "页面ID",
                        "colNumber": 75
                    },
                    {
                        "content": "<Descriptions.Item label=\"页面名称\">{pageData?.pageName}</Descriptions.Item>",
                        "rowNumber": 36,
                        "text": "页面名称",
                        "colNumber": 35
                    },
                    {
                        "content": "<Descriptions.Item label=\"页面类型\">{pageData?.pageContainerType}</Descriptions.Item>",
                        "rowNumber": 37,
                        "text": "页面类型",
                        "colNumber": 35
                    },
                    {
                        "content": "<Descriptions.Item label=\"页面路径\">{pageData?.pagePath?.startsWith('/') ? '' : '/'}{pageData?.pagePath}</Descriptions.Item>",
                        "rowNumber": 38,
                        "text": "页面路径",
                        "colNumber": 35
                    },
                    {
                        "content": "<Descriptions.Item label=\"编辑器版本\" span={2}>",
                        "rowNumber": 39,
                        "text": "编辑器版本",
                        "colNumber": 35
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/index.tsx",
                "rows": [
                    {
                        "content": "label: '事件视图',",
                        "rowNumber": 83,
                        "text": "事件视图",
                        "colNumber": 25
                    },
                    {
                        "content": "label: <div>DSL视图{dsledited && <span style={{ color: '#faad14' }}><WarningFilled /></span>}</div>,",
                        "rowNumber": 87,
                        "text": "DSL视图",
                        "colNumber": 30
                    },
                    {
                        "content": "label: '自定义事件',",
                        "rowNumber": 91,
                        "text": "自定义事件",
                        "colNumber": 25
                    },
                    {
                        "content": "<a onClick={() => setDslModalVisible(true)}>导入/导出DSL</a>",
                        "rowNumber": 95,
                        "text": "导入/导出DSL",
                        "colNumber": 56
                    },
                    {
                        "content": "message=\"断点正在中断\"",
                        "rowNumber": 100,
                        "text": "断点正在中断",
                        "colNumber": 20
                    },
                    {
                        "content": ">\n                  跳转到当前断点处\n                </Button>",
                        "rowNumber": 119,
                        "text": "跳转到当前断点处",
                        "colNumber": 17
                    }
                ]
            },
            {
                "fileName": "ModalDSLImExport.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/ModalDSLImExport.tsx",
                "rows": [
                    {
                        "content": "setErrMsg('输入的DSL有误，DSL必须为一个合理的JSON对象，请检查后重试！');",
                        "rowNumber": 26,
                        "text": "输入的DSL有误，DSL必须为一个合理的JSON对象，请检查后重试！",
                        "colNumber": 16
                    },
                    {
                        "content": "message.success('这个页面的DSL已被修改，刷新页面后生效！');",
                        "rowNumber": 35,
                        "text": "这个页面的DSL已被修改，刷新页面后生效！",
                        "colNumber": 22
                    },
                    {
                        "content": "setErrMsg('保存localStorage失败，可能是空间已满，请清空localStorage后重试');",
                        "rowNumber": 39,
                        "text": "保存localStorage失败，可能是空间已满，请清空localStorage后重试",
                        "colNumber": 16
                    },
                    {
                        "content": "<Modal zIndex={1202} visible={visible} onCancel={onCancel} onOk={onOkInput} title=\"导入/导出DSL\">",
                        "rowNumber": 43,
                        "text": "导入/导出DSL",
                        "colNumber": 86
                    },
                    {
                        "content": "message=\"请在下方文本框内复制走/粘贴进你的DSL，点击确定提交成功后，刷新页面生效\"",
                        "rowNumber": 48,
                        "text": "请在下方文本框内复制走/粘贴进你的DSL，点击确定提交成功后，刷新页面生效",
                        "colNumber": 18
                    }
                ]
            },
            {
                "fileName": "useGetEventNameMap.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/EventTree/useGetEventNameMap.ts",
                "rows": [
                    {
                        "content": "map[name] = `点击${e.title}按钮`;",
                        "rowNumber": 33,
                        "text": "点击",
                        "colNumber": 23
                    },
                    {
                        "content": "map[name] = `点击${e.title}按钮`;",
                        "rowNumber": 33,
                        "text": "按钮",
                        "colNumber": 35
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/EventTree/index.tsx",
                "rows": [
                    {
                        "content": "<div>没有事件</div>",
                        "rowNumber": 97,
                        "text": "没有事件",
                        "colNumber": 19
                    }
                ]
            },
            {
                "fileName": "event.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/EventTree/event.ts",
                "rows": [
                    {
                        "content": "label: '页面加载完成',",
                        "rowNumber": 5,
                        "text": "页面加载完成",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '组件状态变化后',",
                        "rowNumber": 9,
                        "text": "组件状态变化后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '页面退出',",
                        "rowNumber": 13,
                        "text": "页面退出",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '页面加载完成',",
                        "rowNumber": 19,
                        "text": "页面加载完成",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '组件状态变化后',",
                        "rowNumber": 23,
                        "text": "组件状态变化后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '页面退出',",
                        "rowNumber": 27,
                        "text": "页面退出",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '接收页面信息',",
                        "rowNumber": 31,
                        "text": "接收页面信息",
                        "colNumber": 13
                    },
                    {
                        "content": "params: [{ title: '接收数据信息', name: 'p', value: '$p$' }],",
                        "rowNumber": 33,
                        "text": "接收数据信息",
                        "colNumber": 24
                    },
                    {
                        "content": "label: '弹窗打开后',",
                        "rowNumber": 39,
                        "text": "弹窗打开后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '弹窗关闭前',",
                        "rowNumber": 43,
                        "text": "弹窗关闭前",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '点击确认',",
                        "rowNumber": 47,
                        "text": "点击确认",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '点击取消',",
                        "rowNumber": 51,
                        "text": "点击取消",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '组件状态变化后',",
                        "rowNumber": 55,
                        "text": "组件状态变化后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '弹窗打开后',",
                        "rowNumber": 61,
                        "text": "弹窗打开后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '组件状态变化后',",
                        "rowNumber": 69,
                        "text": "组件状态变化后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '推拉门打开后',",
                        "rowNumber": 75,
                        "text": "推拉门打开后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '点击确认',",
                        "rowNumber": 79,
                        "text": "点击确认",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '点击取消',",
                        "rowNumber": 83,
                        "text": "点击取消",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '组件状态变化后',",
                        "rowNumber": 87,
                        "text": "组件状态变化后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '推拉门关闭前',",
                        "rowNumber": 91,
                        "text": "推拉门关闭前",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '浮窗加载完成',",
                        "rowNumber": 97,
                        "text": "浮窗加载完成",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '组件状态变化后',",
                        "rowNumber": 101,
                        "text": "组件状态变化后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '浮窗关闭',",
                        "rowNumber": 105,
                        "text": "浮窗关闭",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '组件加载完成',",
                        "rowNumber": 111,
                        "text": "组件加载完成",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '业务组件状态变化后',",
                        "rowNumber": 115,
                        "text": "业务组件状态变化后",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '组件卸载',",
                        "rowNumber": 119,
                        "text": "组件卸载",
                        "colNumber": 13
                    },
                    {
                        "content": "onChange: '值变化时回调',",
                        "rowNumber": 135,
                        "text": "值变化时回调",
                        "colNumber": 12
                    },
                    {
                        "content": "onClick: '点击事件',",
                        "rowNumber": 136,
                        "text": "点击事件",
                        "colNumber": 11
                    },
                    {
                        "content": "onDoubleClick: '双击',",
                        "rowNumber": 137,
                        "text": "双击",
                        "colNumber": 17
                    },
                    {
                        "content": "onBlur: '失去焦点',",
                        "rowNumber": 138,
                        "text": "失去焦点",
                        "colNumber": 10
                    },
                    {
                        "content": "onMouseEnter: '鼠标移入',",
                        "rowNumber": 139,
                        "text": "鼠标移入",
                        "colNumber": 16
                    },
                    {
                        "content": "onPressEnter: '按下回车',",
                        "rowNumber": 140,
                        "text": "按下回车",
                        "colNumber": 16
                    },
                    {
                        "content": "onIconClick: '点击图标',",
                        "rowNumber": 141,
                        "text": "点击图标",
                        "colNumber": 15
                    },
                    {
                        "content": "onRowAdd: '点击行新增',",
                        "rowNumber": 142,
                        "text": "点击行新增",
                        "colNumber": 12
                    },
                    {
                        "content": "onRowClick: '点击行',",
                        "rowNumber": 143,
                        "text": "点击行",
                        "colNumber": 14
                    },
                    {
                        "content": "onRowDoubleClick: '双击行',",
                        "rowNumber": 144,
                        "text": "双击行",
                        "colNumber": 20
                    },
                    {
                        "content": "onRowDetail: '点击行详情',",
                        "rowNumber": 145,
                        "text": "点击行详情",
                        "colNumber": 15
                    },
                    {
                        "content": "onRowEdit: '点击行编辑',",
                        "rowNumber": 146,
                        "text": "点击行编辑",
                        "colNumber": 13
                    },
                    {
                        "content": "onRowDelete: '点击行删除',",
                        "rowNumber": 147,
                        "text": "点击行删除",
                        "colNumber": 15
                    },
                    {
                        "content": "onPageChange: '页码改变回调',",
                        "rowNumber": 148,
                        "text": "页码改变回调",
                        "colNumber": 16
                    },
                    {
                        "content": "onSelect: '选中树节点',",
                        "rowNumber": 149,
                        "text": "选中树节点",
                        "colNumber": 12
                    },
                    {
                        "content": "onExpand: '展开节点',",
                        "rowNumber": 150,
                        "text": "展开节点",
                        "colNumber": 12
                    },
                    {
                        "content": "onCheck: '勾选时回调',",
                        "rowNumber": 151,
                        "text": "勾选时回调",
                        "colNumber": 11
                    },
                    {
                        "content": "onClickBtn1: '点击扩展按钮1',",
                        "rowNumber": 152,
                        "text": "点击扩展按钮1",
                        "colNumber": 15
                    },
                    {
                        "content": "onClickBtn2: '点击扩展按钮2',",
                        "rowNumber": 153,
                        "text": "点击扩展按钮2",
                        "colNumber": 15
                    },
                    {
                        "content": "onClickBtn3: '点击扩展按钮3',",
                        "rowNumber": 154,
                        "text": "点击扩展按钮3",
                        "colNumber": 15
                    },
                    {
                        "content": "onClickBtn4: '点击扩展按钮4',",
                        "rowNumber": 155,
                        "text": "点击扩展按钮4",
                        "colNumber": 15
                    },
                    {
                        "content": "onClickBtn5: '点击扩展按钮5',",
                        "rowNumber": 156,
                        "text": "点击扩展按钮5",
                        "colNumber": 15
                    },
                    {
                        "content": "onNodeAdd: '点击新增图标',",
                        "rowNumber": 157,
                        "text": "点击新增图标",
                        "colNumber": 13
                    },
                    {
                        "content": "onNodeEdit: '点击编辑图标',",
                        "rowNumber": 158,
                        "text": "点击编辑图标",
                        "colNumber": 14
                    },
                    {
                        "content": "onNodeDelete: '点击删除图标',",
                        "rowNumber": 159,
                        "text": "点击删除图标",
                        "colNumber": 16
                    },
                    {
                        "content": "onTreeExpand: '展开',",
                        "rowNumber": 160,
                        "text": "展开",
                        "colNumber": 16
                    },
                    {
                        "content": "onSearch: '搜索',",
                        "rowNumber": 161,
                        "text": "搜索",
                        "colNumber": 12
                    },
                    {
                        "content": "filterOption: '远程数据过滤',",
                        "rowNumber": 162,
                        "text": "远程数据过滤",
                        "colNumber": 16
                    },
                    {
                        "content": "onBeforeInlineEdit: '开始行内编辑行',",
                        "rowNumber": 163,
                        "text": "开始行内编辑行",
                        "colNumber": 22
                    },
                    {
                        "content": "onBeforeInlineSave: '保存行内编辑行',",
                        "rowNumber": 164,
                        "text": "保存行内编辑行",
                        "colNumber": 22
                    },
                    {
                        "content": "onOk: '提交',",
                        "rowNumber": 165,
                        "text": "提交",
                        "colNumber": 8
                    },
                    {
                        "content": "onCancel: '取消',",
                        "rowNumber": 166,
                        "text": "取消",
                        "colNumber": 12
                    },
                    {
                        "content": "onValuesChange: '表单值变化回调',",
                        "rowNumber": 167,
                        "text": "表单值变化回调",
                        "colNumber": 18
                    },
                    {
                        "content": "onSelectChange: '选中行变化回调',",
                        "rowNumber": 168,
                        "text": "选中行变化回调",
                        "colNumber": 18
                    },
                    {
                        "content": "onClose: '关闭时回调',",
                        "rowNumber": 169,
                        "text": "关闭时回调",
                        "colNumber": 11
                    },
                    {
                        "content": "onPreview: '预览时响应',",
                        "rowNumber": 170,
                        "text": "预览时响应",
                        "colNumber": 13
                    },
                    {
                        "content": "onRemove: '移除时响应',",
                        "rowNumber": 171,
                        "text": "移除时响应",
                        "colNumber": 12
                    },
                    {
                        "content": "requestFunc: '执行请求函数',",
                        "rowNumber": 172,
                        "text": "执行请求函数",
                        "colNumber": 15
                    },
                    {
                        "content": "renderRow: '渲染row',",
                        "rowNumber": 173,
                        "text": "渲染row",
                        "colNumber": 13
                    },
                    {
                        "content": "onRefreshFunc: '下拉刷新',",
                        "rowNumber": 174,
                        "text": "下拉刷新",
                        "colNumber": 17
                    },
                    {
                        "content": "onLoadMoreFunc: '加载更多',",
                        "rowNumber": 175,
                        "text": "加载更多",
                        "colNumber": 18
                    },
                    {
                        "content": "onFinishFailed: '表单提交失败',",
                        "rowNumber": 176,
                        "text": "表单提交失败",
                        "colNumber": 18
                    },
                    {
                        "content": "onFinish: '表单提交完成',",
                        "rowNumber": 177,
                        "text": "表单提交完成",
                        "colNumber": 12
                    },
                    {
                        "content": "onLoad: '页面加载完成',",
                        "rowNumber": 178,
                        "text": "页面加载完成",
                        "colNumber": 10
                    },
                    {
                        "content": "onError: '页面加载失败',",
                        "rowNumber": 179,
                        "text": "页面加载失败",
                        "colNumber": 11
                    },
                    {
                        "content": "onUnload: '页面卸载完成',",
                        "rowNumber": 180,
                        "text": "页面卸载完成",
                        "colNumber": 12
                    },
                    {
                        "content": "onMessage: '接收到消息',",
                        "rowNumber": 181,
                        "text": "接收到消息",
                        "colNumber": 13
                    },
                    {
                        "content": "onSubmit: '提交时回调',",
                        "rowNumber": 182,
                        "text": "提交时回调",
                        "colNumber": 12
                    },
                    {
                        "content": "onFocus: '聚集焦点',",
                        "rowNumber": 183,
                        "text": "聚集焦点",
                        "colNumber": 11
                    },
                    {
                        "content": "onClear: '清除时回调',",
                        "rowNumber": 184,
                        "text": "清除时回调",
                        "colNumber": 11
                    },
                    {
                        "content": "onItemClick: '子项点击事件',",
                        "rowNumber": 185,
                        "text": "子项点击事件",
                        "colNumber": 15
                    },
                    {
                        "content": "onGanttItemTitleClick: '点击项目标题',",
                        "rowNumber": 186,
                        "text": "点击项目标题",
                        "colNumber": 25
                    },
                    {
                        "content": "onGanttItemEditClick: '点击项目编辑按钮',",
                        "rowNumber": 187,
                        "text": "点击项目编辑按钮",
                        "colNumber": 24
                    },
                    {
                        "content": "onGanttItemDetailClick: '点击项目详情按钮',",
                        "rowNumber": 188,
                        "text": "点击项目详情按钮",
                        "colNumber": 26
                    },
                    {
                        "content": "onFinishUpload: '文件上传完成回调',",
                        "rowNumber": 189,
                        "text": "文件上传完成回调",
                        "colNumber": 18
                    },
                    {
                        "content": "onFileRemove: '删除列表文件回调',",
                        "rowNumber": 190,
                        "text": "删除列表文件回调",
                        "colNumber": 16
                    },
                    {
                        "content": "onFileListChange: '文件列表变化时回调',",
                        "rowNumber": 191,
                        "text": "文件列表变化时回调",
                        "colNumber": 20
                    },
                    {
                        "content": "onListenUploading: '监听文件上传',",
                        "rowNumber": 192,
                        "text": "监听文件上传",
                        "colNumber": 21
                    },
                    {
                        "content": "onScroll: '列表滚动时回调',",
                        "rowNumber": 193,
                        "text": "列表滚动时回调",
                        "colNumber": 12
                    },
                    {
                        "content": "onSortChange: '表格排序事件',",
                        "rowNumber": 194,
                        "text": "表格排序事件",
                        "colNumber": 16
                    },
                    {
                        "content": "onClickAddBtn: '点击新增按钮',",
                        "rowNumber": 195,
                        "text": "点击新增按钮",
                        "colNumber": 17
                    },
                    {
                        "content": "{ title: '行id', name: 'rowId', value: '$rowId$' },",
                        "rowNumber": 205,
                        "text": "行id",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '行对象', name: 'row', value: '$row$' },",
                        "rowNumber": 206,
                        "text": "行对象",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '行索引', name: 'index', value: '$index$' },",
                        "rowNumber": 207,
                        "text": "行索引",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '节点key', name: 'key', value: '$key$' },",
                        "rowNumber": 210,
                        "text": "节点key",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '节点数据', name: 'nodeData', value: '$nodeData$', attrType: 'object' },",
                        "rowNumber": 211,
                        "text": "节点数据",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '表格选中行id(单选)', name: 'selectedRowKeys', value: '$selectedRowKeys[0]$' },",
                        "rowNumber": 214,
                        "text": "表格选中行id(单选)",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '表格选中行id(多选)', name: 'selectedRowKeys', value: '$selectedRowKeys$' },",
                        "rowNumber": 215,
                        "text": "表格选中行id(多选)",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '表格选中行数据(单选)', name: 'selectedRows', value: '$selectedRows[0]$' },",
                        "rowNumber": 216,
                        "text": "表格选中行数据(单选)",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '表格选中行数据(多选)', name: 'selectedRows', value: '$selectedRows$' },",
                        "rowNumber": 217,
                        "text": "表格选中行数据(多选)",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '项目对象', name: 'plan', value: '$plan$' },",
                        "rowNumber": 220,
                        "text": "项目对象",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '项目计划id', name: 'planId', value: '$planId$' },",
                        "rowNumber": 221,
                        "text": "项目计划id",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '项目计划名称', name: 'planName', value: '$planName$' },",
                        "rowNumber": 222,
                        "text": "项目计划名称",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '项目计划索引', name: 'index', value: '$index$' },",
                        "rowNumber": 223,
                        "text": "项目计划索引",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '项目计划开始时间', name: 'planStart', value: '$planStart$' },",
                        "rowNumber": 224,
                        "text": "项目计划开始时间",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '项目计划子任务列表', name: 'planChildren', value: '$planChildren$' },",
                        "rowNumber": 225,
                        "text": "项目计划子任务列表",
                        "colNumber": 11
                    },
                    {
                        "content": "'Input.onChange': [{ title: '输入框取值', name: 'e', value: '$e.target.value$' }],",
                        "rowNumber": 230,
                        "text": "输入框取值",
                        "colNumber": 30
                    },
                    {
                        "content": "'Input.onBlur': [{ title: '输入框取值', name: 'e', value: '$e.target.value$' }],",
                        "rowNumber": 231,
                        "text": "输入框取值",
                        "colNumber": 28
                    },
                    {
                        "content": "'Input.onPressEnter': [{ title: '输入框取值', name: 'e', value: '$e.target.value$' }],",
                        "rowNumber": 232,
                        "text": "输入框取值",
                        "colNumber": 34
                    },
                    {
                        "content": "'Radio.onChange': [{ title: '单选组取值', name: 'e', value: '$e.target.value$' }],",
                        "rowNumber": 233,
                        "text": "单选组取值",
                        "colNumber": 30
                    },
                    {
                        "content": "'CheckboxGroup.onChange': [{ title: '复选组取值', name: 'value', value: '$value$' }],",
                        "rowNumber": 234,
                        "text": "复选组取值",
                        "colNumber": 38
                    },
                    {
                        "content": "'Checkbox.onChange': [{ title: '复选框取值', name: 'e', value: '$e.target.checked$' }],",
                        "rowNumber": 235,
                        "text": "复选框取值",
                        "colNumber": 33
                    },
                    {
                        "content": "'InputNumber.onChange': [{ title: '输入框取值', name: 'e', value: '$e$' }],",
                        "rowNumber": 236,
                        "text": "输入框取值",
                        "colNumber": 36
                    },
                    {
                        "content": "'TextArea.onChange': [{ title: '文本域取值', name: 'e', value: '$e.target.value$' }],",
                        "rowNumber": 237,
                        "text": "文本域取值",
                        "colNumber": 33
                    },
                    {
                        "content": "'Select.onChange': [{ title: '下拉框取值', name: 'e', value: '$e$' }],",
                        "rowNumber": 238,
                        "text": "下拉框取值",
                        "colNumber": 31
                    },
                    {
                        "content": "'Select.filterOption': [{ title: '下拉框过滤条件', name: 'e', value: '$e$' }],",
                        "rowNumber": 239,
                        "text": "下拉框过滤条件",
                        "colNumber": 35
                    },
                    {
                        "content": "'MultipleSelect.onChange': [{ title: '下拉框取值', name: 'e', value: '$e$' }],",
                        "rowNumber": 240,
                        "text": "下拉框取值",
                        "colNumber": 39
                    },
                    {
                        "content": "'MultipleSelect.filterOption': [{ title: '下拉框过滤条件', name: 'e', value: '$e$' }],",
                        "rowNumber": 241,
                        "text": "下拉框过滤条件",
                        "colNumber": 43
                    },
                    {
                        "content": "'Switch.onChange': [{ title: '开关取值', name: 'e', value: '$e$' }],",
                        "rowNumber": 242,
                        "text": "开关取值",
                        "colNumber": 31
                    },
                    {
                        "content": "'Button.onClick': [{ title: '事件对象', name: 'e', value: '$e$' }],",
                        "rowNumber": 243,
                        "text": "事件对象",
                        "colNumber": 30
                    },
                    {
                        "content": "'DatePicker.onChange': [{ title: '日期选择框取值', name: 'e', value: '$e$' }],",
                        "rowNumber": 244,
                        "text": "日期选择框取值",
                        "colNumber": 35
                    },
                    {
                        "content": "'TimePicker.onChange': [{ title: '时间选择框取值', name: 'e', value: '$e$' }],",
                        "rowNumber": 245,
                        "text": "时间选择框取值",
                        "colNumber": 35
                    },
                    {
                        "content": "'RangePicker.onChange': [{ title: '时间段选择框取值', name: 'e', value: '$e$' }],",
                        "rowNumber": 246,
                        "text": "时间段选择框取值",
                        "colNumber": 36
                    },
                    {
                        "content": "'Button.onDoubleClick': [{ title: '事件对象', name: 'e', value: '$e$' }],",
                        "rowNumber": 247,
                        "text": "事件对象",
                        "colNumber": 36
                    },
                    {
                        "content": "'Button.onMouseEnter': [{ title: '事件对象', name: 'e', value: '$e$' }],",
                        "rowNumber": 248,
                        "text": "事件对象",
                        "colNumber": 35
                    },
                    {
                        "content": "{ title: '正序字段', name: 'ascendCol', value: TABLE_SORT_ASC_PARAM_VALUE },",
                        "rowNumber": 257,
                        "text": "正序字段",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '倒序字段', name: 'descendCol', value: TABLE_SORT_DESC_PARAM_VALUE },",
                        "rowNumber": 258,
                        "text": "倒序字段",
                        "colNumber": 13
                    },
                    {
                        "content": "'Table.onBeforeInlineEdit': [{ title: '当前编辑行数据', name: 'e', value: '$e$' }],",
                        "rowNumber": 265,
                        "text": "当前编辑行数据",
                        "colNumber": 40
                    },
                    {
                        "content": "{ title: '当前保存行数据', name: 'e', value: '$e$' },",
                        "rowNumber": 268,
                        "text": "当前保存行数据",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '当前保存行id', name: 'rowId', value: '$rowId$' },",
                        "rowNumber": 269,
                        "text": "当前保存行id",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '当前保存行索引', name: 'index', value: '$index$' },",
                        "rowNumber": 270,
                        "text": "当前保存行索引",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '当前页码取值', name: 'page', value: '$page$' },",
                        "rowNumber": 273,
                        "text": "当前页码取值",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '当前页尺寸', name: 'pageSize', value: '$pageSize$' },",
                        "rowNumber": 274,
                        "text": "当前页尺寸",
                        "colNumber": 13
                    },
                    {
                        "content": "'Collapse.onChange': [{ title: '切换面板key', name: 'key', value: '$key$' }],",
                        "rowNumber": 279,
                        "text": "切换面板key",
                        "colNumber": 33
                    },
                    {
                        "content": "'Tabs.onChange': [{ title: '切换面板key', name: 'activeKey', value: '$activeKey$' }],",
                        "rowNumber": 280,
                        "text": "切换面板key",
                        "colNumber": 29
                    },
                    {
                        "content": "'Tree.onCheck': [{ title: '复选框取值', name: 'checkedKeys', value: '$checkedKeys$' }],",
                        "rowNumber": 281,
                        "text": "复选框取值",
                        "colNumber": 28
                    },
                    {
                        "content": "{ title: '节点key(单选)', name: 'selectedKeys', value: '$selectedKeys[0]$' },",
                        "rowNumber": 283,
                        "text": "节点key(单选)",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '节点keys(多选)', name: 'selectedKeys', value: '$selectedKeys$' },",
                        "rowNumber": 284,
                        "text": "节点keys(多选)",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '节点数据', name: '{ node }', value: '$node.props.data$', attrType: 'object' },",
                        "rowNumber": 285,
                        "text": "节点数据",
                        "colNumber": 13
                    },
                    {
                        "content": "'Tree.onExpand': [{ title: '树节点keys', name: 'expandedKeys', value: '$expandedKeys$' }],",
                        "rowNumber": 287,
                        "text": "树节点keys",
                        "colNumber": 29
                    },
                    {
                        "content": "'Alert.onClose': [{ title: '事件对象', name: 'e', value: '$e$' }],",
                        "rowNumber": 291,
                        "text": "事件对象",
                        "colNumber": 29
                    },
                    {
                        "content": "'Tag.onClose': [{ title: '事件对象', name: 'e', value: '$e$' }],",
                        "rowNumber": 292,
                        "text": "事件对象",
                        "colNumber": 27
                    },
                    {
                        "content": "{ title: '节点key', name: 'value', value: '$value$' },",
                        "rowNumber": 296,
                        "text": "节点key",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '节点数据', name: 'node', value: '$node.props.data$', attrType: 'object' },",
                        "rowNumber": 297,
                        "text": "节点数据",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '节点key', name: 'value', value: '$value$' },",
                        "rowNumber": 300,
                        "text": "节点key",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '节点名称', name: 'label', value: '$label$' },",
                        "rowNumber": 301,
                        "text": "节点名称",
                        "colNumber": 13
                    },
                    {
                        "content": "title: '节点数据',",
                        "rowNumber": 303,
                        "text": "节点数据",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '选中值获取', name: 'value', value: '$value$' },",
                        "rowNumber": 310,
                        "text": "选中值获取",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '选中节点获取', name: 'selectedOptions', value: '$selectedOptions$' },",
                        "rowNumber": 311,
                        "text": "选中节点获取",
                        "colNumber": 13
                    },
                    {
                        "content": "'Cascader.onPopupVisibleChange': [{ title: '显示/隐藏浮层', name: 'value', value: '$value$' }],",
                        "rowNumber": 313,
                        "text": "显示/隐藏浮层",
                        "colNumber": 45
                    },
                    {
                        "content": "'Dropdown.onVisibleChange': [{ title: '隐藏/显示状态获取', name: 'visible', value: '$visible$' }],",
                        "rowNumber": 314,
                        "text": "隐藏/显示状态获取",
                        "colNumber": 40
                    },
                    {
                        "content": "{ title: '节点key', name: 'key', value: '$key$' },",
                        "rowNumber": 316,
                        "text": "节点key",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '节点数据', name: 'node', value: '$node.data$', attrType: 'object' },",
                        "rowNumber": 317,
                        "text": "节点数据",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件对象', name: 'file', value: '$file$' },",
                        "rowNumber": 320,
                        "text": "文件对象",
                        "colNumber": 13
                    },
                    {
                        "content": "'Upload.onFinishUpload': [{ title: '文件对象', name: 'file', value: '$file$' }],",
                        "rowNumber": 323,
                        "text": "文件对象",
                        "colNumber": 37
                    },
                    {
                        "content": "{ title: '文件对象', name: 'file', value: '$file$' },",
                        "rowNumber": 325,
                        "text": "文件对象",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件列表', name: 'fileList', value: '$fileList$' },",
                        "rowNumber": 326,
                        "text": "文件列表",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件ID', name: 'fileId', value: '$file?.response?.resultObject?.fileId$' },",
                        "rowNumber": 327,
                        "text": "文件ID",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件大小', name: 'fileSize', value: '$file?.size$' },",
                        "rowNumber": 328,
                        "text": "文件大小",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件名称', name: 'fileName', value: '$file?.name$' },",
                        "rowNumber": 329,
                        "text": "文件名称",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '响应信息', name: 'fileResponse', value: '$file?.response$' },",
                        "rowNumber": 330,
                        "text": "响应信息",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件对象', name: 'file', value: '$file$' },",
                        "rowNumber": 333,
                        "text": "文件对象",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件列表', name: 'fileList', value: '$fileList$' },",
                        "rowNumber": 334,
                        "text": "文件列表",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件ID', name: 'fileId', value: '$file?.response?.resultObject?.fileId$' },",
                        "rowNumber": 335,
                        "text": "文件ID",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件大小', name: 'fileSize', value: '$file?.size$' },",
                        "rowNumber": 336,
                        "text": "文件大小",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件名称', name: 'fileName', value: '$file?.name$' },",
                        "rowNumber": 337,
                        "text": "文件名称",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '响应信息', name: 'fileResponse', value: '$file?.response$' },",
                        "rowNumber": 338,
                        "text": "响应信息",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件对象', name: 'file', value: '$file$' },",
                        "rowNumber": 341,
                        "text": "文件对象",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件列表', name: 'fileList', value: '$fileList$' },",
                        "rowNumber": 342,
                        "text": "文件列表",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件ID', name: 'fileId', value: '$file?.response?.resultObject?.fileId$' },",
                        "rowNumber": 343,
                        "text": "文件ID",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件大小', name: 'fileSize', value: '$file?.size$' },",
                        "rowNumber": 344,
                        "text": "文件大小",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件名称', name: 'fileName', value: '$file?.name$' },",
                        "rowNumber": 345,
                        "text": "文件名称",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '响应信息', name: 'fileResponse', value: '$file?.response$' },",
                        "rowNumber": 346,
                        "text": "响应信息",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件列表', name: 'fileList', value: '$fileList$' },",
                        "rowNumber": 350,
                        "text": "文件列表",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件对象', name: 'file', value: '$file$' },",
                        "rowNumber": 353,
                        "text": "文件对象",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件列表', name: 'fileList', value: '$fileList$' },",
                        "rowNumber": 354,
                        "text": "文件列表",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件对象', name: 'file', value: '$file$' },",
                        "rowNumber": 357,
                        "text": "文件对象",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '文件列表', name: 'fileList', value: '$fileList$' },",
                        "rowNumber": 358,
                        "text": "文件列表",
                        "colNumber": 13
                    },
                    {
                        "content": "'Upload.onPreview': [{ title: '文件对象取值', name: 'file', value: '$file$' }],",
                        "rowNumber": 360,
                        "text": "文件对象取值",
                        "colNumber": 32
                    },
                    {
                        "content": "'StdUpload.onPreview': [{ title: '文件对象取值', name: 'file', value: '$file$' }],",
                        "rowNumber": 361,
                        "text": "文件对象取值",
                        "colNumber": 35
                    },
                    {
                        "content": "'Upload.onRemove': [{ title: '文件对象取值', name: 'file', value: '$file$' }],",
                        "rowNumber": 362,
                        "text": "文件对象取值",
                        "colNumber": 31
                    },
                    {
                        "content": "'StdUpload.onRemove': [{ title: '文件对象取值', name: 'file', value: '$file$' }],",
                        "rowNumber": 363,
                        "text": "文件对象取值",
                        "colNumber": 34
                    },
                    {
                        "content": "{ title: '穿梭框方向', name: 'direction', value: '$direction$' },",
                        "rowNumber": 365,
                        "text": "穿梭框方向",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '搜索框取值', name: 'value', value: '$value$' },",
                        "rowNumber": 366,
                        "text": "搜索框取值",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '目标keys', name: 'targetKeys', value: '$targetKeys$' },",
                        "rowNumber": 369,
                        "text": "目标keys",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '穿梭框方向', name: 'direction', value: '$direction$' },",
                        "rowNumber": 370,
                        "text": "穿梭框方向",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '移动keys', name: 'moveKeys', value: '$moveKeys$' },",
                        "rowNumber": 371,
                        "text": "移动keys",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '穿梭框方向', name: 'direction', value: '$direction$' },",
                        "rowNumber": 374,
                        "text": "穿梭框方向",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '事件对象', name: 'event', value: '$event$' },",
                        "rowNumber": 375,
                        "text": "事件对象",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '源头keys', name: 'sourceSelectedKeys', value: '$sourceSelectedKeys$' },",
                        "rowNumber": 378,
                        "text": "源头keys",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '目标值keys', name: 'targetSelectedKeys', value: '$targetSelectedKeys$' },",
                        "rowNumber": 379,
                        "text": "目标值keys",
                        "colNumber": 13
                    },
                    {
                        "content": "'QuillEditor.onChange': [{ title: '富文本框取值', name: 'value', value: '$value$' }],",
                        "rowNumber": 381,
                        "text": "富文本框取值",
                        "colNumber": 36
                    },
                    {
                        "content": "'Panel.onClickBtn1': [{ title: '按钮1点击回调', name: 'e', value: '$e$' }],",
                        "rowNumber": 382,
                        "text": "按钮1点击回调",
                        "colNumber": 33
                    },
                    {
                        "content": "'Panel.onClickBtn2': [{ title: '按钮2点击回调', name: 'e', value: '$e$' }],",
                        "rowNumber": 383,
                        "text": "按钮2点击回调",
                        "colNumber": 33
                    },
                    {
                        "content": "'Panel.onClickBtn3': [{ title: '按钮3点击回调', name: 'e', value: '$e$' }],",
                        "rowNumber": 384,
                        "text": "按钮3点击回调",
                        "colNumber": 33
                    },
                    {
                        "content": "'Card.onClickBtn1': [{ title: '按钮1点击回调', name: 'e', value: '$e$' }],",
                        "rowNumber": 385,
                        "text": "按钮1点击回调",
                        "colNumber": 32
                    },
                    {
                        "content": "'Card.onClickBtn2': [{ title: '按钮2点击回调', name: 'e', value: '$e$' }],",
                        "rowNumber": 386,
                        "text": "按钮2点击回调",
                        "colNumber": 32
                    },
                    {
                        "content": "'Card.onClickBtn3': [{ title: '按钮3点击回调', name: 'e', value: '$e$' }],",
                        "rowNumber": 387,
                        "text": "按钮3点击回调",
                        "colNumber": 32
                    },
                    {
                        "content": "{ title: '表单变化值', name: 'changedValues', value: '$changedValues$' },",
                        "rowNumber": 389,
                        "text": "表单变化值",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '表单所有值', name: 'allValues', value: '$allValues$' },",
                        "rowNumber": 390,
                        "text": "表单所有值",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '表单当前改变字段编码', name: 'changedFieldName', value: '$changedFieldName$' },",
                        "rowNumber": 395,
                        "text": "表单当前改变字段编码",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '表单当前改变字段值', name: 'changedValue', value: '$changedValue$' },",
                        "rowNumber": 396,
                        "text": "表单当前改变字段值",
                        "colNumber": 13
                    },
                    {
                        "content": "'Rate.onChange': [{ title: '评分变化值', name: 'changedValue', value: '$changedValue$' }],",
                        "rowNumber": 398,
                        "text": "评分变化值",
                        "colNumber": 29
                    },
                    {
                        "content": "{ title: '当前步骤', name: 'current', value: '$current$' },",
                        "rowNumber": 400,
                        "text": "当前步骤",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '当前步骤对象', name: 'stepObj', value: '$stepObj$' },",
                        "rowNumber": 401,
                        "text": "当前步骤对象",
                        "colNumber": 13
                    },
                    {
                        "content": "'ModalSelect.onChange': [{ title: '弹框选择取值', name: 'e', value: '$e$' }],",
                        "rowNumber": 403,
                        "text": "弹框选择取值",
                        "colNumber": 36
                    }
                ]
            },
            {
                "fileName": "const.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/EventTree/const.ts",
                "rows": [
                    {
                        "content": "action: '动作',",
                        "rowNumber": 2,
                        "text": "动作",
                        "colNumber": 10
                    },
                    {
                        "content": "condition: '条件',",
                        "rowNumber": 4,
                        "text": "条件",
                        "colNumber": 13
                    },
                    {
                        "content": "event: '事件',",
                        "rowNumber": 5,
                        "text": "事件",
                        "colNumber": 9
                    },
                    {
                        "content": "callback1: '成功后执行',",
                        "rowNumber": 32,
                        "text": "成功后执行",
                        "colNumber": 15
                    },
                    {
                        "content": "callback2: '失败后执行',",
                        "rowNumber": 33,
                        "text": "失败后执行",
                        "colNumber": 15
                    },
                    {
                        "content": "callback3: '总会执行',",
                        "rowNumber": 34,
                        "text": "总会执行",
                        "colNumber": 15
                    },
                    {
                        "content": "callback1: '点击确认执行',",
                        "rowNumber": 39,
                        "text": "点击确认执行",
                        "colNumber": 17
                    },
                    {
                        "content": "callback2: '点击取消执行',",
                        "rowNumber": 40,
                        "text": "点击取消执行",
                        "colNumber": 17
                    },
                    {
                        "content": "callback1: '打开后执行',",
                        "rowNumber": 44,
                        "text": "打开后执行",
                        "colNumber": 19
                    },
                    {
                        "content": "callback2: '关闭时执行',",
                        "rowNumber": 45,
                        "text": "关闭时执行",
                        "colNumber": 19
                    },
                    {
                        "content": "callback1: '在钉钉App内执行',",
                        "rowNumber": 50,
                        "text": "在钉钉App内执行",
                        "colNumber": 17
                    },
                    {
                        "content": "callback2: '不在钉钉App内执行',",
                        "rowNumber": 51,
                        "text": "不在钉钉App内执行",
                        "colNumber": 17
                    },
                    {
                        "content": "{ title: '弹窗确认回调参数', name: `okData_${id}`, value: `$okData_${id}$` },",
                        "rowNumber": 67,
                        "text": "弹窗确认回调参数",
                        "colNumber": 13
                    },
                    {
                        "content": "{ title: '推拉门确认回调参数', name: `okData_${id}`, value: `$okData_${id}$` },",
                        "rowNumber": 70,
                        "text": "推拉门确认回调参数",
                        "colNumber": 13
                    },
                    {
                        "content": "label: '等于',",
                        "rowNumber": 77,
                        "text": "等于",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '不等于',",
                        "rowNumber": 81,
                        "text": "不等于",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '大于',",
                        "rowNumber": 85,
                        "text": "大于",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '小于',",
                        "rowNumber": 89,
                        "text": "小于",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '大于等于',",
                        "rowNumber": 93,
                        "text": "大于等于",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '小于等于',",
                        "rowNumber": 97,
                        "text": "小于等于",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '为真',",
                        "rowNumber": 101,
                        "text": "为真",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '为假',",
                        "rowNumber": 105,
                        "text": "为假",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '为空',",
                        "rowNumber": 109,
                        "text": "为空",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '不为空',",
                        "rowNumber": 113,
                        "text": "不为空",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '包含',",
                        "rowNumber": 117,
                        "text": "包含",
                        "colNumber": 11
                    },
                    {
                        "content": "label: '不包含',",
                        "rowNumber": 121,
                        "text": "不包含",
                        "colNumber": 11
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/EventTree/ItemWrap/index.tsx",
                "rows": [
                    {
                        "content": "action: '动作',",
                        "rowNumber": 14,
                        "text": "动作",
                        "colNumber": 10
                    },
                    {
                        "content": "event: '事件',",
                        "rowNumber": 15,
                        "text": "事件",
                        "colNumber": 9
                    },
                    {
                        "content": "condition: '如果',",
                        "rowNumber": 16,
                        "text": "如果",
                        "colNumber": 13
                    },
                    {
                        "content": "elseIf: '否则',",
                        "rowNumber": 17,
                        "text": "否则",
                        "colNumber": 10
                    },
                    {
                        "content": "callback: '回调',",
                        "rowNumber": 18,
                        "text": "回调",
                        "colNumber": 12
                    },
                    {
                        "content": "subevent: '子事件',",
                        "rowNumber": 19,
                        "text": "子事件",
                        "colNumber": 12
                    },
                    {
                        "content": "<Tooltip title={shielded ? '取消屏蔽' : '屏蔽'} overlayClassName=\"tip\" placement=\"top\">",
                        "rowNumber": 42,
                        "text": "取消屏蔽",
                        "colNumber": 33
                    },
                    {
                        "content": "<Tooltip title={shielded ? '取消屏蔽' : '屏蔽'} overlayClassName=\"tip\" placement=\"top\">",
                        "rowNumber": 42,
                        "text": "屏蔽",
                        "colNumber": 42
                    },
                    {
                        "content": "message.warn('当前节点不允许屏蔽');",
                        "rowNumber": 49,
                        "text": "当前节点不允许屏蔽",
                        "colNumber": 27
                    },
                    {
                        "content": "<i>{typeMap[dataName] || '未知'}</i>",
                        "rowNumber": 68,
                        "text": "未知",
                        "colNumber": 33
                    },
                    {
                        "content": "return showTooltips ? <Tooltip title=\"条件判断\">{child}</Tooltip> : child;",
                        "rowNumber": 71,
                        "text": "条件判断",
                        "colNumber": 41
                    },
                    {
                        "content": "title={data.remark ? data.remark : '备注'}",
                        "rowNumber": 94,
                        "text": "备注",
                        "colNumber": 47
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/EventTree/EventGroup/index.tsx",
                "rows": [
                    {
                        "content": "<Select size=\"small\" placeholder=\"对象\" dropdownClassName=\"dropdown\" />",
                        "rowNumber": 212,
                        "text": "对象",
                        "colNumber": 49
                    },
                    {
                        "content": "<Select size=\"small\" placeholder=\"动作\" dropdownClassName=\"dropdown\" />",
                        "rowNumber": 215,
                        "text": "动作",
                        "colNumber": 49
                    },
                    {
                        "content": ">\n        该指令有报错！查看日志\n      </Button>",
                        "rowNumber": 238,
                        "text": "该指令有报错！查看日志",
                        "colNumber": 7
                    },
                    {
                        "content": "<Menu.Item onClick={() => addNormalBreak(thisCMDId, isDebug)}>添加/删除断点</Menu.Item>",
                        "rowNumber": 261,
                        "text": "添加/删除断点",
                        "colNumber": 70
                    },
                    {
                        "content": "<div className={`${debuggerCls}-exprwatch-tit`}>添加条件表达式</div>",
                        "rowNumber": 271,
                        "text": "添加条件表达式",
                        "colNumber": 68
                    },
                    {
                        "content": "placeholder=\"请输入表达式，不需要$$包裹\"",
                        "rowNumber": 277,
                        "text": "请输入表达式，不需要$$包裹",
                        "colNumber": 34
                    },
                    {
                        "content": "<Button size=\"small\" type=\"primary\" onClick={() => addConditionBreak(thisCMDId, isDebug)}>\n                      确定\n                    </Button>",
                        "rowNumber": 279,
                        "text": "确定",
                        "colNumber": 110
                    },
                    {
                        "content": ">\n              添加条件断点\n            </Popover>",
                        "rowNumber": 285,
                        "text": "添加条件断点",
                        "colNumber": 13
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/EventTree/ConditionItem/index.tsx",
                "rows": [
                    {
                        "content": "const desc = data?.desc || '该条件没有配置说明';",
                        "rowNumber": 16,
                        "text": "该条件没有配置说明",
                        "colNumber": 29
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/EventTree/ActionItem/index.tsx",
                "rows": [
                    {
                        "content": "return res?.props?.name || res?.label || hasPrefix || '[未选择]';",
                        "rowNumber": 55,
                        "text": "[未选择]",
                        "colNumber": 58
                    },
                    {
                        "content": "return '[未选择]';",
                        "rowNumber": 65,
                        "text": "[未选择]",
                        "colNumber": 13
                    },
                    {
                        "content": "return '显示';",
                        "rowNumber": 73,
                        "text": "显示",
                        "colNumber": 15
                    },
                    {
                        "content": "return '切换';",
                        "rowNumber": 75,
                        "text": "切换",
                        "colNumber": 15
                    },
                    {
                        "content": "return '隐藏';",
                        "rowNumber": 77,
                        "text": "隐藏",
                        "colNumber": 15
                    },
                    {
                        "content": "return '启动';",
                        "rowNumber": 84,
                        "text": "启动",
                        "colNumber": 15
                    },
                    {
                        "content": "return '通过';",
                        "rowNumber": 86,
                        "text": "通过",
                        "colNumber": 15
                    },
                    {
                        "content": "return '拒绝';",
                        "rowNumber": 88,
                        "text": "拒绝",
                        "colNumber": 15
                    },
                    {
                        "content": "return '转派';",
                        "rowNumber": 90,
                        "text": "转派",
                        "colNumber": 15
                    },
                    {
                        "content": "return '通用';",
                        "rowNumber": 92,
                        "text": "通用",
                        "colNumber": 15
                    },
                    {
                        "content": "return '[未设置]';",
                        "rowNumber": 94,
                        "text": "[未设置]",
                        "colNumber": 15
                    },
                    {
                        "content": "return '成功';",
                        "rowNumber": 101,
                        "text": "成功",
                        "colNumber": 15
                    },
                    {
                        "content": "return '提示';",
                        "rowNumber": 103,
                        "text": "提示",
                        "colNumber": 15
                    },
                    {
                        "content": "return '错误';",
                        "rowNumber": 105,
                        "text": "错误",
                        "colNumber": 15
                    },
                    {
                        "content": "return '警告';",
                        "rowNumber": 107,
                        "text": "警告",
                        "colNumber": 15
                    },
                    {
                        "content": "return '正常';",
                        "rowNumber": 109,
                        "text": "正常",
                        "colNumber": 15
                    },
                    {
                        "content": "return '[未设置]';",
                        "rowNumber": 111,
                        "text": "[未设置]",
                        "colNumber": 15
                    },
                    {
                        "content": "return '是';",
                        "rowNumber": 157,
                        "text": "是",
                        "colNumber": 17
                    },
                    {
                        "content": "return '否';",
                        "rowNumber": 159,
                        "text": "否",
                        "colNumber": 17
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/PageElementView/CompTree/index.tsx",
                "rows": [
                    {
                        "content": "placeholder=\"对象名称\"",
                        "rowNumber": 300,
                        "text": "对象名称",
                        "colNumber": 24
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/NetworkView/index.tsx",
                "rows": [
                    {
                        "content": "success: '请求成功',",
                        "rowNumber": 18,
                        "text": "请求成功",
                        "colNumber": 11
                    },
                    {
                        "content": "error: '请求失败',",
                        "rowNumber": 19,
                        "text": "请求失败",
                        "colNumber": 9
                    },
                    {
                        "content": "title: '请求地址',",
                        "rowNumber": 39,
                        "text": "请求地址",
                        "colNumber": 13
                    },
                    {
                        "content": "{row.cmd && <Tag color=\"#108ee9\">由指令触发</Tag>}",
                        "rowNumber": 46,
                        "text": "由指令触发",
                        "colNumber": 43
                    },
                    {
                        "content": "{row.startDate && `${moment(row.startDate).format('YYYY-MM-DD HH:mm:ss')}发起`}",
                        "rowNumber": 48,
                        "text": "发起",
                        "colNumber": 85
                    },
                    {
                        "content": "title: '状态',",
                        "rowNumber": 54,
                        "text": "状态",
                        "colNumber": 13
                    },
                    {
                        "content": "return <Badge status=\"processing\" text=\"请求中……\" />;",
                        "rowNumber": 59,
                        "text": "请求中……",
                        "colNumber": 49
                    },
                    {
                        "content": "return <Badge status=\"warning\" text=\"网络请求成功，但业务可能失败\" />;",
                        "rowNumber": 62,
                        "text": "网络请求成功，但业务可能失败",
                        "colNumber": 46
                    },
                    {
                        "content": "title: '操作',",
                        "rowNumber": 68,
                        "text": "操作",
                        "colNumber": 13
                    },
                    {
                        "content": "{record.cmd && <a onClick={(e) => { e.stopPropagation(); findTargetCMD(record); }}>跳转到对应指令</a>}",
                        "rowNumber": 72,
                        "text": "跳转到对应指令",
                        "colNumber": 93
                    },
                    {
                        "content": "<a onClick={(e) => { e.stopPropagation();setNowSelected(record);setModelVisible(true); }}>重复执行该请求</a>",
                        "rowNumber": 73,
                        "text": "重复执行该请求",
                        "colNumber": 100
                    },
                    {
                        "content": "<Alert type=\"info\" message=\"此处仅记录通过服务请求工具类触发的业务请求\" showIcon />",
                        "rowNumber": 125,
                        "text": "此处仅记录通过服务请求工具类触发的业务请求",
                        "colNumber": 33
                    },
                    {
                        "content": ">清空日志\n        </a>",
                        "rowNumber": 130,
                        "text": "清空日志",
                        "colNumber": 9
                    },
                    {
                        "content": "placeholder=\"输入url过滤\"",
                        "rowNumber": 136,
                        "text": "输入url过滤",
                        "colNumber": 22
                    }
                ]
            },
            {
                "fileName": "ModalResend.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/NetworkView/ModalResend.tsx",
                "rows": [
                    {
                        "content": "body: 'GET请求不能具有请求体',",
                        "rowNumber": 18,
                        "text": "GET请求不能具有请求体",
                        "colNumber": 16
                    },
                    {
                        "content": "message.error('填写有误，请检查！');",
                        "rowNumber": 41,
                        "text": "填写有误，请检查！",
                        "colNumber": 22
                    },
                    {
                        "content": "<Modal zIndex={1202} title=\"重新执行请求\" visible={visible} onCancel={onCancel} onOk={onConfirm}>",
                        "rowNumber": 47,
                        "text": "重新执行请求",
                        "colNumber": 31
                    },
                    {
                        "content": "<Form.Item label=\"请求路径\" name=\"url\">",
                        "rowNumber": 49,
                        "text": "请求路径",
                        "colNumber": 25
                    },
                    {
                        "content": "<Form.Item label=\"HTTP请求方式\" name=\"method\">",
                        "rowNumber": 52,
                        "text": "HTTP请求方式",
                        "colNumber": 25
                    },
                    {
                        "content": "body: 'GET请求不能具有请求体',",
                        "rowNumber": 57,
                        "text": "GET请求不能具有请求体",
                        "colNumber": 22
                    },
                    {
                        "content": "<Form.Item label=\"请求头\" name=\"headers\">",
                        "rowNumber": 75,
                        "text": "请求头",
                        "colNumber": 25
                    },
                    {
                        "content": "<Form.Item label=\"请求体\" name=\"body\">",
                        "rowNumber": 78,
                        "text": "请求体",
                        "colNumber": 25
                    }
                ]
            },
            {
                "fileName": "DrawerParams.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/NetworkView/DrawerParams.tsx",
                "rows": [
                    {
                        "content": "<div title=\"请求详情\" className={`${debuggerCls}-fixpanel ${debuggerCls}-wraper`}>",
                        "rowNumber": 73,
                        "text": "请求详情",
                        "colNumber": 15
                    },
                    {
                        "content": "<div className={`${debuggerCls}-info-dt-tit`}>\n              请求配置\n            </div>",
                        "rowNumber": 80,
                        "text": "请求配置",
                        "colNumber": 58
                    },
                    {
                        "content": "<div className={`${debuggerCls}-info-dt-tit`}>\n              响应结果\n            </div>",
                        "rowNumber": 136,
                        "text": "响应结果",
                        "colNumber": 58
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/EnhancedJSONEditor/index.tsx",
                "rows": [
                    {
                        "content": "message.error('保存localStorage失败，可能是空间已满，请清空localStorage后重试');",
                        "rowNumber": 33,
                        "text": "保存localStorage失败，可能是空间已满，请清空localStorage后重试",
                        "colNumber": 20
                    },
                    {
                        "content": "message.success('当前页面的DSL覆写已清除，刷新页面后生效');",
                        "rowNumber": 39,
                        "text": "当前页面的DSL覆写已清除，刷新页面后生效",
                        "colNumber": 20
                    },
                    {
                        "content": ">\n                清除修改数据\n              </Button>",
                        "rowNumber": 60,
                        "text": "清除修改数据",
                        "colNumber": 15
                    },
                    {
                        "content": "<div>\n              这个页面的DSL已被修改，刷新页面后生效！\n              <Button",
                        "rowNumber": 54,
                        "text": "这个页面的DSL已被修改，刷新页面后生效！",
                        "colNumber": 17
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/CustomFunctionPanel/index.tsx",
                "rows": [
                    {
                        "content": "<Alert type=\"info\" showIcon message=\"调试工具只能显示【编排事件】类型的自定义函数\" />",
                        "rowNumber": 26,
                        "text": "调试工具只能显示【编排事件】类型的自定义函数",
                        "colNumber": 42
                    },
                    {
                        "content": "<div>\n        请选择目标：\n        <Select",
                        "rowNumber": 27,
                        "text": "请选择目标：",
                        "colNumber": 11
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/CompStateLogPanel/index.tsx",
                "rows": [
                    {
                        "content": "targetLog?.basicData && <div>基础数据：{targetLog.basicData}</div>",
                        "rowNumber": 23,
                        "text": "基础数据：",
                        "colNumber": 37
                    },
                    {
                        "content": "<div>变更字段：{o.stateName}</div>",
                        "rowNumber": 29,
                        "text": "变更字段：",
                        "colNumber": 17
                    },
                    {
                        "content": "<div>变更后的值：{o.value}</div>",
                        "rowNumber": 30,
                        "text": "变更后的值：",
                        "colNumber": 17
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/CMDConsoleView/index.tsx",
                "rows": [
                    {
                        "content": "tip: '指令系统运行',",
                        "rowNumber": 25,
                        "text": "指令系统运行",
                        "colNumber": 9
                    },
                    {
                        "content": "tip: '指令系统日志',",
                        "rowNumber": 29,
                        "text": "指令系统日志",
                        "colNumber": 9
                    },
                    {
                        "content": "tip: '指令系统警告',",
                        "rowNumber": 33,
                        "text": "指令系统警告",
                        "colNumber": 9
                    },
                    {
                        "content": "tip: '触发调试断点',",
                        "rowNumber": 37,
                        "text": "触发调试断点",
                        "colNumber": 9
                    },
                    {
                        "content": "tip: '指令系统报错',",
                        "rowNumber": 41,
                        "text": "指令系统报错",
                        "colNumber": 9
                    },
                    {
                        "content": "label: '全部',",
                        "rowNumber": 55,
                        "text": "全部",
                        "colNumber": 9
                    },
                    {
                        "content": "label: '信息',",
                        "rowNumber": 59,
                        "text": "信息",
                        "colNumber": 9
                    },
                    {
                        "content": "label: '日志',",
                        "rowNumber": 63,
                        "text": "日志",
                        "colNumber": 9
                    },
                    {
                        "content": "label: '断点',",
                        "rowNumber": 67,
                        "text": "断点",
                        "colNumber": 9
                    },
                    {
                        "content": "label: '警告',",
                        "rowNumber": 71,
                        "text": "警告",
                        "colNumber": 9
                    },
                    {
                        "content": "label: '报错',",
                        "rowNumber": 75,
                        "text": "报错",
                        "colNumber": 9
                    },
                    {
                        "content": "title: '日志类型',",
                        "rowNumber": 120,
                        "text": "日志类型",
                        "colNumber": 13
                    },
                    {
                        "content": "(typeStr as any)?.[row.type]?.tip || '指令系统运行'",
                        "rowNumber": 131,
                        "text": "指令系统运行",
                        "colNumber": 49
                    },
                    {
                        "content": "title: '当前操作',",
                        "rowNumber": 137,
                        "text": "当前操作",
                        "colNumber": 13
                    },
                    {
                        "content": "{row.errCode && <Tag color=\"red\">错误码{row.errCode}</Tag>}",
                        "rowNumber": 144,
                        "text": "错误码",
                        "colNumber": 45
                    },
                    {
                        "content": "{`页面：${pageData.get(`${row.appId}_${row.pageId}`)?.pageName} ${row.cmd.dataId}-${getActionLabelByKey(row.cmd.type)}`}",
                        "rowNumber": 145,
                        "text": "页面：",
                        "colNumber": 14
                    },
                    {
                        "content": "title: '生成时间',",
                        "rowNumber": 152,
                        "text": "生成时间",
                        "colNumber": 13
                    },
                    {
                        "content": "title: '操作',",
                        "rowNumber": 163,
                        "text": "操作",
                        "colNumber": 13
                    },
                    {
                        "content": "{record.cmd && <a onClick={(e) => { e.stopPropagation(); findTargetCMD(record); }}>跳转到对应指令</a>}",
                        "rowNumber": 168,
                        "text": "跳转到对应指令",
                        "colNumber": 93
                    },
                    {
                        "content": "{`${(o.value ? countMap[o.value] : debugLogs.length) || 0} 条${o.label}`}",
                        "rowNumber": 185,
                        "text": " 条",
                        "colNumber": 72
                    },
                    {
                        "content": ">清空日志\n          </a>",
                        "rowNumber": 197,
                        "text": "清空日志",
                        "colNumber": 11
                    },
                    {
                        "content": "placeholder=\"输入指令ID/指令名称过滤\"",
                        "rowNumber": 203,
                        "text": "输入指令ID/指令名称过滤",
                        "colNumber": 24
                    }
                ]
            },
            {
                "fileName": "DrawerDetail.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebuggerDrawer/CMDConsoleView/DrawerDetail.tsx",
                "rows": [
                    {
                        "content": "<div className={`${debuggerCls}-info-dt-tit`}>\n              指令基本信息\n            </div>",
                        "rowNumber": 66,
                        "text": "指令基本信息",
                        "colNumber": 58
                    },
                    {
                        "content": "<div className={`${debuggerCls}-record-dt-label`}>当前指令：</div>",
                        "rowNumber": 76,
                        "text": "当前指令：",
                        "colNumber": 68
                    },
                    {
                        "content": "<div className={`${debuggerCls}-record-dt-label`}>当前指令编码：</div>",
                        "rowNumber": 81,
                        "text": "当前指令编码：",
                        "colNumber": 68
                    },
                    {
                        "content": "<div className={`${debuggerCls}-record-dt-label`}>指令ID：</div>",
                        "rowNumber": 86,
                        "text": "指令ID：",
                        "colNumber": 68
                    },
                    {
                        "content": "<div className={`${debuggerCls}-record-dt-label`}>指令信息：</div>",
                        "rowNumber": 91,
                        "text": "指令信息：",
                        "colNumber": 68
                    },
                    {
                        "content": "<div className={`${debuggerCls}-info-dt-tit`}>\n                错误信息\n              </div>",
                        "rowNumber": 105,
                        "text": "错误信息",
                        "colNumber": 60
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebugPrinter/Printer/index.tsx",
                "rows": [
                    {
                        "content": "<span style={{ marginLeft: 5 }}>{!breakPointData ? '调试器' : '断点暂停中'}</span>",
                        "rowNumber": 99,
                        "text": "调试器",
                        "colNumber": 61
                    },
                    {
                        "content": "<span style={{ marginLeft: 5 }}>{!breakPointData ? '调试器' : '断点暂停中'}</span>",
                        "rowNumber": 99,
                        "text": "断点暂停中",
                        "colNumber": 69
                    }
                ]
            },
            {
                "fileName": "ShowMore.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/DebugPrinter/Printer/ShowMore.tsx",
                "rows": [
                    {
                        "content": ">\n            收起&uarr;\n          </span>",
                        "rowNumber": 32,
                        "text": "收起↑",
                        "colNumber": 11
                    },
                    {
                        "content": ">\n            展开&darr;\n          </span>",
                        "rowNumber": 45,
                        "text": "展开↓",
                        "colNumber": 11
                    }
                ]
            },
            {
                "fileName": "validation.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/BaseDynamicPage/validation.ts",
                "rows": [
                    {
                        "content": "throwDev('[error]：DynamicPage uidPrefix[唯一编码]属性必填');",
                        "rowNumber": 17,
                        "text": "[error]：DynamicPage uidPrefix[唯一编码]属性必填",
                        "colNumber": 13
                    }
                ]
            },
            {
                "fileName": "useDynamicPage.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/BaseDynamicPage/useDynamicPage.ts",
                "rows": [
                    {
                        "content": "console.error('====> 页面获取DSL失败，getPageDSL error', err);",
                        "rowNumber": 104,
                        "text": "====> 页面获取DSL失败，getPageDSL error",
                        "colNumber": 26
                    }
                ]
            },
            {
                "fileName": "useBOFramer.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/BOFramer/useBOFramer.ts",
                "rows": [
                    {
                        "content": "msg: `没有查询到ID：${busiCompId}的业务组件实例数据，该页面将不会渲染！请检查配置或者确认该页面是否有权限访问`,",
                        "rowNumber": 22,
                        "text": "没有查询到ID：",
                        "colNumber": 18
                    },
                    {
                        "content": "msg: `没有查询到ID：${busiCompId}的业务组件实例数据，该页面将不会渲染！请检查配置或者确认该页面是否有权限访问`,",
                        "rowNumber": 22,
                        "text": "的业务组件实例数据，该页面将不会渲染！请检查配置或者确认该页面是否有权限访问",
                        "colNumber": 39
                    }
                ]
            },
            {
                "fileName": "utils.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/AccountDivideModal/utils.ts",
                "rows": [
                    {
                        "content": "'一月',",
                        "rowNumber": 9,
                        "text": "一月",
                        "colNumber": 2
                    },
                    {
                        "content": "'二月',",
                        "rowNumber": 10,
                        "text": "二月",
                        "colNumber": 2
                    },
                    {
                        "content": "'三月',",
                        "rowNumber": 11,
                        "text": "三月",
                        "colNumber": 2
                    },
                    {
                        "content": "'四月',",
                        "rowNumber": 12,
                        "text": "四月",
                        "colNumber": 2
                    },
                    {
                        "content": "'五月',",
                        "rowNumber": 13,
                        "text": "五月",
                        "colNumber": 2
                    },
                    {
                        "content": "'六月',",
                        "rowNumber": 14,
                        "text": "六月",
                        "colNumber": 2
                    },
                    {
                        "content": "'七月',",
                        "rowNumber": 15,
                        "text": "七月",
                        "colNumber": 2
                    },
                    {
                        "content": "'八月',",
                        "rowNumber": 16,
                        "text": "八月",
                        "colNumber": 2
                    },
                    {
                        "content": "'九月',",
                        "rowNumber": 17,
                        "text": "九月",
                        "colNumber": 2
                    },
                    {
                        "content": "'十月',",
                        "rowNumber": 18,
                        "text": "十月",
                        "colNumber": 2
                    },
                    {
                        "content": "'十一月',",
                        "rowNumber": 19,
                        "text": "十一月",
                        "colNumber": 2
                    },
                    {
                        "content": "'十二月',",
                        "rowNumber": 20,
                        "text": "十二月",
                        "colNumber": 2
                    },
                    {
                        "content": "const YEAR_CN = '年份';",
                        "rowNumber": 22,
                        "text": "年份",
                        "colNumber": 16
                    },
                    {
                        "content": "new: '设置分账',",
                        "rowNumber": 27,
                        "text": "设置分账",
                        "colNumber": 7
                    },
                    {
                        "content": "edit: '变更计划',",
                        "rowNumber": 28,
                        "text": "变更计划",
                        "colNumber": 8
                    },
                    {
                        "content": "detail: '计划详情',",
                        "rowNumber": 29,
                        "text": "计划详情",
                        "colNumber": 10
                    }
                ]
            },
            {
                "fileName": "AccountDivideModal.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/AccountDivideModal/AccountDivideModal.tsx",
                "rows": [
                    {
                        "content": "const [modalTitle, setModalTitle] = useState('设置分账');",
                        "rowNumber": 58,
                        "text": "设置分账",
                        "colNumber": 47
                    },
                    {
                        "content": "message.warning('不符合自动填充条件');",
                        "rowNumber": 170,
                        "text": "不符合自动填充条件",
                        "colNumber": 22
                    },
                    {
                        "content": "message.warning('自动填充失败，请至少先手动填入一项依据数据然后重试');",
                        "rowNumber": 188,
                        "text": "自动填充失败，请至少先手动填入一项依据数据然后重试",
                        "colNumber": 22
                    },
                    {
                        "content": "message.error('分账未完成，请仔细检查');",
                        "rowNumber": 292,
                        "text": "分账未完成，请仔细检查",
                        "colNumber": 20
                    },
                    {
                        "content": "cancelText=\"返回\"",
                        "rowNumber": 347,
                        "text": "返回",
                        "colNumber": 17
                    },
                    {
                        "content": "<Form.Item label=\"开始年月\">",
                        "rowNumber": 357,
                        "text": "开始年月",
                        "colNumber": 33
                    },
                    {
                        "content": "message.error('请选择有效的开始日期');",
                        "rowNumber": 363,
                        "text": "请选择有效的开始日期",
                        "colNumber": 38
                    },
                    {
                        "content": "<Form.Item label=\"出账方式\">",
                        "rowNumber": 378,
                        "text": "出账方式",
                        "colNumber": 33
                    },
                    {
                        "content": "<Option value=\"year\">年</Option>",
                        "rowNumber": 390,
                        "text": "年",
                        "colNumber": 41
                    },
                    {
                        "content": "<Option value=\"halfYear\">半年</Option>",
                        "rowNumber": 391,
                        "text": "半年",
                        "colNumber": 45
                    },
                    {
                        "content": "<Option value=\"quarter\">季</Option>",
                        "rowNumber": 392,
                        "text": "季",
                        "colNumber": 44
                    },
                    {
                        "content": "<Option value=\"month\">月</Option>",
                        "rowNumber": 393,
                        "text": "月",
                        "colNumber": 42
                    },
                    {
                        "content": "<Option value=\"time\">次</Option>",
                        "rowNumber": 394,
                        "text": "次",
                        "colNumber": 41
                    },
                    {
                        "content": "<Button onClick={onReset}>重置</Button>",
                        "rowNumber": 399,
                        "text": "重置",
                        "colNumber": 42
                    },
                    {
                        "content": "<Button type=\"primary\" onClick={autoFill} style={{ marginLeft: '8px' }}>\n                  一键填充\n                </Button>",
                        "rowNumber": 400,
                        "text": "一键填充",
                        "colNumber": 88
                    },
                    {
                        "content": "<div className={`${prefix}-amount`}>\n            剩余\n            <strong",
                        "rowNumber": 418,
                        "text": "剩余",
                        "colNumber": 46
                    },
                    {
                        "content": "</strong>\n            元\n          </div>",
                        "rowNumber": 425,
                        "text": "元",
                        "colNumber": 21
                    }
                ]
            },
            {
                "fileName": "AccountDivideDetail.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/components/AccountDivideModal/AccountDivideDetail/AccountDivideDetail.tsx",
                "rows": [
                    {
                        "content": "{adTitle ? <div className={`${prefix}-title`}>科目：{adTitle || '未命名'}</div> : null}",
                        "rowNumber": 107,
                        "text": "未命名",
                        "colNumber": 67
                    },
                    {
                        "content": "{adTitle ? <div className={`${prefix}-title`}>科目：{adTitle || '未命名'}</div> : null}",
                        "rowNumber": 107,
                        "text": "科目：",
                        "colNumber": 52
                    },
                    {
                        "content": "<div className={`${prefix}-subTitle`}>当前计划</div>",
                        "rowNumber": 110,
                        "text": "当前计划",
                        "colNumber": 48
                    },
                    {
                        "content": "<Form.Item label=\"开始年月\">",
                        "rowNumber": 114,
                        "text": "开始年月",
                        "colNumber": 33
                    },
                    {
                        "content": "<Form.Item label=\"出账方式\">",
                        "rowNumber": 119,
                        "text": "出账方式",
                        "colNumber": 33
                    },
                    {
                        "content": "<Option value=\"year\">年</Option>",
                        "rowNumber": 121,
                        "text": "年",
                        "colNumber": 41
                    },
                    {
                        "content": "<Option value=\"halfYear\">半年</Option>",
                        "rowNumber": 122,
                        "text": "半年",
                        "colNumber": 45
                    },
                    {
                        "content": "<Option value=\"quarter\">季</Option>",
                        "rowNumber": 123,
                        "text": "季",
                        "colNumber": 44
                    },
                    {
                        "content": "<Option value=\"month\">月</Option>",
                        "rowNumber": 124,
                        "text": "月",
                        "colNumber": 42
                    },
                    {
                        "content": "<Option value=\"time\">次</Option>",
                        "rowNumber": 125,
                        "text": "次",
                        "colNumber": 41
                    },
                    {
                        "content": "<div className={`${prefix}-amount`}>\n            剩余\n            <strong>0.00</strong>元",
                        "rowNumber": 143,
                        "text": "剩余",
                        "colNumber": 46
                    },
                    {
                        "content": "<strong>0.00</strong>元\n          </div>",
                        "rowNumber": 145,
                        "text": "元",
                        "colNumber": 33
                    },
                    {
                        "content": "{afterDataTitleVisible ? <div className={`${prefix}-subTitle`}>变更后计划</div> : null}",
                        "rowNumber": 149,
                        "text": "变更后计划",
                        "colNumber": 69
                    },
                    {
                        "content": "<Form.Item label=\"开始年月\">",
                        "rowNumber": 155,
                        "text": "开始年月",
                        "colNumber": 33
                    },
                    {
                        "content": "<Form.Item label=\"出账方式\">",
                        "rowNumber": 160,
                        "text": "出账方式",
                        "colNumber": 33
                    },
                    {
                        "content": "<Option value=\"year\">年</Option>",
                        "rowNumber": 162,
                        "text": "年",
                        "colNumber": 41
                    },
                    {
                        "content": "<Option value=\"halfYear\">半年</Option>",
                        "rowNumber": 163,
                        "text": "半年",
                        "colNumber": 45
                    },
                    {
                        "content": "<Option value=\"quarter\">季</Option>",
                        "rowNumber": 164,
                        "text": "季",
                        "colNumber": 44
                    },
                    {
                        "content": "<Option value=\"month\">月</Option>",
                        "rowNumber": 165,
                        "text": "月",
                        "colNumber": 42
                    },
                    {
                        "content": "<Option value=\"time\">次</Option>",
                        "rowNumber": 166,
                        "text": "次",
                        "colNumber": 41
                    },
                    {
                        "content": "<div className={`${prefix}-amount`}>\n            剩余\n            <strong>0.00</strong>元",
                        "rowNumber": 184,
                        "text": "剩余",
                        "colNumber": 46
                    },
                    {
                        "content": "<strong>0.00</strong>元\n          </div>",
                        "rowNumber": 186,
                        "text": "元",
                        "colNumber": 33
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/basicComponents/PreviewFile/index.tsx",
                "rows": [
                    {
                        "content": "const tip = '该文件不支持当前窗口预览';",
                        "rowNumber": 73,
                        "text": "该文件不支持当前窗口预览",
                        "colNumber": 14
                    },
                    {
                        "content": "setResultInfo('文件资源不存在');",
                        "rowNumber": 134,
                        "text": "文件资源不存在",
                        "colNumber": 26
                    },
                    {
                        "content": "title=\"预览\"",
                        "rowNumber": 312,
                        "text": "预览",
                        "colNumber": 20
                    },
                    {
                        "content": "message.info('已缩放至最小');",
                        "rowNumber": 399,
                        "text": "已缩放至最小",
                        "colNumber": 31
                    },
                    {
                        "content": "message.info('已缩放至最大');",
                        "rowNumber": 413,
                        "text": "已缩放至最大",
                        "colNumber": 31
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/basicComponents/Exception/NotFound/index.tsx",
                "rows": [
                    {
                        "content": "<span style={{ color: 'rgba(28, 36, 46, 0.45)', fontSize: '16px', lineHeight: '22px', fontWeight: '400' }}>\n          抱歉，您访问的页面不存在，刷新页面后重试。\n        </span>",
                        "rowNumber": 21,
                        "text": "抱歉，您访问的页面不存在，刷新页面后重试。",
                        "colNumber": 115
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-pc/src/basicComponents/Exception/NoPermission/index.tsx",
                "rows": [
                    {
                        "content": ">\n          您还没有访问权限，请联系管理员～\n        </span>",
                        "rowNumber": 27,
                        "text": "您还没有访问权限，请联系管理员～",
                        "colNumber": 9
                    }
                ]
            },
            {
                "fileName": "getLcdpRoutes.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/utils/getLcdpRoutes.tsx",
                "rows": [
                    {
                        "content": "title: '无权限',",
                        "rowNumber": 21,
                        "text": "无权限",
                        "colNumber": 11
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/PreviewFile/index.tsx",
                "rows": [
                    {
                        "content": "messageApi.error('文件资源不存在');",
                        "rowNumber": 109,
                        "text": "文件资源不存在",
                        "colNumber": 29
                    },
                    {
                        "content": "messageApi.error('当前文件不支持在线预览');",
                        "rowNumber": 195,
                        "text": "当前文件不支持在线预览",
                        "colNumber": 25
                    },
                    {
                        "content": "messageApi.error('当前文件不支持在线预览');",
                        "rowNumber": 200,
                        "text": "当前文件不支持在线预览",
                        "colNumber": 23
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/Modal/index.tsx",
                "rows": [
                    {
                        "content": "content: '弹窗操作失败：缺少页面实例ID或页面路径',",
                        "rowNumber": 27,
                        "text": "弹窗操作失败：缺少页面实例ID或页面路径",
                        "colNumber": 17
                    }
                ]
            },
            {
                "fileName": "index.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/MessageApi/index.ts",
                "rows": [
                    {
                        "content": "const showAlert = ({ title = '', content = '', okText = '知道了', cancelText = '取消', onOk = () => { }, onCancel = () => { }, type = 'confirm' }) => {",
                        "rowNumber": 73,
                        "text": "知道了",
                        "colNumber": 56
                    },
                    {
                        "content": "const showAlert = ({ title = '', content = '', okText = '知道了', cancelText = '取消', onOk = () => { }, onCancel = () => { }, type = 'confirm' }) => {",
                        "rowNumber": 73,
                        "text": "取消",
                        "colNumber": 76
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/LoginPage/index.tsx",
                "rows": [
                    {
                        "content": "Toast.show('请输入账号');",
                        "rowNumber": 20,
                        "text": "请输入账号",
                        "colNumber": 17
                    },
                    {
                        "content": "Toast.show('请输入密码');",
                        "rowNumber": 24,
                        "text": "请输入密码",
                        "colNumber": 17
                    },
                    {
                        "content": "Toast.show('请输入验证码');",
                        "rowNumber": 28,
                        "text": "请输入验证码",
                        "colNumber": 17
                    },
                    {
                        "content": "<div className=\"loginTitle\">账号密码登录</div>",
                        "rowNumber": 34,
                        "text": "账号密码登录",
                        "colNumber": 34
                    },
                    {
                        "content": "placeholder=\"请输入账号\"",
                        "rowNumber": 37,
                        "text": "请输入账号",
                        "colNumber": 22
                    },
                    {
                        "content": "placeholder=\"请输入密码\"",
                        "rowNumber": 44,
                        "text": "请输入密码",
                        "colNumber": 22
                    },
                    {
                        "content": "placeholder=\"请输入验证码\"",
                        "rowNumber": 52,
                        "text": "请输入验证码",
                        "colNumber": 22
                    },
                    {
                        "content": ">\n        登录\n      </Button>",
                        "rowNumber": 66,
                        "text": "登录",
                        "colNumber": 7
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/Exception/NotFound/index.tsx",
                "rows": [
                    {
                        "content": ">\n          抱歉，您访问的页面不存在\n        </span>",
                        "rowNumber": 27,
                        "text": "抱歉，您访问的页面不存在",
                        "colNumber": 9
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/Exception/NoPermission/index.tsx",
                "rows": [
                    {
                        "content": ">\n          您还没有访问权限，请联系管理员～\n        </span>",
                        "rowNumber": 27,
                        "text": "您还没有访问权限，请联系管理员～",
                        "colNumber": 9
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/ErrorBoundary/index.tsx",
                "rows": [
                    {
                        "content": "<div style={{ fontSize: '16px', fontWeight: 600, color: '#000' }}>\n          组件渲染错误\n        </div>",
                        "rowNumber": 16,
                        "text": "组件渲染错误",
                        "colNumber": 74
                    },
                    {
                        "content": "`<div>\n            <div style=\"line-height:25px\">\n              <span style=\"font-weight:500;color:#000\">组件名称</span>：\n              ${schema?.compName}",
                        "rowNumber": 24,
                        "text": "<div>\n            <div style=\"line-height:25px\">\n              <span style=\"font-weight:500;color:#000\">组件名称</span>：\n              ",
                        "colNumber": 11
                    },
                    {
                        "content": "${schema?.compName}\n            </div>\n            <div style=\"line-height:25px\">\n              <span style=\"font-weight:500;color:#000\">组件标识</span>：\n              ${schema?.id}",
                        "rowNumber": 27,
                        "text": "\n            </div>\n            <div style=\"line-height:25px\">\n              <span style=\"font-weight:500;color:#000\">组件标识</span>：\n              ",
                        "colNumber": 33
                    },
                    {
                        "content": "${schema?.id}\n            </div>\n            <div style=\"line-height:25px\">\n              <span style=\"font-weight:500;color:#000\">错误信息</span>：\n              ${error.message}",
                        "rowNumber": 31,
                        "text": "\n            </div>\n            <div style=\"line-height:25px\">\n              <span style=\"font-weight:500;color:#000\">错误信息</span>：\n              ",
                        "colNumber": 27
                    },
                    {
                        "content": "${error.message}\n            </div>\n            <div style=\"padding-top:10px\">\n              <span style=\"font-weight:500;color:#000\">错误堆栈</span>:\n              ${componentStack || error.stack}",
                        "rowNumber": 35,
                        "text": "\n            </div>\n            <div style=\"padding-top:10px\">\n              <span style=\"font-weight:500;color:#000\">错误堆栈</span>:\n              ",
                        "colNumber": 30
                    },
                    {
                        "content": "组件加载失败，点击<span onClick={openDetailModal}>查看详情</span>",
                        "rowNumber": 51,
                        "text": "查看详情",
                        "colNumber": 49
                    },
                    {
                        "content": "<div className=\"engine-error-boundary-text\">\n        组件加载失败，点击<span onClick={openDetailModal}>查看详情</span>",
                        "rowNumber": 50,
                        "text": "组件加载失败，点击",
                        "colNumber": 50
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/DefaultPage/index.tsx",
                "rows": [
                    {
                        "content": "<div className=\"reason\">当前页面没有访问权限，请登录后再试</div>",
                        "rowNumber": 14,
                        "text": "当前页面没有访问权限，请登录后再试",
                        "colNumber": 30
                    },
                    {
                        "content": "<Button color=\"primary\" style={{ height: '32px', fontSize: '13px' }}>\n        操作按钮\n      </Button>",
                        "rowNumber": 15,
                        "text": "操作按钮",
                        "colNumber": 75
                    }
                ]
            },
            {
                "fileName": "validation.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/BaseDynamicPage/validation.ts",
                "rows": [
                    {
                        "content": "throwDev('[error]：DynamicPage uidPrefix[唯一编码]属性必填');",
                        "rowNumber": 17,
                        "text": "[error]：DynamicPage uidPrefix[唯一编码]属性必填",
                        "colNumber": 13
                    }
                ]
            },
            {
                "fileName": "useDynamicPage.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/BaseDynamicPage/useDynamicPage.ts",
                "rows": [
                    {
                        "content": "console.error('====> 页面获取DSL失败，getPageDSL error', err);",
                        "rowNumber": 108,
                        "text": "====> 页面获取DSL失败，getPageDSL error",
                        "colNumber": 26
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/BannerModal/index.tsx",
                "rows": [
                    {
                        "content": "content: '已缩放至最小',",
                        "rowNumber": 101,
                        "text": "已缩放至最小",
                        "colNumber": 29
                    },
                    {
                        "content": "content: '已缩放至最大',",
                        "rowNumber": 118,
                        "text": "已缩放至最大",
                        "colNumber": 29
                    }
                ]
            },
            {
                "fileName": "useBOFramer.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/engine-app/src/components/BOFramer/useBOFramer.ts",
                "rows": [
                    {
                        "content": "msg: `没有查询到ID：${busiCompId}的业务组件实例数据，该页面将不会渲染！请检查配置或者确认该页面是否有权限访问`,",
                        "rowNumber": 29,
                        "text": "没有查询到ID：",
                        "colNumber": 18
                    },
                    {
                        "content": "msg: `没有查询到ID：${busiCompId}的业务组件实例数据，该页面将不会渲染！请检查配置或者确认该页面是否有权限访问`,",
                        "rowNumber": 29,
                        "text": "的业务组件实例数据，该页面将不会渲染！请检查配置或者确认该页面是否有权限访问",
                        "colNumber": 39
                    }
                ]
            },
            {
                "fileName": "index.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/command/src/index.ts",
                "rows": [
                    {
                        "content": "const lineNumberText = cmd?.line_number ? `第${cmd?.line_number}行` : '';",
                        "rowNumber": 45,
                        "text": "第",
                        "colNumber": 45
                    },
                    {
                        "content": "const lineNumberText = cmd?.line_number ? `第${cmd?.line_number}行` : '';",
                        "rowNumber": 45,
                        "text": "行",
                        "colNumber": 65
                    },
                    {
                        "content": "const eventName = context?.EventName ? `的${context.EventName}事件内` : '';",
                        "rowNumber": 46,
                        "text": "的",
                        "colNumber": 42
                    },
                    {
                        "content": "const eventName = context?.EventName ? `的${context.EventName}事件内` : '';",
                        "rowNumber": 46,
                        "text": "事件内",
                        "colNumber": 63
                    },
                    {
                        "content": "return `页面【${context?.$$pageData?.pageName}】上的组件【${context?.$$compDefine?.name}】(${context?.$$compDefine?.id})${eventName}${lineNumberText}发生了异常：\\n${msg}`;",
                        "rowNumber": 47,
                        "text": "页面【",
                        "colNumber": 10
                    },
                    {
                        "content": "return `页面【${context?.$$pageData?.pageName}】上的组件【${context?.$$compDefine?.name}】(${context?.$$compDefine?.id})${eventName}${lineNumberText}发生了异常：\\n${msg}`;",
                        "rowNumber": 47,
                        "text": "】上的组件【",
                        "colNumber": 45
                    },
                    {
                        "content": "return `页面【${context?.$$pageData?.pageName}】上的组件【${context?.$$compDefine?.name}】(${context?.$$compDefine?.id})${eventName}${lineNumberText}发生了异常：\\n${msg}`;",
                        "rowNumber": 47,
                        "text": "发生了异常：\\n",
                        "colNumber": 141
                    },
                    {
                        "content": "msg: '触发调试工具断点',",
                        "rowNumber": 85,
                        "text": "触发调试工具断点",
                        "colNumber": 15
                    },
                    {
                        "content": "msg: '指令开始执行',",
                        "rowNumber": 201,
                        "text": "指令开始执行",
                        "colNumber": 11
                    },
                    {
                        "content": "msg: e?.cmderror ? `指令错误：${errmsg}` : `脚本运行时异常！${errmsg}`,",
                        "rowNumber": 254,
                        "text": "指令错误：",
                        "colNumber": 28
                    },
                    {
                        "content": "msg: e?.cmderror ? `指令错误：${errmsg}` : `脚本运行时异常！${errmsg}`,",
                        "rowNumber": 254,
                        "text": "脚本运行时异常！",
                        "colNumber": 47
                    },
                    {
                        "content": "console.error('CMDParse接收到非数组的非法值：', cmddata, '请检查！');",
                        "rowNumber": 297,
                        "text": "CMDParse接收到非数组的非法值：",
                        "colNumber": 20
                    },
                    {
                        "content": "console.error('CMDParse接收到非数组的非法值：', cmddata, '请检查！');",
                        "rowNumber": 297,
                        "text": "请检查！",
                        "colNumber": 52
                    },
                    {
                        "content": "console.warn('CMDParse Warning: no context，没有上下文函数，这可能是指令实现缺失context传参');",
                        "rowNumber": 306,
                        "text": "CMDParse Warning: no context，没有上下文函数，这可能是指令实现缺失context传参",
                        "colNumber": 19
                    },
                    {
                        "content": "message: '退出指令错误的抛出: 返回内容__undefined__',",
                        "rowNumber": 413,
                        "text": "退出指令错误的抛出: 返回内容__undefined__",
                        "colNumber": 27
                    },
                    {
                        "content": "message: `退出指令错误的抛出值为：${rValue}`,",
                        "rowNumber": 423,
                        "text": "退出指令错误的抛出值为：",
                        "colNumber": 24
                    },
                    {
                        "content": "const errmsg = gainErrorPrefix(`沙箱执行出错！得到的表达式：${expr}`, cmd, _field);",
                        "rowNumber": 544,
                        "text": "沙箱执行出错！得到的表达式：",
                        "colNumber": 40
                    },
                    {
                        "content": "msg: `指令执行沙箱表达式：${expr}时遇到异常！`,",
                        "rowNumber": 561,
                        "text": "指令执行沙箱表达式：",
                        "colNumber": 18
                    },
                    {
                        "content": "msg: `指令执行沙箱表达式：${expr}时遇到异常！`,",
                        "rowNumber": 561,
                        "text": "时遇到异常！",
                        "colNumber": 35
                    }
                ]
            },
            {
                "fileName": "RemoteComp.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/businesscomponent/src/RemoteComp/RemoteComp.tsx",
                "rows": [
                    {
                        "content": "console.warn('查找组件扩展实现失败！！');",
                        "rowNumber": 56,
                        "text": "查找组件扩展实现失败！！",
                        "colNumber": 23
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/businesscomponent/src/Pageview/index.tsx",
                "rows": [
                    {
                        "content": "`页面容器嵌入页面地址找不到页面，请检查地址'${pageSrc}'是否正确`",
                        "rowNumber": 68,
                        "text": "页面容器嵌入页面地址找不到页面，请检查地址'",
                        "colNumber": 11
                    },
                    {
                        "content": "`页面容器嵌入页面地址找不到页面，请检查地址'${pageSrc}'是否正确`",
                        "rowNumber": 68,
                        "text": "'是否正确",
                        "colNumber": 43
                    }
                ]
            },
            {
                "fileName": "WrapCompWithApp.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/businesscomponent/src/Pageview/WrapCompWithApp.tsx",
                "rows": [
                    {
                        "content": "msg: `获取应用${appId}信息失败，请检查是否拥有该应用权限`,",
                        "rowNumber": 26,
                        "text": "获取应用",
                        "colNumber": 14
                    },
                    {
                        "content": "msg: `获取应用${appId}信息失败，请检查是否拥有该应用权限`,",
                        "rowNumber": 26,
                        "text": "信息失败，请检查是否拥有该应用权限",
                        "colNumber": 26
                    }
                ]
            },
            {
                "fileName": "command.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/assets/src/command.ts",
                "rows": [
                    {
                        "content": "console.error('条件指令注册类型错误');",
                        "rowNumber": 21,
                        "text": "条件指令注册类型错误",
                        "colNumber": 20
                    },
                    {
                        "content": "console.error(`控件指令中存在相同指令, 指令将无法覆盖: ${key}`);",
                        "rowNumber": 38,
                        "text": "控件指令中存在相同指令, 指令将无法覆盖: ",
                        "colNumber": 25
                    },
                    {
                        "content": "return `无法识别的条件类型：${key}，该指令是否不存在于当前指令集？`;",
                        "rowNumber": 64,
                        "text": "无法识别的条件类型：",
                        "colNumber": 12
                    },
                    {
                        "content": "return `无法识别的条件类型：${key}，该指令是否不存在于当前指令集？`;",
                        "rowNumber": 64,
                        "text": "，该指令是否不存在于当前指令集？",
                        "colNumber": 28
                    },
                    {
                        "content": "return `无法识别的指令类型：${key}，该指令是否不存在于当前指令集？`;",
                        "rowNumber": 76,
                        "text": "无法识别的指令类型：",
                        "colNumber": 12
                    },
                    {
                        "content": "return `无法识别的指令类型：${key}，该指令是否不存在于当前指令集？`;",
                        "rowNumber": 76,
                        "text": "，该指令是否不存在于当前指令集？",
                        "colNumber": 28
                    },
                    {
                        "content": "console.error('增加指令错误，无法识别的类型');",
                        "rowNumber": 95,
                        "text": "增加指令错误，无法识别的类型",
                        "colNumber": 20
                    },
                    {
                        "content": "console.error('增加指令错误，无法识别的类型');",
                        "rowNumber": 107,
                        "text": "增加指令错误，无法识别的类型",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "setupProxy.js",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/setupProxy.js",
                "rows": [
                    {
                        "content": "throw new Error('后端服务地址不能为空！请在 .env.local 文件中配置 LCDP_SERVICE_URL');",
                        "rowNumber": 11,
                        "text": "后端服务地址不能为空！请在 .env.local 文件中配置 LCDP_SERVICE_URL",
                        "colNumber": 18
                    },
                    {
                        "content": "console.log(`本地环境变量文件修改，现在的最新服务端地址为：${config.LCDP_SERVICE_URL}`);",
                        "rowNumber": 20,
                        "text": "本地环境变量文件修改，现在的最新服务端地址为：",
                        "colNumber": 19
                    }
                ]
            },
            {
                "fileName": "microFEInit.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/microFEInit.ts",
                "rows": [
                    {
                        "content": "console.error('约定: url 需携带查询参数 basename');",
                        "rowNumber": 154,
                        "text": "约定: url 需携带查询参数 basename",
                        "colNumber": 20
                    },
                    {
                        "content": "console.error('请检查 url 是否是 hash 路径');",
                        "rowNumber": 224,
                        "text": "请检查 url 是否是 hash 路径",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "App.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/App.tsx",
                "rows": [
                    {
                        "content": "return <ErrorPage title=\"页面加载失败\" subTitle={errorInfo?.subTitle} tips={errorInfo?.tips} />;",
                        "rowNumber": 78,
                        "text": "页面加载失败",
                        "colNumber": 28
                    }
                ]
            },
            {
                "fileName": "timing.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/utils/timing.ts",
                "rows": [
                    {
                        "content": "desc: '网页重定向的耗时',",
                        "rowNumber": 22,
                        "text": "网页重定向的耗时",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: '检查本地缓存的耗时',",
                        "rowNumber": 27,
                        "text": "检查本地缓存的耗时",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: 'DNS查询的耗时',",
                        "rowNumber": 32,
                        "text": "DNS查询的耗时",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: 'TCP链接的耗时',",
                        "rowNumber": 37,
                        "text": "TCP链接的耗时",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: '从客户端发起请求到接收响应的时间',",
                        "rowNumber": 42,
                        "text": "从客户端发起请求到接收响应的时间",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: '下载服务端返回数据的时间',",
                        "rowNumber": 46,
                        "text": "下载服务端返回数据的时间",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: 'http请求总耗时',",
                        "rowNumber": 51,
                        "text": "http请求总耗时",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: '首包时间',",
                        "rowNumber": 56,
                        "text": "首包时间",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: '白屏时间',",
                        "rowNumber": 61,
                        "text": "白屏时间",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: 'DOM 解析耗时',",
                        "rowNumber": 66,
                        "text": "DOM 解析耗时",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: '首次可交互时间',",
                        "rowNumber": 71,
                        "text": "首次可交互时间",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: 'DOM 加载完成的时间',",
                        "rowNumber": 76,
                        "text": "DOM 加载完成的时间",
                        "colNumber": 14
                    },
                    {
                        "content": "desc: '页面load的总耗时',",
                        "rowNumber": 81,
                        "text": "页面load的总耗时",
                        "colNumber": 14
                    },
                    {
                        "content": "throw new Error(`时间统计失败：${e}`);",
                        "rowNumber": 88,
                        "text": "时间统计失败：",
                        "colNumber": 23
                    }
                ]
            },
            {
                "fileName": "dateUtil.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/utils/dateUtil.ts",
                "rows": [
                    {
                        "content": "months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),",
                        "rowNumber": 8,
                        "text": "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月",
                        "colNumber": 14
                    },
                    {
                        "content": "monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),",
                        "rowNumber": 9,
                        "text": "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月",
                        "colNumber": 19
                    },
                    {
                        "content": "weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),",
                        "rowNumber": 10,
                        "text": "星期日_星期一_星期二_星期三_星期四_星期五_星期六",
                        "colNumber": 16
                    },
                    {
                        "content": "weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),",
                        "rowNumber": 11,
                        "text": "周日_周一_周二_周三_周四_周五_周六",
                        "colNumber": 21
                    },
                    {
                        "content": "weekdaysMin: '日_一_二_三_四_五_六'.split('_'),",
                        "rowNumber": 12,
                        "text": "日_一_二_三_四_五_六",
                        "colNumber": 19
                    },
                    {
                        "content": "LT: 'Ah点mm分',",
                        "rowNumber": 14,
                        "text": "Ah点mm分",
                        "colNumber": 12
                    },
                    {
                        "content": "LTS: 'Ah点m分s秒',",
                        "rowNumber": 15,
                        "text": "Ah点m分s秒",
                        "colNumber": 13
                    },
                    {
                        "content": "LL: 'YYYY年MMMD日',",
                        "rowNumber": 17,
                        "text": "YYYY年MMMD日",
                        "colNumber": 12
                    },
                    {
                        "content": "LLL: 'YYYY年MMMD日Ah点mm分',",
                        "rowNumber": 18,
                        "text": "YYYY年MMMD日Ah点mm分",
                        "colNumber": 13
                    },
                    {
                        "content": "LLLL: 'YYYY年MMMD日ddddAh点mm分',",
                        "rowNumber": 19,
                        "text": "YYYY年MMMD日ddddAh点mm分",
                        "colNumber": 14
                    },
                    {
                        "content": "ll: 'YYYY年MMMD日',",
                        "rowNumber": 21,
                        "text": "YYYY年MMMD日",
                        "colNumber": 12
                    },
                    {
                        "content": "lll: 'YYYY年MMMD日Ah点mm分',",
                        "rowNumber": 22,
                        "text": "YYYY年MMMD日Ah点mm分",
                        "colNumber": 13
                    },
                    {
                        "content": "llll: 'YYYY年MMMD日ddddAh点mm分',",
                        "rowNumber": 23,
                        "text": "YYYY年MMMD日ddddAh点mm分",
                        "colNumber": 14
                    },
                    {
                        "content": "if (meridiem === '凌晨' || meridiem === '早上' ||",
                        "rowNumber": 31,
                        "text": "凌晨",
                        "colNumber": 25
                    },
                    {
                        "content": "if (meridiem === '凌晨' || meridiem === '早上' ||",
                        "rowNumber": 31,
                        "text": "早上",
                        "colNumber": 46
                    },
                    {
                        "content": "meridiem === '上午') {",
                        "rowNumber": 32,
                        "text": "上午",
                        "colNumber": 23
                    },
                    {
                        "content": "if (meridiem === '下午' || meridiem === '晚上') {",
                        "rowNumber": 35,
                        "text": "下午",
                        "colNumber": 25
                    },
                    {
                        "content": "if (meridiem === '下午' || meridiem === '晚上') {",
                        "rowNumber": 35,
                        "text": "晚上",
                        "colNumber": 46
                    },
                    {
                        "content": "return '凌晨';",
                        "rowNumber": 43,
                        "text": "凌晨",
                        "colNumber": 17
                    },
                    {
                        "content": "return '早上';",
                        "rowNumber": 46,
                        "text": "早上",
                        "colNumber": 17
                    },
                    {
                        "content": "return '上午';",
                        "rowNumber": 49,
                        "text": "上午",
                        "colNumber": 17
                    },
                    {
                        "content": "return '中午';",
                        "rowNumber": 52,
                        "text": "中午",
                        "colNumber": 17
                    },
                    {
                        "content": "return '下午';",
                        "rowNumber": 55,
                        "text": "下午",
                        "colNumber": 17
                    },
                    {
                        "content": "return '晚上';",
                        "rowNumber": 57,
                        "text": "晚上",
                        "colNumber": 15
                    },
                    {
                        "content": "sameDay: () => (this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT'),",
                        "rowNumber": 61,
                        "text": "[今天]Ah[点整]",
                        "colNumber": 47
                    },
                    {
                        "content": "sameDay: () => (this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT'),",
                        "rowNumber": 61,
                        "text": "[今天]LT",
                        "colNumber": 62
                    },
                    {
                        "content": "nextDay: () => (this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT'),",
                        "rowNumber": 63,
                        "text": "[明天]Ah[点整]",
                        "colNumber": 47
                    },
                    {
                        "content": "nextDay: () => (this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT'),",
                        "rowNumber": 63,
                        "text": "[明天]LT",
                        "colNumber": 62
                    },
                    {
                        "content": "lastDay: () => (this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT'),",
                        "rowNumber": 65,
                        "text": "[昨天]Ah[点整]",
                        "colNumber": 47
                    },
                    {
                        "content": "lastDay: () => (this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT'),",
                        "rowNumber": 65,
                        "text": "[昨天]LT",
                        "colNumber": 62
                    },
                    {
                        "content": "const prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';",
                        "rowNumber": 69,
                        "text": "[下]",
                        "colNumber": 77
                    },
                    {
                        "content": "const prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';",
                        "rowNumber": 69,
                        "text": "[本]",
                        "colNumber": 85
                    },
                    {
                        "content": "return this.minutes() === 0 ? `${prefix}dddAh点整` : `${prefix}dddAh点mm`;",
                        "rowNumber": 71,
                        "text": "dddAh点整",
                        "colNumber": 50
                    },
                    {
                        "content": "return this.minutes() === 0 ? `${prefix}dddAh点整` : `${prefix}dddAh点mm`;",
                        "rowNumber": 71,
                        "text": "dddAh点mm",
                        "colNumber": 71
                    },
                    {
                        "content": "const prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';",
                        "rowNumber": 76,
                        "text": "[上]",
                        "colNumber": 60
                    },
                    {
                        "content": "const prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';",
                        "rowNumber": 76,
                        "text": "[本]",
                        "colNumber": 68
                    },
                    {
                        "content": "return this.minutes() === 0 ? `${prefix}dddAh点整` : `${prefix}dddAh点mm`;",
                        "rowNumber": 78,
                        "text": "dddAh点整",
                        "colNumber": 50
                    },
                    {
                        "content": "return this.minutes() === 0 ? `${prefix}dddAh点整` : `${prefix}dddAh点mm`;",
                        "rowNumber": 78,
                        "text": "dddAh点mm",
                        "colNumber": 71
                    },
                    {
                        "content": "return `${number}日`;",
                        "rowNumber": 89,
                        "text": "日",
                        "colNumber": 29
                    },
                    {
                        "content": "return `${number}月`;",
                        "rowNumber": 91,
                        "text": "月",
                        "colNumber": 29
                    },
                    {
                        "content": "return `${number}周`;",
                        "rowNumber": 94,
                        "text": "周",
                        "colNumber": 29
                    },
                    {
                        "content": "future: '%s内',",
                        "rowNumber": 100,
                        "text": "%s内",
                        "colNumber": 16
                    },
                    {
                        "content": "past: '%s前',",
                        "rowNumber": 101,
                        "text": "%s前",
                        "colNumber": 14
                    },
                    {
                        "content": "s: '几秒',",
                        "rowNumber": 102,
                        "text": "几秒",
                        "colNumber": 11
                    },
                    {
                        "content": "m: '1 分钟',",
                        "rowNumber": 103,
                        "text": "1 分钟",
                        "colNumber": 11
                    },
                    {
                        "content": "mm: '%d 分钟',",
                        "rowNumber": 104,
                        "text": "%d 分钟",
                        "colNumber": 12
                    },
                    {
                        "content": "h: '1 小时',",
                        "rowNumber": 105,
                        "text": "1 小时",
                        "colNumber": 11
                    },
                    {
                        "content": "hh: '%d 小时',",
                        "rowNumber": 106,
                        "text": "%d 小时",
                        "colNumber": 12
                    },
                    {
                        "content": "d: '1 天',",
                        "rowNumber": 107,
                        "text": "1 天",
                        "colNumber": 11
                    },
                    {
                        "content": "dd: '%d 天',",
                        "rowNumber": 108,
                        "text": "%d 天",
                        "colNumber": 12
                    },
                    {
                        "content": "M: '1 个月',",
                        "rowNumber": 109,
                        "text": "1 个月",
                        "colNumber": 11
                    },
                    {
                        "content": "MM: '%d 个月',",
                        "rowNumber": 110,
                        "text": "%d 个月",
                        "colNumber": 12
                    },
                    {
                        "content": "y: '1 年',",
                        "rowNumber": 111,
                        "text": "1 年",
                        "colNumber": 11
                    },
                    {
                        "content": "yy: '%d 年',",
                        "rowNumber": 112,
                        "text": "%d 年",
                        "colNumber": 12
                    }
                ]
            },
            {
                "fileName": "auth.js",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/router/auth.js",
                "rows": [
                    {
                        "content": "subTitle: '未登录',",
                        "rowNumber": 7,
                        "text": "未登录",
                        "colNumber": 12
                    },
                    {
                        "content": "'检查session是否缺少或者失效',",
                        "rowNumber": 9,
                        "text": "检查session是否缺少或者失效",
                        "colNumber": 4
                    },
                    {
                        "content": "`检查后端服务代理地址，当前代理地址为 ${process.env.LCDP_SERVICE_URL}`,",
                        "rowNumber": 10,
                        "text": "检查后端服务代理地址，当前代理地址为 ",
                        "colNumber": 5
                    },
                    {
                        "content": "'如果需要免登录访问可将页面配置‘免登录’开启',",
                        "rowNumber": 11,
                        "text": "如果需要免登录访问可将页面配置‘免登录’开启",
                        "colNumber": 4
                    },
                    {
                        "content": "'如上述未能解决问题，请联系开发负责人协助处理',",
                        "rowNumber": 12,
                        "text": "如上述未能解决问题，请联系开发负责人协助处理",
                        "colNumber": 4
                    },
                    {
                        "content": "] : '登录状态失效，请重新登录',",
                        "rowNumber": 13,
                        "text": "登录状态失效，请重新登录",
                        "colNumber": 6
                    },
                    {
                        "content": "console.log('未登录, 调用门户重定向失败', e);",
                        "rowNumber": 38,
                        "text": "未登录, 调用门户重定向失败",
                        "colNumber": 18
                    },
                    {
                        "content": "component: (<ErrorPage title=\"页面加载失败\" {...unLoginInfo} />),",
                        "rowNumber": 42,
                        "text": "页面加载失败",
                        "colNumber": 35
                    }
                ]
            },
            {
                "fileName": "common.js",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/router/config/common.js",
                "rows": [
                    {
                        "content": "pageName: '流程管理',",
                        "rowNumber": 109,
                        "text": "流程管理",
                        "colNumber": 16
                    },
                    {
                        "content": "pageName: '文件预览',",
                        "rowNumber": 169,
                        "text": "文件预览",
                        "colNumber": 16
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/StepDetail/index.tsx",
                "rows": [
                    {
                        "content": "lcdpFlowCommit: '开始流程',",
                        "rowNumber": 15,
                        "text": "开始流程",
                        "colNumber": 18
                    },
                    {
                        "content": "lcdpFlowPage: '完成处理',",
                        "rowNumber": 16,
                        "text": "完成处理",
                        "colNumber": 16
                    },
                    {
                        "content": "lcdpFlowService: '启动服务',",
                        "rowNumber": 17,
                        "text": "启动服务",
                        "colNumber": 19
                    },
                    {
                        "content": "lcdpFlowChild: '开启子流程',",
                        "rowNumber": 18,
                        "text": "开启子流程",
                        "colNumber": 17
                    },
                    {
                        "content": "{parseInt(item.state, 10) === 1 ? traceType2Action[item.traceType as keyof TraceType2ActionType] : '等待处理'}",
                        "rowNumber": 74,
                        "text": "等待处理",
                        "colNumber": 121
                    },
                    {
                        "content": "<Col span={12}>处理人：{item.updatorName}</Col>",
                        "rowNumber": 79,
                        "text": "处理人：",
                        "colNumber": 35
                    },
                    {
                        "content": "<Col span={12}>电话：{item.phoneNo}</Col>",
                        "rowNumber": 80,
                        "text": "电话：",
                        "colNumber": 35
                    },
                    {
                        "content": "<Col span={12}>处理部门：{item.orgName}</Col>",
                        "rowNumber": 83,
                        "text": "处理部门：",
                        "colNumber": 35
                    },
                    {
                        "content": "<Col span={12}>派单时间：{moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}</Col>",
                        "rowNumber": 85,
                        "text": "派单时间：",
                        "colNumber": 35
                    },
                    {
                        "content": "{item.remark && <Row>处理意见：{item.remark}</Row>}",
                        "rowNumber": 87,
                        "text": "处理意见：",
                        "colNumber": 39
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/SceneFlowContainer/index.tsx",
                "rows": [
                    {
                        "content": "message.warn('无效场景数据');",
                        "rowNumber": 51,
                        "text": "无效场景数据",
                        "colNumber": 23
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/OnlinePreview/index.tsx",
                "rows": [
                    {
                        "content": "console.log('预览加载组件成功:', res);",
                        "rowNumber": 78,
                        "text": "预览加载组件成功:",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/ImportFile/index.tsx",
                "rows": [
                    {
                        "content": "message.warn(`上传失败，仅支持后缀为${fileTypes.join(',')}类型的文件`);",
                        "rowNumber": 34,
                        "text": "上传失败，仅支持后缀为",
                        "colNumber": 20
                    },
                    {
                        "content": "message.warn(`上传失败，仅支持后缀为${fileTypes.join(',')}类型的文件`);",
                        "rowNumber": 34,
                        "text": "类型的文件",
                        "colNumber": 53
                    },
                    {
                        "content": "loadingm = message.loading('上传中，请稍候……', 0);",
                        "rowNumber": 47,
                        "text": "上传中，请稍候……",
                        "colNumber": 33
                    },
                    {
                        "content": "message.success('数据导入成功！');",
                        "rowNumber": 53,
                        "text": "数据导入成功！",
                        "colNumber": 24
                    },
                    {
                        "content": "message.info('数据导入失败!');",
                        "rowNumber": 59,
                        "text": "数据导入失败!",
                        "colNumber": 19
                    },
                    {
                        "content": "loadingm = message.loading('上传中，请稍候……');",
                        "rowNumber": 113,
                        "text": "上传中，请稍候……",
                        "colNumber": 33
                    },
                    {
                        "content": "content: '上传文件处理失败！后端服务无响应。',",
                        "rowNumber": 120,
                        "text": "上传文件处理失败！后端服务无响应。",
                        "colNumber": 19
                    },
                    {
                        "content": "content: `上传文件部分处理成功！成功条数：${succcount}；失败条数：${errorcount}；错误信息：${errstr ||",
                        "rowNumber": 137,
                        "text": "上传文件部分处理成功！成功条数：",
                        "colNumber": 20
                    },
                    {
                        "content": "content: `上传文件部分处理成功！成功条数：${succcount}；失败条数：${errorcount}；错误信息：${errstr ||",
                        "rowNumber": 137,
                        "text": "；失败条数：",
                        "colNumber": 48
                    },
                    {
                        "content": "content: `上传文件部分处理成功！成功条数：${succcount}；失败条数：${errorcount}；错误信息：${errstr ||",
                        "rowNumber": 137,
                        "text": "；错误信息：",
                        "colNumber": 67
                    },
                    {
                        "content": "'无'}`,",
                        "rowNumber": 138,
                        "text": "无",
                        "colNumber": 12
                    },
                    {
                        "content": "content: `上传文件处理成功！成功条数：${succcount}；失败条数：${errorcount}；`,",
                        "rowNumber": 142,
                        "text": "上传文件处理成功！成功条数：",
                        "colNumber": 20
                    },
                    {
                        "content": "content: `上传文件处理成功！成功条数：${succcount}；失败条数：${errorcount}；`,",
                        "rowNumber": 142,
                        "text": "；失败条数：",
                        "colNumber": 46
                    },
                    {
                        "content": "message.error(`${info.file.name} 文件上传失败，请重试！`);",
                        "rowNumber": 146,
                        "text": " 文件上传失败，请重试！",
                        "colNumber": 38
                    },
                    {
                        "content": "name: '应用数据',",
                        "rowNumber": 218,
                        "text": "应用数据",
                        "colNumber": 12
                    },
                    {
                        "content": "name: '页面版本',",
                        "rowNumber": 247,
                        "text": "页面版本",
                        "colNumber": 12
                    },
                    {
                        "content": "name: '原子服务',",
                        "rowNumber": 252,
                        "text": "原子服务",
                        "colNumber": 12
                    },
                    {
                        "content": "name: '业务对象',",
                        "rowNumber": 257,
                        "text": "业务对象",
                        "colNumber": 12
                    },
                    {
                        "content": "name: '查询配置',",
                        "rowNumber": 262,
                        "text": "查询配置",
                        "colNumber": 12
                    },
                    {
                        "content": "name: '服务编排',",
                        "rowNumber": 267,
                        "text": "服务编排",
                        "colNumber": 12
                    },
                    {
                        "content": "<h3 className={style.title}>文件导入</h3>",
                        "rowNumber": 274,
                        "text": "文件导入",
                        "colNumber": 34
                    },
                    {
                        "content": "<Form.Item label=\"导入类型\">",
                        "rowNumber": 276,
                        "text": "导入类型",
                        "colNumber": 25
                    },
                    {
                        "content": "<UploadOutlined />\n              上传\n            </Button>",
                        "rowNumber": 288,
                        "text": "上传",
                        "colNumber": 32
                    },
                    {
                        "content": "<span className={style.tip}>{`请上传${fileTypesMap[type].join(',')}类型的文件`}</span>",
                        "rowNumber": 292,
                        "text": "请上传",
                        "colNumber": 40
                    },
                    {
                        "content": "<span className={style.tip}>{`请上传${fileTypesMap[type].join(',')}类型的文件`}</span>",
                        "rowNumber": 292,
                        "text": "类型的文件",
                        "colNumber": 74
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/FlowManage/index.tsx",
                "rows": [
                    {
                        "content": "<Radio.Button value=\"flow\">流程列表</Radio.Button>",
                        "rowNumber": 46,
                        "text": "流程列表",
                        "colNumber": 35
                    },
                    {
                        "content": "<Radio.Button value=\"flow-order\">待办列表</Radio.Button>",
                        "rowNumber": 47,
                        "text": "待办列表",
                        "colNumber": 41
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/FlowManage/WorkOrderTab/index.tsx",
                "rows": [
                    {
                        "content": "1: '待处理',",
                        "rowNumber": 23,
                        "text": "待处理",
                        "colNumber": 5
                    },
                    {
                        "content": "2: '处理完成',",
                        "rowNumber": 24,
                        "text": "处理完成",
                        "colNumber": 5
                    },
                    {
                        "content": "3: '流程废弃',",
                        "rowNumber": 25,
                        "text": "流程废弃",
                        "colNumber": 5
                    },
                    {
                        "content": "message.warn('无效流程数据');",
                        "rowNumber": 90,
                        "text": "无效流程数据",
                        "colNumber": 21
                    },
                    {
                        "content": "title: '工单ID',",
                        "rowNumber": 101,
                        "text": "工单ID",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '业务工单ID',",
                        "rowNumber": 106,
                        "text": "业务工单ID",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '环节名称',",
                        "rowNumber": 124,
                        "text": "环节名称",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '创建时间',",
                        "rowNumber": 129,
                        "text": "创建时间",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '修改时间',",
                        "rowNumber": 135,
                        "text": "修改时间",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '工单状态',",
                        "rowNumber": 141,
                        "text": "工单状态",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '当前处理人',",
                        "rowNumber": 150,
                        "text": "当前处理人",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '操作',",
                        "rowNumber": 157,
                        "text": "操作",
                        "colNumber": 13
                    },
                    {
                        "content": "<Button type=\"primary\" icon={<EditOutlined />} loading={flowHandling && row.workOrderId === handlingWorkOrderId} onClick={() => handleFlow(row, 'handle')}>\n                处理\n              </Button>",
                        "rowNumber": 163,
                        "text": "处理",
                        "colNumber": 169
                    },
                    {
                        "content": "<Button type=\"default\" icon={<FileSearchOutlined />} loading={flowHandling && row.workOrderId === handlingWorkOrderId} onClick={() => handleFlow(row, 'detail')}>\n              详情\n            </Button>",
                        "rowNumber": 170,
                        "text": "详情",
                        "colNumber": 173
                    },
                    {
                        "content": "throw new Error(`获取流程下拉数据error：${e}`);",
                        "rowNumber": 187,
                        "text": "获取流程下拉数据error：",
                        "colNumber": 23
                    },
                    {
                        "content": "throw new Error(`获取环节下拉数据error：${e}`);",
                        "rowNumber": 197,
                        "text": "获取环节下拉数据error：",
                        "colNumber": 23
                    },
                    {
                        "content": "message.warn('无效流程数据');",
                        "rowNumber": 219,
                        "text": "无效流程数据",
                        "colNumber": 21
                    },
                    {
                        "content": "placeholder=\"流程名称\"",
                        "rowNumber": 278,
                        "text": "流程名称",
                        "colNumber": 20
                    },
                    {
                        "content": "placeholder=\"环节名称\"",
                        "rowNumber": 297,
                        "text": "环节名称",
                        "colNumber": 20
                    },
                    {
                        "content": "placeholder=\"流程工单状态\"",
                        "rowNumber": 311,
                        "text": "流程工单状态",
                        "colNumber": 20
                    },
                    {
                        "content": "<Button icon={<SearchOutlined />} onClick={() => getData()}>\n        查询\n      </Button>",
                        "rowNumber": 322,
                        "text": "查询",
                        "colNumber": 66
                    },
                    {
                        "content": "{item.author && `处理人：${item.author}`}",
                        "rowNumber": 356,
                        "text": "处理人：",
                        "colNumber": 31
                    },
                    {
                        "content": "{ title: '待办', key: '0' },",
                        "rowNumber": 369,
                        "text": "待办",
                        "colNumber": 19
                    },
                    {
                        "content": "{ title: '我创建', key: '1' },",
                        "rowNumber": 370,
                        "text": "我创建",
                        "colNumber": 19
                    },
                    {
                        "content": "{ title: '已结束', key: '2' },",
                        "rowNumber": 371,
                        "text": "已结束",
                        "colNumber": 19
                    },
                    {
                        "content": "showTotal: t => `总共 ${t} 条记录`,",
                        "rowNumber": 397,
                        "text": "总共 ",
                        "colNumber": 29
                    },
                    {
                        "content": "showTotal: t => `总共 ${t} 条记录`,",
                        "rowNumber": 397,
                        "text": " 条记录",
                        "colNumber": 36
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/FlowManage/FlowTab/index.tsx",
                "rows": [
                    {
                        "content": "message.warn('无效流程数据');",
                        "rowNumber": 52,
                        "text": "无效流程数据",
                        "colNumber": 21
                    },
                    {
                        "content": "title: '流程 ID',",
                        "rowNumber": 62,
                        "text": "流程 ID",
                        "colNumber": 13
                    },
                    {
                        "content": "title: '流程名称',",
                        "rowNumber": 67,
                        "text": "流程名称",
                        "colNumber": 13
                    },
                    {
                        "content": "title: '流程编码',",
                        "rowNumber": 72,
                        "text": "流程编码",
                        "colNumber": 13
                    },
                    {
                        "content": "title: '操作',",
                        "rowNumber": 77,
                        "text": "操作",
                        "colNumber": 13
                    },
                    {
                        "content": "title={`确认启动流程【${text.flowName}】吗`}",
                        "rowNumber": 82,
                        "text": "确认启动流程【",
                        "colNumber": 20
                    },
                    {
                        "content": "title={`确认启动流程【${text.flowName}】吗`}",
                        "rowNumber": 82,
                        "text": "】吗",
                        "colNumber": 43
                    },
                    {
                        "content": ">\n              启动\n            </Button>",
                        "rowNumber": 92,
                        "text": "启动",
                        "colNumber": 13
                    },
                    {
                        "content": "message.warn('无效流程数据');",
                        "rowNumber": 121,
                        "text": "无效流程数据",
                        "colNumber": 21
                    },
                    {
                        "content": "placeholder=\"请输入名称或编码\"",
                        "rowNumber": 158,
                        "text": "请输入名称或编码",
                        "colNumber": 20
                    },
                    {
                        "content": "showTotal: t => (`总共 ${t} 条记录`),",
                        "rowNumber": 180,
                        "text": "总共 ",
                        "colNumber": 30
                    },
                    {
                        "content": "showTotal: t => (`总共 ${t} 条记录`),",
                        "rowNumber": 180,
                        "text": " 条记录",
                        "colNumber": 37
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/FlowDiagram/index.tsx",
                "rows": [
                    {
                        "content": "const hide = message.loading('处理中..', 0);",
                        "rowNumber": 77,
                        "text": "处理中..",
                        "colNumber": 33
                    }
                ]
            },
            {
                "fileName": "utils.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/FlowDiagram/FlowViewer/utils.ts",
                "rows": [
                    {
                        "content": "label: '关联流程',",
                        "rowNumber": 209,
                        "text": "关联流程",
                        "colNumber": 9
                    },
                    {
                        "content": "label: `${fd.flowName}: ${w.workId === 'tpl' ? '模版' : w.workId}`,",
                        "rowNumber": 440,
                        "text": "模版",
                        "colNumber": 71
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/FlowDiagram/FlowViewer/index.tsx",
                "rows": [
                    {
                        "content": "<div className={style.indicator}>已过流程</div>",
                        "rowNumber": 268,
                        "text": "已过流程",
                        "colNumber": 41
                    },
                    {
                        "content": "<div className={classNames(style.indicator, style.current)}>当前流程</div>",
                        "rowNumber": 269,
                        "text": "当前流程",
                        "colNumber": 68
                    },
                    {
                        "content": "<div className={classNames(style.indicator, style.notPassed)}>未流转流程</div>",
                        "rowNumber": 270,
                        "text": "未流转流程",
                        "colNumber": 70
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/pages/FlowContainer/index.tsx",
                "rows": [
                    {
                        "content": "lcdpFlowCommit: '开始流程',",
                        "rowNumber": 31,
                        "text": "开始流程",
                        "colNumber": 18
                    },
                    {
                        "content": "lcdpFlowPage: '完成处理',",
                        "rowNumber": 32,
                        "text": "完成处理",
                        "colNumber": 16
                    },
                    {
                        "content": "lcdpFlowService: '启动服务',",
                        "rowNumber": 33,
                        "text": "启动服务",
                        "colNumber": 19
                    },
                    {
                        "content": "lcdpFlowChild: '开启子流程',",
                        "rowNumber": 34,
                        "text": "开启子流程",
                        "colNumber": 17
                    },
                    {
                        "content": "<h3 style={{ paddingBottom: '10px' }}>流程轨迹</h3>",
                        "rowNumber": 125,
                        "text": "流程轨迹",
                        "colNumber": 56
                    },
                    {
                        "content": "return `于 ${item.updatedTime.split('.')[0]} ${traceType2Action[item.traceType as (keyof TraceType2ActionType)]}`;",
                        "rowNumber": 148,
                        "text": "于 ",
                        "colNumber": 50
                    },
                    {
                        "content": "return `待${item.updatorName || ''}处理`;",
                        "rowNumber": 150,
                        "text": "待",
                        "colNumber": 50
                    },
                    {
                        "content": "return `待${item.updatorName || ''}处理`;",
                        "rowNumber": 150,
                        "text": "处理",
                        "colNumber": 76
                    },
                    {
                        "content": "return `于 ${item.updatedTime.split('.')[0]}处理失败`;",
                        "rowNumber": 152,
                        "text": "于 ",
                        "colNumber": 50
                    },
                    {
                        "content": "return `于 ${item.updatedTime.split('.')[0]}处理失败`;",
                        "rowNumber": 152,
                        "text": "处理失败",
                        "colNumber": 85
                    },
                    {
                        "content": "{item.remark && <p>{`备注：${item.remark || ''}`}</p>}",
                        "rowNumber": 161,
                        "text": "备注：",
                        "colNumber": 49
                    },
                    {
                        "content": "<Result status=\"403\" title=\"403 Forbidden\" subTitle=\"抱歉, 你没有权限访问此页面。\" />",
                        "rowNumber": 172,
                        "text": "抱歉, 你没有权限访问此页面。",
                        "colNumber": 62
                    }
                ]
            },
            {
                "fileName": "index.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/manage/actions/index.ts",
                "rows": [
                    {
                        "content": "throw new Error(`action ${method} 命名有冲突`);",
                        "rowNumber": 9,
                        "text": " 命名有冲突",
                        "colNumber": 41
                    }
                ]
            },
            {
                "fileName": "zh-CN.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/locales/zh-CN.ts",
                "rows": [
                    {
                        "content": "REQUEST_TIMEOUT: '请求超时',",
                        "rowNumber": 6,
                        "text": "请求超时",
                        "colNumber": 19
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/layouts/BaseLayout/SearchComp/index.tsx",
                "rows": [
                    {
                        "content": "pathName += '预置分组';",
                        "rowNumber": 60,
                        "text": "预置分组",
                        "colNumber": 18
                    },
                    {
                        "content": "<span>历史记录</span>",
                        "rowNumber": 96,
                        "text": "历史记录",
                        "colNumber": 14
                    },
                    {
                        "content": "<span>清空历史记录</span>",
                        "rowNumber": 106,
                        "text": "清空历史记录",
                        "colNumber": 18
                    },
                    {
                        "content": "<span>未找到搜索结果，换个关键字试试吧～</span>",
                        "rowNumber": 128,
                        "text": "未找到搜索结果，换个关键字试试吧～",
                        "colNumber": 12
                    },
                    {
                        "content": "placeholder=\"搜索关键，或Cmd/Ctrl+K弹窗搜索\"",
                        "rowNumber": 202,
                        "text": "搜索关键，或Cmd/Ctrl+K弹窗搜索",
                        "colNumber": 22
                    },
                    {
                        "content": "placeholder=\"搜索页面名称\"",
                        "rowNumber": 237,
                        "text": "搜索页面名称",
                        "colNumber": 26
                    }
                ]
            },
            {
                "fileName": "useAppLoad.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/hooks/useAppLoad.ts",
                "rows": [
                    {
                        "content": "subTitle: '应用标识(appId)缺失',",
                        "rowNumber": 76,
                        "text": "应用标识(appId)缺失",
                        "colNumber": 20
                    },
                    {
                        "content": "tips: `当前页面缺少应用ID将无法访问，请检查链接地址, 页面地址：${history.location.pathname + history.location.search}`,",
                        "rowNumber": 77,
                        "text": "当前页面缺少应用ID将无法访问，请检查链接地址, 页面地址：",
                        "colNumber": 17
                    },
                    {
                        "content": "subTitle: '用户信息获取失败',",
                        "rowNumber": 81,
                        "text": "用户信息获取失败",
                        "colNumber": 20
                    },
                    {
                        "content": "tips: '请重试或联系系统管理员',",
                        "rowNumber": 82,
                        "text": "请重试或联系系统管理员",
                        "colNumber": 16
                    },
                    {
                        "content": "subTitle: '应用初始化失败',",
                        "rowNumber": 86,
                        "text": "应用初始化失败",
                        "colNumber": 20
                    },
                    {
                        "content": "`请检查当前代理环境是否可用，当前代理地址为 ${process.env.LCDP_SERVICE_URL}`,",
                        "rowNumber": 89,
                        "text": "请检查当前代理环境是否可用，当前代理地址为 ",
                        "colNumber": 13
                    },
                    {
                        "content": "'请重试或联系系统管理员',",
                        "rowNumber": 92,
                        "text": "请重试或联系系统管理员",
                        "colNumber": 12
                    },
                    {
                        "content": "setErrorInfo({ subTitle: '微应用页面集成失败', tips: `请检查访问地址是否正确, 页面地址：${history.location.pathname + history.location.search}` });",
                        "rowNumber": 110,
                        "text": "微应用页面集成失败",
                        "colNumber": 33
                    },
                    {
                        "content": "setErrorInfo({ subTitle: '微应用页面集成失败', tips: `请检查访问地址是否正确, 页面地址：${history.location.pathname + history.location.search}` });",
                        "rowNumber": 110,
                        "text": "请检查访问地址是否正确, 页面地址：",
                        "colNumber": 53
                    },
                    {
                        "content": "setErrorInfo(handleTips('init', `获取应用信息失败: ${err.message?.resultMsg || err.message}`));",
                        "rowNumber": 155,
                        "text": "获取应用信息失败: ",
                        "colNumber": 43
                    },
                    {
                        "content": "setErrorInfo(handleTips('init', `获取应用信息失败: ${e?.message || e}`));",
                        "rowNumber": 161,
                        "text": "获取应用信息失败: ",
                        "colNumber": 41
                    }
                ]
            },
            {
                "fileName": "menu.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/constant/menu.tsx",
                "rows": [
                    {
                        "content": "name: '运维主页',",
                        "rowNumber": 13,
                        "text": "运维主页",
                        "colNumber": 10
                    },
                    {
                        "content": "name: '缓存刷新',",
                        "rowNumber": 19,
                        "text": "缓存刷新",
                        "colNumber": 10
                    },
                    {
                        "content": "name: '定时任务配置',",
                        "rowNumber": 25,
                        "text": "定时任务配置",
                        "colNumber": 10
                    },
                    {
                        "content": "name: '生成秘钥',",
                        "rowNumber": 31,
                        "text": "生成秘钥",
                        "colNumber": 10
                    },
                    {
                        "content": "name: '报表管理',",
                        "rowNumber": 37,
                        "text": "报表管理",
                        "colNumber": 10
                    },
                    {
                        "content": "name: '流程发起（旧）',",
                        "rowNumber": 46,
                        "text": "流程发起（旧）",
                        "colNumber": 10
                    },
                    {
                        "content": "name: '流程代办（旧）',",
                        "rowNumber": 52,
                        "text": "流程代办（旧）",
                        "colNumber": 10
                    },
                    {
                        "content": "name: '流程统一待办',",
                        "rowNumber": 58,
                        "text": "流程统一待办",
                        "colNumber": 10
                    },
                    {
                        "content": "name: '离岗代办',",
                        "rowNumber": 64,
                        "text": "离岗代办",
                        "colNumber": 10
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/components/SupportBrowser/index.tsx",
                "rows": [
                    {
                        "content": "const tip = `当前浏览器版本信息：${ua}`;",
                        "rowNumber": 14,
                        "text": "当前浏览器版本信息：",
                        "colNumber": 15
                    },
                    {
                        "content": "<img src={unsupportBrowserImg} alt=\"无法显示\" />",
                        "rowNumber": 18,
                        "text": "无法显示",
                        "colNumber": 41
                    },
                    {
                        "content": ">浏览器版本\n        </a>过低，将不能正常浏览和使用网站。<br />为了获得更好的体验，我们推荐您使用以下浏览器",
                        "rowNumber": 26,
                        "text": "浏览器版本",
                        "colNumber": 9
                    },
                    {
                        "content": "<div className={styles.tip}>\n        您正在使用的\n        <a",
                        "rowNumber": 19,
                        "text": "您正在使用的",
                        "colNumber": 34
                    },
                    {
                        "content": "</a>过低，将不能正常浏览和使用网站。<br />为了获得更好的体验，我们推荐您使用以下浏览器",
                        "rowNumber": 27,
                        "text": "过低，将不能正常浏览和使用网站。",
                        "colNumber": 12
                    },
                    {
                        "content": "</a>过低，将不能正常浏览和使用网站。<br />为了获得更好的体验，我们推荐您使用以下浏览器\n      </div>",
                        "rowNumber": 27,
                        "text": "为了获得更好的体验，我们推荐您使用以下浏览器",
                        "colNumber": 34
                    },
                    {
                        "content": "<img src={ThreeSixZeroImg} alt=\"360极速\" />",
                        "rowNumber": 35,
                        "text": "360极速",
                        "colNumber": 41
                    },
                    {
                        "content": "<div>360极速</div>",
                        "rowNumber": 36,
                        "text": "360极速",
                        "colNumber": 15
                    },
                    {
                        "content": "<img src={firfoxImg} alt=\"火狐\" />",
                        "rowNumber": 39,
                        "text": "火狐",
                        "colNumber": 35
                    },
                    {
                        "content": "<div>火狐</div>",
                        "rowNumber": 40,
                        "text": "火狐",
                        "colNumber": 15
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/components/ServerError/index.tsx",
                "rows": [
                    {
                        "content": "<span style={{ color: 'rgba(28, 36, 46, 0.45)', fontSize: '16px', lineHeight: '22px', fontWeight: '400' }}>\n          抱歉，服务器报告错误，刷新页面后重试。\n        </span>",
                        "rowNumber": 21,
                        "text": "抱歉，服务器报告错误，刷新页面后重试。",
                        "colNumber": 115
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/components/PageTabs/index.tsx",
                "rows": [
                    {
                        "content": "title: '关闭当前窗口',",
                        "rowNumber": 158,
                        "text": "关闭当前窗口",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '关闭左侧窗口',",
                        "rowNumber": 166,
                        "text": "关闭左侧窗口",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '关闭右侧窗口',",
                        "rowNumber": 180,
                        "text": "关闭右侧窗口",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '关闭其它窗口',",
                        "rowNumber": 194,
                        "text": "关闭其它窗口",
                        "colNumber": 15
                    },
                    {
                        "content": "title: '新窗口打开',",
                        "rowNumber": 204,
                        "text": "新窗口打开",
                        "colNumber": 15
                    },
                    {
                        "content": "moreIcon={<span className={styles.moreTitle}>更多标签</span>}",
                        "rowNumber": 247,
                        "text": "更多标签",
                        "colNumber": 53
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/components/PageListWrap/index.tsx",
                "rows": [
                    {
                        "content": "placeholder={sidePlaceHolder || '目录名称'}",
                        "rowNumber": 136,
                        "text": "目录名称",
                        "colNumber": 44
                    },
                    {
                        "content": "<div className={style.left}>\n                      过滤：\n                      <div className={style.screenList}>",
                        "rowNumber": 175,
                        "text": "过滤：",
                        "colNumber": 48
                    },
                    {
                        "content": "{(total || total === 0) && `找到 ${total}条筛选结果`}",
                        "rowNumber": 185,
                        "text": "找到 ",
                        "colNumber": 44
                    },
                    {
                        "content": "{(total || total === 0) && `找到 ${total}条筛选结果`}",
                        "rowNumber": 185,
                        "text": "条筛选结果",
                        "colNumber": 55
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/components/NotFound/index.tsx",
                "rows": [
                    {
                        "content": "<span style={{ color: 'rgba(28, 36, 46, 0.45)', fontSize: '16px', lineHeight: '22px', fontWeight: '400' }}>\n          抱歉，您访问的页面不存在，刷新页面后重试。\n        </span>",
                        "rowNumber": 21,
                        "text": "抱歉，您访问的页面不存在，刷新页面后重试。",
                        "colNumber": 115
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/components/NoPermission/index.tsx",
                "rows": [
                    {
                        "content": ">\n          您还没有访问权限，请联系管理员～\n        </span>",
                        "rowNumber": 27,
                        "text": "您还没有访问权限，请联系管理员～",
                        "colNumber": 9
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/components/Menu/index.tsx",
                "rows": [
                    {
                        "content": "catalogItemName: '预置分组',",
                        "rowNumber": 130,
                        "text": "预置分组",
                        "colNumber": 23
                    },
                    {
                        "content": "title: '运维中心',",
                        "rowNumber": 251,
                        "text": "运维中心",
                        "colNumber": 13
                    },
                    {
                        "content": "title: '应用页面',",
                        "rowNumber": 259,
                        "text": "应用页面",
                        "colNumber": 13
                    },
                    {
                        "content": "title: '流程业务测试',",
                        "rowNumber": 267,
                        "text": "流程业务测试",
                        "colNumber": 13
                    },
                    {
                        "content": "title: '自定义页面',",
                        "rowNumber": 274,
                        "text": "自定义页面",
                        "colNumber": 13
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-pc/src/components/ErrorPage/index.tsx",
                "rows": [
                    {
                        "content": ">\n            失败原因:\n          </Text>",
                        "rowNumber": 35,
                        "text": "失败原因:",
                        "colNumber": 11
                    }
                ]
            },
            {
                "fileName": "initAppConfig.ts",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/initAppConfig.ts",
                "rows": [
                    {
                        "content": "content: '无appId',",
                        "rowNumber": 131,
                        "text": "无appId",
                        "colNumber": 15
                    }
                ]
            },
            {
                "fileName": "app.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/app.tsx",
                "rows": [
                    {
                        "content": "title: '首页',",
                        "rowNumber": 14,
                        "text": "首页",
                        "colNumber": 11
                    },
                    {
                        "content": "documentTitle: '默认标题',",
                        "rowNumber": 36,
                        "text": "默认标题",
                        "colNumber": 17
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/pages/p/index.tsx",
                "rows": [
                    {
                        "content": "console.log('预览加载组件成功:', res);",
                        "rowNumber": 66,
                        "text": "预览加载组件成功:",
                        "colNumber": 22
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/pages/index/index.tsx",
                "rows": [
                    {
                        "content": "欢迎登录使用{process.env.SYSTEM_NAME || '灵犀平台'}",
                        "rowNumber": 38,
                        "text": "灵犀平台",
                        "colNumber": 42
                    },
                    {
                        "content": "<div className={styles.indexText}>\n        欢迎登录使用{process.env.SYSTEM_NAME || '灵犀平台'}",
                        "rowNumber": 37,
                        "text": "欢迎登录使用",
                        "colNumber": 40
                    },
                    {
                        "content": "<div>暂无登录</div>",
                        "rowNumber": 40,
                        "text": "暂无登录",
                        "colNumber": 11
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/components/SearchPage/index.tsx",
                "rows": [
                    {
                        "content": "<div className=\"emptyText\">该分组暂无页面列表数据</div>",
                        "rowNumber": 128,
                        "text": "该分组暂无页面列表数据",
                        "colNumber": 39
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/components/SearchPage/components/SearchView/index.tsx",
                "rows": [
                    {
                        "content": "const [dropdownTitle, setDropdownTitle] = useState('全部分组');",
                        "rowNumber": 18,
                        "text": "全部分组",
                        "colNumber": 53
                    },
                    {
                        "content": "placeholder='搜索页面名称'",
                        "rowNumber": 38,
                        "text": "搜索页面名称",
                        "colNumber": 20
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/components/SearchPage/components/SearchPanel/index.tsx",
                "rows": [
                    {
                        "content": "placeholder=\"搜索分组名称\"",
                        "rowNumber": 32,
                        "text": "搜索分组名称",
                        "colNumber": 22
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/components/Layout/index.tsx",
                "rows": [
                    {
                        "content": "<span>菜单</span>",
                        "rowNumber": 57,
                        "text": "菜单",
                        "colNumber": 18
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/components/FlowLayout/index.tsx",
                "rows": [
                    {
                        "content": "<div className={styles.emptyText}>功能开发中敬请期待</div>",
                        "rowNumber": 12,
                        "text": "功能开发中敬请期待",
                        "colNumber": 40
                    }
                ]
            },
            {
                "fileName": "index.tsx",
                "filePath": "/Users/qinchuanlong/项目/web/lingxi/lowcode/lcdp-app-engine-renderer/packages/app-mobile/src/components/BaseLayout/index.tsx",
                "rows": [
                    {
                        "content": "{ title: '页面', key: 'page' },",
                        "rowNumber": 11,
                        "text": "页面",
                        "colNumber": 11
                    },
                    {
                        "content": "{ title: '流程', key: 'flow' },",
                        "rowNumber": 12,
                        "text": "流程",
                        "colNumber": 11
                    },
                    {
                        "content": "catalogItemName: '全部分组',",
                        "rowNumber": 43,
                        "text": "全部分组",
                        "colNumber": 31
                    },
                    {
                        "content": "catalogItemName: '预置分组',",
                        "rowNumber": 47,
                        "text": "预置分组",
                        "colNumber": 31
                    },
                    {
                        "content": ">\n          关闭\n        </div>",
                        "rowNumber": 94,
                        "text": "关闭",
                        "colNumber": 9
                    },
                    {
                        "content": "欢迎登录使用{process.env.SYSTEM_NAME || '灵犀平台'}",
                        "rowNumber": 123,
                        "text": "灵犀平台",
                        "colNumber": 42
                    },
                    {
                        "content": "<div className=\"emptyText\">\n        欢迎登录使用{process.env.SYSTEM_NAME || '灵犀平台'}",
                        "rowNumber": 122,
                        "text": "欢迎登录使用",
                        "colNumber": 33
                    },
                    {
                        "content": "<div>暂未配置/index 默认页面</div>",
                        "rowNumber": 125,
                        "text": "暂未配置/index 默认页面",
                        "colNumber": 11
                    }
                ]
            }
        ])
    }
}());
